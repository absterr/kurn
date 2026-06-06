"use client";
import { List, type LucideIcon, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "form" | "list";

export default function LeadsWrapper({
  form,
  list,
}: {
  form: React.ReactNode;
  list: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("form");

  const tabDetails: {
    type: Tab;
    name: string;
    icon: LucideIcon;
  }[] = [
    {
      type: "form",
      name: "Find",
      icon: Search,
    },
    {
      type: "list",
      name: "Saved",
      icon: List,
    },
  ];

  return (
    <div className="flex flex-col gap-y-6 min-h-0">
      <div className="flex w-full border-b">
        {tabDetails.map(({ type, name, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveTab(type)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium relative",
              type === activeTab ? "border-b-2 border-current" : "opacity-50",
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">{activeTab === "form" ? form : list}</div>
    </div>
  );
}
