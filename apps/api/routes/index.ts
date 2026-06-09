import { Hono } from "hono";
import { adminV1Router } from "./v1/admin/admin.v1.routes";
import { authV1Router } from "./v1/auth/auth.v1.routes";
import { leadsV1Router } from "./v1/leads/leads.v1.routes";

const v1 = new Hono();
v1.route("/auth", authV1Router);

// Protected routes
v1.route("/leads", leadsV1Router);
v1.route("/admin", adminV1Router);

const routes = new Hono();
routes.route("/v1", v1);

export default routes;
