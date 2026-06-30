import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import AddVenue from "./components/AddVenue";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/owner" element={<DashboardLayout />}>
        <Route index element={<OwnerDashboard />} />
        <Route path="add-venue" element={<AddVenue />} />
      </Route>

      {/* This means "anything else" — redirect to '/login'. So visiting / or any unknown URL goes to login automatically.*/}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
