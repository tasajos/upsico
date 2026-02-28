import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import GestionEvDiag from "./pages/dashboard/gevaluaciondiag/GestionEvDiag";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin/evaluacion-diagnostica" element={<GestionEvDiag />} />
      </Routes>
    </BrowserRouter>
  );
}

