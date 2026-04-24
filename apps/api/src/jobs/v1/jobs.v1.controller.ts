import { Body, Controller, Post } from "@nestjs/common";
import { JobsV1Dto } from "./jobs.v1.dto";
import { JobsV1Service } from "./providers/jobs.v1.service";

@Controller({ path: "jobs", version: "1" })
export class JobsV1Controller {
  constructor(private readonly jobsService: JobsV1Service) {}

  @Post()
  async(@Body() dto: JobsV1Dto) {
    return this.jobsService.findJobs(dto);
  }
}
