import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import diagnosticoRoutes from "./routes/diagnostico.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/diagnostico", diagnosticoRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
