import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "🏠", label: "Inicio",       path: "/estudiante" },
  { icon: "📋", label: "Evaluaciones", path: "/estudiante/evaluaciones" },
  { icon: "👤", label: "Mi Perfil",    path: "/estudiante/perfil" },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  let authUser = null;
  try { authUser = JSON.parse(localStorage.getItem("authUser")); } catch {}

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("ultimoResultado");
    navigate("/", { replace: true });
  };

  const initials = [authUser?.nombres?.[0], authUser?.apellidos?.[0]]
    .filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        minWidth: sidebarOpen ? 240 : 72,
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden", zIndex: 10,
      }}>

        {/* Logo + toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "16px 16px 12px", borderBottom: "1px solid #f1f5f9",
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 6, borderRadius: 8, color: "#64748b",
              fontSize: 18, flexShrink: 0,
              display: "flex", alignItems: "center",
            }}
          >
            ☰
          </button>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1e3a8a", whiteSpace: "nowrap" }}>SUAT</div>
              <div style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>Portal Estudiante</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                textDecoration: "none",
                background: active ? "#eff6ff" : "transparent",
                color: active ? "#1e3a8a" : "#475569",
                fontWeight: active ? 700 : 500, fontSize: 14,
                transition: "background 0.15s",
                whiteSpace: "nowrap", overflow: "hidden",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "12px 8px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 10, overflow: "hidden",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#1e3a8a",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
              {initials}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {authUser?.nombres} {authUser?.apellidos}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {authUser?.email}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "9px 12px", marginTop: 4,
              border: "none", borderRadius: 10, background: "none",
              cursor: "pointer", color: "#ef4444", fontSize: 14, fontWeight: 600,
              textAlign: "left", whiteSpace: "nowrap", overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && "Cerrar sesión"}
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* Topbar */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 9,
        }}>
          <div style={{ fontSize: 14, color: "#64748b" }}>
            {NAV_ITEMS.find(n => n.path === location.pathname)?.label || "Portal del Estudiante"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                {authUser?.nombres} {authUser?.apellidos}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{authUser?.rol}</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#1e3a8a",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 800,
            }}>
              {initials}
            </div>
          </div>
        </header>

        <main style={{ padding: 24, flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}