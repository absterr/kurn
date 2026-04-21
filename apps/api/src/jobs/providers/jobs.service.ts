import { Injectable } from "@nestjs/common";
import { LinkedinAuth } from "src/lib/providers/linkedin-auth";
import { Timeframe } from "src/lib/types";
import { LinkedinJobsScraper } from "./linkedin-jobs.scraper";

@Injectable()
export class JobsService {
  constructor(
    private readonly linkedinJobsScraper: LinkedinJobsScraper,
    private readonly linkedinAuth: LinkedinAuth,
  ) {}

  async findJobs(position: string, timeframe: Timeframe) {
    await this.linkedinAuth.confirmSession();

    const jobs = await this.linkedinJobsScraper.scrape(position, timeframe);

    return jobs;
  }
}
