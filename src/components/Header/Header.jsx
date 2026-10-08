import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useCollection } from '../../context/CollectionContext';
import VisualSearchModal from '../VisualSearchModal/VisualSearchModal';
import './Header.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, toggleCart } = useCart();
  const { compareItems } = useCompare();
  const { collection, setCollection } = useCollection();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/new-arrivals', label: 'New Arrivals' },
    { to: '/offers', label: 'Trending' },
    { to: '/outfit-builder', label: 'Mix & Match' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/gift-cards', label: 'Gift Cards' }
  ];

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="main-header">


        <div className="header__inner container">
          {/* Mobile Menu Toggle */}
          <button
            className="header__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
          </button>

          {/* Logo */}
          <Link to="/" className="header__logo" id="logo-link">
            <span className="logo-text">Style</span>
            <span className="logo-accent">Hub</span>
          </Link>

          {/* Collection Switcher */}
          <div className="collection-switcher">
            <button
              className={`switcher-btn ${collection === 'MEN' ? 'active' : ''}`}
              onClick={() => { setCollection('MEN'); if (location.pathname !== '/') window.location.href = '/'; }}
            >
              MEN
            </button>
            <button
              className={`switcher-btn ${collection === 'WOMEN' ? 'active' : ''}`}
              onClick={() => { setCollection('WOMEN'); if (location.pathname !== '/') window.location.href = '/'; }}
            >
              WOMEN
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="header__nav" id="desktop-nav">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`header__nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="header__actions">
            {/* Visual Search */}
            <button
              className="header__icon-btn"
              onClick={() => setVisualSearchOpen(true)}
              aria-label="Visual Search"
              title="Visual Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>

            {/* Search */}
            <button
              className="header__icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              title="Search"
              id="search-toggle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Compare */}
            <Link to="/compare" className="header__icon-btn" aria-label="Compare" title="Compare" id="compare-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              {compareItems.length > 0 && (
                <span className="header__cart-badge">{compareItems.length}</span>
              )}
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="header__icon-btn" aria-label="Wishlist" title="Wishlist" id="wishlist-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            {/* Account */}
            <Link to="/account" className="header__icon-btn" aria-label="Account" title="Account" id="account-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              className="header__icon-btn header__cart-btn"
              onClick={toggleCart}
              aria-label={`Cart with ${totalItems} items`}
              title="Cart"
              id="cart-toggle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="header__cart-count" id="cart-count">{totalItems}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="search-overlay" id="search-overlay">
            <div className="container">
              <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for T-Shirts, Jeans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  id="search-input"
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="search-close">
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobile-nav">
        <div className="mobile-nav__header">
          <span className="logo-text">Style</span><span className="logo-accent">Hub</span>
          <button onClick={() => setMobileOpen(false)} className="mobile-nav__close" aria-label="Close menu">✕</button>
        </div>
        <div className="mobile-nav__links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav__link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-collection-switcher" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              className={`btn ${collection === 'MEN' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setCollection('MEN'); setMobileOpen(false); if (location.pathname !== '/') window.location.href = '/'; }}
              style={{ flex: 1 }}
            >
              MEN
            </button>
            <button
              className={`btn ${collection === 'WOMEN' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setCollection('WOMEN'); setMobileOpen(false); if (location.pathname !== '/') window.location.href = '/'; }}
              style={{ flex: 1 }}
            >
              WOMEN
            </button>
          </div>
        </div>
        <div className="mobile-nav__promo">
          <p>🔥 3 T-Shirts for ₹500</p>
          <p>🔥 ₹1700 FOR 3 JEANS</p>
        </div>
      </nav>

      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => setVisualSearchOpen(false)}
      />
    </>
  );
}
