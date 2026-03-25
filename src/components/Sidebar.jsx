import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'scan-link', label: 'Scan Link', icon: '🔗' },
  { id: 'email-scanner', label: 'Email Scanner', icon: '✉' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'scan-history', label: 'Scan History', icon: '🕐' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🛡</span>
        <span className="logo-text">
          <span className="logo-phish">Phish</span>
          <span className="logo-hunter">Hunter</span>
          <span className="logo-ai">AI</span>
        </span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activePage === item.id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-status">
        <div className="status-indicator">
          <span className="status-dot" />
          <span className="status-text">System Active</span>
        </div>
        <p className="status-detail">AI Engine: Online</p>
        <p className="status-detail">Threat DB: Updated</p>
      </div>
    </aside>
  );
}