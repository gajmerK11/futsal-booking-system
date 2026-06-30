import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function OwnerDashboard() {
  const { username } = useContext(AuthContext);

  const message = "login"
    ? `Hello, ${username}`
    : `Welcome onboard ${username}`;

  const navigate = useNavigate();

  return (
    <main className="p-8">
      {/* Welcome message section */}
      <section>
        <h1 className="text-display-lg font-extrabold tracking-tight text-on-surface">
          {message}
        </h1>
        <p className="text-body-lg text-on-surface-variant font-medium">
          Manage your venues. Approve bookings. Grow.
        </p>
      </section>
      {/* My Venue section */}
      <section className="mt-8">
        <h2 className="text-sm font-extrabold text-on-surface-variant mb-2 tracking-widest">
          MY VENUE
        </h2>
        <div className="flex flex-col border-2 rounded-3xl border-dashed border-outline-variant items-center p-10 bg-surface-container-low gap-4 min-h-[300px] justify-center hover:border-indigo-400">
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">
              add_business
            </span>
          </div>
          <p className="font-bold text-xl text-primary">Add Your Venue</p>
          <p className="text-on-surface-variant text-center max-w-xs">
            Get started by listing your futsal facility to start receiving
            bookings.
          </p>
          <button
            className="bg-primary text-white px-10 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-primary-container flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/owner/add-venue")}
          >
            <span className="material-symbols-outlined text-sm">add</span>ADD
            VENUE
          </button>
        </div>
      </section>
    </main>
  );
}
export default OwnerDashboard;
