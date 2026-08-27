import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// What we expect to have been passed in via navigate(path, { state: {...} })
interface NavState {
  username: string;
  from: string;
}

function Dashboard() {
  const location = useLocation();
  // react-router types 'location.state' as 'unknown' since it can carry anything —
  // we know what we put there (see Login.jsx's navigate call), so we assert the shape.
  const { username, from } = location.state as NavState;
  const message =
    from === "login" ? `Hello, ${username}` : `Welcome onboard ${username}`;
  // Grabbing 'accessToken' and 'setAccessToken' from context
  const { accessToken, setAccessToken } = useAuth();

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
    <main className="p-8">
      <section>
        <h1 className="text-display-lg font-extrabold tracking-tight text-on-surface">
          {message}
        </h1>
        <p className="text-body-lg text-on-surface-variant font-medium">
          Find a court. Book a slot. Play.
        </p>
      </section>
    </main>
  );
}
export default Dashboard;
