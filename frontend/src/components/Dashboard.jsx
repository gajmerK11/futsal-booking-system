import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const username = location.state.username;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl">Hello {username}</h1>
    </div>
  );
}
export default Dashboard;
