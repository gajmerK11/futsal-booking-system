import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const location = useLocation();
  const { username, from } = location.state;
  const message =
    from === "login" ? `Hello ${username}` : `Welcome onboard ${username}`;
  // Grabbing 'accessToken' from context
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("http://localhost:3000/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Parsing/converting response
      const data = await response.json();

      console.log(data);
    }

    fetchProfile();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl">{message}</h1>
    </div>
  );
}
export default Dashboard;
