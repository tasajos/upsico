import { useMemo, useState } from "react";
import "../login/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !isSubmitting;
  }, [email, password, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setStatus("idle");

    if (!email || !password) {
      setStatus("error");
      setErrorMsg("⚠️ Complete todos los campos académicos.");
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ SIMULACIÓN (hasta que creemos /api/auth/login en el backend)
      // Luego reemplazamos por:
      // const res = await fetch("http://localhost:5000/api/auth/login", {...})
      await new Promise((r) => setTimeout(r, 900));

      setStatus("success");

      // Simulación de redirección
      setTimeout(() => {
        alert(
          `🎓 ¡Bienvenido al sistema EPSICO!\n\nUsuario: ${email}\n\nRedirigiendo al dashboard académico...`
        );
      }, 300);
    } catch (err) {
      setStatus("error");
      setErrorMsg("❌ Ocurrió un error al iniciar sesión. Intente nuevamente.");
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

        <div className="logo">EPSICO</div>
        <div className="subtitle">
          Sistema Universitario de Apoyo a la Toma de Decisiones
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon" aria-hidden="true">
              📧
            </span>
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
            <span className="input-icon" aria-hidden="true">
              🔒
            </span>
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
