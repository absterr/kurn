import { Search } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex rounded-3xl items-center bg-foreground/5 justify-between gap-4 p-4 sm:p-6">
      <div className="flex items-center gap-2 bg-background rounded-full px-3 sm:px-4 py-2 sm:py-3 flex-1 sm:flex-none w-full sm:w-96">
        <Search className="w-4 h-4 text-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-foreground/80 placeholder-foreground/40 flex-1 text-xs md:text-sm"
        />
        <span className="text-foreground/40 text-xs md:text-sm hidden sm:inline p-1 rounded-md bg-foreground/5">
          ⌘ F
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 ml-auto">
        <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-foreground/80 text-sm md:text-base">
              John Doe
            </p>
            <p className="text-xs md:text-sm text-foreground/60">
              johndoe@example.com
            </p>
          </div>
          <div className="p-2 md:p-3.5 rounded-full bg-linear-to-br from-green-700 to-green-500 font-semibold text-xs md:text-sm text-background">
            JD
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
