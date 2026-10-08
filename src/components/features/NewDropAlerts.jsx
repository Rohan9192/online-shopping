import React, { useState } from 'react';

export default function NewDropAlerts() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="new-drop-alerts container" style={{ marginTop: '40px', marginBottom: '40px', padding: '40px', background: 'var(--color-black)', color: 'white', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
      <div style={{ flex: '1 1 300px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'white' }}>Get New Drop Alerts</h2>
        <p style={{ color: '#a1a1aa' }}>Be the first to know when limited collections drop. No spam.</p>
      </div>
      
      <div style={{ flex: '1 1 400px' }}>
        {!subscribed ? (
          <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              style={{ flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid #3f3f46', background: '#27272a', color: 'white' }} 
            />
            <button type="submit" className="btn btn-primary" style={{ background: 'white', color: 'black' }}>Notify Me</button>
          </form>
        ) : (
          <div style={{ padding: '16px', background: '#27272a', borderRadius: '8px', color: '#4ade80', fontWeight: 'bold' }}>
            ✓ You're on the list!
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.8rem', color: '#a1a1aa' }}>
          <label><input type="checkbox" defaultChecked style={{ marginRight: '4px' }} /> Men</label>
          <label><input type="checkbox" defaultChecked style={{ marginRight: '4px' }} /> Women</label>
          <label><input type="checkbox" style={{ marginRight: '4px' }} /> Accessories</label>
        </div>
      </div>
    </section>
  );
}
