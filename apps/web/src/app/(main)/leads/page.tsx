import LeadsQueries from "./LeadsQueries";
import LeadsQueryForm from "./LeadsQueryForm";

export default function Leads() {
  return (
    // "h-full" fills the constrained grid column; "flex-col" lets ScrollArea stretch below the header
    <div className="h-full flex flex-col p-2 sm:p-4">
      <h1 className="font-medium text-xl sm:text-2xl py-4">Leads</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 min-h-0 pt-4">
        <div>
          <h2 className="font-medium text-base sm:text-lg">Find Leads</h2>
          <LeadsQueryForm />
        </div>

        {/* min-h-0: constrains grid child so descendants with h-full have a real boundary */}
        <div className="min-h-0">
          <LeadsQueries />
        </div>
      </div>
    </div>
  );
}
