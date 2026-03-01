import { Link } from "react-router-dom";
import "./UsuariosHome.css";

export default function UsuariosHome() {
  return (
    <>
      <h1 className="dashboard-title">Gestión de Usuarios</h1>
      <p className="card-description" style={{ marginTop: 6 }}>
        Administra usuarios del sistema: alta, modificación y listado.
      </p>

      <section className="users-cards-grid">
        <Link to="/admin/usuarios/nuevo" className="users-card">
          <div className="users-card-icon">➕</div>
          <div className="users-card-body">
            <h3>Añadir Usuario</h3>
            <p>Registra nuevos usuarios con rol y estado.</p>
          </div>
          <div className="users-card-cta">Entrar →</div>
        </Link>

{/*
        <Link to="/admin/usuarios/modificar" className="users-card">
          <div className="users-card-icon">✏️</div>
          <div className="users-card-body">
            <h3>Modificar Usuario</h3>
            <p>Busca un usuario y actualiza sus datos.</p>
          </div>
          <div className="users-card-cta">Entrar →</div>
        </Link>

        */}

        <Link to="/admin/usuarios/lista" className="users-card">
          <div className="users-card-icon">📋</div>
          <div className="users-card-body">
            <h3>Lista de Usuarios</h3>
            <p>Listado con filtros y acciones rápidas.</p>
          </div>
          <div className="users-card-cta">Entrar →</div>
        </Link>
      </section>

      <div style={{ marginTop: 16 }}>
        <Link className="eaen-secondary-btn" to="/admin">
          ← Volver al Dashboard
        </Link>
      </div>
    </>
  );
}