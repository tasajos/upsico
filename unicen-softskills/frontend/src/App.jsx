import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";

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
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* TODO lo de admin pasa por AdminLayout (sidebar + outlet) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* /admin */}
          <Route index element={<AdminDashboard />} />

          {/* /admin/evaluacion-diagnostica */}
          <Route path="evaluacion-diagnostica" element={<GestionEvDiag />} />
          <Route path="evaluacion-diagnostica/test" element={<TestDiagnostico />} />

          {/* /admin/usuarios */}
          <Route path="usuarios">
            <Route index element={<UsuariosHome />} />
            <Route path="nuevo" element={<NuevoUsuario />} />
            <Route path="modificar" element={<EditarUsuario />} />
            <Route path="lista" element={<ListaUsuarios />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}