"use client";
import type { TransitionStartFunction } from "react";
import GithubIcon from "@/components/icons/GithubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const socialLoginList = [
  { name: "Google", icon: GoogleIcon },
  { name: "Github", icon: GithubIcon },
];

const SocialLoginBtn = ({
  isPending,
  startTransition,
}: {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      {socialLoginList.map(({ name, icon: Icon }) => (
        <Tooltip key={name} delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
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
