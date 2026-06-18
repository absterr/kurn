import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { Lead } from "@/utils/shared-types";
import { AuditLeadsService } from "../providers/audit-leads";

interface AuditLeadsJobData {
  leadQueryId: string;
  leads: Lead[];
}

@Processor("lead-audit")
export class LeadAuditProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly auditLeadsService: AuditLeadsService,
    @InjectQueue("lead-enrichment") private readonly leadEnrichmentQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<AuditLeadsJobData>) {
    const { leadQueryId, leads } = job.data;

    try {
      const auditedLeads = await this.auditLeadsService.auditLeads(leads);

      const filteredAuditedLeads = auditedLeads.filter(async (lead) => {
        return lead.websiteAudits !== null;
      });

      await this.leadEnrichmentQueue.add(
        "lead-enrichment",
        {
          leadQueryId,
          leads: filteredAuditedLeads,
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
