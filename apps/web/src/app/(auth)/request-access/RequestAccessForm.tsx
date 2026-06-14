"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { requestAccessSchema } from "@/lib/validators";

const RequestAccessForm = () => {
  const form = useForm<z.infer<typeof requestAccessSchema>>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = () => {};

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {(["name", "email"] as const).map((field) => (
        <div key={field}>
          <input
            type={field}
            placeholder={field === "email" ? "Email address" : "Name"}
            className="w-full h-12 text-xs md:text-sm px-4 rounded-xl bg-background dark:bg-foreground/5 border border-foreground/20 placeholder-foreground/50 focus:outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/60 font-medium transition-colors"
            {...form.register(field)}
          />
          {form.formState.errors[field] && (
            <p className="text-sm text-red-500 pt-1">
              <CircleAlert size={14} className="inline pr-1" />
              {form.formState.errors[field].message}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/80 hover:cursor-pointer font-medium text-sm md:text-base transition-colors"
      >
        Request Access
      </button>
    </form>
  );
};

export default RequestAccessForm;
