import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Account.css';

export default function Account() {
  const [activeTab, setActiveTab] = useState('overview');

  // Currently no real authentication exists in the repository.
  // We mock the logged-in state to demonstrate the UI structure as requested.
  // If the user hasn't "signed in" locally (mock), we prompt them.
  const [isMockLoggedIn, setIsMockLoggedIn] = useState(false);

  if (!isMockLoggedIn) {
    return (
      <div className="account-page container page-enter">
        <div className="account-auth">
          <h1>Sign In</h1>
          <p>Sign in to manage your orders, rewards, and saved fits.</p>
          <div className="account-auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setIsMockLoggedIn(true)}>
              Sign In (Demo)
            </button>
            <div className="account-auth-note">
              <p>Authentication provider is not yet configured. This is a UI demonstration.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page container page-enter">
      <div className="account-header">
        <h1>My StyleHub</h1>
        <button className="btn btn-outline btn-sm" onClick={() => setIsMockLoggedIn(false)}>Sign Out</button>
      </div>

      <div className="account-layout">
        <aside className="account-sidebar">
          <nav className="account-nav">
            <button className={`account-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Order History</button>
            <button className={`account-nav-btn ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>Rewards</button>
            <button className={`account-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
          </nav>
        </aside>

        <main className="account-content">
          {activeTab === 'overview' && (
            <div className="account-section slide-up-fade">
              <h2>Welcome back!</h2>
              <p>Manage your account settings, track orders, and view your rewards here.</p>
              
              <div className="account-cards">
                <div className="account-card">
                  <h3>Recent Orders</h3>
                  <p>You have 0 recent orders.</p>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('orders')}>View All</button>
                </div>
                <div className="account-card">
                  <h3>StyleHub Rewards</h3>
                  <p><strong>0</strong> Points Available</p>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('rewards')}>Redeem</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="account-section slide-up-fade">
              <h2>Order History</h2>
              <div className="account-empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 8l-9 5-9-5M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8M21 8l-9-5-9 5"/>
                </svg>
                <h3>No Orders Yet</h3>
                <p>Looks like you haven't made a purchase yet.</p>
                <Link to="/" className="btn btn-primary">Start Shopping</Link>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="account-section slide-up-fade">
              <h2>Rewards Program</h2>
              <div className="rewards-summary">
                <div className="rewards-balance">
                  <span className="rewards-value">0</span>
                  <span className="rewards-label">Points Available</span>
                </div>
                <p className="rewards-desc">Earn 10 points for every ₹100 spent. Points can be redeemed for discounts on your next order!</p>
              </div>
              <div className="account-empty-state" style={{ marginTop: '24px' }}>
                <p>Make a purchase to start earning points.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="account-section slide-up-fade">
              <h2>Account Settings</h2>
              <p>Authentication integration required to manage profile details securely.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
