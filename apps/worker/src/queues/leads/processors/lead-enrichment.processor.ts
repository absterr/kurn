import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { Kysely } from "kysely";
import pLimit from "p-limit";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { AuditedLead } from "@/utils/audit-types";
import { EnrichLeadsService } from "../providers/enrich-leads";

interface EnrichLeadsJobData {
  leadQueryId: string;
  queuedJobIds: string[];
  auditedLeads: AuditedLead[];
}

@Processor("lead-enrichment")
export class LeadEnrichmentProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly enrichLeadsService: EnrichLeadsService,
  ) {
    super();
  }

  async process(job: Job<EnrichLeadsJobData>) {
    const { leadQueryId, queuedJobIds, auditedLeads } = job.data;
    const limit = pLimit(3);

    try {
      const diagnosedLeads = await Promise.all(
        auditedLeads.map((lead) =>
          limit(async () => {
            const auditDiagnosis =
              await this.enrichLeadsService.diagnoseLead(lead);

            const { websiteAudits, ...rest } = lead;

            const emailDraft = await this.enrichLeadsService.generateEmail({
              ...rest,
              auditDiagnosis,
            });

            return {
              ...rest,
              auditDiagnosis,
              emailDraft,
            };
          }),
        ),
      );

      await this.db.transaction().execute(async (tx) => {
        await tx
          .insertInto("leads")
          .values(diagnosedLeads.map((lead) => ({ leadQueryId, ...lead })))
          .execute();

        await tx
          .updateTable("leadQueries")
          .set({ status: "successful" })
          .where("id", "=", leadQueryId)
          .where("status", "!=", "exhausted")
          .execute();
      });
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
    } finally {
      const batchSize = 50;
      for (let i = 0; i < queuedJobIds.length; i += batchSize) {
        const batch = queuedJobIds.slice(i, i + batchSize);
        await this.db
          .deleteFrom("leadQueue")
          .where("id", "in", batch)
          .execute();
      }
    }
  }
}
