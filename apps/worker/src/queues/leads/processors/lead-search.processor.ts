import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { Lead } from "@/utils/shared-types";
import { GoogleMapsScraper } from "../providers/google-maps.scraper";

interface LeadSearchJobData {
  leadQueryId: string;
  keyword: string;
  location: string;
}

@Processor("lead-search")
export class LeadSearchProcessor extends WorkerHost {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly googleMapsScraper: GoogleMapsScraper,
    @InjectQueue("lead-audit") private readonly leadAuditQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<LeadSearchJobData>) {
    const { leadQueryId, keyword, location } = job.data;

    try {
      await this.db
        .updateTable("leadQueries")
        .set({ status: "processing" })
        .where("id", "=", leadQueryId)
        .execute();

      const leads = await this.googleMapsScraper.scrape(keyword, location);
      if (leads.length < 2) {
        if (leads.length === 0) throw new Error("No leads found");

        await this.db
          .updateTable("leadQueries")
          .where("id", "=", leadQueryId)
          .set({ status: "exhausted" })
          .execute();
      }

      const dedupLeads = await this.deduplicateLeads(leadQueryId, leads);
      if (dedupLeads.length === 0) throw new Error("No new leads found");

      await this.leadAuditQueue.add(
        "lead-audit",
        {
          leadQueryId,
          dedupLeads,
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

  private async deduplicateLeads(leadQueryId: string, leads: Lead[]) {
    const filteredLeads = leads.filter(
      (lead, index, self) =>
        index === self.findIndex((l) => l.mapLink === lead.mapLink),
    );
    const savedLeads = await this.db
      .selectFrom("leads")
      .where("leadQueryId", "=", leadQueryId)
      .select(["mapLink"])
      .execute();

    // O(N + M)
    const savedMapLinks = new Set(savedLeads.map((l) => l.mapLink));
    return filteredLeads.filter((lead) => !savedMapLinks.has(lead.mapLink));
  }
}
