import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import GestionEvDiag from "./pages/dashboard/gevaluaciondiag/GestionEvDiag";
import TestDiagnostico from "./pages/dashboard/gevaluaciondiag/TestDiagnostico";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
     
        <Route path="/admin/evaluacion-diagnostica" element={<GestionEvDiag />} />
        <Route path="/admin/evaluacion-diagnostica/test" element={<TestDiagnostico />} />
           <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

