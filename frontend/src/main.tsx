import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

// 'document.getElementById' can return null (TS doesn't know '#root' exists in index.html)
// The '!' tells TS "trust me, this element is always there" — safe here since it's
// hardcoded in our own index.html and never removed.
createRoot(document.getElementById("root")!).render(
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
