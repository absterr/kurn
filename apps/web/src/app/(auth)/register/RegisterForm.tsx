"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { registerHandler } from "@/lib/queries/auth-queries";
import { passwordSchema } from "@/lib/schema/auth-schema";
import SocialLoginBtn from "../SocialLoginBtn";

const RegisterForm = ({ token }: { token: string }) => {
  const [isFormLoading, setFormLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (body: z.infer<typeof passwordSchema>) => {
    setFormLoading(true);

    startTransition(async () => {
      const { data, error } = await registerHandler(body, token);
      if (error || !data) {
        toast.error(error);
        setFormLoading(false);
        return;
      }
      toast.success(data.message);
    });
  };

  return (
    <>
      <SocialLoginBtn isPending={isPending} startTransition={startTransition} />
      <div className="flex items-center gap-4 py-5">
        <div className="flex-1 h-px bg-foreground/20"></div>
        <span className="text-foreground/50 text-xs md:text-sm">or</span>
        <div className="flex-1 h-px bg-foreground/20"></div>
      </div>

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

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl hover:bg-foreground/80 cursor-pointer font-medium text-sm md:text-base transition-colors"
        >
          {isFormLoading ? (
            <LoadingSpinner
              size={5}
              className="text-background/40 fill-background"
            />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
