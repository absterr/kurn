import LeadsQueries from "./LeadsQueries";
import LeadsQueryForm from "./LeadsQueryForm";
import LeadsWrapper from "./LeadsWrapper";

export default function Leads() {
  return (
    <>
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-10 min-h-0 pt-4">
        <LeadsQueryForm />
        <LeadsQueries />
      </div>

      {/* "flex-col" and "min-h-0" lets ScrollArea stretch as needed for the content */}
      <div className="flex flex-col md:hidden min-h-0">
        <LeadsWrapper form={<LeadsQueryForm />} list={<LeadsQueries />} />
      </div>
    </>
  );
}
