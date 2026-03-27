import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

const API = "http://localhost:5000/api";

const ICONOS_CURSOS = [
  { color: "#1e3a8a", emoji: "🏆" },
  { color: "#0f6e56", emoji: "🧠" },
  { color: "#854f0b", emoji: "💼" },
  { color: "#993556", emoji: "🤝" },
];

const nivelConfig = {
  AVANZADO: { bg: "#dcfce7", text: "#15803d", barColor: "#16a34a", headerBg: "#16a34a", mensaje: "¡Excelente! Tenés competencias sólidas para el mercado laboral." },
  FUNCIONAL: { bg: "#fef9c3", text: "#854d0e", barColor: "#eab308", headerBg: "#ca8a04", mensaje: "Hay áreas clave que podés fortalecer para mejorar tu empleabilidad." },
  BASICO:    { bg: "#fee2e2", text: "#b91c1c", barColor: "#ef4444", headerBg: "#dc2626", mensaje: "Identificamos áreas importantes a desarrollar. Los cursos del COL te ayudarán." },
};

const CURSOS = [
  { nombre: "Habilidades de Presentación para Entrevistas Laborales", habilidades: ["Comunicación", "Gestión Socioemocional"], parcial: ["Adaptabilidad", "Resolución de Problemas y Pensamiento Crítico", "Liderazgo e Iniciativa"] },
  { nombre: "Trabajo en Equipo y Resolución de Conflictos", habilidades: ["Comunicación", "Trabajo en Equipo", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional"], parcial: ["Adaptabilidad", "Liderazgo e Iniciativa"] },
  { nombre: "Motivación, Coaching y Gestión de Equipos", habilidades: ["Trabajo en Equipo", "Adaptabilidad", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional", "Liderazgo e Iniciativa"], parcial: ["Comunicación"] },
  { nombre: "Inteligencia Emocional aplicada al Trabajo", habilidades: ["Comunicación", "Adaptabilidad", "Gestión Socioemocional"], parcial: ["Trabajo en Equipo", "Resolución de Problemas y Pensamiento Crítico", "Liderazgo e Iniciativa"] },
  { nombre: "Gestión del Tiempo y Productividad Personal", habilidades: ["Adaptabilidad", "Gestión Socioemocional", "Gestión de Tiempo y Responsabilidad"], parcial: ["Resolución de Problemas y Pensamiento Crítico", "Liderazgo e Iniciativa"] },
  { nombre: "Elaboración Estratégica de CV", habilidades: ["Comunicación"], parcial: ["Adaptabilidad", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional", "Gestión de Tiempo y Responsabilidad"] },
  { nombre: "Networking Digital y Búsqueda de Empleo en Línea", habilidades: ["Comunicación", "Adaptabilidad"], parcial: ["Trabajo en Equipo", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional", "Liderazgo e Iniciativa", "Gestión de Tiempo y Responsabilidad"] },
  { nombre: "Mentalidad Emprendedora y Autoliderazgo", habilidades: ["Adaptabilidad", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional", "Liderazgo e Iniciativa"], parcial: ["Comunicación", "Trabajo en Equipo", "Gestión de Tiempo y Responsabilidad"] },
  { nombre: "Comunicación Efectiva y Pitch de Negocios", habilidades: ["Comunicación", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional", "Liderazgo e Iniciativa"], parcial: ["Trabajo en Equipo"] },
  { nombre: "Transición Profesional al Mundo Laboral", habilidades: ["Comunicación", "Trabajo en Equipo", "Adaptabilidad", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional"], parcial: ["Liderazgo e Iniciativa", "Gestión de Tiempo y Responsabilidad"] },
];

const HABILIDADES_POR_NIVEL = {
  BASICO:    ["Comunicación", "Trabajo en Equipo", "Gestión Socioemocional", "Gestión de Tiempo y Responsabilidad", "Adaptabilidad", "Resolución de Problemas y Pensamiento Crítico", "Liderazgo e Iniciativa"],
  FUNCIONAL: ["Adaptabilidad", "Liderazgo e Iniciativa", "Resolución de Problemas y Pensamiento Crítico", "Gestión Socioemocional"],
  AVANZADO:  ["Liderazgo e Iniciativa", "Resolución de Problemas y Pensamiento Crítico"],
};

function getCursosRecomendados(nivel) {
  const debiles = HABILIDADES_POR_NIVEL[nivel] || [];
  return CURSOS
    .map((c) => ({ ...c, score: debiles.filter(h => c.habilidades.includes(h)).length * 2 + debiles.filter(h => c.parcial.includes(h)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function SectionDivider({ number, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 16px" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "#1e3a8a", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 800, flexShrink: 0,
      }}>
        {number}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
    </div>
  );
}

export default function StudentDashboard() {
  const location = useLocation();

  const authUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("authUser")); } catch { return null; }
  }, []);

  const [resultado, setResultado] = useState(location.state?.resultado || null);
  const [loadingResultado, setLoadingResultado] = useState(false);

  useEffect(() => {
    // Si viene del modal, ya tenemos el resultado
    if (location.state?.resultado) {
      setResultado(location.state.resultado);
      return;
    }
    // Si no, buscar en BD
    if (!authUser?.id) return;

    const fetchResultado = async () => {
      try {
        setLoadingResultado(true);
        const res = await fetch(`${API}/diagnostico/mi-ultimo-resultado?usuario_id=${authUser.id}`);
        const data = await res.json();
        if (data.ok && data.resultado) setResultado(data.resultado);
      } catch (e) {
        console.error("Error cargando resultado:", e);
      } finally {
        setLoadingResultado(false);
      }
    };

    fetchResultado();
  }, [authUser?.id, location.state?.resultado]);

  const col = resultado ? nivelConfig[resultado.nivel] : null;
  const habilidades = resultado ? HABILIDADES_POR_NIVEL[resultado.nivel] : [];
  const cursos = resultado ? getCursosRecomendados(resultado.nivel) : [];

  let secNum = 1;





  return (
    <div style={{ padding: "4px 0 48px" }}>

      {/* Encabezado */}
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ color: "#1e3a8a", fontSize: 28, fontWeight: 900, margin: "0 0 3px" }}>
          Bienvenido
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
          Panel del estudiante · Centro de Oportunidades Laborales
        </p>
      </div>
      {loadingResultado && (
  <div style={{ color: "#64748b", fontSize: 13, margin: "16px 0", display: "flex", alignItems: "center", gap: 8 }}>
    ⏳ Cargando tu último resultado...
  </div>
)}

      {/* ── SECCIÓN 1: Resultado ── */}
      {resultado && col && (
        <>
          <SectionDivider
            number={secNum++}
            title="Resultado de tu evaluación"
            subtitle="Diagnóstico de habilidades blandas · COL-UNICEN"
          />
          <div style={{
            background: "#fff", border: "0.5px solid #e2e8f0",
            borderRadius: 14, overflow: "hidden", maxWidth: 500,
          }}>
            <div style={{
              background: col.headerBg, padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  Diagnóstico de habilidades blandas
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                  Test COL-UNICEN
                </div>
              </div>
              <span style={{
                background: "rgba(255,255,255,0.22)", color: "#fff",
                padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800,
              }}>
                Nivel {resultado.nivel}
              </span>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: "#1e3a8a", lineHeight: 1 }}>
                  {resultado.total}
                </span>
                <span style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>/ 84 puntos</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginBottom: 5 }}>
                  <span>21 — Básico</span><span>43 — Funcional</span><span>64 — Avanzado — 84</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999, background: col.barColor,
                    width: `${Math.round(((resultado.total - 21) / 63) * 100)}%`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: col.text, background: col.bg, padding: "10px 14px", borderRadius: 8, fontWeight: 500 }}>
                {col.mensaje}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SECCIÓN 2: Mis Evaluaciones ── */}
      <SectionDivider
        number={secNum++}
        title="Mis Evaluaciones"
        subtitle="Evaluaciones diagnósticas disponibles para rendir"
      />
      <div style={{
        background: "#fff", border: "0.5px solid #e2e8f0",
        borderRadius: 12, overflow: "hidden", maxWidth: 320,
      }}>
        <div style={{
          background: "#1e3a8a", height: 80, padding: "12px 16px",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>COL-UNICEN</span>
          <span style={{ fontSize: 34, opacity: 0.3 }}>📋</span>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>
            Evaluación Diagnóstica de Habilidades Blandas
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 14 }}>
            Test COL-UNICEN · Semestres 4to y 7mo
          </div>
          <Link
            to="/estudiante/evaluaciones"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#1e3a8a", color: "#fff", textDecoration: "none",
              padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 12,
            }}
          >
            {resultado ? "Rendir nuevamente" : "Comenzar evaluación →"}
          </Link>
        </div>
      </div>

      {/* ── SECCIÓN 3: Habilidades ── */}
      {resultado && habilidades.length > 0 && (
        <>
          <SectionDivider
            number={secNum++}
            title="Habilidades a fortalecer"
            subtitle="Competencias prioritarias identificadas en tu evaluación"
          />
          <div style={{
            background: "#fff", border: "0.5px solid #e2e8f0",
            borderRadius: 12, padding: "16px 20px",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {habilidades.map((h) => (
                <span key={h} style={{
                  padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                  border: "0.5px solid #cbd5e1", color: "#334155", background: "#f8fafc",
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── SECCIÓN 4: Cursos recomendados ── */}
      {resultado && cursos.length > 0 && (
        <>
          <SectionDivider
            number={secNum++}
            title="Cursos recomendados"
            subtitle="Seleccionados por el COL según tus áreas de mejora"
          />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}>
            {cursos.map((curso, i) => (
              <div key={curso.nombre} style={{
                background: "#fff",
                border: i === 0 ? `1.5px solid ${ICONOS_CURSOS[i].color}` : "0.5px solid #e2e8f0",
                borderRadius: 12, overflow: "hidden",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  background: ICONOS_CURSOS[i].color, height: 80,
                  padding: "10px 14px", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", position: "relative",
                }}>
                  {i === 0 && (
                    <span style={{
                      display: "inline-flex", fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 4,
                      background: "rgba(255,255,255,0.25)", color: "#fff", alignSelf: "flex-start",
                    }}>
                      ⭐ Más recomendado
                    </span>
                  )}
                  <span style={{ position: "absolute", bottom: 8, right: 12, fontSize: 30, opacity: 0.35 }}>
                    {ICONOS_CURSOS[i].emoji}
                  </span>
                </div>
                <div style={{ padding: "12px 14px", flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.35, marginBottom: 3 }}>
                    {curso.nombre}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
                    Centro de Oportunidades Laborales · COL-UNICEN
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {curso.habilidades.slice(0, 2).map((h) => (
                      <span key={h} style={{
                        fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
                        background: `${ICONOS_CURSOS[i].color}18`, color: ICONOS_CURSOS[i].color,
                      }}>
                        {h.split(" y ")[0].split(" de ")[0]}
                      </span>
                    ))}
                    {(curso.habilidades.length + curso.parcial.length) > 2 && (
                      <span style={{
                        fontSize: 10, padding: "2px 7px", borderRadius: 4,
                        fontWeight: 500, background: "#f1f5f9", color: "#94a3b8",
                      }}>
                        + {curso.habilidades.length + curso.parcial.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}