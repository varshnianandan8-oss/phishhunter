import React from 'react';
import { Shield } from 'lucide-react';

const footerLinks = {
  Product: ['Dashboard', 'URL Scanner', 'Email Scanner', 'Reports'],
  Resources: ['Documentation', 'API Reference', 'Security Blog', 'Threat Intel'],
  Company: ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'],
};

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '56px 48px 32px',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 48,
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Shield size={20} color="var(--cyan)" strokeWidth={2} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              Phish<span style={{ color: 'var(--cyan)' }}>Hunter</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--cyan)', marginLeft: 5 }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 220 }}>
            AI-powered phishing detection protecting users worldwide from cyber threats.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 20 }}>{section}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {links.map(link => (
                <a key={link} href="#" style={{
                  fontSize: 14, color: 'var(--text-muted)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '20px 48px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2026 PhishHunter AI. All rights reserved.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--cyan)', display: 'block',
            animation: 'blink 2s ease infinite',
          }} />
          <span style={{ fontSize: 13, color: 'var(--cyan)', fontFamily: 'monospace', letterSpacing: '0.3px' }}>
            All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}