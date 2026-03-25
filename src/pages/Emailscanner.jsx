import React, { useState } from 'react';
import axios from 'axios';

export default function EmailScanner() {
  const [activeTab, setActiveTab] = useState('paste');
  const [emailContent, setEmailContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setEmailContent(event.target.result || '');
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;

    setAnalyzing(true);
    setResult(null);

    try {
      const res = await axios.post('https://phishhunterai.onrender.com/api/aiscore', {
        message: emailContent,
      });

      const data = res.data;

      setResult({
        status: data.status || data.prediction || 'Safe',
        risk: data.risk || data.risk_score || 0,
        indicators:
          data.indicators ||
          data.threats ||
          data.reasons ||
          [],
        urls:
          data.urls ||
          [],
        fileName: uploadedFile ? uploadedFile.name : null,
      });
    } catch (error) {
      console.error('Analyze error:', error.response?.data || error.message);

      setResult({
        status: 'Error',
        risk: "notfound",
        indicators: ['Unable to analyze the email content'],
        urls: [],
        fileName: uploadedFile ? uploadedFile.name : null,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="email-scanner-page">
      <div className="page-header">
        <h1>Email Scanner</h1>
        <p>Analyze emails for phishing attempts and scam patterns</p>
      </div>

      <div className="email-card">
        <div className="email-tabs">
          <button
            className={`email-tab ${activeTab === 'paste' ? 'email-tab--active' : ''}`}
            onClick={() => setActiveTab('paste')}
          >
            📄 Paste Email
          </button>

          <button
            className={`email-tab ${activeTab === 'upload' ? 'email-tab--active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            ⬆ Upload File
          </button>
        </div>

        {activeTab === 'paste' && (
          <>
            <div className="email-content-header">
              <label className="content-label">Email Content</label>
            </div>

            <textarea
              className="email-textarea"
              placeholder="Paste the email content here including headers..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </>
        )}

        {activeTab === 'upload' && (
          <div className="upload-zone">
            <span className="upload-icon">📁</span>
            <p>Drag and drop your .eml file here</p>
            <p className="upload-sub">or click to browse</p>

            <input
              type="file"
              className="file-input"
              accept=".eml,.msg,.txt"
              onChange={handleFileChange}
            />

            {uploadedFile && (
              <div className="result-section">
                <p className="result-section-title">📎 Selected File:</p>
                <div className="url-item">
                  <span>{uploadedFile.name}</span>
                  <span className="badge--safe">Ready</span>
                </div>
              </div>
            )}
          </div>
        )}

        <button className="btn-analyze" onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? '⏳ Analyzing...' : '🔲 Analyze Email'}
        </button>

        {result && (
          <div className={`email-result email-result--${result.status.toLowerCase()}`}>
            <div className="result-row">
              <h4>Analysis Result</h4>
              <span className={`result-badge badge--${result.status.toLowerCase()}`}>
                {result.status === 'Phishing'
                  ? '⚠'
                  : result.status === 'Safe'
                  ? '🛡'
                  : result.status === 'Suspicious'
                  ? '⚠'
                  : '❌'}{' '}
                {result.status}
              </span>
            </div>

            {result.fileName && (
              <div className="result-section">
                <p className="result-section-title">📄 Uploaded File:</p>
                <div className="url-item">
                  <span>{result.fileName}</span>
                  <span className="badge--safe">Processed</span>
                </div>
              </div>
            )}

            <div className="result-section">
              <p className="result-section-title">📊 Risk Score:</p>
              <div className="url-item">
                <span>Overall Risk</span>
                <span
                  className={
                    result.status === 'Phishing'
                      ? 'badge--phishing'
                      : result.status === 'Suspicious'
                      ? 'badge--suspicious'
                      : 'badge--safe'
                  }
                >
                  {result.risk}%
                </span>
              </div>
            </div>

            {result.indicators.length > 0 && (
              <div className="result-section">
                <p className="result-section-title">🚨 Phishing Indicators:</p>
                {result.indicators.map((ind, i) => (
                  <div key={i} className="indicator-item">⚠ {ind}</div>
                ))}
              </div>
            )}

            {result.urls.length > 0 && (
              <div className="result-section">
                <p className="result-section-title">🔗 Suspicious URLs Found:</p>
                {result.urls.map((u, i) => (
                  <div key={i} className="url-item">
                    <span>{typeof u === 'string' ? u : u.url}</span>
                    <span className="badge--phishing">
                      ⚠ {typeof u === 'string' ? 'Phishing' : u.risk || 'Phishing'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {result.status === 'Safe' && (
              <p className="safe-msg">✅ No phishing indicators found. This email appears safe.</p>
            )}

            {result.status === 'Error' && (
              <p className="safe-msg">❌ Failed to analyze email. Please try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}