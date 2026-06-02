import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const { username, from } = location.state;
  const message =
    from === "login" ? `Hello ${username}` : `Welcome onboard ${username}`;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl">{message}</h1>
    </div>
  );
}
export default Dashboard;
