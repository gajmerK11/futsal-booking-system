import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// temporarily importing sidebar component to see it
import Sidebar from "./layout/Sidebar";

function Dashboard() {
  const location = useLocation();
  const { username, from } = location.state;
  const message =
    from === "login" ? `Hello ${username}` : `Welcome onboard ${username}`;
  // Grabbing 'accessToken' and 'setAccessToken' from context
  const { accessToken, setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("http://localhost:3000/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        const newAccessToken = await fetch(
          "http://localhost:3000/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          },
        );
        // Since right now, fetch returns raw access token, we need to parse/convert it first
        const goodAccessToken = await newAccessToken.json();
        // extracting new access token
        const freshAccessToken = goodAccessToken.newAccessToken;
        // updating context using 'setAccessToken' so rest of the app has fresh access token
        setAccessToken(freshAccessToken);
        // retry '/user/profile'
        const retryResponse = await fetch(
          "http://localhost:3000/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${freshAccessToken}`,
            },
          },
        );
        // parsing/converting retried response to js object
        const retryData = await retryResponse.json();
        console.log(retryData);
        return;
      }
      // Parsing/converting response to js object so that js can use it/manipulate it
      const data = await response.json();

      console.log(data);
    }

    fetchProfile();
  }, []);
  return (
    <div>
      <Sidebar />
      <h1 className="text-3xl">{message}</h1>
    </div>
  );
}
export default Dashboard;
