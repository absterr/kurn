import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB, JsonValue } from "@/db/types";
import { AuditedLead } from "@/utils/audit-types";
import { Lead } from "@/utils/shared-types";
import { AuditLeadsService } from "../providers/audit-leads";

interface AuditLeadsJobData {
  leadQueryId: string;
  queuedJobIds: string[];
  leads: Lead[];
}

@Processor("lead-audit")
export class LeadAuditProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly auditLeadsService: AuditLeadsService,
  ) {
    super();
  }

  async process(job: Job<AuditLeadsJobData>) {
    const { leadQueryId, queuedJobIds, leads } = job.data;

    try {
      const auditedLeads = await this.auditLeadsService.auditLeads(leads);

      const updateRows = queuedJobIds.map((id, index) => ({
        id,
        leadQueryId,
        queueName: "lead-audit" as const,
        payload: auditedLeads[index] as AuditedLead & Record<string, JsonValue>,
      }));

      await this.db
        .insertInto("leadQueue")
        .values(updateRows)
        .onConflict((oc) =>
          oc.column("id").doUpdateSet({
            queueName: (eb) => eb.ref("excluded.queueName"),
            payload: (eb) => eb.ref("excluded.payload"),
          }),
        )
        .execute();
    } catch (err) {
      const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);

      if (isLastAttempt) {
        await this.db
          .updateTable("leadQueries")
          .set({ status: "failed" })
          .where("id", "=", leadQueryId)
          .execute();

        const batchSize = 50;
        for (let i = 0; i < queuedJobIds.length; i += batchSize) {
          const batch = queuedJobIds.slice(i, i + batchSize);
          await this.db
            .deleteFrom("leadQueue")
            .where("id", "in", batch)
            .execute();
        }
      }

      throw err;
    }
  }
}
