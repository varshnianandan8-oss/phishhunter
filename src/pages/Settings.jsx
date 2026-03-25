import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [plan, setPlan] = useState(null);
  const [securitySettings, setSecuritySettings] = useState([]);

  const tabs = ['Profile', 'Notifications', 'API Keys', 'Security'];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('https://phishhunterai.onrender.com/api/profile');
        const data = response.data || {};

        const profile = data.profile || data.user || data;

        setName(profile.name || profile.fullName || '');
        setEmail(profile.email || '');
        setOrg(profile.organization || profile.org || '');
        setRole(profile.role || '');

        setNotifications(
          data.notifications || [
            { label: 'Email alerts for high-risk threats', on: false },
            { label: 'Weekly threat summary report', on: false },
            { label: 'System status updates', on: false },
            { label: 'New feature announcements', on: false },
          ]
        );

        setApiKeys(data.apiKeys || []);

        setPlan(
          data.plan || {
            name: '',
            status: '',
            description: '',
          }
        );

        setSecuritySettings(
          data.securitySettings || [
            {
              title: 'Two-Factor Authentication',
              description: 'Add an extra layer of security to your account.',
              buttonText: 'Enable 2FA',
              type: 'primary',
            },
            {
              title: 'Change Password',
              description: 'Update your password regularly.',
              buttonText: 'Change',
              type: 'outline',
            },
            {
              title: 'Active Sessions',
              description: 'Manage devices logged into your account.',
              buttonText: 'View Sessions',
              type: 'outline',
            },
          ]
        );
      } catch (err) {
        console.error('Profile fetch error:', err.response?.data || err.message);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaveLoading(true);
    setError('');

    try {
      await axios.put('https://phishhunterai.onrender.com/api/profile', {
        name,
        email,
        organization: org,
        role,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Profile save error:', err.response?.data || err.message);
      setError('Failed to save profile changes');
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleNotification = (index) => {
    setNotifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, on: !item.on } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
        <div className="settings-card">
          <h3>Loading...</h3>
          <p className="settings-sub">Fetching profile data from backend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {error && (
        <div className="settings-card" style={{ marginBottom: '16px' }}>
          <p className="settings-sub" style={{ color: '#ff4444' }}>{error}</p>
        </div>
      )}

      <div className="settings-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`settings-tab ${activeTab === t ? 'settings-tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'Profile' && '👤 '}
            {t === 'Notifications' && '🔔 '}
            {t === 'API Keys' && '🔑 '}
            {t === 'Security' && '🛡 '}
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="settings-card">
          <h3>Profile Information</h3>

          <div className="avatar-row">
            <div className="avatar-circle">
              <span>👤</span>
            </div>
            <div>
              <button className="btn-change-avatar">Change Avatar</button>
              <p className="avatar-hint">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Organization</label>
              <input
                className="form-input"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="save-row">
            <button className="btn-save" onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Changes'}
            </button>
          </div>

          {plan && (
            <div className="plan-card">
              <h3>Account Plan</h3>
              <div className="plan-item">
                <span className="plan-icon">🛡</span>
                <div className="plan-info">
                  <span className="plan-name">{plan.name || 'No Plan Available'}</span>
                  {plan.status && <span className="plan-badge">{plan.status}</span>}
                  <p className="plan-desc">{plan.description || 'No plan description available'}</p>
                </div>
                <button className="btn-manage">Manage Plan</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="settings-card">
          <h3>Notification Preferences</h3>

          {notifications.length > 0 ? (
            notifications.map((item, i) => (
              <div className="notif-row" key={i}>
                <span className="notif-label">{item.label}</span>
                <div
                  className={`toggle ${item.on ? 'toggle--on' : ''}`}
                  onClick={() => toggleNotification(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
            ))
          ) : (
            <p className="settings-sub">No notification preferences found.</p>
          )}
        </div>
      )}

      {activeTab === 'API Keys' && (
        <div className="settings-card">
          <h3>API Keys</h3>
          <p className="settings-sub">Use these keys to integrate PhishHunter AI with your systems.</p>

          {apiKeys.length > 0 ? (
            apiKeys.map((key, index) => (
              <div className="api-key-row" key={index}>
                <span className="api-key-label">{key.label || `Key ${index + 1}`}</span>
                <div className="api-key-val">{key.value || 'No key value available'}</div>
                <button className="btn-outline-sm">Copy</button>
                <button className="btn-outline-sm">Regenerate</button>
              </div>
            ))
          ) : (
            <p className="settings-sub">No API keys found.</p>
          )}

          <button className="btn-save" style={{ marginTop: '16px' }}>+ Generate New Key</button>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="settings-card">
          <h3>Security Settings</h3>

          {securitySettings.length > 0 ? (
            securitySettings.map((item, index) => (
              <div className="security-row" key={index}>
                <div>
                  <p className="security-title">{item.title}</p>
                  <p className="security-desc">{item.description}</p>
                </div>
                <button className={item.type === 'primary' ? 'btn-save' : 'btn-outline'}>
                  {item.buttonText}
                </button>
              </div>
            ))
          ) : (
            <p className="settings-sub">No security settings found.</p>
          )}
        </div>
      )}
    </div>
  );
}