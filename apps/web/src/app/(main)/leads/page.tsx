import LeadsQueries from "./LeadsQueries";
import LeadsQueryForm from "./LeadsQueryForm";
import { LeadsWrapper } from "./LeadsWrapper";

export default function Leads() {
  return (
    // "h-full" fills the constrained grid column; "flex-col" lets ScrollArea stretch below the header
    <div className="h-full flex flex-col p-2 sm:p-4">
      <h1 className="font-medium text-xl sm:text-2xl py-4">Leads</h1>
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-10 min-h-0 pt-4">
        <LeadsQueryForm />
        <LeadsQueries />
      </div>

      {/* flex-col lets ScrollArea stretch as needed for the content */}
      <div className="flex flex-col md:hidden min-h-0">
        <LeadsWrapper form={<LeadsQueryForm />} list={<LeadsQueries />} />
      </div>
    </div>
  );
}
