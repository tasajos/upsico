import { Navigate, Outlet } from "react-router-dom";

export default function StudentRoute() {
  const raw = localStorage.getItem("authUser");

  if (!raw) return <Navigate to="/" replace />;

  try {
    const user = JSON.parse(raw);
    if (!user || user.rol !== "Estudiante") {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch {
    return <Navigate to="/" replace />;
  }
}