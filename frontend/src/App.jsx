import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* This means "anything else" — redirect to '/login'. So visiting / or any unknown URL goes to login automatically.*/}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
