export default function LeadsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // "h-full" fills the constrained grid column; "flex-col" lets ScrollArea stretch below the header
  return (
    <div className="p-2 sm:p-4 h-full flex flex-col">
      <h1 className="font-medium text-xl sm:text-2xl py-4">Leads</h1>
      {children}
    </div>
  );
}
