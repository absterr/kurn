import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { AuditLeadsService } from "../providers/audit-leads.service";
import { Lead } from "../providers/google-maps.scraper";

interface AuditLeadsJobData {
  leadQueryId: string;
  leads: Lead[];
}

@Processor("lead-search")
export class LeadSearchProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly auditLeadsService: AuditLeadsService,
  ) {
    super();
  }

  async process(job: Job<AuditLeadsJobData>) {
    const { leadQueryId, leads } = job.data;

    try {
      const auditedLeads = await this.auditLeadsService.auditLeads(leads);

      auditedLeads.forEach(async (lead) => {
        const { name, diagnosis, ...rest } = lead;

        await this.db
          .insertInto("leads")
          .values({
            ...rest,
            leadQueryId,
            companyName: name,
            auditDiagnosis: diagnosis,
            completionStatus: "partial",
          })
          .returningAll()
          .executeTakeFirstOrThrow();
      });

      return auditedLeads;
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
