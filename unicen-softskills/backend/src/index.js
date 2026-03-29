import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import diagnosticoRoutes from "./routes/diagnostico.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import matrizRoutes from "./routes/matriz.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));



app.use(express.json());
app.use("/api/diagnostico", diagnosticoRoutes);
app.use("/api/matriz", matrizRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API UNICEN SoftSkills funcionando" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS test");
    res.json({ ok: true, rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Servir frontend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
