import React from 'react';
import './index.css';
import Navbar   from './components/Navbar';
import Hero     from './components/Hero';
import StatsBar from './components/StatsBar';
import Features from './components/Features';
import Footer   from './components/Footer';

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <Footer />
    </div>
  );
}