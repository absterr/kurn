import { Hono } from "hono";
import { authV1Router } from "./v1/auth/auth.v1.routes";
import { leadsV1Router } from "./v1/leads/leads.v1.routes";

const v1 = new Hono();
v1.route("/auth", authV1Router);
v1.route("/leads", leadsV1Router);

const routes = new Hono();
routes.route("/v1", v1);

export default routes;
