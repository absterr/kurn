import { Search } from "lucide-react";
import UserInfo from "./UserInfo";

const Topbar = () => {
  return (
    <div className="bg-foreground/5 rounded-2xl">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2 bg-background rounded-full px-3 sm:px-4 py-2 sm:py-3 max-w-50 sm:max-w-xs lg:max-w-sm">
          <Search className="w-4 h-4 text-foreground shrink-0" />
          <input
            type="text"
            name="search"
            placeholder="Search"
            className="bg-transparent outline-none text-foreground placeholder-muted-foreground flex-1 text-xs md:text-sm"
          />
          <span className="text-muted-foreground text-xs md:text-sm hidden lg:inline p-1 rounded-md bg-foreground/5">
            ⌘ F
          </span>
        </div>

        <UserInfo />
      </div>
    </div>
  );
};

export default Topbar;
