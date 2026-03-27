import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";

import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";

import AdminLayout from "./pages/dashboard/admin/AdminLayout";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

import GestionEvDiag from "./pages/dashboard/gevaluaciondiag/GestionEvDiag";
import TestDiagnostico from "./pages/dashboard/gevaluaciondiag/TestDiagnostico";

import UsuariosHome from "./pages/dashboard/admin/usuarios/UsuariosHome";
import NuevoUsuario from "./pages/dashboard/admin/usuarios/NuevoUsuario";
import EditarUsuario from "./pages/dashboard/admin/usuarios/EditarUsuario";
import ListaUsuarios from "./pages/dashboard/admin/usuarios/ListaUsuarios";

import StudentLayout from "./pages/dashboard/estudiante/StudentLayout";
import StudentDashboard from "./pages/dashboard/estudiante/StudentDashboard";
import StudentEvaluaciones from "./pages/dashboard/estudiante/StudentEvaluaciones";
import StudentPerfil from "./pages/dashboard/estudiante/StudentPerfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AdminRoute />}>
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

       <Route element={<StudentRoute />}>
      <Route path="/estudiante" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="evaluaciones" element={<StudentEvaluaciones />} />
        <Route path="evaluaciones/test" element={<TestDiagnostico />} />
        <Route path="perfil" element={<StudentPerfil />} />
      </Route>
    </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}