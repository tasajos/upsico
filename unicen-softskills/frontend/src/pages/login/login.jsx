import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/login.css";

export default function Login() {
  const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5000/api";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !isSubmitting;
  }, [email, password, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setStatus("idle");

    if (!email || !password) {
      setStatus("error");
      setErrorMsg("⚠️ Complete todos los campos.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "No se pudo iniciar sesión.");
      }

      localStorage.setItem("authUser", JSON.stringify(data.user));

      setStatus("success");

      setTimeout(() => {
       if (data.user.rol === "Administrador") {
        navigate("/admin");
      } else if (data.user.rol === "Estudiante") {
        navigate("/estudiante");
      } else {
        throw new Error("Rol no permitido.");
      }
      }, 250);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "❌ Ocurrió un error al iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText =
    status === "success"
      ? "✅ Acceso Autorizado"
      : isSubmitting
      ? "⏳ Verificando credenciales..."
      : "🎓 Acceder al Sistema";

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="university-badge">Plataforma Académica</div>

        <div className="unicen-logo-wrapper">
          <img src="/unicen.png" alt="UNICEN" className="unicen-logo" />
        </div>

        <div className="logo">SUAT</div>

        <div className="subtitle">
          Sistema Universitario de Apoyo a la Toma de Decisiones
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon" aria-hidden="true">📧</span>
            <input
              type="email"
              placeholder="usuario@universidad.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <span className="input-icon" aria-hidden="true">🔒</span>
            <input
              type="password"
              placeholder="Contraseña segura"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {status === "error" && (
            <div className="alert-error" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className={`login-btn ${status === "success" ? "btn-success" : ""}`}
            disabled={!canSubmit}
          >
            {buttonText}
          </button>
        </form>

        <div className="links">
          <a className="link" href="#">
            ¿Problemas para iniciar sesión?
          </a>
          <a className="link" href="#">
            Solicitar acceso institucional
          </a>
        </div>

        <div className="footer-text">🔐 Autenticación</div>
      </div>
    </div>
  );
}