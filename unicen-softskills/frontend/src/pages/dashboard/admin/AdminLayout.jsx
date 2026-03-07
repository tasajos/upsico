import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const authUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser")) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/", { replace: true });
  };

  const nombreCompleto = authUser
    ? `${authUser.nombres || ""} ${authUser.apellidos || ""}`.trim()
    : "Administrador";

  return (
    <div className="admin-shell">
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <img
              src="/unicen.png"
              alt="UNICEN"
              className="sidebar-unicen-logo"
            />
          </div>

          <div className="sidebar-title-block">
            <div className="sidebar-logo">EPSICO Admin</div>
            <span className="role-badge">{authUser?.rol || "Administrador"}</span>
          </div>
        </div>

        <div
          style={{
            padding: "0 18px 14px 18px",
            color: "#24406f",
            fontWeight: 800,
            fontSize: "13px",
            lineHeight: 1.35,
          }}
        >
          <div style={{ opacity: 0.75, fontSize: "12px" }}>Sesión activa</div>
          <div>{nombreCompleto}</div>
          <div style={{ opacity: 0.7, fontWeight: 700 }}>
            {authUser?.email || ""}
          </div>
        </div>

        <div className="sidebar-nav">
          <NavLink to="/admin" end className="nav-link">
            <span className="nav-icon">🏛️</span>Dashboard
          </NavLink>

          <NavLink to="/admin/usuarios" className="nav-link">
            <span className="nav-icon">👥</span>Gestión de Usuarios
          </NavLink>

          <NavLink to="/admin/evaluacion-diagnostica" className="nav-link">
            <span className="nav-icon">📝</span>Gestión de Evaluaciones Diagnósticas
          </NavLink>

          <NavLink to="/admin/motor" className="nav-link">
            <span className="nav-icon">🧮</span>Motor de Cálculo e Interpretación
          </NavLink>

          <NavLink to="/admin/reportes" className="nav-link">
            <span className="nav-icon">📊</span>Reportes y Analítica
          </NavLink>

          <NavLink to="/admin/rutas" className="nav-link">
            <span className="nav-icon">🛤️</span>Rutas de Capacitación
          </NavLink>

          <NavLink to="/admin/seguimiento" className="nav-link">
            <span className="nav-icon">📈</span>Seguimiento Evolutivo
          </NavLink>

          <NavLink to="/admin/cv" className="nav-link">
            <span className="nav-icon">📄</span>Perfil Profesional y CV
          </NavLink>
        </div>

        <div style={{ marginTop: "auto", padding: "16px 14px 14px 14px" }}>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <span className="nav-icon">🚪</span>Salir
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <button
        className="menu-toggle"
        aria-label="Abrir menú"
        onClick={() => setIsSidebarOpen((v) => !v)}
      >
        ☰
      </button>

      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}