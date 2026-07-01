import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { Selectable } from "kysely";
import { LeadQueries, LeadQueue } from "@/db/types";
import { AuditedLead } from "@/utils/audit-types";
import { Lead } from "@/utils/shared-types";

interface QueueOpts {
  attempts: number;
  backoff: {
    type: string;
    delay: number;
  };
}

interface BatchEnqueueOptions<TInput, TJobData> {
  queue: Queue;
  items: TInput[];
  batchSize: number;
  jobName: Selectable<LeadQueue>["queueName"];
  mapToJobData: (item: TInput) => TJobData;
  opts: QueueOpts;
}

@Injectable()
export class LeadsService {
  constructor(
    @InjectQueue("lead-search") private readonly leadSearchQueue: Queue,
    @InjectQueue("lead-audit") private readonly leadAuditQueue: Queue,
    @InjectQueue("lead-enrichment") private readonly leadEnrichmentQueue: Queue,
  ) {}

  // ── Lead Search ───────────────────────────────────────────────────
  async queueLeadSearch(awaitingQueries: Selectable<LeadQueries>[]) {
    const batchSize = 10;
    const opts: QueueOpts = {
      attempts: 2,
      backoff: {
        type: "fixed",
        delay: 10000,
      },
    };

    const leadSearchOptions: BatchEnqueueOptions<
      Selectable<LeadQueries>,
      { leadQueryId: string; keyword: string; location: string }
    > = {
      queue: this.leadSearchQueue,
      items: awaitingQueries,
      batchSize,
      jobName: "lead-search",
      mapToJobData: (query: Selectable<LeadQueries>) => ({
        leadQueryId: query.id,
        keyword: query.keyword,
        location: query.location,
      }),
      opts,
    };

    await this.batchEnqueue(leadSearchOptions);
  }

  // ── Lead Audit ───────────────────────────────────────────────────
  async queueLeadAudit(
    leadQueryId: string,
    queuedJobIds: string[],
    foundLeads: Lead[],
  ) {
    const batchSize = 10;
    const opts = {
      attempts: 3,
      backoff: {
        type: "fixed",
        delay: 5000,
      },
    };

    const leadAuditOptions: BatchEnqueueOptions<
      Lead,
      { leadQueryId: string; queuedJobIds: string[]; lead: Lead }
    > = {
      queue: this.leadAuditQueue,
      items: foundLeads,
      batchSize,
      jobName: "lead-audit",
      mapToJobData: (lead: Lead) => ({
        leadQueryId,
        queuedJobIds,
        lead,
      }),
      opts,
    };

    await this.batchEnqueue(leadAuditOptions);
  }

  // ── Lead Enrichment ───────────────────────────────────────────────────
  async queueLeadEnrichment(
    leadQueryId: string,
    queuedJobIds: string[],
    auditedLeads: AuditedLead[],
  ) {
    const batchSize = 10;
    const opts = {
      attempts: 3,
      backoff: {
        type: "fixed",
        delay: 5000,
      },
    };

    const leadEnrichmentOptions: BatchEnqueueOptions<
      AuditedLead,
      { leadQueryId: string; queuedJobIds: string[]; auditedLead: AuditedLead }
    > = {
      queue: this.leadEnrichmentQueue,
      jobName: "lead-enrichment",
      items: auditedLeads,
      batchSize,
      mapToJobData: (auditedLead: AuditedLead) => ({
        leadQueryId,
        queuedJobIds,
        auditedLead,
      }),
      opts,
    };

    await this.batchEnqueue(leadEnrichmentOptions);
  }

  private async batchEnqueue<TInput, TJobData>(
    options: BatchEnqueueOptions<TInput, TJobData>,
  ): Promise<void> {
    const { queue, items, batchSize, jobName, mapToJobData, opts } = options;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      const bulkJobs = batch.map((item) => ({
        name: jobName,
        data: mapToJobData(item),
        opts,
      }));

      await queue.addBulk(bulkJobs);
    }
  }
}
