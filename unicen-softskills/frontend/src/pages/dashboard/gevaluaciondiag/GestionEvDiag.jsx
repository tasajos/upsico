import { useMemo, useState } from "react";
import "./GestionEvDiag.css";

const TABS = [
  { key: "evaluaciones", label: "Gestiona evaluaciones", icon: "📝" },
  { key: "reportes", label: "Reportes (individual / institucional)", icon: "📊" },
  { key: "matriz", label: "Matriz cursos vs competencias", icon: "🧩" },
  { key: "comparativo", label: "Seguimiento comparativo", icon: "📈" },
  { key: "impacto", label: "Indicadores de impacto", icon: "🎯" },
];

export default function GestionEvDiag() {
  const [tab, setTab] = useState("evaluaciones");
  const current = useMemo(() => TABS.find((t) => t.key === tab), [tab]);

  return (
    <section className="ged-wrap">
      <header className="ged-head">
        <div>
          <h1 className="ged-title">Gestión de Evaluación Diagnóstica</h1>
          <p className="ged-subtitle">
            Administra evaluaciones, reportes, matriz cursos vs competencias y seguimiento del impacto.
          </p>
        </div>

        <div className="ged-actions">
          <button className="ged-btn-secondary" type="button">
            ⬇️ Exportar
          </button>
          <button className="ged-btn-primary" type="button">
            ➕ Nueva evaluación
          </button>
        </div>
      </header>

      <div className="ged-grid">
        {/* Menú lateral interno */}
        <aside className="ged-menu">
          <div className="ged-menu-title">Módulos</div>

          <div className="ged-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`ged-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <span className="ged-tab-icon">{t.icon}</span>
                <span className="ged-tab-text">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="ged-hint">
            <div className="ged-hint-title">Tip</div>
            <div className="ged-hint-text">
              Por ahora esta vista es “mock”. Luego conectaremos los botones a la BD y API.
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <main className="ged-content">
          <div className="ged-panel">
            <div className="ged-panel-head">
              <div className="ged-panel-kicker">{current?.icon} Módulo</div>
              <h2 className="ged-panel-title">{current?.label}</h2>
              <p className="ged-panel-desc">
                {tab === "evaluaciones" &&
                  "Crea, publica y cierra evaluaciones por carrera/semestre; controla ventanas de aplicación y estado."}
                {tab === "reportes" &&
                  "Genera reportes individuales (por estudiante) y reportes institucionales (por carrera, cohorte y periodo)."}
                {tab === "matriz" &&
                  "Configura la matriz de cursos vs competencias (habilidades blandas) para alinear diagnóstico con oferta COL."}
                {tab === "comparativo" &&
                  "Compara resultados 4to vs 7mo semestre; seguimiento de evolución por competencia y por carrera."}
                {tab === "impacto" &&
                  "Visualiza indicadores de impacto de acciones formativas (tasa de mejora, cobertura, brechas y tendencia)."}
              </p>
            </div>

            {/* Cards rápidas */}
            <div className="ged-cards">
              <div className="ged-card">
                <div className="ged-card-title">Estado</div>
                <div className="ged-card-value">Activo (Simulado)</div>
                <div className="ged-card-note">Listo para integrar API</div>
              </div>

              <div className="ged-card">
                <div className="ged-card-title">Periodo</div>
                <div className="ged-card-value">2026-I</div>
                <div className="ged-card-note">Editable luego</div>
              </div>

              <div className="ged-card">
                <div className="ged-card-title">Cobertura</div>
                <div className="ged-card-value">—</div>
                <div className="ged-card-note">Se calculará con BD</div>
              </div>
            </div>

            {/* Placeholder contenido por módulo */}
            <div className="ged-placeholder">
              <div className="ged-placeholder-box">
                <div className="ged-placeholder-title">Área de trabajo</div>
                <div className="ged-placeholder-text">
                  Aquí irá la funcionalidad del módulo: formularios, tablas, filtros, exportación y gráficos.
                </div>

                <div className="ged-placeholder-actions">
                  <button className="ged-chip" type="button">🔎 Filtros</button>
                  <button className="ged-chip" type="button">🧾 Ver detalle</button>
                  <button className="ged-chip" type="button">📤 Generar reporte</button>
                </div>
              </div>
            </div>

            <footer className="ged-footer">
              <span className="ged-footer-pill">1) Gestiona evaluaciones</span>
              <span className="ged-footer-pill">2) Reportes</span>
              <span className="ged-footer-pill">3) Matriz</span>
              <span className="ged-footer-pill">4) Comparativo</span>
              <span className="ged-footer-pill">5) Impacto</span>
            </footer>
          </div>
        </main>
      </div>
    </section>
  );
}