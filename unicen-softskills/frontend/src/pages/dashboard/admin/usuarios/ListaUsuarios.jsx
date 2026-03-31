import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UsuariosForms.css";

export default function ListaUsuarios() {
  const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5000/api";

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState("");

  // ── Modal rehabilitar ──
  const [modalUsuario, setModalUsuario] = useState(null); // { id, nombre }
  const [rehabilitando, setRehabilitando] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const abrirModal = (u) => {
    setModalUsuario({ id: u.id, nombre: `${u.nombres} ${u.apellidos}` });
    setModalMsg("");
  };

  const cerrarModal = () => {
    setModalUsuario(null);
    setModalMsg("");
    setRehabilitando(false);
  };

  const confirmarRehabilitacion = async () => {
    if (!modalUsuario) return;
    try {
      setRehabilitando(true);
      setModalMsg("");
      const res = await fetch(`${API_BASE}/diagnostico/rehabilitar/${modalUsuario.id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setModalMsg("ok");
      fetchUsuarios(); // refresca la tabla
    } catch (err) {
      setModalMsg(err.message || "Error al rehabilitar.");
    } finally {
      setRehabilitando(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (rol) params.append("rol", rol);
      if (estado) params.append("estado", estado);
      const res = await fetch(`${API_BASE}/usuarios?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al obtener usuarios");
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_BASE}/usuarios/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  return (
    <>
      <div className="eaen-subview-head">
        <div>
          <h1 className="dashboard-title">Lista de Usuarios</h1>
          <p className="card-description">Usuarios registrados en el sistema.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="eaen-secondary-btn" to="/admin/usuarios">← Volver</Link>
          <Link className="eaen-primary-btn" to="/admin/usuarios/nuevo">+ Nuevo</Link>
        </div>
      </div>

      <div className="users-panel">

        {/* FILTROS */}
        <div className="users-grid" style={{ marginBottom: 20 }}>
          <div className="users-field">
            <label>Buscar</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, apellido o correo" />
          </div>
          <div className="users-field">
            <label>Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Todos</option>
              <option>Administrador</option>
              <option>Docente</option>
              <option>Estudiante</option>
              <option>Invitado</option>
              <option>Gestor</option>
            </select>
          </div>
          <div className="users-field">
            <label>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="eaen-primary-btn" onClick={fetchUsuarios}>Filtrar</button>
          </div>
        </div>

        {loading && <p>Cargando usuarios...</p>}
        {error && <div className="users-alert bad">{error}</div>}
        {!loading && usuarios.length === 0 && <p>No existen usuarios registrados.</p>}

        {!loading && usuarios.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Evaluación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const dioCuestionario = u.evaluacion_estado === "completada";
                return (
                  <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                    <td>{u.nombres} {u.apellidos}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      <span style={{
                        padding: "4px 10px", borderRadius: 20,
                        background: u.estado === "Activo" ? "#d4edda" : "#f8d7da",
                        color: u.estado === "Activo" ? "#155724" : "#721c24",
                      }}>
                        {u.estado}
                      </span>
                    </td>

                    {/* ── Columna Evaluación ── */}
                    <td>
                      {u.rol === "Estudiante" ? (
                        <span style={{
                          padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: dioCuestionario ? "#dbeafe" : "#f1f5f9",
                          color: dioCuestionario ? "#1e3a8a" : "#64748b",
                        }}>
                          {dioCuestionario ? "✅ Completada" : "⏳ Pendiente"}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
                      )}
                    </td>

                    {/* ── Acciones ── */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Link
                        className="eaen-secondary-btn"
                        style={{ marginRight: 6 }}
                        to={`/admin/usuarios/modificar?id=${u.id}`}
                      >
                        Editar
                      </Link>

                      {u.rol === "Estudiante" && dioCuestionario && (
                        <button
                          className="eaen-secondary-btn"
                          style={{ marginRight: 6, color: "#1e3a8a", borderColor: "#bfdbfe", background: "#eff6ff" }}
                          onClick={() => abrirModal(u)}
                        >
                          🔓 Rehabilitar
                        </button>
                      )}

                      <button className="eaen-secondary-btn" onClick={() => eliminarUsuario(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal rehabilitar ── */}
      {modalUsuario && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32, maxWidth: 400, width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center",
          }}>
            {modalMsg === "ok" ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ color: "#15803d", marginBottom: 8 }}>Rehabilitado correctamente</h3>
                <p style={{ color: "#64748b", marginBottom: 24 }}>
                  <b>{modalUsuario.nombre}</b> puede volver a rendir la evaluación.
                </p>
                <button className="eaen-primary-btn" onClick={cerrarModal}>Cerrar</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔓</div>
                <h3 style={{ color: "#1e3a8a", marginBottom: 8 }}>Rehabilitar evaluación</h3>
                <p style={{ color: "#64748b", marginBottom: 8 }}>
                  ¿Permitir que <b>{modalUsuario.nombre}</b> vuelva a rendir la evaluación diagnóstica?
                </p>
                <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 24 }}>
                  El intento anterior se conserva en el historial.
                </p>
                {modalMsg && <div className="users-alert bad" style={{ marginBottom: 16 }}>{modalMsg}</div>}
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button className="eaen-secondary-btn" onClick={cerrarModal} disabled={rehabilitando}>
                    Cancelar
                  </button>
                  <button className="eaen-primary-btn" onClick={confirmarRehabilitacion} disabled={rehabilitando}>
                    {rehabilitando ? "Procesando..." : "Sí, rehabilitar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}