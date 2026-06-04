import { createContext, useState } from "react";

// Creates the container and 'AuthContext' is the name of that container
const AuthContext = createContext();

// Creates provider
function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
