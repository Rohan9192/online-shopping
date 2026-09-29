import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
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

          {/* Help */}
          <div className="footer__col">
            <h4 className="footer__heading">Help</h4>
            <span className="footer__link">Size Guide</span>
            <span className="footer__link">Shipping</span>
            <span className="footer__link">Returns</span>
            <span className="footer__link">Contact Us</span>
          </div>

          {/* Newsletter */}
          <div className="footer__col footer__col--wide">
            <h4 className="footer__heading">Stay Updated</h4>
            <p className="footer__newsletter-text">Get exclusive deals and new arrivals straight to your inbox.</p>
            <div className="footer__newsletter">
              <input type="email" placeholder="Your email address" className="footer__input" />
              <button className="btn btn-accent btn-sm">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 StyleHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
