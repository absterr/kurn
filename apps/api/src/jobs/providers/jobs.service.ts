import { Injectable } from "@nestjs/common";
import { LinkedinAuth } from "src/lib/providers/linkedin-auth";
import { LinkedinJobsScraper } from "./linkedin-jobs.scraper";

@Injectable()
export class JobsService {
  constructor(
    private readonly linkedinJobsScraper: LinkedinJobsScraper,
    private readonly linkedinAuth: LinkedinAuth,
  ) {}

  async findJobs(position: string) {
    await this.linkedinAuth.confirmSession();

    const isFound = await this.linkedinJobsScraper.scrape(position);

    return isFound;
  }
}
