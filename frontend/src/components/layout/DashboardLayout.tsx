import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    // Wrapper
    <div>
      <Sidebar />
      {/* Right side of sidebar */}
      <div className="pl-64 bg-surface min-h-screen">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
}
export default DashboardLayout;
