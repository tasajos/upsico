import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/diagnostico/test-activo
 * Retorna el test activo y sus preguntas
 */
router.get("/test-activo", async (req, res) => {
  try {
    const [testRows] = await pool.query(
      `SELECT id, nombre, version
       FROM diagnostico_test
       WHERE activo = 1
       ORDER BY id DESC
       LIMIT 1`
    );

    if (!testRows.length) {
      return res.status(404).json({ ok: false, message: "No hay test activo." });
    }

    const test = testRows[0];

    const [preguntas] = await pool.query(
      `SELECT id, numero, enunciado, competencia
 FROM diagnostico_pregunta
 WHERE test_id = ? AND activo = 1
 ORDER BY numero ASC`,
      [test.id]
    );

    return res.json({
      ok: true,
      test,
      preguntas,
      escala: [
        { valor: 1, label: "Totalmente en desacuerdo" },
        { valor: 2, label: "En desacuerdo" },
        { valor: 3, label: "De acuerdo" },
        { valor: 4, label: "Totalmente de acuerdo" },
      ],
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * POST /api/diagnostico/enviar
 * body:
 * {
 *   estudiante_nombre, carrera, semestre, fecha_aplicacion,
 *   respuestas: [{ pregunta_id, valor }, ...]  // 21
 * }
 */
router.post("/enviar", async (req, res) => {
  const { test_id, estudiante_nombre, carrera, semestre, fecha_aplicacion, respuestas } = req.body;

  if (!test_id || !estudiante_nombre || !carrera || !semestre || !fecha_aplicacion) {
    return res.status(400).json({ ok: false, message: "Faltan datos (incluye test_id)." });
  }

  if (!Array.isArray(respuestas) || !respuestas.length) {
    return res.status(400).json({ ok: false, message: "Debes enviar respuestas." });
  }

  // Validar valores 1..4
  for (const r of respuestas) {
    const v = Number(r.valor);
    if (!r.pregunta_id || Number.isNaN(v) || v < 1 || v > 4) {
      return res.status(400).json({
        ok: false,
        message: "Cada respuesta debe tener pregunta_id y valor entre 1 y 4.",
      });
    }
  }

  try {
    // 1) Cargar preguntas del test (para validar cantidad y recodificar invertidas)
    const [pregRows] = await pool.query(
      `SELECT id, invertido
       FROM diagnostico_pregunta
       WHERE test_id = ? AND activo = 1`,
      [test_id]
    );

    if (!pregRows.length) {
      return res.status(404).json({ ok: false, message: "El test no tiene preguntas activas." });
    }

    // Validar cantidad exacta
    if (respuestas.length !== pregRows.length) {
      return res.status(400).json({
        ok: false,
        message: `Debes enviar exactamente ${pregRows.length} respuestas para este test.`,
      });
    }

    const invMap = new Map(pregRows.map(p => [p.id, Number(p.invertido) === 1]));

    // 2) Calcular total aplicando inversión donde corresponde: nuevo = 5 - valor :contentReference[oaicite:2]{index=2}
    const total = respuestas.reduce((acc, r) => {
      const v = Number(r.valor);
      const inv = invMap.get(Number(r.pregunta_id)) === true;
      const real = inv ? (5 - v) : v;
      return acc + real;
    }, 0);

    let nivel = "FUNCIONAL";
    if (total >= 21 && total <= 42) nivel = "BASICO";
    else if (total >= 43 && total <= 63) nivel = "FUNCIONAL";
    else if (total >= 64 && total <= 84) nivel = "AVANZADO";

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [insIntento] = await conn.query(
        `INSERT INTO diagnostico_intento
          (test_id, estudiante_nombre, carrera, semestre, fecha_aplicacion, total_puntaje, nivel)
         VALUES (?,?,?,?,?,?,?)`,
        [test_id, estudiante_nombre, carrera, String(semestre), fecha_aplicacion, total, nivel]
      );

      const intento_id = insIntento.insertId;

      const values = respuestas.map((r) => [intento_id, r.pregunta_id, Number(r.valor)]);
      await conn.query(
        `INSERT INTO diagnostico_respuesta (intento_id, pregunta_id, valor)
         VALUES ?`,
        [values]
      );

      await conn.commit();
      return res.json({ ok: true, intento_id, total, nivel });
    } catch (e) {
      await conn.rollback();
      return res.status(500).json({ ok: false, error: e.message });
    } finally {
      conn.release();
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * GET /api/diagnostico/intentos
 * Query opcional: ?carrera=&semestre=&desde=&hasta=
 */
router.get("/intentos", async (req, res) => {
  try {
    const { carrera, semestre, desde, hasta } = req.query;

    const where = [];
    const params = [];

    if (carrera) {
      where.push("carrera = ?");
      params.push(carrera);
    }
    if (semestre) {
      where.push("semestre = ?");
      params.push(String(semestre));
    }
    if (desde) {
      where.push("fecha_aplicacion >= ?");
      params.push(desde);
    }
    if (hasta) {
      where.push("fecha_aplicacion <= ?");
      params.push(hasta);
    }

    const sql = `
      SELECT id, estudiante_nombre, carrera, semestre, fecha_aplicacion, total_puntaje, nivel, creado_en
      FROM diagnostico_intento
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY creado_en DESC
      LIMIT 500
    `;

    const [rows] = await pool.query(sql, params);
    return res.json({ ok: true, rows });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * GET /api/diagnostico/intentos/:id
 * Detalle de intento + respuestas
 */
router.get("/intentos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [intentoRows] = await pool.query(
      `SELECT *
       FROM diagnostico_intento
       WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!intentoRows.length) {
      return res.status(404).json({ ok: false, message: "Intento no encontrado." });
    }

    const intento = intentoRows[0];

    const [respuestas] = await pool.query(
   `SELECT r.pregunta_id, p.numero, p.enunciado, p.competencia, r.valor
 FROM diagnostico_respuesta r
 JOIN diagnostico_pregunta p ON p.id = r.pregunta_id
 WHERE r.intento_id = ?
 ORDER BY p.numero ASC`,
      [id]
    );

    return res.json({ ok: true, intento, respuestas });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});


// GET /api/diagnostico/resumen
router.get("/resumen", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(nivel='BASICO') AS basico,
        SUM(nivel='FUNCIONAL') AS funcional,
        SUM(nivel='AVANZADO') AS avanzado,
        ROUND(AVG(total_puntaje), 2) AS promedio
      FROM diagnostico_intento
    `);

    return res.json({ ok: true, resumen: rows[0] });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * GET /api/diagnostico/carreras
 * Lista carreras disponibles (para filtros)
 */
router.get("/carreras", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT carrera
      FROM diagnostico_intento
      WHERE carrera IS NOT NULL AND carrera <> ''
      ORDER BY carrera ASC
    `);
    return res.json({ ok: true, rows: rows.map(r => r.carrera) });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * GET /api/diagnostico/comparativo
 * Query: ?carrera=&desde=&hasta=
 * Devuelve comparativo 4to vs 7mo (conteo, promedio, distribución niveles)
 */
router.get("/comparativo", async (req, res) => {
  try {
    const { carrera, desde, hasta } = req.query;

    const where = [];
    const params = [];

    if (carrera) { where.push("carrera = ?"); params.push(carrera); }
    if (desde) { where.push("fecha_aplicacion >= ?"); params.push(desde); }
    if (hasta) { where.push("fecha_aplicacion <= ?"); params.push(hasta); }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Resumen por semestre
    const [bySemestre] = await pool.query(`
      SELECT
        semestre,
        COUNT(*) AS n,
        ROUND(AVG(total_puntaje), 2) AS avg_total,
        MIN(total_puntaje) AS min_total,
        MAX(total_puntaje) AS max_total,
        SUM(nivel = 'BASICO') AS basico,
        SUM(nivel = 'FUNCIONAL') AS funcional,
        SUM(nivel = 'AVANZADO') AS avanzado
      FROM diagnostico_intento
      ${whereSql}
      GROUP BY semestre
      ORDER BY FIELD(semestre, '4','7'), semestre
    `, params);

    // Serie mensual (para tendencia)
    const [serie] = await pool.query(`
      SELECT
        DATE_FORMAT(fecha_aplicacion, '%Y-%m') AS mes,
        semestre,
        COUNT(*) AS n,
        ROUND(AVG(total_puntaje), 2) AS avg_total
      FROM diagnostico_intento
      ${whereSql}
      GROUP BY mes, semestre
      ORDER BY mes ASC, FIELD(semestre, '4','7'), semestre
    `, params);

    return res.json({ ok: true, bySemestre, serie });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/impacto", async (req, res) => {
  try {
    const { carrera = "", desde = "", hasta = "" } = req.query;

    const where = [];
    const params = [];

    if (carrera) {
      where.push("carrera = ?");
      params.push(carrera);
    }
    if (desde) {
      where.push("DATE(fecha_aplicacion) >= DATE(?)");
      params.push(desde);
    }
    if (hasta) {
      where.push("DATE(fecha_aplicacion) <= DATE(?)");
      params.push(hasta);
    }

    const WHERE_SQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // ✅ TABLA CORRECTA: diagnostico_intento
    // ✅ NIVELES CORRECTOS: BASICO/FUNCIONAL/AVANZADO

    // 1) KPIs globales
    const [kpiRows] = await pool.query(
      `
      SELECT 
        COUNT(*) AS n_intentos,
        ROUND(AVG(total_puntaje), 2) AS avg_total,
        MIN(total_puntaje) AS min_total,
        MAX(total_puntaje) AS max_total,
        SUM(nivel = 'BASICO') AS basico,
        SUM(nivel = 'FUNCIONAL') AS funcional,
        SUM(nivel = 'AVANZADO') AS avanzado
      FROM diagnostico_intento
      ${WHERE_SQL}
      `,
      params
    );

    const kpis = kpiRows?.[0] || {
      n_intentos: 0,
      avg_total: null,
      min_total: null,
      max_total: null,
      basico: 0,
      funcional: 0,
      avanzado: 0,
    };

    // 2) Por carrera
    const [byCarrera] = await pool.query(
      `
      SELECT 
        carrera,
        COUNT(*) AS n,
        ROUND(AVG(total_puntaje), 2) AS avg_total,
        SUM(nivel = 'BASICO') AS basico,
        SUM(nivel = 'FUNCIONAL') AS funcional,
        SUM(nivel = 'AVANZADO') AS avanzado
      FROM diagnostico_intento
      ${WHERE_SQL}
      GROUP BY carrera
      ORDER BY n DESC, carrera ASC
      `,
      params
    );

    // 3) Por semestre
    const [bySemestre] = await pool.query(
      `
      SELECT 
        semestre,
        COUNT(*) AS n,
        ROUND(AVG(total_puntaje), 2) AS avg_total,
        SUM(nivel = 'BASICO') AS basico,
        SUM(nivel = 'FUNCIONAL') AS funcional,
        SUM(nivel = 'AVANZADO') AS avanzado
      FROM diagnostico_intento
      ${WHERE_SQL}
      GROUP BY semestre
      ORDER BY CAST(semestre AS UNSIGNED) ASC
      `,
      params
    );

    // 4) Tendencia mensual (opcional)
    const [trend] = await pool.query(
      `
      SELECT 
        DATE_FORMAT(fecha_aplicacion, '%Y-%m') AS ym,
        COUNT(*) AS n,
        ROUND(AVG(total_puntaje), 2) AS avg_total
      FROM diagnostico_intento
      ${WHERE_SQL}
      GROUP BY ym
      ORDER BY ym ASC
      `,
      params
    );

    return res.json({
      ok: true,
      filters: { carrera, desde, hasta },
      kpis,
      byCarrera,
      bySemestre,
      trend,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/diagnostico/tests
// GET /api/diagnostico/tests
router.get("/tests", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, version, activo
      FROM diagnostico_test
      ORDER BY id DESC
    `);
    return res.json({ ok: true, rows });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/diagnostico/tests/activo
router.get("/tests/activo", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, version, activo
      FROM diagnostico_test
      WHERE activo = 1
      LIMIT 1
    `);

    if (!rows.length) {
      return res.status(404).json({
        ok: false,
        message: "No hay evaluación habilitada actualmente."
      });
    }

    return res.json({
      ok: true,
      test: rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener evaluación activa."
    });
  }
});

// GET /api/diagnostico/tests/:id
router.get("/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [testRows] = await pool.query(
      `SELECT id, nombre, version, activo
       FROM diagnostico_test
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!testRows.length) {
      return res.status(404).json({ ok: false, message: "Test no encontrado." });
    }

    const test = testRows[0];

    const [preguntas] = await pool.query(
      `SELECT id, numero, enunciado, competencia, invertido
       FROM diagnostico_pregunta
       WHERE test_id = ? AND activo = 1
       ORDER BY numero ASC`,
      [test.id]
    );

    return res.json({
      ok: true,
      test,
      preguntas,
      escala: [
        { valor: 1, label: "Rara vez actúo así" },
        { valor: 2, label: "Algunas veces actúo así" },
        { valor: 3, label: "Generalmente actúo así" },
        { valor: 4, label: "Casi siempre actúo así" },
      ],
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});
export default router;