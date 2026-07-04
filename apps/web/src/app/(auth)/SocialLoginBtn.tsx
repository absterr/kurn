"use client";
import { type TransitionStartFunction, useEffect, useRef } from "react";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRole } from "./_Role/role-provider";

const socialLoginList = [
  { name: "Google", icon: GoogleIcon },
  { name: "GitHub", icon: GithubIcon },
];

const SocialLoginBtn = ({
  isPending,
  startTransition,
}: {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) => {
  const { role } = useRole();
  const resolverRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && resolverRef.current) {
        resolverRef.current();
        resolverRef.current = null;
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleSocialLogin = (provider: string) => {
    startTransition(async () => {
      // Keeps isPending true until browser navigates
      await new Promise<void>((resolve) => {
        resolverRef.current = resolve;
        const url = `/api/v1/oauth/${provider}?role=${role}`;
        window.location.href = url;
      });
    });
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {socialLoginList.map(({ name, icon: Icon }) => (
        <Tooltip key={name} delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleSocialLogin(name.toLowerCase())}
              disabled={isPending}
              className="bg-foreground hover:bg-foreground/80 dark:bg-foreground/5 dark:hover:bg-foreground/10 cursor-pointer py-5 px-12"
            >
              <Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sign in with {name}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default SocialLoginBtn;
