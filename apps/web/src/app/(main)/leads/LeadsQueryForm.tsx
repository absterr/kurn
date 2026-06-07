"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { findLeads } from "@/lib/actions";

const leadsQueryFormSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  location: z.string().min(1, "Location is required"),
});

type FormValues = z.infer<typeof leadsQueryFormSchema>;

export default function LeadsQueryForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(leadsQueryFormSchema),
    defaultValues: {
      keyword: "",
      location: "",
    },
  });

  const onSaveQuery = ({
    keyword,
    location,
  }: {
    keyword: string;
    location: string;
  }) => {
    startTransition(async () => {
      try {
        // Save lead query (saveLeds(keyword, location))
        await findLeads(keyword, location);
        // Update cache state here
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div>
      <h2 className="font-medium text-base sm:text-lg">Find Leads</h2>
      <form onSubmit={handleSubmit(onSaveQuery)}>
        <div className="flex flex-col md:flex-row items-start gap-4 pt-4 pb-8">
          <div className="w-full">
            <div className="flex justify-between">
              <p className="py-2">
                Keyword <span className="text-red-500 text-sm">*</span>
              </p>
              {errors.keyword && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.keyword.message}
                </p>
              )}
            </div>

            <input
              {...register("keyword")}
              placeholder="Keyword"
              className="w-full p-3 bg-background/10 border border-foreground/10 focus:outline-foreground/40 rounded-lg text-xs sm:text-sm"
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between">
              <p className="py-2">
                Location <span className="text-red-500 text-sm">*</span>
              </p>
              {errors.location && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>
            <input
              {...register("location")}
              placeholder="Location"
              className="w-full p-3 bg-background/10 border border-foreground/10 focus:outline-foreground/40 rounded-lg text-xs sm:text-sm"
            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-foreground w-full sm:w-fit text-background p-5 cursor-pointer rounded-2xl"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
