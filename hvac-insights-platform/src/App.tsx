import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Technicians from "./pages/Technicians";
import UploadData from "./pages/UploadData";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="upload" element={<UploadData />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="customers" element={<Customers />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;