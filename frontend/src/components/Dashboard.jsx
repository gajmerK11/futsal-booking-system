import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";

function Dashboard() {
  const location = useLocation();
  const { username, from } = location.state;
  const message =
    from === "login" ? `Hello, ${username}` : `Welcome onboard ${username}`;
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
    <DashboardLayout>
      <main className="p-8 max-w-7xl mx-auto">
        <section>
          <h1 className="text-display-lg font-extrabold tracking-tight text-on-surface">
            {message}
          </h1>
          <p className="text-body-lg text-on-surface-variant font-medium">
            Find a court. Book a slot. Play.
          </p>
        </section>
      </main>
    </DashboardLayout>
  );
}
export default Dashboard;
