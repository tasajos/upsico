import { useEffect, useMemo, useState } from "react";
import "./TestDiagnostico.css";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function TestDiagnostico() {
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [escala, setEscala] = useState([]);
  const navigate = useNavigate();
  const q = useQuery();
  const testId = q.get("testId");

  const authUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser")) || null;
    } catch {
      return null;
    }
  }, []);

  const isStudent = authUser?.rol === "Estudiante";
  const backPath = isStudent ? "/estudiante" : "/admin/evaluacion-diagnostica";

  const [estudianteNombre, setEstudianteNombre] = useState("");
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("4");
  const [fechaAplicacion, setFechaAplicacion] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const [answers, setAnswers] = useState({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        setResult(null);
        setAnswers({});

        const url = testId
          ? `${API}/diagnostico/tests/${encodeURIComponent(testId)}`
          : `${API}/diagnostico/test-activo`;

        const res = await fetch(url);
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          throw new Error(data?.message || "No se pudo cargar el test.");
        }

        if (!mounted) return;

        setTest(data.test);
        setPreguntas(data.preguntas || []);
        setEscala(data.escala || []);
      } catch (e) {
        if (mounted) setError(e.message || "Error cargando test.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (isStudent && authUser) {
      const nombre = `${authUser.nombres || ""} ${authUser.apellidos || ""}`.trim();
      setEstudianteNombre(nombre);
    }

    load();
    return () => { mounted = false; };
  }, [testId, isStudent, authUser]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const totalQuestions = preguntas.length;

  const canSubmit = useMemo(() => {
    return (
      !sending &&
      estudianteNombre.trim() &&
      carrera.trim() &&
      semestre &&
      fechaAplicacion &&
      totalQuestions > 0 &&
      answeredCount === totalQuestions
    );
  }, [sending, estudianteNombre, carrera, semestre, fechaAplicacion, answeredCount, totalQuestions]);

  const onPick = (preguntaId, valor) => {
    setAnswers((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!estudianteNombre.trim()) {
      setError("⚠️ Falta completar: Nombre completo.");
      return;
    }
    if (!carrera.trim()) {
      setError("⚠️ Falta completar: Carrera.");
      return;
    }
    if (!semestre) {
      setError("⚠️ Falta completar: Semestre.");
      return;
    }
    if (!fechaAplicacion) {
      setError("⚠️ Falta completar: Fecha.");
      return;
    }
    if (answeredCount !== totalQuestions) {
      const faltantes = preguntas
        .filter((p) => !answers[p.id])
        .map((p) => `#${p.numero}`)
        .join(", ");
      setError(`⚠️ Faltan respuestas en las preguntas: ${faltantes}`);
      return;
    }

    try {
      setSending(true);

      const payload = {
        test_id: Number(testId || test?.id),
        estudiante_nombre: estudianteNombre,
        carrera,
        semestre,
        fecha_aplicacion: fechaAplicacion,
        respuestas: preguntas.map((p) => ({
          pregunta_id: p.id,
          valor: Number(answers[p.id]),
        })),
      };

      if (!payload.test_id) {
        throw new Error("No se pudo determinar el test_id. Volvé a cargar la página.");
      }

      const res = await fetch(`${API}/diagnostico/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data?.message || "No se pudo enviar el test.");
      }

      const resultadoFinal = {
        intento_id: data.intento_id,
        total: data.total,
        nivel: data.nivel,
      };

      // Persistir en localStorage para que esté disponible al navegar
      localStorage.setItem("ultimoResultado", JSON.stringify(resultadoFinal));

      setResult(resultadoFinal);
      setShowModal(true);

    } catch (e) {
      setError(e.message || "Error enviando test.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="td-wrap">
        <div className="td-card">Cargando test diagnóstico...</div>
      </div>
    );
  }

  if (error && !test) {
    return (
      <div className="td-wrap">
        <div className="td-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="td-back" type="button" onClick={() => navigate(backPath)} style={{ marginTop: 12 }}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="td-wrap">
      <div className="td-header">
        <div>
          <h1 className="td-title">Test Diagnóstico</h1>
          <p className="td-subtitle">
            {isStudent
              ? "Evaluación diagnóstica habilitada para el estudiante."
              : (<>{test?.nombre} · {test?.version}{testId ? <span style={{ marginLeft: 8, color: "#64748b" }}>· ID {testId}</span> : null}</>)
            }
          </p>
        </div>

        <button className="td-back" type="button" onClick={() => navigate(backPath)}>
          ← Volver
        </button>

        <div className="td-progress">
          <div className="td-progress-top">
            <span>Progreso</span>
            <strong>{answeredCount}/{totalQuestions}</strong>
          </div>
          <div className="td-bar">
            <div
              className="td-bar-fill"
              style={{ width: `${totalQuestions ? (answeredCount / totalQuestions) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <form className="td-grid" onSubmit={handleSubmit}>
        <section className="td-panel">
          <h3 className="td-panel-title">Datos del estudiante</h3>

          <label className="td-field">
            <span>Nombre completo</span>
            <input
              value={estudianteNombre}
              onChange={(e) => setEstudianteNombre(e.target.value)}
              readOnly={isStudent}
            />
          </label>

          <label className="td-field">
            <span>Carrera</span>
            <select value={carrera} onChange={(e) => setCarrera(e.target.value)}>
              <option value="">-- Seleccioná tu carrera --</option>
              <option>Administración de Empresas</option>
              <option>Administración de Empresas Turísticas, Hoteleras y Gastronómicas</option>
              <option>Contaduría Pública</option>
              <option>Derecho y Ciencias Jurídicas</option>
              <option>Fisioterapia y Kinesiología</option>
              <option>Ingeniería Comercial</option>
              <option>Ingeniería Financiera</option>
              <option>Innovación Digital e Inteligencia Artificial</option>
              <option>Medicina</option>
              <option>Propaganda, Publicidad y Marketing</option>
              <option>Psicología</option>
            </select>
          </label>

          <div className="td-row">
            <label className="td-field">
              <span>Semestre</span>
              <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
                <option value="4">4to</option>
                <option value="7">7mo</option>
              </select>
            </label>

            <label className="td-field">
              <span>Fecha</span>
              <input
                type="date"
                value={fechaAplicacion}
                onChange={(e) => setFechaAplicacion(e.target.value)}
              />
            </label>
          </div>

          {error && (
            <div className="td-alert" role="alert">{error}</div>
          )}

          <button className="td-submit" type="submit" disabled={!canSubmit}>
            {sending ? "Enviando..." : "Enviar evaluación"}
          </button>

          {!isStudent && result && (
            <div className="td-result">
              <div className="td-result-top">
                <strong>Resultado</strong>
                <span className={`td-pill ${String(result.nivel || "").toLowerCase()}`}>
                  {result.nivel}
                </span>
              </div>
              <div className="td-result-score">
                <span>Puntaje total</span>
                <b>{result.total}</b>
              </div>
              <div className="td-result-meta">ID Intento: {result.intento_id}</div>
            </div>
          )}
        </section>

        <section className="td-panel td-panel-wide">
          <h3 className="td-panel-title">Preguntas</h3>

          <div className="td-scale">
            <span>Escala:</span>
            {escala?.length ? (
              escala.map((s) => (
                <span key={s.valor} className="td-scale-item">
                  <b>{s.valor}</b> {s.label}
                </span>
              ))
            ) : (
              <span className="td-scale-item">1–4</span>
            )}
          </div>

          <div className="td-questions">
            {preguntas.map((p) => (
              <article key={p.id} className={`td-q ${answers[p.id] ? "done" : ""}`}>
                <div className="td-q-head">
                  <span className="td-q-num">#{p.numero}</span>
                  <div className="td-q-title">
                    {!isStudent && (
                      <div className="td-competencia">{p.competencia || "Sin competencia"}</div>
                    )}
                    <p className="td-q-text">{p.enunciado}</p>
                  </div>
                </div>
                <div className="td-q-options">
                  {[1, 2, 3, 4].map((v) => (
                    <label key={v} className={`td-opt ${Number(answers[p.id]) === v ? "active" : ""}`}>
                      <input
                        type="radio"
                        name={`p_${p.id}`}
                        value={v}
                        checked={Number(answers[p.id]) === v}
                        onChange={() => onPick(p.id, v)}
                      />
                      <span>{v}</span>
                    </label>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </form>

      {/* ── Modal resultado ── */}
      {showModal && result && (
        <div className="td-modal-overlay">
          <div className="td-modal">
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>

            <h2 style={{ color: "#1e3a8a", marginBottom: 4 }}>¡Evaluación completada!</h2>
            <p style={{ color: "#64748b", marginBottom: 20 }}>Tu evaluación fue enviada correctamente.</p>

            {/* Puntaje */}
            <div style={{
              background: "#eff6ff", border: "1px solid #bfdbfe",
              borderRadius: 14, padding: "16px 24px", marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Puntaje obtenido</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#1e3a8a", lineHeight: 1 }}>
                {result.total}
              </div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
                de {totalQuestions * 4} puntos posibles
              </div>
            </div>

            {/* Nivel */}
            <div style={{
              display: "inline-block",
              padding: "8px 24px", borderRadius: 999,
              fontWeight: 800, fontSize: 16, marginBottom: 24,
              background:
                result.nivel === "AVANZADO" ? "#dcfce7" :
                result.nivel === "FUNCIONAL" ? "#fef9c3" : "#fee2e2",
              color:
                result.nivel === "AVANZADO" ? "#15803d" :
                result.nivel === "FUNCIONAL" ? "#854d0e" : "#b91c1c",
            }}>
              Nivel: {result.nivel}
            </div>

            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              {result.nivel === "AVANZADO" && "¡Excelente! Tenés un nivel avanzado de habilidades."}
              {result.nivel === "FUNCIONAL" && "Buen trabajo. Hay algunas áreas que podés mejorar."}
              {result.nivel === "BASICO" && "Te recomendamos revisar los recursos de apoyo disponibles."}
            </p>

            <button
              className="td-modal-btn"
              onClick={() => navigate("/estudiante", {
                state: {
                  resultado: {
                    total: result.total,
                    nivel: result.nivel,
                    intento_id: result.intento_id,
                  }
                }
              })}
            >
              Ver mis recomendaciones →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}