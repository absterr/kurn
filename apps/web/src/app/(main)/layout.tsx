import Sidebar from "./_Sidebar";
import { SidebarProvider } from "./_Sidebar/SidebarProvider";
import Topbar from "./Topbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden p-4 flex gap-4">
        <Sidebar />
        <div className="flex flex-1 flex-col gap-y-4">
          <Topbar />
          <main className="flex-1 rounded-xl bg-foreground/5 p-4 flex min-h-0">
            <div className="overflow-hidden h-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
