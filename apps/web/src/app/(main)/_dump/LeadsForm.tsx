"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const leadsFormSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  location: z.string().min(1, "Location is required"),
});

type FormValues = z.infer<typeof leadsFormSchema>;

const LeadsForm = ({
  isPending,
  onSearchAction,
}: {
  isPending: boolean;
  onSearchAction: (values: FormValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(leadsFormSchema),
    defaultValues: {
      keyword: "",
      location: "",
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSearchAction)}
        className="w-full flex flex-col items-end md:flex-row gap-4 pt-4 pb-8"
      >
        <div className="w-full">
          <div className="flex justify-between p-1">
            <p>
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
            className="w-full p-3 bg-background rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div className="w-full">
          <div className="flex justify-between p-1">
            <p>
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
            className="w-full p-3 bg-background rounded-xl text-xs sm:text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-foreground w-full sm:w-fit text-background p-5 cursor-pointer rounded-3xl"
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default LeadsForm;
