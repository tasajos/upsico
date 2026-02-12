import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API UNICEN SoftSkills funcionando" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
