"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { forgotPasswordHandler } from "@/lib/queries/auth-queries";
import { userDetailsSchema } from "@/lib/schema/auth-schema";
import { useRole } from "../_Role/role-provider";

const ForgotPasswordForm = () => {
  const { role } = useRole();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof userDetailsSchema>>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      email: "",
      role,
    },
  });

  const onSubmit = (body: z.infer<typeof userDetailsSchema>) => {
    startTransition(async () => {
      const { data, error } = await forgotPasswordHandler(body);
      if (error || !data) {
        toast.error(error);
        return;
      }

      toast.success(data.message);
    });
  };

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
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 pt-1">
            <CircleAlert size={14} className="inline pr-1" />
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl hover:bg-foreground/80 cursor-pointer font-medium text-sm md:text-base transition-colors"
      >
        {isPending ? (
          <LoadingSpinner
            size={5}
            className="text-background/40 fill-background"
          />
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
