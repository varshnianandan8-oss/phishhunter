import React, { useEffect, useRef, useState } from 'react';
import { Link2, Mail, BarChart2, History, Zap ,Key } from 'lucide-react';

const features = [
  {
    icon: Link2,
    title: 'URL Scanner',
    desc: 'Instantly analyze any URL for phishing indicators, malicious redirects, and suspicious domains.',
    color: 'var(--cyan)',
  },
  {
    icon: Mail,
    title: 'Email Analysis',
    desc: 'Paste email content or upload files to detect scam patterns, suspicious links, and impersonation attempts.',
    color: 'var(--cyan)',
  },
  {
    icon: Key,
    title: 'API Key',
    desc: 'Look for unusual API traffic patterns or data being sent to unrecognized domains.',
    color: 'var(--cyan)',
  },
  {
    icon: BarChart2,
    title: 'Threat Analytics',
    desc: 'Comprehensive reports and dashboards showing threat trends, detection patterns, and security insights.',
    color: 'var(--cyan)',
  },
  {
    icon: History,
    title: 'Scan History',
    desc: 'Complete audit trail of all scans with detailed results, timestamps, and threat classifications.',
    color: 'var(--cyan)',
  },
  {
    icon: Zap,
    title: 'Real-time Protection',
    desc: 'AI-powered detection engine that analyzes threats in milliseconds with high accuracy.',
    color: 'var(--cyan)',
  },
];

export default function Features() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }} id='features'>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.5px' }}>
            Comprehensive{' '}
            <span style={{ color: 'var(--cyan)' }}>Security Features</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
            Advanced AI-powered tools to protect you from the latest phishing threats and cyber attacks.
          </p>
        </div>

        {/* 3×2 Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '28px 26px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, border-color 0.2s`,
              cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,200,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {/* Icon box */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(0,229,200,0.1)',
                border: '1px solid rgba(0,229,200,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}