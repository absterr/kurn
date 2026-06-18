import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { Kysely } from "kysely";
import pLimit from "p-limit";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { AuditedLead } from "@/utils/audit-types";
import { EnrichLeadsService } from "../providers/enrich-leads";

interface AuditLeadsJobData {
  leadQueryId: string;
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

  async process(job: Job<AuditLeadsJobData>) {
    const { leadQueryId, auditedLeads } = job.data;
    const limit = pLimit(4);

    try {
      const diagnosedLeads = await Promise.all(
        auditedLeads.map((lead) => limit(async () => {})),
      );

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
          .set({ status: "failed" })
          .where("id", "=", leadQueryId)
          .execute();
      }

      throw err;
    }
  }
}
