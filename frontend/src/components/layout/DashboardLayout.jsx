import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    // Wrapper
    <div>
      <Sidebar />
      {/* Right side of sidebar */}
      <div className="pl-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}
export default DashboardLayout;
