import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 
    1. Here we have wrapped 'App' with browser router because doing so gives whole app access to routing system.
    2. And it must be wrapped at top level - all components inside can then use router features.
    3. If not wrapped: 'useNavigate', 'Link' won't work
     */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
