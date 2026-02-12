import { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("Cargando...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch(() => setMsg("Error conectando con backend"));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h2>UNICEN SoftSkills</h2>
      <p>{msg}</p>
    </div>
  );
}
