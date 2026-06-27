import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
function Sidebar() {
  const userNav = [
    {
      label: "Dashboard",
      href: "#",
      icon: "dashboard",
    },
    {
      label: "Venues",
      href: "#",
      icon: "stadium",
    },
    {
      label: "Bookings",
      href: "#",
      icon: "event_available",
    },
    {
      label: "Profile",
      href: "#",
      icon: "person",
    },
  ];

  const ownerNav = [
    {
      label: "Dashboard",
      href: "#",
      icon: "dashboard",
    },
    {
      label: "Edit Venue ",
      href: "#",
      icon: "storefront",
    },
    {
      label: "Booking Requests ",
      href: "#",
      icon: "calendar_month",
    },
    {
      label: "Profile",
      href: "#",
      icon: "person",
    },
  ];

  const { role } = useContext(AuthContext);

  const navItems = role === "user" ? userNav : ownerNav;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#f5f5f4] border-r border-outline-variant hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 mb-8 font-extrabold uppercase tracking-tighter text-on-surface">
        FUTSALBOOK
      </div>

      {/* Nav links */}
      <nav className="px-4 space-y-2">
        {navItems.map((item) => (
          <a
            href={item.href}
            className="flex items-center gap-4 px-4 py-3"
            key={item.label}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-auto border-t border-outline-variant  p-6 ">
        <button className="flex items-center justify-center gap-2 rounded-full px-6 py-2 bg-gray-900 text-white w-full uppercase text-xs font-medium tracking-widest hover:bg-indigo-600 transition-colors">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
