import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Shield } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  const handleClick = ()=>{
    navigate('/api/auth')
  }
  const handlegetstarted = ()=>{
    navigate('/api/register')
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 64,
      background: scrolled ? 'rgba(5,12,14,0.95)' : 'rgba(5,12,14,0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Shield size={22} color="var(--cyan)" strokeWidth={2} />
        <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
          Phish<span style={{ color: 'var(--cyan)' }}>Hunter</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--cyan)', marginLeft: 6, letterSpacing: '0.5px' }}>AI</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {['Features', 'Pricing', 'Documentation'].map(link => (
          <a key={link} href="#features" style={{
            fontSize: 14, color: 'var(--text-muted)', fontWeight: 400,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{
          padding: '8px 20px', borderRadius: 8,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff', fontSize: 14, fontWeight: 500,
          transition: 'border-color 0.2s',
        }} onClick={handleClick}>Sign In</button>
        <button style={{
          padding: '8px 20px', borderRadius: 8,
          background: 'var(--cyan)',
          border: '1px solid var(--cyan)',
          color: '#050c0e', fontSize: 14, fontWeight: 600,
          transition: 'opacity 0.2s',
        }} onClick={handlegetstarted}>Get Started</button>
      </div>
    </nav>
  );
}