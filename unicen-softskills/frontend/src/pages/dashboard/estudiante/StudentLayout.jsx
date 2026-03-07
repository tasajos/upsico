import { Outlet, useNavigate } from "react-router-dom";

export default function StudentLayout() {
  const navigate = useNavigate();

  let authUser = null;
  try {
    authUser = JSON.parse(localStorage.getItem("authUser"));
  } catch {
    authUser = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#1e3a8a" }}>
            Portal del Estudiante
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {authUser?.nombres} {authUser?.apellidos}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 800,
            background: "#1e3a8a",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Salir
        </button>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}