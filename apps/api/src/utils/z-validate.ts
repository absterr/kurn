import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";

export const zValidate = <T extends ZodType>(
  target: "json" | "query",
  schema: T,
) =>
  zValidator(target, schema, (result, ctx) => {
    if (!result.success) {
      return ctx.json({ error: result.error.issues }, 400);
    }
  });
