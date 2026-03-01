import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

const router = express.Router();

/* =========================
   GET - Listar usuarios
========================= */
router.get("/", async (req, res) => {
  try {
    const { q, rol, estado } = req.query;

    let sql = "SELECT id, nombres, apellidos, email, rol, estado, created_at FROM usuarios WHERE 1=1";
    const params = [];

    if (q) {
      sql += " AND (nombres LIKE ? OR apellidos LIKE ? OR email LIKE ?)";
      const search = `%${q}%`;
      params.push(search, search, search);
    }

    if (rol) {
      sql += " AND rol = ?";
      params.push(rol);
    }

    if (estado) {
      sql += " AND estado = ?";
      params.push(estado);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await pool.query(sql, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

/* =========================
   GET - Obtener usuario por ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, nombres, apellidos, email, rol, estado FROM usuarios WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

/* =========================
   POST - Crear usuario
========================= */
router.post("/", async (req, res) => {
  try {
    const { nombres, apellidos, email, password, rol, estado } = req.body;

    if (!nombres || !apellidos || !email || !password) {
      return res.status(400).json({ message: "Campos obligatorios faltantes" });
    }

    const emailLower = email.trim().toLowerCase();

    // verificar duplicado
    const [exist] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [emailLower]
    );

    if (exist.length) {
      return res.status(409).json({ message: "Correo ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol, estado) VALUES (?,?,?,?,?,?)",
      [
        nombres,
        apellidos,
        emailLower,
        hash,
        rol || "Estudiante",
        estado || "Activo"
      ]
    );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

/* =========================
   PUT - Actualizar usuario
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, email, rol, estado, password } = req.body;

    if (!nombres || !apellidos || !email || !rol || !estado) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const emailLower = String(email).trim().toLowerCase();

    // Verificar si el email ya lo usa otro usuario
    const [dup] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? AND id <> ? LIMIT 1",
      [emailLower, id]
    );
    if (dup.length) return res.status(409).json({ message: "Ese correo ya está en uso." });

    // Si viene password, actualizar hash también
    if (password && String(password).trim().length > 0) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: "Contraseña mínima 6 caracteres." });
      }
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE usuarios SET nombres=?, apellidos=?, email=?, rol=?, estado=?, password_hash=? WHERE id=?",
        [nombres, apellidos, emailLower, rol, estado, hash, id]
      );
    } else {
      await pool.query(
        "UPDATE usuarios SET nombres=?, apellidos=?, email=?, rol=?, estado=? WHERE id=?",
        [nombres, apellidos, emailLower, rol, estado, id]
      );
    }

    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

/* =========================
   DELETE - Eliminar usuario
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM usuarios WHERE id=?", [id]);

    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

export default router;