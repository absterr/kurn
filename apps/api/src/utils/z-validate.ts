import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";
import { formatZodIssues } from "./format-zod.js";

export const zValidate = <T extends ZodType>(
  target: "json" | "query" | "param",
  schema: T,
) =>
  zValidator(target, schema, (result, ctx) => {
    if (!result.success) {
      const error = formatZodIssues(result.error.issues);
      return ctx.json({ error }, 400);
    }
  });
