import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // cierra sidebar cuando cambias a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Animación barras (similar a tu script)
  useEffect(() => {
    const bars = document.querySelectorAll(".chart-bar");
    bars.forEach((bar) => {
      const height = bar.getAttribute("data-height");
      bar.style.height = "0%";
      setTimeout(() => {
        bar.style.height = `${height}%`;
      }, 250);
    });
  }, []);

  return (
    <div className="admin-shell">
      {/* Sidebar */}
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
          <span className="role-badge">Administrador</span>
        </div>
        </div>

        <div className="sidebar-nav">
          <a className="nav-link" href="#">
            <span className="nav-icon">👥</span>Gestión de Usuarios
          </a>

          <Link className="nav-link" to="/admin/evaluacion-diagnostica">
  <span className="nav-icon">📝</span>Gestión de Evaluaciones Diagnósticas
</Link>

          
          <a className="nav-link" href="#">
            <span className="nav-icon">🧮</span>Motor de Cálculo e Interpretación
          </a>
          <a className="nav-link" href="#">
            <span className="nav-icon">📊</span>Reportes y Analítica
          </a>
          <a className="nav-link" href="#">
            <span className="nav-icon">🛤️</span>Rutas de Capacitación
          </a>
          <a className="nav-link" href="#">
            <span className="nav-icon">📈</span>Seguimiento Evolutivo
          </a>
          <a className="nav-link" href="#">
            <span className="nav-icon">📄</span>Perfil Profesional y CV
          </a>
        </div>
      </nav>

      {/* Main */}
      <main className="main-content">
        <h1 className="dashboard-title">Dashboard Institucional</h1>

        <section className="indicators-grid">
          <div className="indicator-card">
            <h2 className="card-title">% Estudiantes en Nivel Básico</h2>
            <div className="card-value">28%</div>
            <p className="card-description">
              Porcentaje de estudiantes en nivel básico (última evaluación institucional).
            </p>
            <div className="chart-placeholder">
              <div className="chart-bar" style={{ left: "20%" }} data-height="28" />
            </div>
          </div>

          <div className="indicator-card">
            <h2 className="card-title">Evolución Promedio por Carrera</h2>
            <div className="card-value">+15%</div>
            <p className="card-description">
              Mejora promedio por carrera en el último semestre.
            </p>
            <div className="chart-placeholder">
              <div className="chart-bar" style={{ left: "10%", width: "30px" }} data-height="60" />
              <div className="chart-bar" style={{ left: "50%", width: "30px" }} data-height="75" />
              <div className="chart-bar" style={{ left: "90%", width: "30px" }} data-height="45" />
            </div>
          </div>

          <div className="indicator-card">
            <h2 className="card-title">Comparativa 4to vs 7mo Semestre</h2>
            <div className="card-value">+22 pts</div>
            <p className="card-description">
              Diferencia promedio entre 4to y 7mo (progresión académica).
            </p>
            <div className="chart-placeholder">
              <div
                className="chart-bar light"
                style={{ left: "20%" }}
                data-height="50"
              />
              <div className="chart-bar" style={{ left: "60%" }} data-height="72" />
            </div>
          </div>

          <div className="indicator-card">
            <h2 className="card-title">Top 3 Competencias Más Débiles</h2>
            <ul className="weak-list">
              <li>1. Pensamiento Crítico (45%)</li>
              <li>2. Trabajo en Equipo (52%)</li>
              <li>3. Resolución de Problemas (58%)</li>
            </ul>
            <p className="card-description">Basado en evaluaciones diagnósticas institucionales.</p>

            <div className="chart-placeholder">
              <div className="pie" />
            </div>
          </div>
        </section>
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
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}
