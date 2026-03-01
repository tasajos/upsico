import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <img src="/unicen.png" alt="UNICEN" className="sidebar-unicen-logo" />
          </div>

          <div className="sidebar-title-block">
            <div className="sidebar-logo">EPSICO Admin</div>
            <span className="role-badge">Administrador</span>
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
      </nav>

      {/* Main */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Mobile toggle */}
      <button
        className="menu-toggle"
        aria-label="Abrir menú"
        onClick={() => setIsSidebarOpen((v) => !v)}
      >
        ☰
      </button>

      {/* Overlay móvil */}
      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}