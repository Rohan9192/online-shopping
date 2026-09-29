import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { totalItems } = useCart();

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </Link>
      <Link to="/category/tshirts" className={`nav-item ${pathname.includes('/category') ? 'active' : ''}`}>
        <span className="nav-icon">👕</span>
        <span className="nav-label">Shop</span>
      </Link>
      <button className="nav-item">
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Search</span>
      </button>
      <button className="nav-item">
        <span className="nav-icon">♡</span>
        <span className="nav-label">Wishlist</span>
      </button>
      <button className="nav-item cart-btn" onClick={() => document.body.classList.add('cart-open')}>
        <span className="nav-icon">🛒
          {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
        </span>
        <span className="nav-label">Cart</span>
      </button>
    </nav>
  );
}
