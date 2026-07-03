import v1GithubStrategyInit from "@/routes/v1/oauth/strategies/github-strategy.v1.js";
import v1GoogleStrategyInit from "../routes/v1/oauth/strategies/google-strategy.v1.js";

export default function passportInit() {
  v1GoogleStrategyInit();
  v1GithubStrategyInit();
}
