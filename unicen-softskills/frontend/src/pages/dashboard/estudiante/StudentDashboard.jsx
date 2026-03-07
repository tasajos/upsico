import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <>
      <h1 style={{ color: "#1e3a8a", fontSize: 42, fontWeight: 900, marginBottom: 8 }}>
        Bienvenido
      </h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Desde aquí podrás acceder únicamente a tus evaluaciones diagnósticas.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          maxWidth: 420,
        }}
      >
        <h2 style={{ marginTop: 0, color: "#1e3a8a" }}>Evaluaciones</h2>
        <p style={{ color: "#64748b" }}>
          Ingresa para rendir tus evaluaciones disponibles.
        </p>

        <Link
          to="/estudiante/evaluaciones"
          style={{
            display: "inline-block",
            marginTop: 10,
            background: "#1e3a8a",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 14px",
            borderRadius: 10,
            fontWeight: 800,
          }}
        >
          Ir a evaluaciones
        </Link>
      </div>
    </>
  );
}