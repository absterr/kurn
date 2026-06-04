import LeadsQueryForm from "./LeadsQueryForm";

export default function Leads() {
  return (
    <div className="h-full flex flex-col p-2 sm:p-4">
      <h1 className="font-medium text-xl sm:text-2xl py-8">Leads</h1>
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          {/* Leads Query Form */}
          <h1 className="font-medium text-base sm:text-lg">Find Leads</h1>
          <LeadsQueryForm />
        </div>

        <div>{/* Leads Queries List */}</div>
      </div>
    </div>
  );
}
