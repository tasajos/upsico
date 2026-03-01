import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UsuariosForms.css";

export default function ListaUsuarios() {
  const API_BASE =
    import.meta?.env?.VITE_API_BASE || "http://localhost:5000/api";

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState("");

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
      const res = await fetch(`${API_BASE}/usuarios/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <>
      <div className="eaen-subview-head">
        <div>
          <h1 className="dashboard-title">Lista de Usuarios</h1>
          <p className="card-description">
            Usuarios registrados en el sistema.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link className="eaen-secondary-btn" to="/admin/usuarios">
            ← Volver
          </Link>
          <Link className="eaen-primary-btn" to="/admin/usuarios/nuevo">
            + Nuevo
          </Link>
        </div>
      </div>

      <div className="users-panel">

        {/* FILTROS */}
        <div className="users-grid" style={{ marginBottom: 20 }}>
          <div className="users-field">
            <label>Buscar</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, apellido o correo"
            />
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
            <button className="eaen-primary-btn" onClick={fetchUsuarios}>
              Filtrar
            </button>
          </div>
        </div>

        {/* TABLA */}
        {loading && <p>Cargando usuarios...</p>}
        {error && <div className="users-alert bad">{error}</div>}

        {!loading && usuarios.length === 0 && (
          <p>No existen usuarios registrados.</p>
        )}

        {!loading && usuarios.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>
                    {u.nombres} {u.apellidos}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        background:
                          u.estado === "Activo"
                            ? "#d4edda"
                            : "#f8d7da",
                        color:
                          u.estado === "Activo"
                            ? "#155724"
                            : "#721c24",
                      }}
                    >
                      {u.estado}
                    </span>
                  </td>
                  <td>
                   <Link
                    className="eaen-secondary-btn"
                    style={{ marginRight: 6 }}
                    to={`/admin/usuarios/modificar?id=${u.id}`}
                    >
                    Editar
                    </Link>

                    <button
                      className="eaen-secondary-btn"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}