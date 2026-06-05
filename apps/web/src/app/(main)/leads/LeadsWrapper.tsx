"use client";
import { List, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "form" | "list";

export function LeadsWrapper({
  form,
  list,
}: {
  form: React.ReactNode;
  list: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("form");

  return (
    <div className="flex flex-col gap-y-6 min-h-0">
      <div className="flex w-full border-b">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium relative",
            activeTab === "form" ? "border-b-2 border-current" : "opacity-50",
          )}
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Find</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium relative",
            activeTab === "list" ? "border-b-2 border-current" : "opacity-50",
          )}
        >
          <List className="w-4 h-4" />
          <span className="text-xs">Saved</span>
        </button>
      </div>

      <div className="flex-1 min-h-0">{activeTab === "form" ? form : list}</div>
    </div>
  );
}
