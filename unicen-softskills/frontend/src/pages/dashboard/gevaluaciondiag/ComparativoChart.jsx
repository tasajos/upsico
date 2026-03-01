import React, { useMemo } from "react";
import "./ComparativoChart.css";

export default function ComparativoChart({ serie = [] }) {
  const parsed = useMemo(() => {
    const base = (Array.isArray(serie) ? serie : [])
      .map((d) => {
        const fecha = String(d.fecha ?? d.dia ?? d.fecha_label ?? "").slice(0, 10);
        const semestre = Number(d.semestre);
        const raw = d.avg_total ?? d.promedio ?? d.valor ?? d.y ?? 0;

        // soporte "67,50"
        const num = typeof raw === "string" ? Number(raw.replace(",", ".")) : Number(raw);

        return { fecha, semestre, y: num };
      })
      .filter((d) => d.fecha && (d.semestre === 4 || d.semestre === 7) && Number.isFinite(d.y))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    if (!base.length) return { data: [], labels: [], scale: 1 };

    const ys = base.map((d) => d.y);
    const maxY = Math.max(...ys);

    // ✅ AUTO-ESCALA: si viene 0..1 lo pasamos a 0..100
    const scale = maxY <= 1.5 ? 100 : 1;

    const data = base.map((d) => ({ ...d, y: d.y * scale }));
    const labels = Array.from(new Set(data.map((d) => d.fecha)));

    return { data, labels, scale };
  }, [serie]);

  const data = parsed.data;
  const labels = parsed.labels;

  const s4 = data.filter((d) => d.semestre === 4);
  const s7 = data.filter((d) => d.semestre === 7);

  if (!data.length) {
    return (
      <div className="ged-chart-wrap">
        <div className="ged-chart-empty">No hay datos para graficar.</div>
      </div>
    );
  }

  // dominio Y
  const ys = data.map((d) => d.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const pad = (maxY - minY) === 0 ? 5 : (maxY - minY) * 0.12;
  const y0 = minY - pad;
  const y1 = maxY + pad;

  // layout SVG (responsive)
  const W = 1000;
  const H = 280;
  const M = { l: 52, r: 18, t: 18, b: 44 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  const xFor = (fecha) => {
    const i = labels.indexOf(fecha);
    if (labels.length <= 1) return M.l + innerW / 2;
    return M.l + (i / (labels.length - 1)) * innerW;
  };

  const yFor = (val) => {
    if (y1 - y0 === 0) return M.t + innerH / 2;
    const t = (val - y0) / (y1 - y0);
    return M.t + (1 - t) * innerH;
  };

  const toPoints = (arr) => arr.map((d) => `${xFor(d.fecha)},${yFor(d.y)}`).join(" ");

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }).map((_, i) => y0 + (i / ticks) * (y1 - y0));

  return (
    <div className="ged-chart-wrap">
      <svg className="ged-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {/* grid Y + labels */}
        {yTicks.map((v, i) => {
          const y = yFor(v);
          return (
            <g key={i}>
              <line x1={M.l} y1={y} x2={W - M.r} y2={y} className="grid" />
              <text x={M.l - 10} y={y + 4} textAnchor="end" className="yLab">
                {Number(v).toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* eje X labels */}
        {labels.map((f, i) => {
          const step = labels.length > 10 ? 2 : 1;
          if (i % step !== 0) return null;
          const x = xFor(f);
          return (
            <text key={f} x={x} y={H - 16} textAnchor="middle" className="xLab">
              {f.slice(5)} {/* MM-DD */}
            </text>
          );
        })}

        {/* líneas */}
        {s4.length > 0 && <polyline points={toPoints(s4)} className="line s4" fill="none" />}
        {s7.length > 0 && <polyline points={toPoints(s7)} className="line s7" fill="none" />}

        {/* puntos */}
        {s4.map((d, idx) => (
          <circle key={`s4-${idx}`} cx={xFor(d.fecha)} cy={yFor(d.y)} r="3.5" className="pt s4" />
        ))}
        {s7.map((d, idx) => (
          <circle key={`s7-${idx}`} cx={xFor(d.fecha)} cy={yFor(d.y)} r="3.5" className="pt s7" />
        ))}
      </svg>
    </div>
  );
}