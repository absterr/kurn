import { Controller, Get } from "@nestjs/common";

@Controller("wake")
export class WakeController {
  @Get("/")
  async wake() {
    return {
      status: "Healthy",
      awake: true,
    };
  }
}
