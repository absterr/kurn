"use server";
import { z } from "zod";

const leadsFormSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  location: z.string().min(1, "Location is required"),
});

export type FormState = {
  keyword?: string;
  location?: string;
  errors?: {
    keyword?: string[];
    location?: string[];
  };
  success?: boolean;
};

export async function submitForm(state: FormState): Promise<FormState> {
  const parsed = leadsFormSchema.safeParse({
    keyword: state.keyword,
    location: state.location,
  });

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      errors: {
        keyword: tree.properties?.keyword?.errors,
        location: tree.properties?.location?.errors,
      },
    };
  }

  return { success: true };
}
