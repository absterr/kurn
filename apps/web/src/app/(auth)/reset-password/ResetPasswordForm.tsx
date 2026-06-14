"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import AppIcon from "@/components/icons/AppIcon";
import { passwordSchema } from "@/lib/validators";

const ResetPasswordForm = () => {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = () => {};

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md px-6 py-12">
        <div className="flex justify-center pb-4">
          <AppIcon className="size-12" />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
          Reset Password
        </h1>

        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {(["password", "confirmPassword"] as const).map((field) => (
            <div key={field}>
              <input
                type={field}
                placeholder={
                  field === "password" ? "Enter password" : "Confirm password"
                }
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
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
