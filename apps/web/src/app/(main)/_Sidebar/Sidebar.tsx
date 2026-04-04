"use client";
import {
  Bookmark,
  CheckSquare,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";

const AppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="30"
    height="30"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Kurn</title>
    <ellipse
      cx="100"
      cy="150"
      rx="50"
      ry="10"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M80 150 L95 60 M100 150 L100 55 M120 150 L105 60"
      stroke="currentColor"
      stroke-width="6"
      stroke-linecap="round"
    />
    <g fill="currentColor">
      <ellipse cx="95" cy="60" rx="6" ry="9" />
      <ellipse cx="100" cy="55" rx="6" ry="9" />
      <ellipse cx="105" cy="60" rx="6" ry="9" />
    </g>
    <rect x="85" y="110" width="30" height="8" rx="4" fill="currentColor" />
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
      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </a>
  );
};

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <>
      {!isCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-background/50 backdrop-blur-md md:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={cn(
          "py-4 sm:py-6 flex h-auto flex-col justify-between overflow-hidden rounded-xl bg-foreground/5 transition-[width, transform] duration-300 ease-in-out shrink-0",
          isCollapsed
            ? "w-13 sm:w-17.5"
            : "w-56 md:w-42 lg:w-64 max-md:fixed max-md:top-4 max-md:bottom-4 max-md:left-4 max-md:z-50 ",
        )}
      >
        <div className="w-full">
          <div className="flex items-center md:items-left py-1 px-2 md:px-4 md:py-3 shrink-0">
            <button
              type="button"
              onClick={toggle}
              className="p-1 cursor-default flex items-center gap-2"
            >
              <AppIcon />
              {!isCollapsed && <span className="text-lg truncate">Kurn</span>}
            </button>
          </div>

          <nav className="flex flex-col flex-1 md:px-2 py-6 md:py-10 gap-y-5 md:gap-y-6">
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
            className="flex gap-x-3 items-center px-4 md:px-6 outline-0"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            />
            {!isCollapsed && <span className="truncate text-sm">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
