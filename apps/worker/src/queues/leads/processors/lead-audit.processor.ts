import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB, JsonValue } from "@/db/types";
import { AuditedLead } from "@/utils/audit-types";
import { LeadValidationListDto } from "@/utils/shared-types";
import { AuditLeadsService } from "../providers/audit-leads";

@Processor("lead-audit")
export class LeadAuditProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    @InjectQueue("lead-enrichment") private readonly leadEnrichmentQueue: Queue,
    private readonly auditLeadsService: AuditLeadsService,
  ) {
    super();
  }

  async process(job: Job<string>) {
    const leadQueryId = job.data;

    const pendingLeads = await this.db
      .updateTable("leadQueue")
      .where("leadQueryId", "=", leadQueryId)
      .where("queueStatus", "=", "pending")
      .set({ queueStatus: "auditing" })
      .returning(["payload", "id"])
      .execute();

    if (pendingLeads.length === 0) return;

    const queuedJobIds = pendingLeads.map((lead) => lead.id);
    const payloads = pendingLeads.map((lead) => lead.payload);

    const validationInstance = plainToInstance(LeadValidationListDto, {
      leads: payloads,
    });
    const errors = await validate(validationInstance);

    if (errors.length > 0) {
      throw new Error("Queue payload structural mismatch detected.");
    }

    try {
      const auditedLeads = await this.auditLeadsService.auditLeads(
        validationInstance.leads,
      );

      const updateRows = queuedJobIds.map((id, index) => ({
        id,
        leadQueryId,
        queueName: "lead-audit" as const,
        queryStatus: "audited",
        payload: auditedLeads[index] as AuditedLead & Record<string, JsonValue>,
      }));

      await this.db
        .insertInto("leadQueue")
        .values(updateRows)
        .onConflict((oc) =>
          oc.column("id").doUpdateSet({
            queueName: (eb) => eb.ref("excluded.queueName"),
            queueStatus: (eb) => eb.ref("excluded.queueStatus"),
            payload: (eb) => eb.ref("excluded.payload"),
          }),
        )
        .execute();

      await this.leadEnrichmentQueue.add("lead-enrichment", leadQueryId, {
        attempts: 3,
        backoff: {
          type: "fixed",
          delay: 5000,
        },
      });
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
            .updateTable("leadQueue")
            .where("id", "in", batch)
            .where("queueStatus", "=", "auditing")
            .set({ queueStatus: "pending" })
            .execute();
        }
      }

      throw err;
    }
  }
}
