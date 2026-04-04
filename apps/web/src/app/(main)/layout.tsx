import Topbar from "./Topbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-4 flex gap-4">
      <aside></aside>
      <div className="flex flex-col w-full gap-y-4">
        <Topbar />
        <main className="rounded-xl bg-foreground/5 p-4">{children}</main>
      </div>
    </div>
  );
}
