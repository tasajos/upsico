// src/pages/dashboard/estudiante/StudentPerfil.jsx
export default function StudentPerfil() {
  const user = JSON.parse(localStorage.getItem("authUser") || "{}");
  return (
    <>
      <h1 style={{ color: "#1e3a8a", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Mi Perfil</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>Información de tu cuenta</p>
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14, padding: 24, maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}><span style={{ fontSize: 12, color: "#94a3b8" }}>Nombre</span><div style={{ fontWeight: 700 }}>{user.nombres} {user.apellidos}</div></div>
        <div style={{ marginBottom: 12 }}><span style={{ fontSize: 12, color: "#94a3b8" }}>Correo</span><div style={{ fontWeight: 700 }}>{user.email}</div></div>
        <div><span style={{ fontSize: 12, color: "#94a3b8" }}>Rol</span><div style={{ fontWeight: 700 }}>{user.rol}</div></div>
      </div>
    </>
  );
}