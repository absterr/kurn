"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import AppIcon from "@/components/icons/AppIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { passwordSchema } from "@/lib/validators";

const RegisterForm = () => {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = () => {};

  const socialLoginList = [
    { name: "Google", icon: GoogleIcon },
    { name: "Github", icon: GithubIcon },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md px-6 py-12">
        <div className="flex justify-center pb-4">
          <AppIcon className="size-12" />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
          Register
        </h1>

        <div className="flex gap-2 items-center justify-center">
          {socialLoginList.map(({ name, icon: Icon }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <Button className="bg-foreground hover:bg-foreground/80 dark:bg-foreground/5 dark:hover:bg-foreground/10 cursor-pointer py-5 px-12">
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign in with {name}</TooltipContent>
            </Tooltip>
          ))}
        </div>

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

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/80 hover:cursor-pointer font-medium text-sm md:text-base transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-xs text-foreground/50 text-center pt-6">
          By continuing, you agree to Kurn's{" "}
          <a
            href="https://www.example.com/terms"
            className="text-foreground/70 hover:text-foreground underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="https://www.example.com/privacy"
            className="text-foreground/70 hover:text-foreground underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </section>
  );
};

export default RegisterForm;
