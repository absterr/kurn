"use client";
import { AlertCircle, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import type { Lead } from "./mockLeads";

export default function LeadHeader({
  lead,
  onCloseAction,
}: {
  lead: Lead;
  onCloseAction: () => void;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <HeaderDetails lead={lead} />
        <CloseBtn onCloseAction={onCloseAction} />
      </div>
    </div>
  );
}

const HeaderDetails = ({ lead }: { lead: Lead }) => (
  <header className="flex flex-col gap-2">
    <div className="flex gap-3 items-center">
      <h3 className="font-medium text-base">{lead.companyName}</h3>
      <div className="flex items-center">
        <span>
          {lead.completionStatus === "completed" ? (
            <CheckCircle2 className="size-3 mr-1" />
          ) : (
            <AlertCircle className="size-3 mr-1" />
          )}
        </span>
        <span className="text-xs">{lead.completionStatus}</span>
      </div>
    </div>
    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
      <Clock className="size-3" />
      Added: {formatDate(lead.createdAt)}
    </div>
  </header>
);

const CloseBtn = ({ onCloseAction }: { onCloseAction: () => void }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={"outline"}
        onClick={onCloseAction}
        className="group px-2 border border-foreground/10 rounded-xl cursor-pointer bg-background/10 hover:bg-background"
      >
        <X className="w-4 text-foreground/80 group-hover:text-foreground" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Close</TooltipContent>
  </Tooltip>
);
