import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentEvaluaciones() {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testActivo, setTestActivo] = useState(null);  // ← nuevo

  // Cargar el test activo al montar el componente
  useEffect(() => {
    const cargarTest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/diagnostico/tests/activo`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "No hay evaluación disponible.");
        setTestActivo(data.test);  // { id, nombre, version, activo }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarTest();
  }, []);

  const comenzarEvaluacion = () => {
    if (!testActivo) return;
    navigate(`/estudiante/evaluaciones/test?testId=${testActivo.id}`);
  };

  return (
    <>
      <h1 style={{ color: "#1e3a8a", fontSize: 34, fontWeight: 900, marginBottom: 8 }}>
        Mis Evaluaciones
      </h1>

      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Accede a la evaluación diagnóstica disponible.
      </p>

      <div style={{
        background: "#fff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        maxWidth: 480,
      }}>
        <h3 style={{ marginTop: 0, color: "#1e3a8a" }}>
          Evaluación Diagnóstica
        </h3>

        {/* Estado de carga */}
        {loading && (
          <p style={{ color: "#64748b" }}>Buscando evaluación disponible...</p>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#b91c1c",
            fontWeight: 700,
            marginBottom: 12,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Info del test activo */}
        {testActivo && !loading && (
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
          }}>
            <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: 16 }}>
              📋 {testActivo.nombre}
            </div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
              Versión: {testActivo.version}
            </div>
          </div>
        )}

        {/* Sin test disponible */}
        {!testActivo && !loading && !error && (
          <p style={{ color: "#64748b" }}>
            No hay evaluación habilitada en este momento.
          </p>
        )}

        <button
          onClick={comenzarEvaluacion}
          disabled={loading || !testActivo}
          style={{
            marginTop: 4,
            background: testActivo ? "#1e3a8a" : "#94a3b8",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 10,
            fontWeight: 800,
            cursor: testActivo ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Cargando..." : testActivo ? "Comenzar evaluación" : "No disponible"}
        </button>
      </div>
    </>
  );
}