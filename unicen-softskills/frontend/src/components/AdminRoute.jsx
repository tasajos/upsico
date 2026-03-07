import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const raw = localStorage.getItem("authUser");

  if (!raw) return <Navigate to="/" replace />;

  try {
    const user = JSON.parse(raw);
    if (!user || user.rol !== "Administrador") {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch {
    return <Navigate to="/" replace />;
  }
}