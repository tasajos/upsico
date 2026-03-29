import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
    }

    const emailLower = String(email).trim().toLowerCase();

    const [rows] = await pool.query(
      `SELECT id, nombres, apellidos, email, password_hash, rol, estado
       FROM usuarios
       WHERE email = ?
       LIMIT 1`,
      [emailLower]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = rows[0];

    if (user.estado !== "Activo") {
      return res.status(403).json({ message: "Usuario inactivo." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Solo permitimos por ahora Administrador y Estudiante
    if (!["Administrador", "Estudiante","Gestor"].includes(user.rol)) {
      return res.status(403).json({ message: "Rol sin acceso al sistema." });
    }

    return res.json({
      message: "Login correcto",
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

export default router;