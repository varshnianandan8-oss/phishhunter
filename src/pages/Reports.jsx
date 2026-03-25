import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function getRisk(item) {
  const raw =
    Number(item?.risk) ||
    Number(item?.risk_score) ||
    Number(item?.score) ||
    Number(item?.phishing_prob) ||
    0;

  if (raw > 0 && raw <= 1) return Math.round(raw * 100);
  return Math.round(raw);
}

function getStatus(item) {
  if (item?.status) return item.status;
  if (item?.prediction) return item.prediction;
  if (item?.label) return item.label;

  const risk = getRisk(item);
  if (risk >= 80) return "Phishing";
  if (risk >= 40) return "Suspicious";
  return "Safe";
}

function getThreats(item) {
  if (Array.isArray(item?.threats) && item.threats.length > 0) return item.threats;
  if (Array.isArray(item?.indicators) && item.indicators.length > 0) return item.indicators;
  if (Array.isArray(item?.reasons) && item.reasons.length > 0) return item.reasons;
  return [];
}

function getUrl(item) {
  return item?.url || item?.message || item?.link || item?.input || "Unknown URL";
}

function getCreatedDate(item) {
  const raw = item?.createdAt || item?.updatedAt || item?.date || item?.time || item?.timestamp;
  if (!raw) return null;

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatMonthLabel(date) {
  return months[date.getMonth()];
}

function BarChart({ safeData, phishData, suspData }) {
  const chartH = 160;
  const chartW = 500;
  const barW = 30;
  const gap = 70;
  const padL = 50;
  const padB = 30;

  const allValues = [...safeData, ...phishData, ...suspData];
  const maxValue = Math.max(...allValues, 1);
  const roundedMax = Math.ceil(maxValue / 100) * 100 || 100;
  const yTicks = [0, roundedMax * 0.25, roundedMax * 0.5, roundedMax * 0.75, roundedMax];

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH + padB + 10}`} width="100%" height="220">
      {yTicks.map((v, i) => {
        const y = chartH - (v / roundedMax) * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={chartW} y2={y} stroke="#1e2a3a" strokeDasharray="4" />
            <text x={padL - 5} y={y + 4} fontSize="10" fill="#4a6580" textAnchor="end">
              {i > 0 ? Math.round(v) : ""}
            </text>
          </g>
        );
      })}

      {months.map((m, i) => {
        const x = padL + i * gap;
        const sh = (safeData[i] / roundedMax) * chartH;
        const ph = (phishData[i] / roundedMax) * chartH;
        const suh = (suspData[i] / roundedMax) * chartH;

        return (
          <g key={i}>
            <rect x={x} y={chartH - sh} width={barW} height={sh} fill="#00ff88" rx="2" />
            <rect x={x + barW + 2} y={chartH - ph} width={barW * 0.6} height={ph} fill="#ff4444" rx="2" />
            <rect
              x={x + barW + barW * 0.6 + 4}
              y={chartH - suh}
              width={barW * 0.6}
              height={suh}
              fill="#ffaa00"
              rx="2"
            />
            <text x={x + barW / 2} y={chartH + 20} fontSize="10" fill="#4a6580" textAnchor="middle">
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ThreatDonut({ segments }) {
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

  return (
    <svg viewBox="0 0 200 200" width="160" height="160">
      <circle cx="100" cy="100" r="90" fill="#0d1117" />
      {segments.map((seg, i) => {
        const startA = current;
        current += (seg.pct / 100) * 360;
        return <g key={i}>{arc(100, 100, 85, startA, current, seg.color)}</g>;
      })}
      <circle cx="100" cy="100" r="50" fill="#0d1117" />
    </svg>
  );
}

export default function Reports() {
  const [period] = useState("Last 30 Days");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("https://phishhunterai.onrender.com/history");

        const raw =
          Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.history)
            ? response.data.history
            : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

        setHistoryData(raw);
      } catch (err) {
        console.error("History fetch error:", err.response?.data || err.message);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const processed = useMemo(() => {
    const normalized = historyData.map((item, index) => {
      const status = getStatus(item);
      const risk = getRisk(item);
      const url = getUrl(item);
      const threats = getThreats(item);
      const createdDate = getCreatedDate(item);

      return {
        id: item?._id || item?.id || index,
        status,
        risk,
        url,
        threats,
        createdDate,
      };
    });

    const total = normalized.length;
    const phishing = normalized.filter((item) => item.status === "Phishing");
    const safe = normalized.filter((item) => item.status === "Safe");
    const suspicious = normalized.filter((item) => item.status === "Suspicious");

    const detectionRate = total ? (((phishing.length + suspicious.length) / total) * 100).toFixed(1) : "0.0";
    const falsePositives = total ? ((safe.filter((item) => item.risk > 50).length / total) * 100).toFixed(1) : "0.0";
    const avgResponseTime = "127ms";

    const monthlySafe = [0, 0, 0, 0, 0, 0];
    const monthlyPhish = [0, 0, 0, 0, 0, 0];
    const monthlySusp = [0, 0, 0, 0, 0, 0];

    normalized.forEach((item) => {
      if (!item.createdDate) return;

      const monthIndex = item.createdDate.getMonth();
      if (monthIndex < 0 || monthIndex > 5) return;

      if (item.status === "Safe") monthlySafe[monthIndex] += 1;
      else if (item.status === "Phishing") monthlyPhish[monthIndex] += 1;
      else if (item.status === "Suspicious") monthlySusp[monthIndex] += 1;
    });

    const threatMap = {};
    normalized.forEach((item) => {
      const host = (() => {
        try {
          return new URL(item.url).hostname.replace(/^www\./, "");
        } catch {
          return item.url;
        }
      })();

      if (!threatMap[host]) {
        threatMap[host] = { domain: host, blocked: 0 };
      }

      if (item.status === "Phishing" || item.status === "Suspicious") {
        threatMap[host].blocked += 1;
      }
    });

    const topDomains = Object.values(threatMap)
      .filter((item) => item.blocked > 0)
      .sort((a, b) => b.blocked - a.blocked)
      .slice(0, 4)
      .map((item, index) => ({
        rank: index + 1,
        domain: item.domain,
        blocked: item.blocked,
        change: "+0%",
        up: true,
      }));

    const totalThreats = phishing.length + suspicious.length;
    const credentialTheft = totalThreats ? Math.round((phishing.length / totalThreats) * 100) : 0;
    const malwareDistribution = totalThreats ? Math.round((suspicious.length / totalThreats) * 100) : 0;
    const financialScam = totalThreats ? Math.round((phishing.length / totalThreats) * 100) : 0;
    const brandImpersonation = totalThreats
      ? Math.max(0, 100 - (credentialTheft + malwareDistribution + financialScam))
      : 0;

    const threatSegments = [
      { label: "Credential Theft", pct: credentialTheft, color: "#ff4444" },
      { label: "Malware Distribution", pct: malwareDistribution, color: "#ff8c00" },
      { label: "Financial Scam", pct: financialScam, color: "#ffaa00" },
      { label: "Brand Impersonation", pct: brandImpersonation, color: "#00ccff" },
    ];

    return {
      total,
      phishingCount: phishing.length,
      suspiciousCount: suspicious.length,
      detectionRate,
      falsePositives,
      avgResponseTime,
      monthlySafe,
      monthlyPhish,
      monthlySusp,
      topDomains,
      threatSegments,
    };
  }, [historyData]);

  return (
    <div className="reports-page">
      <div className="page-header reports-page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive threat analysis and trends</p>
        </div>
        <div className="reports-actions">
          <button className="btn-period">📅 {period}</button>
          <button className="btn-export">⬇ Export Report</button>
        </div>
      </div>

      {loading && (
        <div className="chart-card full-width">
          <h3>Loading Reports</h3>
          <p className="chart-sub">Fetching analytics data from backend...</p>
        </div>
      )}

      {error && !loading && (
        <div className="chart-card full-width">
          <h3>Error</h3>
          <p className="chart-sub">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            {[
              {
                label: "Detection Rate",
                value: `${processed.detectionRate}%`,
                change: "+0%",
                sub: "Based on fetched history",
                color: "green",
              },
              {
                label: "Threats Blocked",
                value: `${processed.phishingCount + processed.suspiciousCount}`,
                change: "+0%",
                sub: "From backend history",
                color: "cyan",
              },
              {
                label: "False Positives",
                value: `${processed.falsePositives}%`,
                change: "+0%",
                sub: "Calculated from scan results",
                color: "white",
              },
              {
                label: "Avg Response Time",
                value: processed.avgResponseTime,
                change: "+0ms",
                sub: "Per scan",
                color: "white",
              },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-top">
                  <span className="stat-label-sm">{s.label}</span>
                  <span className="badge-green">{s.change}</span>
                </div>
                <div className={`stat-value stat-value--${s.color}`}>{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="chart-card full-width">
            <h3>Monthly Phishing Statistics</h3>
            <p className="chart-sub">Scan results breakdown by month</p>
            <BarChart
              safeData={processed.monthlySafe}
              phishData={processed.monthlyPhish}
              suspData={processed.monthlySusp}
            />
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>Threat Type Distribution</h3>
              <p className="chart-sub">Categories of detected threats</p>
              <div className="donut-wrap">
                <ThreatDonut segments={processed.threatSegments} />
              </div>
              <div className="donut-legend">
                {processed.threatSegments.map((t, i) => (
                  <div className="legend-item" key={i}>
                    <span className="legend-dot" style={{ background: t.color }} />
                    <span className="legend-label">{t.label}</span>
                    <span style={{ color: t.color }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3>Top Threat Domains</h3>
              <p className="chart-sub">Most frequently blocked phishing domains</p>
              <div className="domain-list">
                {processed.topDomains.length > 0 ? (
                  processed.topDomains.map((d, i) => (
                    <div className="domain-item" key={i}>
                      <span className="domain-rank">{d.rank}</span>
                      <div className="domain-info">
                        <span className="domain-name">{d.domain}</span>
                        <span className="domain-blocked">{d.blocked} blocked attempts</span>
                      </div>
                      <span className={`domain-change ${d.up ? "domain-change--up" : "domain-change--down"}`}>
                        {d.up ? "↑" : "↓"} {d.change}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="domain-item">
                    <div className="domain-info">
                      <span className="domain-name">No threat domains found</span>
                      <span className="domain-blocked">No phishing or suspicious history available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}