"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { loginUser } from "@/actions/auth-actions";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { loginSchema } from "@/lib/validators";
import { useRole } from "../_Role/role-provider";

const LoginForm = () => {
  const { role } = useRole();
  const router = useRouter();
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
    startTransition(async () => {
      const { error } = await loginUser(body);

      if (error) {
        toast.error(error);
        return;
      }

      router.replace("/");
    });
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
          {isPending ? <LoadingSpinner /> : "Log in"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
