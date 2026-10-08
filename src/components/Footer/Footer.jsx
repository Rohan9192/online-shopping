import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="logo-text">Style</span><span className="logo-accent">Hub</span>
            </Link>
            <p className="footer__tagline">Premium fashion at unbeatable prices. Style more, spend less.</p>
          </div>

          {/* Shop */}
          <div className="footer__col">
            <h4 className="footer__heading">Shop</h4>
            <Link to="/category/tshirts" className="footer__link">T-Shirts</Link>
            <Link to="/category/jeans" className="footer__link">Jeans</Link>
            <Link to="/new-arrivals" className="footer__link">New Arrivals</Link>
            <Link to="/offers" className="footer__link">Offers</Link>
          </div>

          {/* Help & Trust */}
          <div className="footer__col">
            <h4 className="footer__heading">Support & Trust</h4>
            <Link to="/policies/about" className="footer__link">About Us</Link>
            <Link to="/policies/contact" className="footer__link">Contact Us</Link>
            <Link to="/policies/faq" className="footer__link">FAQ</Link>
            <Link to="/policies/shipping" className="footer__link">Shipping Policy</Link>
            <Link to="/policies/returns" className="footer__link">Returns & Refunds</Link>
            <Link to="/policies/terms" className="footer__link">Terms of Service</Link>
            <Link to="/policies/privacy" className="footer__link">Privacy Policy</Link>
            <Link to="/policies/tracking" className="footer__link">Order Tracking</Link>
            <Link to="/policies/size-guide" className="footer__link">Size Guide</Link>
            <Link to="/policies/material" className="footer__link">Material & Care</Link>
          </div>

          {/* Newsletter / Drop Notifications */}
          <div className="footer__col footer__col--wide">
            <h4 className="footer__heading">New Drop Notifications</h4>
            <p className="footer__newsletter-text">Never miss a limited drop. Select your preferences below.</p>
            {isSubscribed ? (
              <div className="footer__success slide-up-fade" style={{ background: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                You're on the list! Keep an eye on your inbox.
              </div>
            ) : (
              <form className="footer__drop-form" onSubmit={handleSubscribe}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" defaultChecked /> New Collections
                  </label>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" defaultChecked /> Restocks
                  </label>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" /> Exclusive Offers
                  </label>
                </div>
                <div className="footer__newsletter">
                  <input type="email" placeholder="Your email address" className="footer__input" required />
                  <button type="submit" className="btn btn-accent btn-sm">Subscribe</button>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-gray)', marginTop: '8px' }}>
                  By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 StyleHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
