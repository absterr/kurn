"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getEmailSchema, passwordSchema } from "@/lib/validators";

const emailSchema = z.object({
  email: getEmailSchema(),
});

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = () => {};

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-12 text-xs md:text-sm px-4 rounded-xl bg-background dark:bg-foreground/5 border border-foreground/20 placeholder-foreground/50 focus:outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/60 font-medium transition-colors"
          {...form.register("email")}
        />
        {form.formState.errors["email"] && (
          <p className="text-sm text-red-500 pt-1">
            <CircleAlert size={14} className="inline pr-1" />
            {form.formState.errors["email"].message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/80 hover:cursor-pointer font-medium text-sm md:text-base transition-colors"
      >
        Send Reset Link
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
