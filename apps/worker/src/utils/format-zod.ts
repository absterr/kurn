import { z } from "zod";

const formatZodIssue = (issue: z.core.$ZodIssue) =>
  `${issue.path.join(".")}: ${issue.message}`;

export const formatZodIssues = (issues: z.core.$ZodIssue[]) =>
  issues.map(formatZodIssue).join("\n");
