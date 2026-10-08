import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function VIP() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="vip-page container page-enter" style={{ padding: '64px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', color: 'white', borderRadius: '24px', padding: '64px 32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👑</div>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '16px', letterSpacing: '2px' }}>StyleHub VIP</h1>
        <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '40px' }}>Join the elite. Get exclusive access, early drops, and premium rewards.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚀</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Early Access</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Shop new drops 24 hours before anyone else.</p>
          </div>
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎁</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Birthday Gift</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>A special surprise on your birthday month.</p>
          </div>
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⭐</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>2x Points</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Earn double rewards points on every purchase.</p>
          </div>
        </div>

        {!joined ? (
          <button className="btn btn-primary btn-lg" style={{ background: 'white', color: 'black', fontSize: '1.2rem', padding: '16px 48px' }} onClick={() => setJoined(true)}>
            Join VIP for ₹999/year
          </button>
        ) : (
          <div className="slide-up-fade" style={{ padding: '24px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderRadius: '16px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Welcome to the Club!</h3>
            <p>Your VIP benefits are now active. Payment will be processed via your default payment method.</p>
            <Link to="/" className="btn btn-outline" style={{ marginTop: '16px', color: 'white', borderColor: 'white' }}>Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}
