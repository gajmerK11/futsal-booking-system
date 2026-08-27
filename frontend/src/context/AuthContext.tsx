import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Shape of everything this context hands out to the rest of the app
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => Promise<void>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

// Creates the container and 'AuthContext' is the name of that container
// Starts as 'undefined' because there's no real value until <AuthProvider> renders
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creates provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>("");
  const [role, setRole] = useState<string | null>("");

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

// Custom hook — components call this instead of useContext(AuthContext) directly.
// Throws a clear error if used outside <AuthProvider>, instead of every consumer
// having to check "is this undefined?" themselves.
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
