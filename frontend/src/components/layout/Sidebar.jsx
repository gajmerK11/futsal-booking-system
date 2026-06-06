function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#f5f5f4] border-r border-outline-variant hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 mb-8 font-extrabold uppercase tracking-tighter text-on-surface">
        FUTSALBOOK
      </div>

      {/* Nav links */}
      <nav className="px-4 space-y-2">
        <a
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-xl uppercase text-xs font-semibold tracking-widest hover:text-primary text-primary bg-primary-fixed"
        >
          {/* This span is google material icon. This is how we render it. */}
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            dashboard
          </span>
          Dashboard
        </a>
        <a
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-xl uppercase text-xs font-semibold tracking-widest hover:text-primary hover:bg-surface-container text-on-surface-variant"
        >
          <span className="material-symbols-outlined">stadium</span>
          Venues
        </a>
        <a
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-xl uppercase text-xs font-semibold tracking-widest hover:text-primary hover:bg-surface-container text-on-surface-variant"
        >
          <span className="material-symbols-outlined">event_available</span>
          Bookings
        </a>
        <a
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-xl uppercase text-xs font-semibold tracking-widest hover:text-primary hover:bg-surface-container text-on-surface-variant"
        >
          <span className="material-symbols-outlined">person</span>
          Profile
        </a>
      </nav>

      {/* Logout button */}
      <div className="mt-auto border-t border-outline-variant  p-6 ">
        <button className="flex items-center justify-center gap-2 rounded-full px-6 py-2 bg-gray-900 text-white w-full uppercase text-xs tracking-widest hover:bg-indigo-600 transition-colors">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
