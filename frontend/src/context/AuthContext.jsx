import { createContext, useState } from "react";

// Creates the container and 'AuthContext' is the name of that container
const AuthContext = createContext();

// Creates provider
function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
