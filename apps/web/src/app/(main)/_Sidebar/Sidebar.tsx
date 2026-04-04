"use client";
import {
  Bookmark,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";

const AppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6 text-primary"
  >
    <title>Kurn</title>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M5 20h14" />
  </svg>
);

const NavItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const { isCollapsed } = useSidebar();
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </a>
  );
};

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "py-4 sm:py-6 flex h-auto flex-col  justify-between overflow-hidden rounded-xl bg-foreground/5 transition-[width, transform] duration-300 ease-in-out shrink-0",
        isCollapsed
          ? "items-center w-13 sm:w-17.5"
          : "items-start w-56 md:w-42 lg:w-64",
      )}
    >
      <div>
        <div className="flex items-center md:items-left py-1 px-4 md:py-3 shrink-0">
          <button
            type="button"
            onClick={toggle}
            className="p-1 cursor-default flex items-center gap-2"
          >
            <AppIcon />
            {!isCollapsed && <span className="text-lg truncate">Kurn</span>}
          </button>
        </div>

        <nav className="flex-1 px-2 py-6 md:py-10 flex flex-col gap-y-5 md:gap-y-6">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            href="#"
          />
          <NavItem icon={<CheckSquare size={20} />} label="Leads" href="#" />
          <NavItem icon={<Bookmark size={20} />} label="Saved" href="#" />
        </nav>
      </div>
      <div>
        <button
          type="button"
          onClick={toggle}
          className="flex gap-x-1 items-center px-2 outline-0"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="truncate text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
