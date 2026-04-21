import { Body, Controller, Post } from "@nestjs/common";
import { JobsDto } from "./jobs.dto";
import { JobsService } from "./providers/jobs.service";

@Controller("scraper/jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async(@Body() dto: JobsDto) {
    return this.jobsService.findJobs(dto.position, dto.timeframe);
  }
}
