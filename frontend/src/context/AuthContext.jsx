import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Creates the container and 'AuthContext' is the name of that container
const AuthContext = createContext();

// Creates provider
function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");

  // This is used here to navigate user to login page when logged out, not for 'CONTEXT' purpose
  const navigate = useNavigate();

  const [username, setUsername] = useState("Owner");

  // Logout function
  async function logout() {
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include", // needed to send the refresh token cookie because frontend runs on different port i.e. 5173 and cross-origin requests don't send cookies by default
    });

    if (response.ok) {
      setAccessToken(null); // clear access token from context
      setRole(null); // clear role from context as well because after logout, no need of role
      navigate("/login"); // redirect to login page
    }
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        role,
        setRole,
        logout,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
