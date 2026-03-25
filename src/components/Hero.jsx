import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, Scan, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ScanCard() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => {
        p += 1.2;
        if (p >= 72) { clearInterval(interval); p = 72; }
        setProgress(p);
      }, 30);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-cyan)',
      borderRadius: 16,
      padding: 28,
      width: 420,
      boxShadow: '0 0 60px rgba(0,229,200,0.08), 0 0 120px rgba(0,229,200,0.04)',
      animation: 'float 4s ease-in-out infinite',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Protected badge */}
      <div style={{
        position: 'absolute', top: -14, right: 20,
        display: 'flex', alignItems: 'center', gap: 7,
        background: '#0d1a1f',
        border: '1px solid var(--border)',
        borderRadius: 20, padding: '5px 14px',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'block' }} />
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>Protected</span>
      </div>

      {/* Shield icon */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 28px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', width: 80, height: 80, borderRadius: '50%',
            border: '1px solid rgba(0,229,200,0.2)',
            animation: 'pulse-ring 2.5s ease-out infinite',
          }} />
          <Shield size={56} color="var(--cyan)" strokeWidth={1.5} />
        </div>
      </div>

      {/* Scanning URL row */}
      <div style={{
        background: '#0d1a1f',
        border: '1px solid var(--border)',
        borderRadius: 10, padding: '14px 16px',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Scanning URL ...</span>
          <span style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 600, letterSpacing: '0.5px' }}>ACTIVE</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--cyan-dim), var(--cyan))',
            borderRadius: 4,
            transition: 'width 0.1s linear',
            boxShadow: '0 0 10px rgba(0,229,200,0.5)',
          }} />
        </div>
      </div>

      {/* Safe + Confidence row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[
          { label: 'Status', value: 'SAFE', color: 'var(--green)' },
          { label: 'Confidence', value: '98%', color: 'var(--cyan)' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#0d1a1f', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* No threats row */}
      <div style={{
        background: '#0d1a1f', border: '1px solid var(--border)',
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,230,118,0.1)',
          border: '1px solid rgba(0,230,118,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <CheckCircle size={18} color="var(--green)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>No threats detected</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Domain verified • SSL valid</div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {


    const navigate = useNavigate();

    const handleClick = ()=>{
        navigate('/api/dashboard')
    }
    const clickscan = ()=>{
      navigate('/api/dashboard')
    }

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 48px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', right: '10%', top: '20%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,229,200,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 60, position: 'relative', zIndex: 1,
      }}>
        {/* Left content */}
        <div style={{ flex: 1, maxWidth: 580, animation: 'fadeInUp 0.6s ease both' }}>
          {/* AI badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,229,200,0.08)',
            border: '1px solid rgba(0,229,200,0.2)',
            borderRadius: 20, padding: '7px 16px',
            marginBottom: 28,
          }}>
            <span style={{ fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 500 }}>Powered by Advanced AI</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
            AI Powered<br />
            <span style={{ color: 'var(--cyan)', textShadow: '0 0 40px rgba(0,229,200,0.4)' }}>
              Phishing Detection
            </span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Scan links, emails, and messages instantly. Our AI analyzes threats
            in real-time, protecting you from sophisticated phishing attacks,
            scam emails, and malicious content.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '13px 28px', borderRadius: 10,
              background: 'var(--cyan)', border: 'none',
              color: '#050c0e', fontSize: 15, fontWeight: 700,
              boxShadow: '0 0 30px rgba(0,229,200,0.3)',
              transition: 'all 0.2s',
            }} onClick={clickscan}>
              <Scan size={16} />
              Start Scanning
              <ArrowRight size={16} />
            </button>
            <button style={{
              padding: '13px 28px', borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(0,229,200,0.3)',
              color: 'var(--cyan)', fontSize: 15, fontWeight: 600,
              transition: 'all 0.2s',
            }} onClick={handleClick}>
              View Dashboard
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Real-time Analysis', 'AI Powered', '99.9% Accuracy'].map(badge => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(0,229,200,0.15)',
                  border: '1px solid rgba(0,229,200,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle size={11} color="var(--cyan)" />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Scan Card */}
        <div style={{ animation: 'fadeInUp 0.6s ease 0.2s both' }}>
          <ScanCard />
        </div>
      </div>
    </section>
  );
}