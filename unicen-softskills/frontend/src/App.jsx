import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./pages/dashboard/admin/AdminLayout";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

import GestionEvDiag from "./pages/dashboard/gevaluaciondiag/GestionEvDiag";
import TestDiagnostico from "./pages/dashboard/gevaluaciondiag/TestDiagnostico";

import UsuariosHome from "./pages/dashboard/admin/usuarios/UsuariosHome";
import NuevoUsuario from "./pages/dashboard/admin/usuarios/NuevoUsuario";
import EditarUsuario from "./pages/dashboard/admin/usuarios/EditarUsuario";
import ListaUsuarios from "./pages/dashboard/admin/usuarios/ListaUsuarios";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="evaluacion-diagnostica" element={<GestionEvDiag />} />
            <Route path="evaluacion-diagnostica/test" element={<TestDiagnostico />} />

            <Route path="usuarios">
              <Route index element={<UsuariosHome />} />
              <Route path="nuevo" element={<NuevoUsuario />} />
              <Route path="modificar" element={<EditarUsuario />} />
              <Route path="lista" element={<ListaUsuarios />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}