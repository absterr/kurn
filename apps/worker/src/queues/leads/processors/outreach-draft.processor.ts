import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { Kysely } from "kysely";
import pLimit from "p-limit";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { OutreachDraftService } from "../providers/outreach-draft.service";

type AuditedLead = {
  id: string;
  leadQueryId: string;
  emails: string[] | null;
  websiteReachable: boolean | null;
  auditDiagnosis: string[] | null;
  companyName: string;
  phone: string | null;
  website: string | null;
};

interface AuditLeadsJobData {
  leadQueryId: string;
  auditedLeads: AuditedLead[];
}

@Processor("outreach-draft")
export class OutreachDraftProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly outreachDraftService: OutreachDraftService,
  ) {
    super();
  }

  async process(job: Job<AuditLeadsJobData>) {
    const { leadQueryId, auditedLeads } = job.data;
    const limit = pLimit(4);

    try {
      const leadsDrafts = await Promise.all(
        auditedLeads.map((lead) =>
          limit(async () => {
            const leadHasEmails =
              lead.emails !== null && lead.emails.length > 0;

            if (lead.websiteReachable || !leadHasEmails) {
              return { leadId: lead.id, emailDraft: {} };
            }

            const leadAuditDetails = {
              companyName: lead.companyName,
              website: lead.website,
              emails: lead.emails,
              websiteReachable: lead.websiteReachable,
              auditDiagnosis: lead.auditDiagnosis,
            };

            const draft =
              await this.outreachDraftService.generateEmail(leadAuditDetails);

            return { leadId: lead.id, emailDraft: draft };
          }),
        ),
      );

      leadsDrafts.forEach(async ({ leadId, emailDraft }) => {
        await this.db
          .updateTable("leads")
          .set({ emailDraft })
          .where("id", "=", leadId)
          .execute();
      });

      await this.db
        .updateTable("leadQueries")
        .set({ status: "successful" })
        .where("id", "=", leadQueryId)
        .where("status", "!=", "exhausted")
        .execute();
    } catch (err) {
      const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);

      if (isLastAttempt) {
        await this.db
          .updateTable("leadQueries")
          .set({ status: "partial" })
          .where("id", "=", leadQueryId)
          .execute();
      }

      throw err;
    }
  }
}
