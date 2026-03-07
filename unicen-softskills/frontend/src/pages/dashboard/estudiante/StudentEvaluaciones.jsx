import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentEvaluaciones() {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const comenzarEvaluacion = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/diagnostico/tests/activo`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No hay evaluación disponible.");
      }

      // Redirigir al test activo
      
      navigate(`/estudiante/evaluaciones/test?testId=${data.test.id}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1
        style={{
          color: "#1e3a8a",
          fontSize: 34,
          fontWeight: 900,
          marginBottom: 8
        }}
      >
        Mis Evaluaciones
      </h1>

      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Accede a la evaluación diagnóstica disponible.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          maxWidth: 480,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#1e3a8a" }}>
          Evaluación Diagnóstica
        </h3>

        <p style={{ color: "#64748b" }}>
          El sistema te asignará automáticamente la evaluación habilitada.
        </p>

        {error && (
          <div
            style={{
              marginTop: 10,
              color: "#b91c1c",
              fontWeight: 700
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={comenzarEvaluacion}
          disabled={loading}
          style={{
            marginTop: 12,
            background: "#1e3a8a",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 10,
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {loading ? "Cargando evaluación..." : "Comenzar evaluación"}
        </button>
      </div>
    </>
  );
}