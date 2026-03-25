import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DonutChart({ threatDistribution }) {
  const total = 360;

  const safePct = threatDistribution.find((t) => t.label === "Safe")?.pct || 0;
  const phishPct = threatDistribution.find((t) => t.label === "Phishing")?.pct || 0;
  const suspPct = threatDistribution.find((t) => t.label === "Suspicious")?.pct || 0;

  const safeAngle = (safePct / 100) * total;
  const phishAngle = (phishPct / 100) * total;
  const suspAngle = (suspPct / 100) * total;

  const polarToCart = (cx, cy, r, angle) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arc = (cx, cy, r, startAngle, endAngle, color) => {
    const start = polarToCart(cx, cy, r, startAngle);
    const end = polarToCart(cx, cy, r, endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;

    return (
      <path
        d={`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`}
        fill={color}
      />
    );
  };

  let current = 0;
  const segments = [
    { angle: safeAngle, color: "#00ff88" },
    { angle: phishAngle, color: "#ff4444" },
    { angle: suspAngle, color: "#ffaa00" },
  ];

  return (
    <svg viewBox="0 0 200 200" width="180" height="180">
      <circle cx="100" cy="100" r="90" fill="#0d1117" />
      {segments.map((seg, i) => {
        const start = current;
        current += seg.angle;
        return <g key={i}>{arc(100, 100, 85, start, current, seg.color)}</g>;
      })}
      <circle cx="100" cy="100" r="55" fill="#0d1117" />
    </svg>
  );
}

function LineChart({ weeklyActivity }) {
  const values =
    weeklyActivity && weeklyActivity.length === 7
      ? weeklyActivity
      : [0, 0, 0, 0, 0, 0, 0];

  const max = Math.max(...values, 1);
  const w = 300;
  const h = 120;
  const pad = 20;

  const points = values.map((v, i) => ({
    x: pad + (i / (values.length - 1 || 1)) * (w - pad * 2),
    y: h - pad - (v / max) * (h - pad * 2),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h + 30}`} width="100%" height="150">
      {[0, max * 0.25, max * 0.5, max * 0.75, max].map((v, i) => {
        const y = h - pad - (v / max) * (h - pad * 2);
        return (
          <g key={i}>
            <line
              x1={pad}
              y1={y}
              x2={w - pad}
              y2={y}
              stroke="#1e2a3a"
              strokeDasharray="4"
            />
            <text
              x={pad - 2}
              y={y + 4}
              fontSize="9"
              fill="#4a6580"
              textAnchor="end"
            >
              {i > 0 ? Math.round(v) : ""}
            </text>
          </g>
        );
      })}

      <path d={pathD} fill="none" stroke="#00ccff" strokeWidth="2" />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#00ccff" />
      ))}

      {days.map((d, i) => (
        <text
          key={i}
          x={points[i]?.x || 0}
          y={h + 15}
          fontSize="9"
          fill="#4a6580"
          textAnchor="middle"
        >
          {d}
        </text>
      ))}
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    Phishing: { cls: "badge--phishing", icon: "⚠" },
    Safe: { cls: "badge--safe", icon: "🛡" },
    Suspicious: { cls: "badge--suspicious", icon: "⚡" },
  };

  const badge = map[status] || map.Safe;
  return (
    <span className={`status-badge ${badge.cls}`}>
      {badge.icon} {status}
    </span>
  );
}

function RiskBar({ value, status }) {
  const color =
    status === "Phishing"
      ? "#ff4444"
      : status === "Suspicious"
      ? "#ffaa00"
      : "#00ff88";

  return (
    <div className="risk-bar-wrap">
      <div className="risk-bar-track">
        <div
          className="risk-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="risk-value">{value}%</span>
    </div>
  );
}

function getStatus(item) {
  if (item.status) return item.status;
  if (item.prediction) return item.prediction;
  if (item.label) return item.label;

  const risk =
    Number(item.risk) ||
    Number(item.risk_score) ||
    Number(item.score) ||
    Number(item.phishing_prob) ||
    0;

  if (risk >= 80) return "Phishing";
  if (risk >= 40) return "Suspicious";
  return "Safe";
}

function getRisk(item) {
  const risk =
    Number(item.risk) ||
    Number(item.risk_score) ||
    Number(item.score) ||
    Number(item.phishing_prob) ||
    0;

  if (risk <= 1 && risk > 0) {
    return Math.round(risk * 100);
  }

  return Math.round(risk);
}

function getThreats(item) {
  if (Array.isArray(item.threats) && item.threats.length > 0) return item.threats;
  if (Array.isArray(item.indicators) && item.indicators.length > 0) return item.indicators;
  if (Array.isArray(item.reasons) && item.reasons.length > 0) return item.reasons;
  return ["No threats"];
}

function formatTime(value) {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

export default function DashboardPage() {
  const { id } = useParams();

  const [stats, setStats] = useState([
    { icon: "🔲", value: "0", label: "Total Scans", change: "+0%", up: true, color: "cyan" },
    { icon: "⚠", value: "0", label: "Phishing Detected", change: "+0%", up: true, color: "red" },
    { icon: "🛡", value: "0", label: "Safe Links", change: "+0%", up: true, color: "green" },
    { icon: "⚡", value: "0", label: "Suspicious", change: "+0%", up: false, color: "yellow" },
  ]);

  const [recentScans, setRecentScans] = useState([]);
  const [threatDistribution, setThreatDistribution] = useState([
    { label: "Safe", pct: 0, color: "#00ff88" },
    { label: "Phishing", pct: 0, color: "#ff4444" },
    { label: "Suspicious", pct: 0, color: "#ffaa00" },
  ]);
  const [weeklyActivity, setWeeklyActivity] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`https://phishhunterai.onrender.com/api/history/${id}`);

        const rawData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.history)
          ? res.data.history
          : Array.isArray(res.data?.data)
          ? res.data.data
          : res.data
          ? [res.data]
          : [];

        const normalized = rawData.map((item, index) => {
          const status = getStatus(item);
          const risk = getRisk(item);
          const rawDate =
            item.createdAt ||
            item.updatedAt ||
            item.date ||
            item.time ||
            item.timestamp ||
            null;

          return {
            id: item._id || item.id || index,
            url: item.url || item.message || item.link || item.input || "No URL",
            status,
            risk,
            threats: getThreats(item),
            time: formatTime(rawDate),
            rawDate,
          };
        });

        setRecentScans(normalized);

        const totalScans = normalized.length;
        const phishingCount = normalized.filter((item) => item.status === "Phishing").length;
        const safeCount = normalized.filter((item) => item.status === "Safe").length;
        const suspiciousCount = normalized.filter((item) => item.status === "Suspicious").length;

        setStats([
          {
            icon: "🔲",
            value: totalScans.toLocaleString(),
            label: "Total Scans",
            change: "+0%",
            up: true,
            color: "cyan",
          },
          {
            icon: "⚠",
            value: phishingCount.toLocaleString(),
            label: "Phishing Detected",
            change: "+0%",
            up: true,
            color: "red",
          },
          {
            icon: "🛡",
            value: safeCount.toLocaleString(),
            label: "Safe Links",
            change: "+0%",
            up: true,
            color: "green",
          },
          {
            icon: "⚡",
            value: suspiciousCount.toLocaleString(),
            label: "Suspicious",
            change: "+0%",
            up: false,
            color: "yellow",
          },
        ]);

        const total = totalScans || 1;

        setThreatDistribution([
          {
            label: "Safe",
            pct: Number(((safeCount / total) * 100).toFixed(1)),
            color: "#00ff88",
          },
          {
            label: "Phishing",
            pct: Number(((phishingCount / total) * 100).toFixed(1)),
            color: "#ff4444",
          },
          {
            label: "Suspicious",
            pct: Number(((suspiciousCount / total) * 100).toFixed(1)),
            color: "#ffaa00",
          },
        ]);

        const weekMap = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        };

        normalized.forEach((item) => {
          if (!item.rawDate) return;

          const d = new Date(item.rawDate);
          if (Number.isNaN(d.getTime())) return;

          const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
          if (weekMap[dayName] !== undefined) {
            weekMap[dayName] += 1;
          }
        });

        setWeeklyActivity(days.map((day) => weekMap[day] || 0));
      } catch (err) {
        console.error("History fetch error:", err.response?.data || err.message);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserHistory();
    } else {
      setLoading(false);
      setError("User id not found in route");
    }
  }, [id]);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Security overview and threat monitoring</p>
      </div>

      {loading && (
        <div className="recent-scans-card">
          <div className="recent-header">
            <div>
              <h3>Processing Data</h3>
              <p className="chart-sub">Loading graph, analysis, and user scan details...</p>
            </div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="recent-scans-card">
          <div className="recent-header">
            <div>
              <h3>Error</h3>
              <p className="chart-sub">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className={`stat-card stat-card--${s.color}`} key={i}>
                <div className="stat-top">
                  <span className="stat-icon">{s.icon}</span>
                  <span className={`stat-change ${s.up ? "stat-change--up" : "stat-change--down"}`}>
                    {s.up ? "↑" : "↓"} {s.change}
                  </span>
                </div>
                <div className={`stat-value stat-value--${s.color}`}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>Threat Distribution</h3>
              <p className="chart-sub">Classification of scanned URLs</p>
              <div className="donut-wrap">
                <DonutChart threatDistribution={threatDistribution} />
              </div>
              <div className="donut-legend">
                {threatDistribution.map((t, i) => (
                  <div className="legend-item" key={i}>
                    <span className="legend-dot" style={{ background: t.color }} />
                    <span className="legend-label">{t.label}</span>
                    <span className="legend-pct" style={{ color: t.color }}>
                      {t.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3>Scan Activity</h3>
              <p className="chart-sub">Weekly scan volume and threats detected</p>
              <LineChart weeklyActivity={weeklyActivity} />
              <div className="line-legend">
                <span className="line-leg-item">
                  <span className="line-dot cyan" />
                  Total Scans
                </span>
                <span className="line-leg-item">
                  <span className="line-dot red" />
                  Threats Detected
                </span>
              </div>
            </div>
          </div>

          <div className="recent-scans-card">
            <div className="recent-header">
              <div>
                <h3>Recent Scans</h3>
                <p className="chart-sub">Latest URL analysis results</p>
              </div>
              <button className="btn-outline">View All</button>
            </div>

            <table className="scans-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>STATUS</th>
                  <th>RISK SCORE</th>
                  <th>THREATS</th>
                  <th>TIME</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.length > 0 ? (
                  recentScans.map((scan) => (
                    <tr key={scan.id}>
                      <td className="scan-url">
                        {scan.url} <span className="ext-icon">↗</span>
                      </td>
                      <td>
                        <StatusBadge status={scan.status} />
                      </td>
                      <td>
                        <RiskBar value={scan.risk} status={scan.status} />
                      </td>
                      <td className="threats-cell">
                        {scan.threats.map((t, j) =>
                          t !== "No threats" ? (
                            <span key={j} className="threat-tag">
                              {t}
                            </span>
                          ) : (
                            <span key={j} className="no-threat">
                              No threats
                            </span>
                          )
                        )}
                      </td>
                      <td className="time-cell">{scan.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      No scan history found for this user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}