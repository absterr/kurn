"use client";
import { Shield, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Role, useRole } from "./role-provider";

const ROLE_CONFIG: Record<Role, { label: string; Icon: React.ElementType }> = {
  member: { label: "Member", Icon: User },
  admin: { label: "Admin", Icon: Shield },
};

const RoleSwitch = () => {
  const { role, setRole } = useRole();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-center p-2">
        <fieldset
          aria-label="User role"
          className="flex gap-1.5 rounded-lg p-1 bg-foreground/10"
        >
          {(Object.keys(ROLE_CONFIG) as Role[]).map((userRole) => {
            const { label, Icon } = ROLE_CONFIG[userRole];
            const isActive = role === userRole;

            return (
              <Tooltip key={userRole}>
                <TooltipTrigger asChild>
                  <label
                    className={cn(
                      "flex items-center justify-center rounded-md w-10 h-7 cursor-pointer",
                      "transition-all duration-200",
                      isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-foreground/50 hover:text-foreground/75",
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={userRole}
                      checked={isActive}
                      onChange={() => setRole(userRole)}
                      className="sr-only"
                    />
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  </label>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            );
          })}
        </fieldset>
      </div>
    </TooltipProvider>
  );
};

export default RoleSwitch;
