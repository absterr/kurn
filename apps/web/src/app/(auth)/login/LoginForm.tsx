"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { loginHandler } from "@/lib/queries/auth-queries";
import { loginSchema } from "@/lib/schema/auth-schema";
import { useRole } from "../_Role/role-provider";
import GuestLoginBtn from "../GuestLoginBtn";

const LoginForm = () => {
  const { role } = useRole();
  const router = useRouter();
  const [isFormLoading, setFormLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role,
    },
  });

  const onSubmit = (body: z.infer<typeof loginSchema>) => {
    setFormLoading(true);
    try {
      startTransition(async () => {
        const { error } = await loginHandler(body);
        if (error) {
          toast.error(error);
          return;
        }
        router.replace("/");
      });
    } finally {
      setFormLoading(false);
    }
  };

  const socialLoginList = [
    { name: "Google", icon: GoogleIcon },
    { name: "Github", icon: GithubIcon },
  ];

  return (
    <>
      <div className="flex gap-2 items-center justify-center">
        {socialLoginList.map(({ name, icon: Icon }) => (
          <Tooltip key={name} delayDuration={200}>
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
        <div className="flex-1 border-t border-foreground/20"></div>
        <span className="text-foreground/50 text-xs md:text-sm">or</span>
        <div className="flex-1 border-t border-foreground/20"></div>
      </div>

      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {(["email", "password"] as const).map((field) => (
          <div key={field}>
            {field === "password" && (
              <div className="pb-1.5 text-end">
                <Link
                  href={"/forgot-password"}
                  className="text-foreground/70 hover:text-foreground underline lg:no-underline lg:hover:underline text-xs md:text-sm"
                >
                  Forgot password?
                </Link>
              </div>
            )}
            <input
              type={field}
              placeholder={
                field === "email" ? "Enter email address" : "Enter password"
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
          disabled={isPending}
          className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/80 hover:cursor-pointer font-medium text-sm md:text-base transition-colors"
        >
          {isFormLoading ? <LoadingSpinner /> : "Log in"}
        </button>
      </form>

      {role === "member" && (
        <div className="flex flex-col pt-6 gap-6 md:gap-8">
          <p className="text-xs text-foreground/50 text-center">
            By continuing, you agree to Kurn's{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.example.com/terms"
              className="text-foreground/70 hover:text-foreground underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.example.com/privacy"
              className="text-foreground/70 hover:text-foreground underline"
            >
              Privacy Policy
            </a>
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-xs md:text-sm text-foreground/50 text-center">
              Looking to get started?{" "}
              <Link
                href={"/request-access"}
                className=" text-foreground/70 hover:text-foreground underline lg:no-underline lg:hover:underline"
              >
                Request access
              </Link>
            </p>
            <GuestLoginBtn
              isPending={isPending}
              startTransition={startTransition}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
