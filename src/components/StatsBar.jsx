import React, { useEffect, useRef, useState } from 'react';
import { Scan, AlertTriangle, Shield, Users } from 'lucide-react';

const stats = [
  { icon: Scan,          value: '0+',  label: 'URLs Scanned',    color: 'var(--cyan)' },
  { icon: AlertTriangle, value: '0+', label: 'Threats Blocked', color: 'var(--red)'  },
  { icon: Shield,        value: '0%', label: 'Detection Rate',  color: 'var(--green)'},
  { icon: Users,         value: '0+',  label: 'Active Users',    color: 'var(--cyan)' },
];

export default function StatsBar() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: '0 48px 80px',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        overflow: 'hidden',
      }}>
        {stats.map(({ icon: Icon, value, label, color }, i) => (
          <div key={label} style={{
            padding: '44px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
          }}>
            <Icon size={28} color={color} strokeWidth={1.5} />
            <div style={{ fontSize: 40, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}