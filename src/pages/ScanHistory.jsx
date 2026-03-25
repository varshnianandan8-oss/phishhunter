import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

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
  if (risk >= 80) return 'Phishing';
  if (risk >= 40) return 'Suspicious';
  return 'Safe';
}

function getType(item) {
  if (item?.type) return item.type.toUpperCase();

  const target = (item?.target || item?.url || item?.message || item?.link || '').toLowerCase();

  if (
    target.includes('from:') ||
    target.includes('subject:') ||
    target.includes('to:')
  ) {
    return 'EMAIL';
  }

  return 'URL';
}

function getTarget(item) {
  return item?.target || item?.url || item?.message || item?.link || 'No target found';
}

function getThreats(item) {
  if (Array.isArray(item?.threats) && item.threats.length > 0) return item.threats;
  if (Array.isArray(item?.indicators) && item.indicators.length > 0) return item.indicators;
  if (Array.isArray(item?.reasons) && item.reasons.length > 0) return item.reasons;
  return [];
}

function formatTime(value) {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

export default function ScanHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [allScans, setAllScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('https://phishhunterai.onrender.com/api/histroy');

        const rawData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.history)
          ? response.data.history
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const normalizedData = rawData.map((item, index) => ({
          id: item?._id || item?.id || index,
          type: getType(item),
          target: getTarget(item),
          status: getStatus(item),
          risk: getRisk(item),
          threats: getThreats(item),
          time: formatTime(
            item?.createdAt ||
              item?.updatedAt ||
              item?.date ||
              item?.time ||
              item?.timestamp
          ),
        }));

        setAllScans(normalizedData);
      } catch (err) {
        console.error('History fetch error:', err.response?.data || err.message);
        setError('Failed to load scan history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filtered = useMemo(() => {
    return allScans.filter((s) => {
      const matchSearch = s.target.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All Status' || s.status === statusFilter;
      const matchType = typeFilter === 'All Types' || s.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [allScans, search, statusFilter, typeFilter]);

  const totals = useMemo(() => {
    return {
      total: allScans.length,
      safe: allScans.filter((s) => s.status === 'Safe').length,
      suspicious: allScans.filter((s) => s.status === 'Suspicious').length,
      phishing: allScans.filter((s) => s.status === 'Phishing').length,
    };
  }, [allScans]);

  return (
    <div className="scan-history-page">
      <div className="page-header reports-page-header">
        <div>
          <h1>Scan History</h1>
          <p>View all past scans and analysis results</p>
        </div>
        <button className="btn-export">⬇ Export History</button>
      </div>

      <div className="history-stats">
        <div className="hist-stat">
          <div className="hist-num">{totals.total}</div>
          <div className="hist-label">Total Scans</div>
        </div>
        <div className="hist-stat">
          <div className="hist-num hist-num--green">{totals.safe}</div>
          <div className="hist-label">Safe</div>
        </div>
        <div className="hist-stat">
          <div className="hist-num hist-num--yellow">{totals.suspicious}</div>
          <div className="hist-label">Suspicious</div>
        </div>
        <div className="hist-stat">
          <div className="hist-num hist-num--red">{totals.phishing}</div>
          <div className="hist-label">Phishing</div>
        </div>
      </div>

      <div className="history-filters">
        <div className="search-input-wrap">
          <span>🔍</span>
          <input
            type="text"
            className="filter-search"
            placeholder="Search by URL or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Safe</option>
          <option>Phishing</option>
          <option>Suspicious</option>
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>URL</option>
          <option>EMAIL</option>
        </select>
      </div>

      <div className="history-table-wrap">
        {loading ? (
          <div className="history-loading">Loading scan history...</div>
        ) : error ? (
          <div className="history-loading">{error}</div>
        ) : (
          <table className="scans-table">
            <thead>
              <tr>
                <th>TYPE</th>
                <th>TARGET</th>
                <th>STATUS</th>
                <th>RISK</th>
                <th>THREATS</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((scan) => (
                  <tr key={scan.id}>
                    <td>
                      <span className={`type-badge type-badge--${scan.type.toLowerCase()}`}>
                        {scan.type === 'URL' ? '🔗' : '✉'} {scan.type}
                      </span>
                    </td>

                    <td className="scan-url">
                      {scan.target} <span className="ext-icon">↗</span>
                    </td>

                    <td>
                      <span className={`status-badge badge--${scan.status.toLowerCase()}`}>
                        {scan.status === 'Phishing'
                          ? '⚠'
                          : scan.status === 'Safe'
                          ? '🛡'
                          : '⚡'}{' '}
                        {scan.status}
                      </span>
                    </td>

                    <td>
                      <div className="risk-bar-wrap">
                        <div className="risk-bar-track">
                          <div
                            className="risk-bar-fill"
                            style={{
                              width: `${scan.risk}%`,
                              background:
                                scan.status === 'Phishing'
                                  ? '#ff4444'
                                  : scan.status === 'Suspicious'
                                  ? '#ffaa00'
                                  : '#00ff88',
                            }}
                          />
                        </div>
                        <span className="risk-value">{scan.risk}%</span>
                      </div>
                    </td>

                    <td className="threats-cell">
                      {scan.threats.length > 0 ? (
                        scan.threats.map((t, j) => (
                          <span key={j} className="threat-tag">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="no-threat">No threats</span>
                      )}
                    </td>

                    <td className="time-cell">{scan.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No scan history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}