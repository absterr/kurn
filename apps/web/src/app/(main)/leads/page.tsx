import LeadsWrapper from "./LeadsWrapper";

export default function Leads() {
  return (
    <div className="h-full flex flex-col p-2 sm:p-4">
      <h1 className="font-medium text-xl sm:text-2xl">Find Leads</h1>
      <LeadsWrapper />
    </div>
  );
}
