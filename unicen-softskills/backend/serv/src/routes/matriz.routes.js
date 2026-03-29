import express from "express";
import { pool } from "../db.js";

const router = express.Router();

const ESTADOS = new Set(["NO", "PARCIAL", "DIRECTO"]);
const clampPeso = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
};

// GET /api/matriz/catalogos  -> cursos + competencias
router.get("/catalogos", async (req, res) => {
  try {
    const [cursos] = await pool.query(
      `SELECT id, codigo, nombre
       FROM col_curso
       WHERE activo = 1
       ORDER BY nombre ASC`
    );

    const [competencias] = await pool.query(
      `SELECT id, nombre
       FROM col_competencia
       WHERE activo = 1
       ORDER BY nombre ASC`
    );

    return res.json({ ok: true, cursos, competencias });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/matriz?curso_id=&competencia_id=
router.get("/", async (req, res) => {
  try {
    const { curso_id, competencia_id } = req.query;

    const where = ["m.activo = 1"];
    const params = [];

    if (curso_id) { where.push("m.curso_id = ?"); params.push(curso_id); }
    if (competencia_id) { where.push("m.competencia_id = ?"); params.push(competencia_id); }

    const sql = `
      SELECT
        m.id, m.curso_id, m.competencia_id, m.estado, m.peso,
        c.nombre AS curso_nombre, c.codigo AS curso_codigo,
        cp.nombre AS competencia_nombre
      FROM col_matriz_curso_comp m
      JOIN col_curso c ON c.id = m.curso_id
      JOIN col_competencia cp ON cp.id = m.competencia_id
      WHERE ${where.join(" AND ")}
      ORDER BY c.nombre ASC, cp.nombre ASC
      LIMIT 2000
    `;

    const [rows] = await pool.query(sql, params);
    return res.json({ ok: true, rows });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/matriz  { curso_id, competencia_id, estado, peso }
router.post("/", async (req, res) => {
  try {
    const { curso_id, competencia_id, estado, peso } = req.body;

    if (!curso_id || !competencia_id) {
      return res.status(400).json({ ok: false, message: "curso_id y competencia_id son obligatorios." });
    }

    const est = estado ? String(estado).toUpperCase() : "NO";
    if (!ESTADOS.has(est)) {
      return res.status(400).json({ ok: false, message: "estado debe ser NO, PARCIAL o DIRECTO." });
    }

    const p = peso === undefined ? 0 : clampPeso(peso);
    if (p === null) {
      return res.status(400).json({ ok: false, message: "peso debe ser número 0..100." });
    }

    const [ins] = await pool.query(
      `INSERT INTO col_matriz_curso_comp (curso_id, competencia_id, estado, peso)
       VALUES (?,?,?,?)`,
      [curso_id, competencia_id, est, p]
    );

    return res.json({ ok: true, id: ins.insertId });
  } catch (e) {
    // duplicado (uq_curso_comp)
    if (String(e.message || "").includes("Duplicate")) {
      return res.status(409).json({ ok: false, message: "Esa relación ya existe." });
    }
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// PUT /api/matriz/:id  { estado?, peso? }
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, peso } = req.body;

    const sets = [];
    const params = [];

    if (estado !== undefined) {
      const est = String(estado).toUpperCase();
      if (!ESTADOS.has(est)) {
        return res.status(400).json({ ok: false, message: "estado debe ser NO, PARCIAL o DIRECTO." });
      }
      sets.push("estado = ?");
      params.push(est);
    }

    if (peso !== undefined) {
      const p = clampPeso(peso);
      if (p === null) {
        return res.status(400).json({ ok: false, message: "peso debe ser número 0..100." });
      }
      sets.push("peso = ?");
      params.push(p);
    }

    if (!sets.length) {
      return res.status(400).json({ ok: false, message: "Envía estado y/o peso." });
    }

    params.push(id);

    const [upd] = await pool.query(
      `UPDATE col_matriz_curso_comp
       SET ${sets.join(", ")}
       WHERE id = ? AND activo = 1`,
      params
    );

    return res.json({ ok: true, affected: upd.affectedRows });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// DELETE /api/matriz/:id  (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [upd] = await pool.query(
      `UPDATE col_matriz_curso_comp SET activo = 0 WHERE id = ?`,
      [id]
    );
    return res.json({ ok: true, affected: upd.affectedRows });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;