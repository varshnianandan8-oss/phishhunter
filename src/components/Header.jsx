import React, { useState } from 'react';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-search">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search scans, reports..." className="search-input" />
      </div>
      <div className="header-actions">
        <button className="notif-btn">
          🔔
          <span className="notif-badge" />
        </button>
        <div className="profile-wrapper">
          <button className="profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <span className="profile-icon">👤</span>
            <span className="profile-name">Security Analyst</span>
          </button>
          {showDropdown && (
            <div className="profile-dropdown">
              <p className="dropdown-heading">My Account</p>
              <button className="dropdown-item">Profile Settings</button>
              <button className="dropdown-item">API Keys</button>
              <button className="dropdown-item">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}