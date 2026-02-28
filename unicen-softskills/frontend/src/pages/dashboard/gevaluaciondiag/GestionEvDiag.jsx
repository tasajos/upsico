import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GestionEvDiag.css";

const API = "http://localhost:5000/api";

async function apiJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || "Error en la solicitud");
  return data;
}

const MODULOS = [
  { key: "evaluaciones", icon: "🧾", title: "Gestiona evaluaciones", desc: "Configurar • Revisar • Exportar" },
  { key: "reportes", icon: "📊", title: "Reportes (individual / institucional)", desc: "Configurar • Revisar • Exportar" },
  { key: "matriz", icon: "🧩", title: "Matriz cursos vs competencias", desc: "Configurar • Revisar • Exportar" },
  { key: "comparativo", icon: "🧭", title: "Seguimiento comparativo", desc: "Configurar • Revisar • Exportar" },
  { key: "impacto", icon: "🎯", title: "Indicadores de impacto", desc: "Configurar • Revisar • Exportar" },
];

export default function GestionEvDiag() {
  const navigate = useNavigate();
  const [active, setActive] = useState("evaluaciones");
  const [intentos, setIntentos] = useState([]);
  const [loadingIntentos, setLoadingIntentos] = useState(false);
  const [errorIntentos, setErrorIntentos] = useState("");
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError] = useState("");
  const [detalle, setDetalle] = useState(null); 

  const activeModule = useMemo(
    () => MODULOS.find((m) => m.key === active) || MODULOS[0],
    [active]
  );

  // Cargar intentos SOLO cuando entras a "Reportes"
  useEffect(() => {
    let mounted = true;

    async function loadIntentos() {
      try {
        setLoadingIntentos(true);
        setErrorIntentos("");
        const data = await apiJson(`${API}/diagnostico/intentos`);
        if (!mounted) return;
        setIntentos(data.rows || []);
      } catch (e) {
        if (mounted) setErrorIntentos(e.message || "Error cargando intentos.");
      } finally {
        if (mounted) setLoadingIntentos(false);
      }
    }

    if (active === "reportes") loadIntentos();
    return () => (mounted = false);
  }, [active]);

  const kpis = useMemo(
    () => [
      { label: "Estado", value: "Activo", hint: "Test disponible" },
      { label: "Periodo", value: "2026-I", hint: "Editable luego" },
      { label: "Cobertura", value: "—", hint: "Se calculará con BD" },
    ],
    []
  );

  const closeDetalle = () => {
  setDetalleOpen(false);
  setDetalle(null);
  setDetalleError("");
};

const openDetalle = async (id) => {
  try {
    setDetalleOpen(true);
    setDetalleLoading(true);
    setDetalleError("");
    setDetalle(null);

    const data = await apiJson(`${API}/diagnostico/intentos/${id}`);
    setDetalle(data); // { ok:true, intento, respuestas }
  } catch (e) {
    setDetalleError(e.message || "No se pudo cargar el detalle.");
  } finally {
    setDetalleLoading(false);
  }
};

  function renderModuleBody() {
    // 1) Evaluaciones (por ahora: guía y acceso directo al test)
    if (active === "evaluaciones") {
      return (
        <div className="ged-work">
          <div className="ged-work-title">Evaluaciones</div>
          <div className="ged-work-text">
            Aquí podrás crear/activar un test, versionarlo y definir ventana de aplicación por carrera/semestre.
          </div>

          <div className="ged-work-actions">
            <button type="button" className="ged-chip" onClick={() => navigate("/admin/evaluacion-diagnostica/test")}>
              🧪 Aplicar Test
            </button>
            <button type="button" className="ged-chip" onClick={() => alert("Nueva evaluación (mock)")}>
              ＋ Nueva evaluación
            </button>
          </div>
        </div>
      );
    }

    // 2) Reportes (YA con datos reales: intentos)
    if (active === "reportes") {
      return (
        <div className="ged-work">
          <div className="ged-work-title">Reportes</div>
          <div className="ged-work-text">
            Listado de intentos enviados. Luego aquí generaremos reporte individual e institucional.
          </div>

          {loadingIntentos && <div style={{ marginTop: 12 }}>Cargando intentos...</div>}
          {errorIntentos && (
            <div className="td-alert" role="alert" style={{ marginTop: 12 }}>
              {errorIntentos}
            </div>
          )}

          {!loadingIntentos && !errorIntentos && (
            <div style={{ marginTop: 14, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#1e3a8a" }}>
                    <th>ID</th>
                    <th>Estudiante</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                    <th>Fecha</th>
                    <th>Puntaje</th>
                    <th>Nivel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {intentos.map((it) => (
                    <tr key={it.id} style={{ background: "#fff", boxShadow: "0 10px 22px rgba(30,58,138,0.08)", borderRadius: 14 }}>
                      <td style={{ padding: 12, borderRadius: "14px 0 0 14px" }}>{it.id}</td>
                      <td style={{ padding: 12 }}>{it.estudiante_nombre}</td>
                      <td style={{ padding: 12 }}>{it.carrera}</td>
                      <td style={{ padding: 12 }}>{it.semestre}</td>
                      <td style={{ padding: 12 }}>{String(it.fecha_aplicacion).slice(0, 10)}</td>
                      <td style={{ padding: 12, fontWeight: 800, color: "#1e40af" }}>{it.total_puntaje}</td>
                      <td style={{ padding: 12 }}>{it.nivel}</td>
                      <td style={{ padding: 12, borderRadius: "0 14px 14px 0" }}>
                        <button
                          type="button"
                          className="ged-chip"
                          onClick={() => openDetalle(it.id)}
                        >
                          📄 Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!intentos.length && (
                    <tr>
                      <td colSpan={8} style={{ padding: 12, color: "#64748b" }}>
                        No hay intentos aún. Aplica un test para generar registros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    // 3) Matriz (mock por ahora)
    if (active === "matriz") {
      return (
        <div className="ged-work">
          <div className="ged-work-title">Matriz cursos vs competencias</div>
          <div className="ged-work-text">
            Aquí vas a mapear cursos del COL ↔ competencias blandas, para recomendar capacitaciones según resultados.
          </div>
          <div className="ged-work-actions">
            <button type="button" className="ged-chip" onClick={() => alert("Configurar matriz (mock)")}>
              🧩 Configurar
            </button>
          </div>
        </div>
      );
    }

    // 4) Comparativo (mock por ahora)
    if (active === "comparativo") {
      return (
        <div className="ged-work">
          <div className="ged-work-title">Seguimiento comparativo</div>
          <div className="ged-work-text">
            Aquí compararemos 4to vs 7mo semestre y tendencia por carrera.
          </div>
        </div>
      );
    }

    // 5) Impacto (mock por ahora)
    return (
      <div className="ged-work">
        <div className="ged-work-title">Indicadores de impacto</div>
        <div className="ged-work-text">
          Aquí verás KPIs institucionales: % en básico/funcional/avanzado, evolución, cobertura, etc.
        </div>
      </div>
    );
  }

  return (
    <div className="ged-wrap">
      <div className="ged-topbar">
        <div className="ged-topbar-left">
          <h1 className="ged-title">Gestión de Evaluación Diagnóstica</h1>
          <p className="ged-subtitle">
            Administra evaluaciones, reportes, matriz cursos vs competencias y seguimiento del impacto.
          </p>
        </div>

        <div className="ged-actions">
          <button type="button" className="ged-btn ged-btn-ghost" onClick={() => navigate("/admin")}>
            ← Volver al Dashboard
          </button>
          <button type="button" className="ged-btn ged-btn-soft" onClick={() => alert("Exportar (mock)")}>
            ⬇️ Exportar
          </button>
          <button type="button" className="ged-btn ged-btn-primary" onClick={() => alert("Nueva evaluación (mock)")}>
            ＋ Nueva evaluación
          </button>
          <button type="button" className="ged-btn ged-btn-primary-alt" onClick={() => navigate("/admin/evaluacion-diagnostica/test")}>
            🧪 Aplicar Test
          </button>
        </div>
      </div>

      <div className="ged-grid">
        <aside className="ged-left">
          <div className="ged-left-card">
            <div className="ged-left-head">
              <h3>Módulos</h3>
              <span className="ged-left-pill">Mock</span>
            </div>

            <div className="ged-mod-list">
              {MODULOS.map((m) => {
                const isActive = m.key === active;
                return (
                  <button
                    key={m.key}
                    type="button"
                    className={`ged-mod ${isActive ? "active" : ""}`}
                    onClick={() => setActive(m.key)}
                  >
                    <div className="ged-mod-ico">{m.icon}</div>
                    <div className="ged-mod-body">
                      <div className="ged-mod-title">{m.title}</div>
                      <div className="ged-mod-desc">{m.desc}</div>
                    </div>
                    <div className="ged-mod-arrow">›</div>
                  </button>
                );
              })}
            </div>

            <div className="ged-tip">
              <b>Tip</b>
              <p>Ahora ya: “Reportes” muestra intentos reales desde la BD.</p>
            </div>
          </div>
        </aside>

        <main className="ged-main">
          <section className="ged-main-card">
            <div className="ged-main-head">
              <div className="ged-main-head-badge">🧩 Módulo</div>
              <h2 className="ged-main-title">{activeModule.title}</h2>
              <p className="ged-main-sub">{activeModule.desc}</p>
            </div>

            <div className="ged-kpis">
              {kpis.map((k) => (
                <div key={k.label} className="ged-kpi">
                  <div className="ged-kpi-label">{k.label}</div>
                  <div className="ged-kpi-value">{k.value}</div>
                  <div className="ged-kpi-hint">{k.hint}</div>
                </div>
              ))}
            </div>

            {/* ✅ AQUÍ se muestra lo que corresponde a cada módulo */}
            {renderModuleBody()}

            <div className="ged-steps">
              <span className={`ged-step ${active === "evaluaciones" ? "on" : ""}`}>1) Evaluaciones</span>
              <span className={`ged-step ${active === "reportes" ? "on" : ""}`}>2) Reportes</span>
              <span className={`ged-step ${active === "matriz" ? "on" : ""}`}>3) Matriz</span>
              <span className={`ged-step ${active === "comparativo" ? "on" : ""}`}>4) Comparativo</span>
              <span className={`ged-step ${active === "impacto" ? "on" : ""}`}>5) Impacto</span>
            </div>
          </section>
        </main>
      </div>

      {detalleOpen && (
  <div className="ged-modal-overlay" onClick={closeDetalle} role="dialog" aria-modal="true">
    <div className="ged-modal" onClick={(e) => e.stopPropagation()}>
      <div className="ged-modal-head">
        <div>
          <h3 className="ged-modal-title">Detalle del intento</h3>
          <p className="ged-modal-sub">
            {detalle?.intento?.estudiante_nombre ? `Estudiante: ${detalle.intento.estudiante_nombre}` : "—"}
          </p>
        </div>
        <button type="button" className="ged-modal-close" onClick={closeDetalle}>
          ✕
        </button>
      </div>

      {detalleLoading && <div className="ged-modal-body">Cargando detalle...</div>}

      {!detalleLoading && detalleError && (
        <div className="ged-modal-body">
          <div className="td-alert" role="alert">{detalleError}</div>
        </div>
      )}

      {!detalleLoading && !detalleError && detalle?.intento && (
        <div className="ged-modal-body">
          <div className="ged-det-kpis">
            <div className="ged-det-kpi">
              <span>ID</span>
              <b>{detalle.intento.id}</b>
            </div>
            <div className="ged-det-kpi">
              <span>Carrera</span>
              <b>{detalle.intento.carrera}</b>
            </div>
            <div className="ged-det-kpi">
              <span>Semestre</span>
              <b>{detalle.intento.semestre}</b>
            </div>
            <div className="ged-det-kpi">
              <span>Fecha</span>
              <b>{String(detalle.intento.fecha_aplicacion).slice(0, 10)}</b>
            </div>
            <div className="ged-det-kpi">
              <span>Puntaje</span>
              <b style={{ color: "#1e40af" }}>{detalle.intento.total_puntaje}</b>
            </div>
            <div className="ged-det-kpi">
              <span>Nivel</span>
              <b>{detalle.intento.nivel}</b>
            </div>
          </div>

          <div className="ged-det-tablewrap">
            <table className="ged-det-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Enunciado</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {(detalle.respuestas || []).map((r) => (
                  <tr key={r.pregunta_id}>
                    <td>{r.numero}</td>
                    <td>{r.enunciado}</td>
                    <td><span className="ged-det-pill">{r.valor}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ged-modal-actions">
            <button type="button" className="ged-btn ged-btn-soft" onClick={() => alert("Exportar PDF/Excel (luego)")}>
              ⬇️ Exportar detalle
            </button>
            <button type="button" className="ged-btn ged-btn-ghost" onClick={closeDetalle}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}