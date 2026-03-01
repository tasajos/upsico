import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GestionEvDiag.css";
import MatrizCursosCompetencias from "./MatrizCursosCompetencias";


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

// Estados de celda
const CELL = {
  NO: "NO",          // —
  PARCIAL: "PARCIAL",// ◐
  DIRECTO: "DIRECTO" // ✔️
};

function cellLabel(v) {
  if (v === CELL.DIRECTO) return "✔️";
  if (v === CELL.PARCIAL) return "◐";
  return "—";
}

function nextCell(v) {
  if (v === CELL.NO) return CELL.PARCIAL;
  if (v === CELL.PARCIAL) return CELL.DIRECTO;
  return CELL.NO;
}

export default function GestionEvDiag() {
  const navigate = useNavigate();

  const [active, setActive] = useState("evaluaciones");

  // REPORTES (intentos)
  const [intentos, setIntentos] = useState([]);
  const [loadingIntentos, setLoadingIntentos] = useState(false);
  const [errorIntentos, setErrorIntentos] = useState("");

  // DETALLE MODAL (intentos)
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError] = useState("");
  const [detalle, setDetalle] = useState(null);

  // MATRIZ (modo 1: visual, basado en el documento)
  const [matLoading, setMatLoading] = useState(false);
  const [matError, setMatError] = useState("");



  //compa
  const [carList, setCarList] = useState([]);

const [cmpCarrera, setCmpCarrera] = useState("");


//impacto
// impacto
const [impCarrera, setImpCarrera] = useState("");
const [impDesde, setImpDesde] = useState("");
const [impHasta, setImpHasta] = useState("");

const [impLoading, setImpLoading] = useState(false);
const [impError, setImpError] = useState("");
const [impData, setImpData] = useState(null);


const [cmpDesde, setCmpDesde] = useState("");
const [cmpHasta, setCmpHasta] = useState("");

const [cmpLoading, setCmpLoading] = useState(false);
const [cmpError, setCmpError] = useState("");
const [cmpData, setCmpData] = useState(null); // { bySemestre, serie }

  // Catálogos para matriz
  const [competencias, setCompetencias] = useState([
    "Comunicación",
    "Trabajo en equipo",
    "Adaptabilidad",
    "Resolución de problemas",
    "Gestión socioemocional",
    "Liderazgo",
    "Gestión del tiempo",
  ]);

  // Filas (cursos) y su matriz de celdas
  const [matCursos, setMatCursos] = useState([
    {
      curso: "Habilidades de Presentación para Entrevistas Laborales",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.NO,
        "Adaptabilidad": CELL.PARCIAL,
        "Resolución de problemas": CELL.PARCIAL,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.PARCIAL,
        "Gestión del tiempo": CELL.NO,
      },
    },
    {
      curso: "Trabajo en Equipo y Resolución de Conflictos",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.DIRECTO,
        "Adaptabilidad": CELL.PARCIAL,
        "Resolución de problemas": CELL.DIRECTO,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.PARCIAL,
        "Gestión del tiempo": CELL.NO,
      },
    },
    {
      curso: "Motivación, Coaching y Gestión de Equipos",
      cells: {
        "Comunicación": CELL.PARCIAL,
        "Trabajo en equipo": CELL.DIRECTO,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.DIRECTO,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.DIRECTO,
        "Gestión del tiempo": CELL.NO,
      },
    },
    {
      curso: "Inteligencia Emocional aplicada al Trabajo",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.PARCIAL,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.PARCIAL,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.PARCIAL,
        "Gestión del tiempo": CELL.NO,
      },
    },
    {
      curso: "Gestión del Tiempo y Productividad Personal",
      cells: {
        "Comunicación": CELL.NO,
        "Trabajo en equipo": CELL.NO,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.PARCIAL,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.PARCIAL,
        "Gestión del tiempo": CELL.DIRECTO,
      },
    },
    {
      curso: "Elaboración Estratégica de CV",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.NO,
        "Adaptabilidad": CELL.PARCIAL,
        "Resolución de problemas": CELL.PARCIAL,
        "Gestión socioemocional": CELL.PARCIAL,
        "Liderazgo": CELL.NO,
        "Gestión del tiempo": CELL.PARCIAL,
      },
    },
    {
      curso: "Networking Digital y Búsqueda de Empleo en Línea",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.PARCIAL,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.PARCIAL,
        "Gestión socioemocional": CELL.PARCIAL,
        "Liderazgo": CELL.PARCIAL,
        "Gestión del tiempo": CELL.PARCIAL,
      },
    },
    {
      curso: "Mentalidad Emprendedora y Autoliderazgo",
      cells: {
        "Comunicación": CELL.PARCIAL,
        "Trabajo en equipo": CELL.PARCIAL,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.DIRECTO,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.DIRECTO,
        "Gestión del tiempo": CELL.PARCIAL,
      },
    },
    {
      curso: "Comunicación Efectiva y Pitch de Negocios",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.PARCIAL,
        "Adaptabilidad": CELL.PARCIAL,
        "Resolución de problemas": CELL.DIRECTO,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.DIRECTO,
        "Gestión del tiempo": CELL.NO,
      },
    },
    {
      curso: "Transición Profesional al Mundo Laboral",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.DIRECTO,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.DIRECTO,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.PARCIAL,
        "Gestión del tiempo": CELL.PARCIAL,
      },
    },
    {
      curso: "Cursos Internacionales (3)",
      cells: {
        "Comunicación": CELL.DIRECTO,
        "Trabajo en equipo": CELL.DIRECTO,
        "Adaptabilidad": CELL.DIRECTO,
        "Resolución de problemas": CELL.DIRECTO,
        "Gestión socioemocional": CELL.DIRECTO,
        "Liderazgo": CELL.DIRECTO,
        "Gestión del tiempo": CELL.PARCIAL,
      },
    },
  ]);

  const activeModule = useMemo(
    () => MODULOS.find((m) => m.key === active) || MODULOS[0],
    [active]
  );


  // 1) Cargar carreras (cuando comparativo o impacto)
useEffect(() => {
  let mounted = true;

  async function loadCarreras() {
    try {
      const data = await apiJson(`${API}/diagnostico/carreras`);
      if (!mounted) return;
      setCarList(data.rows || []);
    } catch (e) {
      // no es fatal
    }
  }

  if (active === "comparativo" || active === "impacto") loadCarreras();

  return () => { mounted = false; };
}, [active]);


// 2) Cargar comparativo (solo comparativo)
useEffect(() => {
  let mounted = true;

  async function loadComparativo() {
    try {
      if (active !== "comparativo") return;

      setCmpLoading(true);
      setCmpError("");
      setCmpData(null);

      const qs = new URLSearchParams();
      if (cmpCarrera) qs.set("carrera", cmpCarrera);
      if (cmpDesde) qs.set("desde", cmpDesde);
      if (cmpHasta) qs.set("hasta", cmpHasta);

      const data = await apiJson(
        `${API}/diagnostico/comparativo${qs.toString() ? `?${qs}` : ""}`
      );
      if (!mounted) return;
      setCmpData(data);
    } catch (e) {
      if (mounted) setCmpError(e.message || "Error cargando comparativo.");
    } finally {
      if (mounted) setCmpLoading(false);
    }
  }

  loadComparativo();
  return () => { mounted = false; };
}, [active, cmpCarrera, cmpDesde, cmpHasta]);


// 3) Cargar impacto (solo impacto)
useEffect(() => {
  let mounted = true;

  async function loadImpacto() {
    try {
      if (active !== "impacto") return;

      setImpLoading(true);
      setImpError("");
      setImpData(null);

      const qs = new URLSearchParams();
      if (impCarrera) qs.set("carrera", impCarrera);
      if (impDesde) qs.set("desde", impDesde);
      if (impHasta) qs.set("hasta", impHasta);

      const data = await apiJson(
        `${API}/diagnostico/impacto${qs.toString() ? `?${qs}` : ""}`
      );
      if (!mounted) return;
      setImpData(data);
    } catch (e) {
      if (mounted) setImpError(e.message || "Error cargando indicadores de impacto.");
    } finally {
      if (mounted) setImpLoading(false);
    }
  }

  loadImpacto();
  return () => { mounted = false; };
}, [active, impCarrera, impDesde, impHasta]);
  // ✅ HOOK 1: cargar intentos SOLO si active === "reportes"
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

  // ✅ HOOK 2: si luego quieres traer matriz desde API/BD, aquí va (sin romper hooks)
  useEffect(() => {
  let mounted = true;

  async function loadMatrizFromApi() {
    try {
      setMatLoading(true);
      setMatError("");

      // Por ahora lo dejamos comentado (modo 1: matriz local basada en documento)
      // const data = await apiJson(`${API}/matriz`);
      // if (!mounted) return;
      // setCompetencias(data.competencias || []);
      // setMatCursos(data.cursos || []);

    } catch (e) {
      if (mounted) setMatError(e.message || "Error cargando matriz.");
    } finally {
      if (mounted) setMatLoading(false);
    }
  }

  if (active === "matriz") {
    // Si más adelante traes de API, descomenta:
    // loadMatrizFromApi();
  }

  return () => {
    mounted = false;
  };
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
      setDetalle(data);
    } catch (e) {
      setDetalleError(e.message || "No se pudo cargar el detalle.");
    } finally {
      setDetalleLoading(false);
    }
  };

  // ✅ editar una celda de matriz (cicla — → ◐ → ✔️)
  const toggleCell = (cursoIdx, compName) => {
    setMatCursos((prev) => {
      const copy = [...prev];
      const row = { ...copy[cursoIdx] };
      const cells = { ...row.cells };
      cells[compName] = nextCell(cells[compName] || CELL.NO);
      row.cells = cells;
      copy[cursoIdx] = row;
      return copy;
    });
  };

  function renderModuleBody() {
  if (active === "evaluaciones") {
    return (
      <div className="ged-work">
        <div className="ged-work-title">Evaluaciones</div>
        <div className="ged-work-text">
          Aquí podrás crear/activar un test, versionarlo y definir ventana de aplicación por carrera/semestre.
        </div>

        <div className="ged-work-actions">
          <button
            type="button"
            className="ged-chip"
            onClick={() => navigate("/admin/evaluacion-diagnostica/test")}
          >
            🧪 Aplicar Test
          </button>
          <button type="button" className="ged-chip" onClick={() => alert("Nueva evaluación (mock)")}>
            ＋ Nueva evaluación
          </button>
        </div>
      </div>
    );
  }

  if (active === "reportes") {
    return (
      <div className="ged-work">
        <div className="ged-work-title">Reportes</div>
        <div className="ged-work-text">Listado de intentos enviados.</div>

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
                  <tr
                    key={it.id}
                    style={{
                      background: "#fff",
                      boxShadow: "0 10px 22px rgba(30,58,138,0.08)",
                      borderRadius: 14,
                    }}
                  >
                    <td style={{ padding: 12, borderRadius: "14px 0 0 14px" }}>{it.id}</td>
                    <td style={{ padding: 12 }}>{it.estudiante_nombre}</td>
                    <td style={{ padding: 12 }}>{it.carrera}</td>
                    <td style={{ padding: 12 }}>{it.semestre}</td>
                    <td style={{ padding: 12 }}>{String(it.fecha_aplicacion).slice(0, 10)}</td>
                    <td style={{ padding: 12, fontWeight: 800, color: "#1e40af" }}>{it.total_puntaje}</td>
                    <td style={{ padding: 12 }}>{it.nivel}</td>
                    <td style={{ padding: 12, borderRadius: "0 14px 14px 0" }}>
                      <button type="button" className="ged-chip" onClick={() => openDetalle(it.id)}>
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

  if (active === "matriz") {
    return (
      <div className="ged-work">
        <div className="ged-work-title">Matriz cursos vs competencias</div>
        <div className="ged-work-text">
          Basada en el documento COL. Click en una celda para cambiar: <b>— → ◐ → ✔️</b>
        </div>

        <div className="ged-legend">
          <span><b>✔️</b> Desarrollo directo</span>
          <span><b>◐</b> Desarrollo parcial</span>
          <span><b>—</b> No aborda explícito</span>
        </div>

        {matError && (
          <div className="td-alert" role="alert" style={{ marginTop: 12 }}>
            {matError}
          </div>
        )}

        {matLoading ? (
          <div style={{ marginTop: 12 }}>Cargando matriz...</div>
        ) : (
          <div className="ged-matrix-wrap" style={{ marginTop: 12 }}>
            <table className="ged-matrix">
              <thead>
                <tr>
                  <th className="ged-matrix-sticky">Cursos COL / Habilidades</th>
                  {competencias.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matCursos.map((row, idx) => (
                  <tr key={row.curso}>
                    <td className="ged-matrix-sticky-row">
                      <div className="ged-matrix-course">{row.curso}</div>
                    </td>

                    {competencias.map((comp) => {
                      const v = row.cells?.[comp] || CELL.NO;
                      return (
                        <td key={comp}>
                          <button
                            type="button"
                            className={`ged-matrix-cell ${v.toLowerCase?.() || ""}`}
                            onClick={() => toggleCell(idx, comp)}
                            title={`Click para cambiar (${cellLabel(v)})`}
                          >
                            {cellLabel(v)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="ged-work-actions" style={{ marginTop: 12 }}>
          <button type="button" className="ged-btn ged-btn-soft" onClick={() => alert("Luego: guardar en BD/API")}>
            💾 Guardar cambios
          </button>
          <button type="button" className="ged-btn ged-btn-ghost" onClick={() => alert("Luego: exportar PDF/Excel")}>
            ⬇️ Exportar matriz
          </button>
        </div>
      </div>
    );
  }

  if (active === "comparativo") {
    const rows = cmpData?.bySemestre || [];
    const s4 = rows.find((r) => String(r.semestre) === "4");
    const s7 = rows.find((r) => String(r.semestre) === "7");

    return (
      <div className="ged-work">
        <div className="ged-work-title">Seguimiento comparativo (4to vs 7mo)</div>
        <div className="ged-work-text">
          Compara cantidad de intentos, puntaje promedio y distribución de niveles por semestre.
        </div>

        <div className="ged-mat-toolbar" style={{ marginTop: 12 }}>
          <div className="ged-mat-filters">
            <label className="ged-mat-field">
              <span>Carrera</span>
              <select value={cmpCarrera} onChange={(e) => setCmpCarrera(e.target.value)}>
                <option value="">Todas</option>
                {carList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="ged-mat-field">
              <span>Desde</span>
              <input type="date" value={cmpDesde} onChange={(e) => setCmpDesde(e.target.value)} />
            </label>

            <label className="ged-mat-field">
              <span>Hasta</span>
              <input type="date" value={cmpHasta} onChange={(e) => setCmpHasta(e.target.value)} />
            </label>
          </div>

          <button
            type="button"
            className="ged-btn ged-btn-soft"
            onClick={() => {
              setCmpCarrera("");
              setCmpDesde("");
              setCmpHasta("");
            }}
          >
            Limpiar
          </button>
        </div>

        {cmpError && (
          <div className="td-alert" role="alert" style={{ marginTop: 12 }}>
            {cmpError}
          </div>
        )}

        {cmpLoading ? (
          <div style={{ marginTop: 12 }}>Cargando comparativo...</div>
        ) : (
          <>
            <div className="ged-det-kpis" style={{ marginTop: 12, gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
              <div className="ged-det-kpi">
                <span>4to semestre</span>
                <b>{s4 ? `n=${s4.n} · avg=${s4.avg_total}` : "—"}</b>
              </div>
              <div className="ged-det-kpi">
                <span>7mo semestre</span>
                <b>{s7 ? `n=${s7.n} · avg=${s7.avg_total}` : "—"}</b>
              </div>
              <div className="ged-det-kpi">
                <span>Diferencia promedio</span>
                <b>{(s4 && s7) ? `${(Number(s7.avg_total) - Number(s4.avg_total)).toFixed(2)}` : "—"}</b>
              </div>
            </div>

            <div className="ged-det-tablewrap" style={{ marginTop: 12 }}>
              <table className="ged-det-table">
                <thead>
                  <tr>
                    <th>Semestre</th>
                    <th>Intentos</th>
                    <th>Promedio</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Básico</th>
                    <th>Funcional</th>
                    <th>Avanzado</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.semestre}>
                      <td><b>{r.semestre}</b></td>
                      <td>{r.n}</td>
                      <td>{r.avg_total}</td>
                      <td>{r.min_total}</td>
                      <td>{r.max_total}</td>
                      <td>{r.basico}</td>
                      <td>{r.funcional}</td>
                      <td>{r.avanzado}</td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td colSpan={8} style={{ padding: 12, color: "#64748b", fontWeight: 800 }}>
                        No hay datos con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  }

  // ✅ IMPACTO AQUÍ (no dentro de return)
  if (active === "impacto") {
    const k = impData?.kpis || null;

    const n = Number(k?.n_intentos || 0);
    const basico = Number(k?.basico || 0);
    const funcional = Number(k?.funcional || 0);
    const avanzado = Number(k?.avanzado || 0);

    const pct = (x) => (n ? `${Math.round((Number(x || 0) * 100) / n)}%` : "—");

    const byCarrera = impData?.byCarrera || [];
    const bySemestre = impData?.bySemestre || [];
    const trend = impData?.trend || [];

    return (
      <div className="ged-work">
        <div className="ged-work-title">Indicadores de impacto</div>
        <div className="ged-work-text">
          KPIs institucionales: distribución por nivel, promedios y tendencia.
        </div>

        <div className="ged-mat-toolbar" style={{ marginTop: 12 }}>
          <div className="ged-mat-filters">
            <label className="ged-mat-field">
              <span>Carrera</span>
              <select value={impCarrera} onChange={(e) => setImpCarrera(e.target.value)}>
                <option value="">Todas</option>
                {carList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="ged-mat-field">
              <span>Desde</span>
              <input type="date" value={impDesde} onChange={(e) => setImpDesde(e.target.value)} />
            </label>

            <label className="ged-mat-field">
              <span>Hasta</span>
              <input type="date" value={impHasta} onChange={(e) => setImpHasta(e.target.value)} />
            </label>
          </div>

          <button
            type="button"
            className="ged-btn ged-btn-soft"
            onClick={() => { setImpCarrera(""); setImpDesde(""); setImpHasta(""); }}
          >
            Limpiar
          </button>
        </div>

        {impError && (
          <div className="td-alert" role="alert" style={{ marginTop: 12 }}>
            {impError}
          </div>
        )}

        {impLoading ? (
          <div style={{ marginTop: 12 }}>Cargando indicadores...</div>
        ) : (
          <>
            <div className="ged-det-kpis" style={{ marginTop: 12, gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
              <div className="ged-det-kpi">
                <span>Intentos</span>
                <b>{k ? n : "—"}</b>
              </div>
              <div className="ged-det-kpi">
                <span>Promedio</span>
                <b style={{ color: "#1e40af" }}>{k ? k.avg_total : "—"}</b>
              </div>
              <div className="ged-det-kpi">
                <span>Mínimo</span>
                <b>{k ? k.min_total : "—"}</b>
              </div>
              <div className="ged-det-kpi">
                <span>Máximo</span>
                <b>{k ? k.max_total : "—"}</b>
              </div>
            </div>

            <div className="ged-det-kpis" style={{ marginTop: 12, gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
              <div className="ged-det-kpi">
                <span>Básico</span>
                <b>{basico} <span style={{ fontWeight: 700, color: "#64748b" }}>({pct(basico)})</span></b>
              </div>
              <div className="ged-det-kpi">
                <span>Funcional</span>
                <b>{funcional} <span style={{ fontWeight: 700, color: "#64748b" }}>({pct(funcional)})</span></b>
              </div>
              <div className="ged-det-kpi">
                <span>Avanzado</span>
                <b>{avanzado} <span style={{ fontWeight: 700, color: "#64748b" }}>({pct(avanzado)})</span></b>
              </div>
            </div>

            <div className="ged-det-tablewrap" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, color: "#1e3a8a", marginBottom: 8 }}>Impacto por carrera</div>
              <table className="ged-det-table">
                <thead>
                  <tr>
                    <th>Carrera</th>
                    <th>Intentos</th>
                    <th>Promedio</th>
                    <th>Básico</th>
                    <th>Funcional</th>
                    <th>Avanzado</th>
                  </tr>
                </thead>
                <tbody>
                  {byCarrera.map((r) => (
                    <tr key={r.carrera}>
                      <td><b>{r.carrera}</b></td>
                      <td>{r.n}</td>
                      <td>{r.avg_total}</td>
                      <td>{r.basico}</td>
                      <td>{r.funcional}</td>
                      <td>{r.avanzado}</td>
                    </tr>
                  ))}
                  {!byCarrera.length && (
                    <tr>
                      <td colSpan={6} style={{ padding: 12, color: "#64748b", fontWeight: 800 }}>
                        No hay datos con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="ged-det-tablewrap" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, color: "#1e3a8a", marginBottom: 8 }}>Impacto por semestre</div>
              <table className="ged-det-table">
                <thead>
                  <tr>
                    <th>Semestre</th>
                    <th>Intentos</th>
                    <th>Promedio</th>
                    <th>Básico</th>
                    <th>Funcional</th>
                    <th>Avanzado</th>
                  </tr>
                </thead>
                <tbody>
                  {bySemestre.map((r) => (
                    <tr key={r.semestre}>
                      <td><b>{r.semestre}</b></td>
                      <td>{r.n}</td>
                      <td>{r.avg_total}</td>
                      <td>{r.basico}</td>
                      <td>{r.funcional}</td>
                      <td>{r.avanzado}</td>
                    </tr>
                  ))}
                  {!bySemestre.length && (
                    <tr>
                      <td colSpan={6} style={{ padding: 12, color: "#64748b", fontWeight: 800 }}>
                        No hay datos con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="ged-det-tablewrap" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, color: "#1e3a8a", marginBottom: 8 }}>Tendencia mensual (promedio)</div>

              {!trend.length ? (
                <div style={{ padding: 12, color: "#64748b", fontWeight: 800 }}>
                  No hay tendencia para los filtros actuales.
                </div>
              ) : (
                <table className="ged-det-table">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Intentos</th>
                      <th>Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trend.map((t) => (
                      <tr key={t.ym}>
                        <td><b>{t.ym}</b></td>
                        <td>{t.n}</td>
                        <td>{t.avg_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // fallback
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
          <p className="ged-subtitle">Administra evaluaciones, reportes, matriz cursos vs competencias y seguimiento del impacto.</p>
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
              <p>“Desarrollado por Carlos Azcarraga.</p>
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

      {/* MODAL DETALLE (igual al tuyo) */}
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
                <div className="td-alert" role="alert">
                  {detalleError}
                </div>
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
                          <td>
                            <span className="ged-det-pill">{r.valor}</span>
                          </td>
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