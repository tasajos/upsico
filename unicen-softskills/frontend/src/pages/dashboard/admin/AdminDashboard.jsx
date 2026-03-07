import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api";

function clampPercent(v) {
  const n = Number(v || 0);
  return Math.max(0, Math.min(100, n));
}

function shortLabel(text = "", max = 18) {
  if (!text) return "N/A";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function semaforoClase(avg) {
  const n = Number(avg || 0);
  if (n < 43) return "danger";
  if (n < 64) return "warning";
  return "success";
}

function semaforoTexto(avg) {
  const n = Number(avg || 0);
  if (n < 43) return "Básico";
  if (n < 64) return "Funcional";
  return "Avanzado";
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

  const buildQuery = (customFilters = filters) => {
    const params = new URLSearchParams();
    if (customFilters.carrera) params.append("carrera", customFilters.carrera);
    if (customFilters.desde) params.append("desde", customFilters.desde);
    if (customFilters.hasta) params.append("hasta", customFilters.hasta);
    return params.toString();
  };

  const loadDashboard = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const qs = buildQuery(customFilters);
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

  const clearFilters = async () => {
    const reset = { carrera: "", desde: "", hasta: "" };
    setFilters(reset);
    await loadDashboard(reset);
  };

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

  const maxCarreraAvg = useMemo(() => {
    if (!impacto.length) return 1;
    return Math.max(...impacto.map((x) => Number(x.avg_total || 0)), 1);
  }, [impacto]);

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
            Visualización real de evaluaciones diagnósticas por carrera, semestre y nivel.
          </p>
        </div>

        <button className="dashboard-refresh-btn" onClick={() => loadDashboard()}>
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
          <button className="dashboard-apply-btn" onClick={() => loadDashboard()}>
            Aplicar filtros
          </button>
          <button className="dashboard-clear-btn" onClick={clearFilters}>
            Limpiar
          </button>
        </div>
      </section>

      <section className="kpi-grid kpi-grid-strong">
        <div className="kpi-card">
          <span className="kpi-label">Total intentos</span>
          <strong className="kpi-value">{Number(resumen?.total || 0)}</strong>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Promedio general</span>
          <strong className="kpi-value">{Number(resumen?.promedio || 0).toFixed(2)}</strong>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">% Nivel básico</span>
          <strong className="kpi-value">{porcentajeBasico}%</strong>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Diferencia 7mo vs 4to</span>
          <strong className="kpi-value">{diferenciaSemestres} pts</strong>
        </div>
      </section>

      <section className="dashboard-analytics-grid">
        <div className="analytics-card analytics-card-large">
          <div className="analytics-head">
            <h2>Distribución por niveles</h2>
            <p>Porcentaje de estudiantes clasificados en Básico, Funcional y Avanzado.</p>
          </div>

          <div className="pie-card-wrap pie-card-wrap-big">
            <div className="pie-chart-real pie-chart-real-big" style={{ background: pieBackground }} />
            <div className="pie-legend pie-legend-big">
              <div className="pie-legend-item">
                <span className="legend-dot legend-basico" />
                <span>Básico</span>
                <strong>{porcentajeBasico}%</strong>
              </div>
              <div className="pie-legend-item">
                <span className="legend-dot legend-funcional" />
                <span>Funcional</span>
                <strong>{porcentajeFuncional}%</strong>
              </div>
              <div className="pie-legend-item">
                <span className="legend-dot legend-avanzado" />
                <span>Avanzado</span>
                <strong>{porcentajeAvanzado}%</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card analytics-card-large">
          <div className="analytics-head">
            <h2>Comparativa 4to vs 7mo</h2>
            <p>Puntaje promedio real por semestre académico.</p>
          </div>

          <div className="big-bars-chart">
            <div className="big-bars-plot">
              <div className="big-bar-group">
                <div
                  className="big-bar light"
                  style={{
                    height: `${clampPercent((Number(comparativa4to?.avg_total || 0) / 84) * 100)}%`,
                  }}
                />
                <span className="big-bar-value">{Number(comparativa4to?.avg_total || 0).toFixed(2)}</span>
                <span className="big-bar-label">4to</span>
              </div>

              <div className="big-bar-group">
                <div
                  className="big-bar"
                  style={{
                    height: `${clampPercent((Number(comparativa7mo?.avg_total || 0) / 84) * 100)}%`,
                  }}
                />
                <span className="big-bar-value">{Number(comparativa7mo?.avg_total || 0).toFixed(2)}</span>
                <span className="big-bar-label">7mo</span>
              </div>
            </div>

            <div className="big-bars-foot">
              <strong>Diferencia:</strong> {diferenciaSemestres} pts
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="analytics-card">
          <div className="analytics-head">
            <h2>Promedio por carrera</h2>
            <p>Carreras ordenadas por promedio de puntaje total.</p>
          </div>

          <div className="career-horizontal-chart">
            {impacto.length ? (
              impacto.map((item) => {
                const width = (Number(item.avg_total || 0) / maxCarreraAvg) * 100;
                return (
                  <div key={item.carrera} className="career-row">
                    <span className="career-row-label">{shortLabel(item.carrera, 24)}</span>
                    <div className="career-row-track">
                      <div
                        className="career-row-fill"
                        style={{ width: `${clampPercent(width)}%` }}
                      />
                    </div>
                    <strong className="career-row-value">
                      {Number(item.avg_total || 0).toFixed(2)}
                    </strong>
                  </div>
                );
              })
            ) : (
              <p>No hay datos para mostrar.</p>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-head">
            <h2>Competencias más débiles</h2>
            <p>Top 3 competencias con menor promedio real.</p>
          </div>

          <div className="weak-mini-bars">
            {debiles.length ? (
              debiles.map((item, idx) => (
                <div key={item.competencia} className="weak-mini-row">
                  <span>{idx + 1}. {shortLabel(item.competencia, 20)}</span>
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
              ))
            ) : (
              <p>No hay datos suficientes.</p>
            )}
          </div>
        </div>
      </section>

      <section className="analytics-card table-card">
        <div className="analytics-head">
  <h2>Resumen por carrera</h2>
  <p>Intentos, promedios y semáforo de desempeño por carrera.</p>

  <div className="status-legend">
    <div className="status-legend-item">
      <span className="status-pill danger">Básico</span>
      <span>Requiere intervención prioritaria</span>
    </div>

    <div className="status-legend-item">
      <span className="status-pill warning">Funcional</span>
      <span>Requiere seguimiento</span>
    </div>

    <div className="status-legend-item">
      <span className="status-pill success">Avanzado</span>
      <span>Buen desempeño</span>
    </div>
  </div>
</div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Carrera</th>
                <th>Intentos</th>
                <th>Promedio</th>
                <th>Básico</th>
                <th>Funcional</th>
                <th>Avanzado</th>
                <th>Semáforo</th>
              </tr>
            </thead>
            <tbody>
              {impacto.length ? (
                impacto.map((row) => (
                  <tr key={row.carrera}>
                    <td>{row.carrera}</td>
                    <td>{Number(row.n || 0)}</td>
                    <td>{Number(row.avg_total || 0).toFixed(2)}</td>
                    <td>{Number(row.basico || 0)}</td>
                    <td>{Number(row.funcional || 0)}</td>
                    <td>{Number(row.avanzado || 0)}</td>
                    <td>
                    <div className="status-cell">
                      <span className={`status-pill ${semaforoClase(row.avg_total)}`}>
                        {semaforoTexto(row.avg_total)}
                      </span>
                      <small className="status-help">
                        {semaforoClase(row.avg_total) === "danger" && "Requiere intervención prioritaria"}
                        {semaforoClase(row.avg_total) === "warning" && "Requiere seguimiento"}
                        {semaforoClase(row.avg_total) === "success" && "Buen desempeño"}
                      </small>
                    </div>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No hay datos disponibles para los filtros seleccionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}