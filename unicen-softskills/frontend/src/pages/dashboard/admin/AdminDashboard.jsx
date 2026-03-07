import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api";

function clampPercent(v) {
  const n = Number(v || 0);
  return Math.max(0, Math.min(100, n));
}

function shortLabel(text = "", max = 12) {
  if (!text) return "N/A";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resumen, setResumen] = useState(null);
  const [comparativo, setComparativo] = useState([]);
  const [impacto, setImpacto] = useState([]);
  const [debiles, setDebiles] = useState([]);
  const [carreras, setCarreras] = useState([]);

  const [filters, setFilters] = useState({
    carrera: "",
    desde: "",
    hasta: "",
  });

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.carrera) params.append("carrera", filters.carrera);
    if (filters.desde) params.append("desde", filters.desde);
    if (filters.hasta) params.append("hasta", filters.hasta);
    return params.toString();
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const qs = buildQuery();
      const suffix = qs ? `?${qs}` : "";

      const [rResumen, rComparativo, rImpacto, rDebiles, rCarreras] =
        await Promise.all([
          fetch(`${API}/diagnostico/resumen${suffix}`),
          fetch(`${API}/diagnostico/comparativo${suffix}`),
          fetch(`${API}/diagnostico/impacto${suffix}`),
          fetch(`${API}/diagnostico/competencias-debiles${suffix}`),
          fetch(`${API}/diagnostico/carreras`),
        ]);

      const dResumen = await rResumen.json().catch(() => ({}));
      const dComparativo = await rComparativo.json().catch(() => ({}));
      const dImpacto = await rImpacto.json().catch(() => ({}));
      const dDebiles = await rDebiles.json().catch(() => ({}));
      const dCarreras = await rCarreras.json().catch(() => ({}));

      if (!rResumen.ok) throw new Error(dResumen?.message || "No se pudo cargar resumen.");
      if (!rComparativo.ok) throw new Error(dComparativo?.message || "No se pudo cargar comparativo.");
      if (!rImpacto.ok) throw new Error(dImpacto?.message || "No se pudo cargar impacto.");
      if (!rDebiles.ok) throw new Error(dDebiles?.message || "No se pudo cargar competencias débiles.");
      if (!rCarreras.ok) throw new Error(dCarreras?.message || "No se pudo cargar carreras.");

      setResumen(dResumen?.resumen || null);
      setComparativo(dComparativo?.bySemestre || []);
      setImpacto(dImpacto?.byCarrera || []);
      setDebiles(dDebiles?.rows || []);
      setCarreras(dCarreras?.rows || []);
    } catch (e) {
      setError(e.message || "Error al cargar dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const porcentajeBasico = useMemo(() => {
    if (!resumen || !Number(resumen.total)) return 0;
    return Math.round((Number(resumen.basico || 0) / Number(resumen.total)) * 100);
  }, [resumen]);

  const porcentajeFuncional = useMemo(() => {
    if (!resumen || !Number(resumen.total)) return 0;
    return Math.round((Number(resumen.funcional || 0) / Number(resumen.total)) * 100);
  }, [resumen]);

  const porcentajeAvanzado = useMemo(() => {
    if (!resumen || !Number(resumen.total)) return 0;
    return Math.round((Number(resumen.avanzado || 0) / Number(resumen.total)) * 100);
  }, [resumen]);

  const comparativa4to = useMemo(
    () => comparativo.find((x) => String(x.semestre) === "4") || null,
    [comparativo]
  );

  const comparativa7mo = useMemo(
    () => comparativo.find((x) => String(x.semestre) === "7") || null,
    [comparativo]
  );

  const diferenciaSemestres = useMemo(() => {
    const a = Number(comparativa4to?.avg_total || 0);
    const b = Number(comparativa7mo?.avg_total || 0);
    return (b - a).toFixed(2);
  }, [comparativa4to, comparativa7mo]);

  const topCarreras = useMemo(() => impacto.slice(0, 5), [impacto]);

  const maxCarreraAvg = useMemo(() => {
    if (!topCarreras.length) return 1;
    return Math.max(...topCarreras.map((x) => Number(x.avg_total || 0)), 1);
  }, [topCarreras]);

  const pieBackground = useMemo(() => {
    const b = porcentajeBasico;
    const f = porcentajeFuncional;
    const a = porcentajeAvanzado;
    return `conic-gradient(
      #1e40af 0% ${b}%,
      #3b82f6 ${b}% ${b + f}%,
      #93c5fd ${b + f}% ${b + f + a}%,
      #e5edf9 ${b + f + a}% 100%
    )`;
  }, [porcentajeBasico, porcentajeFuncional, porcentajeAvanzado]);

  if (loading) {
    return <div className="dashboard-loading">Cargando dashboard institucional...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <>
      <div className="dashboard-head">
        <div>
          <h1 className="dashboard-title">Dashboard Institucional</h1>
          <p className="dashboard-subtitle">
            Indicadores reales de evaluaciones diagnósticas por carrera, semestre y nivel.
          </p>
        </div>

        <button className="dashboard-refresh-btn" onClick={loadDashboard}>
          Actualizar
        </button>
      </div>

      <section className="dashboard-filters">
        <div className="dashboard-filter-field">
          <label>Carrera</label>
          <select name="carrera" value={filters.carrera} onChange={onFilterChange}>
            <option value="">Todas</option>
            {carreras.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="dashboard-filter-field">
          <label>Desde</label>
          <input type="date" name="desde" value={filters.desde} onChange={onFilterChange} />
        </div>

        <div className="dashboard-filter-field">
          <label>Hasta</label>
          <input type="date" name="hasta" value={filters.hasta} onChange={onFilterChange} />
        </div>

        <div className="dashboard-filter-actions">
          <button className="dashboard-apply-btn" onClick={loadDashboard}>
            Aplicar filtros
          </button>
          <button
            className="dashboard-clear-btn"
            onClick={() => {
              setFilters({ carrera: "", desde: "", hasta: "" });
              setTimeout(() => {
                window.location.reload();
              }, 50);
            }}
          >
            Limpiar
          </button>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total intentos</span>
          <strong className="kpi-value">{Number(resumen?.total || 0)}</strong>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Promedio general</span>
          <strong className="kpi-value">{Number(resumen?.promedio || 0).toFixed(2)}</strong>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Nivel básico</span>
          <strong className="kpi-value">{porcentajeBasico}%</strong>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Nivel avanzado</span>
          <strong className="kpi-value">{porcentajeAvanzado}%</strong>
        </div>
      </section>

      <section className="indicators-grid">
        <div className="indicator-card">
          <h2 className="card-title">% Estudiantes en Nivel Básico</h2>
          <div className="card-value">{porcentajeBasico}%</div>
          <p className="card-description">
            Porcentaje real de estudiantes clasificados en nivel básico.
          </p>

          <div className="chart-placeholder single-bar">
            <div
              className="chart-bar"
              style={{
                left: "45%",
                height: `${clampPercent(porcentajeBasico)}%`,
              }}
            />
          </div>
        </div>

        <div className="indicator-card">
          <h2 className="card-title">Promedio por Carrera</h2>
          <div className="card-value">
            {topCarreras.length ? Number(topCarreras[0].avg_total || 0).toFixed(2) : "0.00"}
          </div>
          <p className="card-description">
            Las carreras con mejor promedio de puntaje total.
          </p>

          <div className="chart-placeholder bars-with-labels">
            {topCarreras.map((c, i) => {
              const height = (Number(c.avg_total || 0) / maxCarreraAvg) * 100;
              const positions = ["8%", "26%", "44%", "62%", "80%"];

              return (
                <div key={`${c.carrera}-${i}`}>
                  <div
                    className="chart-bar"
                    style={{
                      left: positions[i],
                      width: "34px",
                      height: `${clampPercent(height)}%`,
                    }}
                    title={`${c.carrera}: ${c.avg_total}`}
                  />
                  <span className="bar-bottom-label" style={{ left: positions[i] }}>
                    {shortLabel(c.carrera, 10)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="indicator-card">
          <h2 className="card-title">Comparativa 4to vs 7mo Semestre</h2>
          <div className="card-value">{diferenciaSemestres} pts</div>
          <p className="card-description">
            Diferencia real del puntaje promedio entre 4to y 7mo semestre.
          </p>

          <div className="chart-placeholder">
            <div
              className="chart-bar light"
              style={{
                left: "22%",
                width: "42px",
                height: `${clampPercent((Number(comparativa4to?.avg_total || 0) / 84) * 100)}%`,
              }}
              title={`4to: ${comparativa4to?.avg_total || 0}`}
            />
            <div
              className="chart-bar"
              style={{
                left: "62%",
                width: "42px",
                height: `${clampPercent((Number(comparativa7mo?.avg_total || 0) / 84) * 100)}%`,
              }}
              title={`7mo: ${comparativa7mo?.avg_total || 0}`}
            />
          </div>

          <div className="sem-labels">
            <span>4to</span>
            <span>7mo</span>
          </div>
        </div>

        <div className="indicator-card">
          <h2 className="card-title">Distribución por Niveles</h2>
          <div className="pie-card-wrap">
            <div className="pie-chart-real" style={{ background: pieBackground }} />
            <div className="pie-legend">
              <div className="pie-legend-item">
                <span className="legend-dot legend-basico" />
                <span>Básico ({porcentajeBasico}%)</span>
              </div>
              <div className="pie-legend-item">
                <span className="legend-dot legend-funcional" />
                <span>Funcional ({porcentajeFuncional}%)</span>
              </div>
              <div className="pie-legend-item">
                <span className="legend-dot legend-avanzado" />
                <span>Avanzado ({porcentajeAvanzado}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="indicator-card indicator-card-wide">
          <h2 className="card-title">Top 3 Competencias Más Débiles</h2>
          <ul className="weak-list">
            {debiles.length ? (
              debiles.slice(0, 3).map((item, idx) => (
                <li key={item.competencia}>
                  {idx + 1}. {item.competencia} ({Number(item.promedio || 0).toFixed(2)})
                </li>
              ))
            ) : (
              <li>No hay datos suficientes.</li>
            )}
          </ul>

          <div className="weak-mini-bars">
            {debiles.slice(0, 3).map((item) => (
              <div key={item.competencia} className="weak-mini-row">
                <span>{shortLabel(item.competencia, 18)}</span>
                <div className="weak-mini-track">
                  <div
                    className="weak-mini-fill"
                    style={{
                      width: `${clampPercent((Number(item.promedio || 0) / 4) * 100)}%`,
                    }}
                  />
                </div>
                <strong>{Number(item.promedio || 0).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}