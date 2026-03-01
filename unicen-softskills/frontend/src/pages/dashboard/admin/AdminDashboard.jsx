import { useEffect } from "react";
import "./AdminDashboard.css"; // asegúrate el nombre exacto

export default function AdminDashboard() {
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
    <>
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
          <p className="card-description">Mejora promedio por carrera en el último semestre.</p>
          <div className="chart-placeholder">
            <div className="chart-bar" style={{ left: "10%", width: "30px" }} data-height="60" />
            <div className="chart-bar" style={{ left: "50%", width: "30px" }} data-height="75" />
            <div className="chart-bar" style={{ left: "90%", width: "30px" }} data-height="45" />
          </div>
        </div>

        <div className="indicator-card">
          <h2 className="card-title">Comparativa 4to vs 7mo Semestre</h2>
          <div className="card-value">+22 pts</div>
          <p className="card-description">Diferencia promedio entre 4to y 7mo (progresión académica).</p>
          <div className="chart-placeholder">
            <div className="chart-bar light" style={{ left: "20%" }} data-height="50" />
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
    </>
  );
}