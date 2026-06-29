"use client";
import {
  BriefcaseBusiness,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  TextSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { ThemeSwitch } from "@/app/_Theme/ThemeSwitch";
import AppIcon from "@/components/icons/AppIcon";
import { logoutHandler } from "@/lib/queries/session-queries";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      toast.loading("Logging out...");
      const { error } = await logoutHandler();
      toast.dismiss();

      if (error) {
        toast.error(error);
        return;
      }

      router.replace("/login");
      toast.success("Logout successful");
    });
  };

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
              {!isCollapsed && (
                <span className="text-lg font-medium truncate">Kurn</span>
              )}
            </button>
          </div>

          <nav className="flex flex-col flex-1 md:px-2 py-6 md:py-10 gap-y-5 md:gap-y-6">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              href="/dashboard"
            />
            <NavItem
              icon={<TextSearch size={20} />}
              label="Leads"
              href="/leads"
            />
            <NavItem
              icon={<BriefcaseBusiness size={20} />}
              label="Jobs"
              href="/jobs"
            />
            <div className="px-3">
              <hr />
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <div className="shrink-0">
                <LogOut size={20} />
              </div>
              {!isCollapsed && <span className="truncate">Log out</span>}
            </button>
          </nav>
        </div>
        <div
          className={cn(
            "flex justify-between gap-y-10 flex-col items-center",
            !isCollapsed && "flex-row sm:flex-col xl:flex-row items-left",
          )}
        >
          <button
            type="button"
            onClick={toggle}
            className="w-full flex gap-x-3 items-center py-1 px-4 md:px-6 outline-0"
          >
            <ChevronRight
              size={20}
              className={`transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            />
            {!isCollapsed && <span className="truncate text-sm">Collapse</span>}
          </button>
          <div
            className={cn(
              isCollapsed ? "-order-1" : "sm:-order-1 xl:order-1 px-6",
            )}
          >
            <ThemeSwitch />
          </div>
        </div>
      </aside>
    </>
  );
}

const NavItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={() => {
        const media = window.matchMedia("(max-width: 640px)");
        if (media.matches && !isCollapsed) {
          toggle();
        }
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );
};
