import { useState } from "react";
import { Link } from "react-router-dom";
import "./UsuariosForms.css"; // (lo creamos abajo)

export default function NuevoUsuario() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    rol: "Estudiante",
    estado: "Activo",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!form.nombres.trim()) return "Ingresa nombres.";
    if (!form.apellidos.trim()) return "Ingresa apellidos.";
    if (!form.email.trim()) return "Ingresa correo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Correo inválido.";
    if (!form.password || form.password.length < 6) return "Contraseña mínima 6 caracteres.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    const v = validate();
    if (v) return setErr(v);

    try {
      setLoading(true);

      // Ajusta la URL según tu backend (ej: VITE_API_BASE)
      const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5000/api";

      const res = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          rol: form.rol,
          estado: form.estado,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "No se pudo registrar el usuario.");

      setMsg("Usuario registrado correctamente.");
      setForm({
        nombres: "",
        apellidos: "",
        email: "",
        password: "",
        rol: "Estudiante",
        estado: "Activo",
      });
    } catch (error) {
      setErr(error.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="eaen-subview-head">
        <div>
          <h1 className="dashboard-title" style={{ marginBottom: 6 }}>Añadir Usuario</h1>
          <p className="card-description">Registro de usuario (MySQL + Node).</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="eaen-secondary-btn" to="/admin/usuarios">← Volver</Link>
          <Link className="eaen-secondary-btn" to="/admin/usuarios/lista">Ver lista</Link>
        </div>
      </div>

      <div className="users-panel">
        <form onSubmit={onSubmit}>
          <div className="users-grid">
            <div className="users-field">
              <label>Nombres</label>
              <input name="nombres" value={form.nombres} onChange={onChange} placeholder="Ej: Carlos Andrés" />
            </div>

            <div className="users-field">
              <label>Apellidos</label>
              <input name="apellidos" value={form.apellidos} onChange={onChange} placeholder="Ej: Azcárraga Esquivel" />
            </div>

            <div className="users-field full">
              <label>Correo</label>
              <input name="email" value={form.email} onChange={onChange} placeholder="usuario@unicen.edu" />
            </div>

            <div className="users-field full">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="users-field">
              <label>Rol</label>
              <select name="rol" value={form.rol} onChange={onChange}>
                <option>Administrador</option>
                <option>Docente</option>
                <option>Estudiante</option>
                <option>Invitado</option>
                <option>Gestor</option>
              </select>
            </div>

            <div className="users-field">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={onChange}>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="users-actions">
            <button className="eaen-primary-btn" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

          {err && <div className="users-alert bad">{err}</div>}
          {msg && <div className="users-alert ok">{msg}</div>}
        </form>
      </div>
    </>
  );
}