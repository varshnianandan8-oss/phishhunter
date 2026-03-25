import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ScanLink() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!url.trim()) return;

    setScanning(true);
    setResult(null);

    try {
      const res = await axios.post("https://phishhunterai.onrender.com/api/aiscore", {
        message: url
      });

      setResult(res.data);
    } catch (error) {
      console.error("Scan error:", error.response?.data || error.message);
      setResult({
        url: url,
        status: "Suspicious",
        risk: "not found",
        threats: ["Unable to fetch scan result"]
      });
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    axios.get("https://phishhunterai.onrender.com/api/history")
      .then((res) => {
        console.log("History data:", res.data);
      })
      .catch((error) => {
        console.error("History fetch error:", error.response?.data || error.message);
      });
  }, []);

  return (
    <div className="scan-link-page">
      <div className="page-header">
        <h1>Scan Link</h1>
        <p>Analyze URLs for phishing and malicious content</p>
      </div>

      <div className="scanner-card">
        <div className="scanner-card-header">
          <span className="scanner-icon">🔗</span>
          <div>
            <h3>URL Scanner</h3>
            <p>Paste any URL to analyze for threats</p>
          </div>
        </div>

        <div className="scanner-input-row">
          <div className="url-input-wrap">
            <span className="globe-icon">🌐</span>
            <input
              type="text"
              className="url-input"
              placeholder="https://example.com/suspicious-link"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
            />
          </div>

          <button className="btn-scan" onClick={handleScan} disabled={scanning}>
            {scanning ? (
              <span className="scanning-text">⏳ Scanning...</span>
            ) : (
              <span>🔲 Scan Now</span>
            )}
          </button>
        </div>

        {scanning && (
          <div className="scan-progress">
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
            <p className="scan-msg">Analyzing URL for threats...</p>
          </div>
        )}

        {result && (
          <div className={`scan-result scan-result--${result.status?.toLowerCase()}`}>
            <div className="result-header">
              <span className="result-url">{result.url || url}</span>
              <span className={`result-badge badge--${result.status?.toLowerCase()}`}>
                {result.status === 'Phishing'
                  ? '⚠'
                  : result.status === 'Safe'
                  ? '🛡'
                  : '⚡'}{" "}
                {result.status || "Unknown"}
              </span>
            </div>

            <div className="result-details">
              <div className="result-item">
                <span className="result-label">Risk Score</span>
                <div className="risk-bar-wrap">
                  <div className="risk-bar-track">
                    <div
                      className="risk-bar-fill"
                      style={{
                        width: `${result.risk || 0}%`,
                        background:
                          result.status === 'Phishing'
                            ? '#ff4444'
                            : result.status === 'Suspicious'
                            ? '#ffaa00'
                            : '#00ff88',
                      }}
                    />
                  </div>
                  <span className="risk-value">{result.risk || 0}%</span>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Threats</span>
                <div className="threats-list">
                  {result.threats && result.threats.length > 0 ? (
                    result.threats.map((t, i) => (
                      <span key={i} className="threat-tag">{t}</span>
                    ))
                  ) : (
                    <span className="no-threat">No threats detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}