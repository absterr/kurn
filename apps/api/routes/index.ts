import { Hono } from "hono";
import { accessV1Router } from "./v1/access/access.v1.routes";
import { authV1Router } from "./v1/auth/auth.v1.routes";
import { leadsV1Router } from "./v1/leads/leads.v1.routes";
import { logoutV1Router } from "./v1/logout/logout.v1.route";

const v1 = new Hono();
v1.route("/auth", authV1Router);

// Protected routes
v1.route("/access", accessV1Router);
v1.route("/leads", leadsV1Router);
v1.route("/logout", logoutV1Router);

const routes = new Hono();
routes.route("/v1", v1);

export default routes;
