import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { Lead } from "@/utils/shared-types";
import { AuditLeadsService } from "../providers/audit-leads.service";

interface AuditLeadsJobData {
  leadQueryId: string;
  leads: Lead[];
}

@Processor("lead-audit")
export class LeadAuditProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly auditLeadsService: AuditLeadsService,
    @InjectQueue("outreach-draft") private readonly outreachDraftQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<AuditLeadsJobData>) {
    const { leadQueryId, leads } = job.data;

    try {
      const auditedLeads = await this.auditLeadsService.auditLeads(leads);

      const filteredAuditedLeads = auditedLeads.filter(async (lead) => {
        const leadHasEmails = lead.emails !== null && lead.emails.length > 0;
        const leadIsReachable = leadHasEmails || lead.phone !== null;

        return leadIsReachable;
      });

      const savedLeadsDetails = await Promise.all(
        filteredAuditedLeads.map(async (lead) => {
          const { companyName, diagnosis, ...rest } = lead;
          const leadDetails = await this.db
            .insertInto("leads")
            .values({
              ...rest,
              leadQueryId,
              companyName,
              auditDiagnosis: diagnosis,
              completionStatus: "partial",
            })
            .returning([
              "id",
              "leadQueryId",
              "emails",
              "websiteReachable",
              "auditDiagnosis",
              "companyName",
              "phone",
              "website",
            ])
            .executeTakeFirstOrThrow();

          return leadDetails;
        }),
      );

      await this.outreachDraftQueue.add(
        "outreach-draft",
        {
          leadQueryId,
          leads: savedLeadsDetails,
        },
        {
          attempts: 3,
          backoff: {
            type: "fixed",
            delay: 5000,
          },
        },
      );
    } catch (err) {
      const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);

      if (isLastAttempt) {
        await this.db
          .updateTable("leadQueries")
          .set({ status: "failed" })
          .where("id", "=", leadQueryId)
          .execute();
      }

      throw err;
    }
  }
}
