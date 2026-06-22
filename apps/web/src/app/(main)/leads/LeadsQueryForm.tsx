"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addLeadQueryHandler } from "@/lib/queries/lead-queries";
import {
  type LeadQueryForm,
  leadQueryFormSchema,
} from "@/lib/schema/lead-schema";

export default function LeadsQueryForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadQueryForm>({
    resolver: zodResolver(leadQueryFormSchema),
    defaultValues: {
      keyword: "",
      location: "",
    },
  });

  const onAddQuery = (body: LeadQueryForm) => {
    startTransition(async () => {
      const { error } = await addLeadQueryHandler(body);
      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Lead query added successfully");
    });
  };

  return (
    <div>
      <h2 className="font-medium text-base sm:text-lg">Add Query</h2>
      <form onSubmit={handleSubmit(onAddQuery)}>
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
            {isPending ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}
