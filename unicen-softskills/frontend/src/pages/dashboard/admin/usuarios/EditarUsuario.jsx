import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./UsuariosForms.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function EditarUsuario() {
  const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5000/api";
  const query = useQuery();
  const nav = useNavigate();

  const id = query.get("id");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    rol: "Estudiante",
    estado: "Activo",
    password: "", // opcional
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const loadUser = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setErr("");
      setMsg("");

      const res = await fetch(`${API_BASE}/usuarios/${id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "No se pudo cargar el usuario");

      setForm((p) => ({
        ...p,
        nombres: data.nombres || "",
        apellidos: data.apellidos || "",
        email: data.email || "",
        rol: data.rol || "Estudiante",
        estado: data.estado || "Activo",
        password: "",
      }));
    } catch (e) {
      setErr(e.message || "Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validate = () => {
    if (!id) return "No se recibió el ID del usuario.";
    if (!form.nombres.trim()) return "Ingresa nombres.";
    if (!form.apellidos.trim()) return "Ingresa apellidos.";
    if (!form.email.trim()) return "Ingresa correo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Correo inválido.";
    if (!form.rol) return "Selecciona un rol.";
    if (!form.estado) return "Selecciona un estado.";
    if (form.password && form.password.length > 0 && form.password.length < 6)
      return "Contraseña mínima 6 caracteres.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const v = validate();
    if (v) return setErr(v);

    try {
      setSaving(true);

      const payload = {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim().toLowerCase(),
        rol: form.rol,
        estado: form.estado,
      };

      // solo enviamos password si se escribió algo
      if (form.password && form.password.trim().length > 0) {
        payload.password = form.password;
      }

      const res = await fetch(`${API_BASE}/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "No se pudo guardar.");

      setMsg("Usuario actualizado correctamente.");
      setForm((p) => ({ ...p, password: "" }));
    } catch (e) {
      setErr(e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <>
        <h1 className="dashboard-title">Modificar Usuario</h1>
        <div className="users-alert bad">
          Falta el parámetro <b>?id=</b> en la URL. Vuelve a la lista y selecciona “Editar”.
        </div>
        <div style={{ marginTop: 16 }}>
          <Link className="eaen-secondary-btn" to="/admin/usuarios/lista">
            ← Ir a Lista
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="eaen-subview-head">
        <div>
          <h1 className="dashboard-title" style={{ marginBottom: 6 }}>
            Modificar Usuario
          </h1>
          <p className="card-description">Edita los datos del usuario seleccionado.</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="eaen-secondary-btn" to="/admin/usuarios/lista">
            ← Volver a lista
          </Link>
          <button className="eaen-secondary-btn" type="button" onClick={() => nav("/admin/usuarios")}>
            Inicio Usuarios
          </button>
        </div>
      </div>

      <div className="users-panel">
        {loading && <p>Cargando usuario...</p>}
        {err && <div className="users-alert bad">{err}</div>}
        {msg && <div className="users-alert ok">{msg}</div>}

        {!loading && (
          <form onSubmit={onSubmit}>
            <div className="users-grid">
              <div className="users-field">
                <label>Nombres</label>
                <input name="nombres" value={form.nombres} onChange={onChange} />
              </div>

              <div className="users-field">
                <label>Apellidos</label>
                <input name="apellidos" value={form.apellidos} onChange={onChange} />
              </div>

              <div className="users-field full">
                <label>Correo</label>
                <input name="email" value={form.email} onChange={onChange} />
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

              <div className="users-field full">
                <label>Nueva contraseña (opcional)</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Dejar en blanco para no cambiar"
                />
              </div>
            </div>

            <div className="users-actions">
              <button className="eaen-primary-btn" disabled={saving} type="submit">
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}