import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, Link } from "react-router-dom";
function Sidebar() {
  const userNav = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      label: "Venues",
      href: "/venues",
      icon: "stadium",
    },
    {
      label: "Bookings",
      href: "/bookings",
      icon: "event_available",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: "person",
    },
  ];

  const ownerNav = [
    {
      label: "Dashboard",
      href: "/owner/dashboard",
      icon: "dashboard",
    },
    {
      label: "Edit Venue ",
      href: "/owner/edit-venue",
      icon: "storefront",
    },
    {
      label: "Booking Requests ",
      href: "/owner/booking-requests",
      icon: "calendar_month",
    },
    {
      label: "Profile",
      href: "/owner/profile",
      icon: "person",
    },
  ];

  const { role, logout } = useContext(AuthContext);

  const navItems = role === "user" ? userNav : ownerNav;

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#f5f5f4] border-r border-outline-variant hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 mb-8 font-extrabold uppercase tracking-tighter text-on-surface">
        FUTSALBOOK
      </div>

      {/* Nav links */}
      <nav className="px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            to={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl uppercase text-xs font-semibold tracking-widest hover:text-primary hover:bg-surface-container text-on-surface-variant ${item.href === pathname ? "text-primary bg-primary-fixed" : ""}`}
            key={item.label}
          >
            <span
              className="material-symbols-outlined"
              style={
                item.icon === "dashboard" && item.href === pathname
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-auto border-t border-outline-variant  p-6 ">
        <button
          className="flex items-center justify-center gap-2 rounded-full px-6 py-2 bg-gray-900 text-white w-full uppercase text-xs font-medium tracking-widest hover:bg-indigo-600 transition-colors cursor-pointer"
          onClick={logout}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
