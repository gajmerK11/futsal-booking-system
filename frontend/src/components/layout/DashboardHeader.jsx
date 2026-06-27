import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function DashboardHeader() {
  const { role } = useContext(AuthContext);
  return (
    <header className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Search bar */}
        <div className={`relative ml-4 ${role === "user" ? "" : "hidden"}`}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="pl-10 w-96 bg-surface-container-low border border-surface-container-low rounded-full py-2 pr-4 outline-none placeholder:text-on-surface-variant text-sm text-on-surface"
            placeholder="Search venues..."
          />
        </div>
        {/* Right - username + avatar */}
        <div
          className={`flex items-center gap-3 ${role !== "user" ? "ml-auto" : ""}`}
        >
          {/* username */}
          <span className="font-semibold text-sm text-on-surface flex flex-col">
            ALEX MORGAN
            {role !== "user" && (
              <span className="text-xs text-on-surface-variant text-right">
                Venue Owner
              </span>
            )}
          </span>
          {/* profile-picture */}
          <div className="w-9 h-9 rounded-full bg-inverse-surface text-white flex items-center justify-center text-xs font-bold">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
export default DashboardHeader;
