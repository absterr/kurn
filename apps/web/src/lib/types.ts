import { z } from "zod";

const jobSchema = z.object({
  title: z.string(),
  link: z.string(),
  location: z.string(),
  posted: z.string(),
});

export const leadSchema = z.object({
  name: z.string(),
  mapLink: z.string(),
  address: z.string(),
  phone: z.string().optional(),
  website: z.string().optional(),
  emails: z.array(z.string()),
  linkedinUrl: z.string().optional(),
  overview: z.string().optional(),
  jobs: z.array(jobSchema).optional(),
});

export type Lead = z.Infer<typeof leadSchema>;
