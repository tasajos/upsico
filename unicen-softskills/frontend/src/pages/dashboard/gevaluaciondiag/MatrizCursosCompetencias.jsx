import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

async function apiJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || "Error en la solicitud");
  return data;
}

const ESTADOS = [
  { v: "NO", label: "— NO" },
  { v: "PARCIAL", label: "◐ PARCIAL" },
  { v: "DIRECTO", label: "✔ DIRECTO" },
];

export default function MatrizCursosCompetencias() {
  const [catLoading, setCatLoading] = useState(false);
  const [matLoading, setMatLoading] = useState(false);
  const [matError, setMatError] = useState("");

  const [cursos, setCursos] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [rows, setRows] = useState([]);

  const [fCurso, setFCurso] = useState("");
  const [fComp, setFComp] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [addCurso, setAddCurso] = useState("");
  const [addComp, setAddComp] = useState("");
  const [addEstado, setAddEstado] = useState("DIRECTO");
  const [addPeso, setAddPeso] = useState("25");

  const queryUrl = useMemo(() => {
    const qs = new URLSearchParams();
    if (fCurso) qs.set("curso_id", fCurso);
    if (fComp) qs.set("competencia_id", fComp);
    return `${API}/matriz${qs.toString() ? `?${qs}` : ""}`;
  }, [fCurso, fComp]);

  // catálogos (1 vez)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCatLoading(true);
        setMatError("");
        const data = await apiJson(`${API}/matriz/catalogos`);
        if (!mounted) return;
        setCursos(data.cursos || []);
        setCompetencias(data.competencias || []);
      } catch (e) {
        if (mounted) setMatError(e.message || "Error cargando catálogos.");
      } finally {
        if (mounted) setCatLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // matriz (cada vez que cambian filtros)
  const loadRows = async () => {
    const data = await apiJson(queryUrl);
    setRows(data.rows || []);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setMatLoading(true);
        setMatError("");
        const data = await apiJson(queryUrl);
        if (!mounted) return;
        setRows(data.rows || []);
      } catch (e) {
        if (mounted) setMatError(e.message || "Error cargando matriz.");
      } finally {
        if (mounted) setMatLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [queryUrl]);

  const createRelacion = async () => {
    await apiJson(`${API}/matriz`, {
      method: "POST",
      body: JSON.stringify({
        curso_id: addCurso,
        competencia_id: addComp,
        estado: addEstado,
        peso: addPeso,
      }),
    });
    setAddOpen(false);
    setAddCurso("");
    setAddComp("");
    setAddEstado("DIRECTO");
    setAddPeso("25");
    await loadRows();
  };

  const updateRow = async (id, patch) => {
    await apiJson(`${API}/matriz/${id}`, { method: "PUT", body: JSON.stringify(patch) });
  };

  const removeRelacion = async (id) => {
    await apiJson(`${API}/matriz/${id}`, { method: "DELETE" });
    await loadRows();
  };

  return (
    <div className="ged-work">
      <div className="ged-work-title">Matriz cursos vs competencias</div>
      <div className="ged-work-text">
        Define <b>Estado</b> (NO/PARCIAL/DIRECTO) y <b>Peso (%)</b>.
      </div>

      <div className="ged-mat-toolbar">
        <div className="ged-mat-filters">
          <label className="ged-mat-field">
            <span>Curso</span>
            <select value={fCurso} onChange={(e) => setFCurso(e.target.value)} disabled={catLoading}>
              <option value="">Todos</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}{c.codigo ? ` (${c.codigo})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="ged-mat-field">
            <span>Competencia</span>
            <select value={fComp} onChange={(e) => setFComp(e.target.value)} disabled={catLoading}>
              <option value="">Todas</option>
              {competencias.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="button" className="ged-btn ged-btn-primary" onClick={() => setAddOpen(true)}>
          ＋ Agregar relación
        </button>
      </div>

      {matError && <div className="td-alert" role="alert" style={{ marginTop: 12 }}>{matError}</div>}

      {matLoading ? (
        <div style={{ marginTop: 12 }}>Cargando matriz...</div>
      ) : (
        <div className="ged-mat-tablewrap" style={{ marginTop: 12 }}>
          <table className="ged-mat-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Competencia</th>
                <th style={{ width: 200 }}>Estado</th>
                <th style={{ width: 160 }}>Peso (%)</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="ged-mat-course">
                      <b>{r.curso_nombre}</b>
                      <span>{r.curso_codigo || "—"}</span>
                    </div>
                  </td>
                  <td>{r.competencia_nombre}</td>

                  <td>
                    <select
                      className="ged-mat-select"
                      defaultValue={r.estado}
                      onChange={async (e) => {
                        const v = e.target.value;
                        await updateRow(r.id, { estado: v });
                      }}
                    >
                      {ESTADOS.map((x) => (
                        <option key={x.v} value={x.v}>{x.label}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      className="ged-mat-weight"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={r.peso}
                      onBlur={async (e) => {
                        const v = e.target.value;
                        await updateRow(r.id, { peso: v });
                      }}
                    />
                  </td>

                  <td>
                    <button type="button" className="ged-mini" onClick={() => removeRelacion(r.id)}>
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}

              {!rows.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 12, color: "#64748b", fontWeight: 800 }}>
                    No hay relaciones aún. Presiona “Agregar relación”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Agregar */}
      {addOpen && (
        <div className="ged-modal-overlay" onClick={() => setAddOpen(false)} role="dialog" aria-modal="true">
          <div className="ged-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ged-modal-head">
              <div>
                <h3 className="ged-modal-title">Agregar relación</h3>
                <p className="ged-modal-sub">Selecciona curso, competencia, estado y peso.</p>
              </div>
              <button className="ged-modal-close" type="button" onClick={() => setAddOpen(false)}>✕</button>
            </div>

            <div className="ged-modal-body">
              <div className="ged-mat-addgrid">
                <label className="ged-mat-field">
                  <span>Curso</span>
                  <select value={addCurso} onChange={(e) => setAddCurso(e.target.value)}>
                    <option value="">Selecciona…</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}{c.codigo ? ` (${c.codigo})` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ged-mat-field">
                  <span>Competencia</span>
                  <select value={addComp} onChange={(e) => setAddComp(e.target.value)}>
                    <option value="">Selecciona…</option>
                    {competencias.map((cp) => (
                      <option key={cp.id} value={cp.id}>{cp.nombre}</option>
                    ))}
                  </select>
                </label>

                <label className="ged-mat-field">
                  <span>Estado</span>
                  <select value={addEstado} onChange={(e) => setAddEstado(e.target.value)}>
                    {ESTADOS.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}
                  </select>
                </label>

                <label className="ged-mat-field">
                  <span>Peso (%)</span>
                  <input type="number" min="0" max="100" value={addPeso} onChange={(e) => setAddPeso(e.target.value)} />
                </label>
              </div>

              <div className="ged-modal-actions">
                <button className="ged-btn ged-btn-primary" type="button" disabled={!addCurso || !addComp} onClick={createRelacion}>
                  Guardar
                </button>
                <button className="ged-btn ged-btn-ghost" type="button" onClick={() => setAddOpen(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}