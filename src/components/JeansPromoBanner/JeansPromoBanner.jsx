import { Link } from 'react-router-dom';
import './JeansPromoBanner.css';

export default function JeansPromoBanner() {
  return (
    <div className="jeans-promo-banner container">
      <div className="jeans-promo-banner__inner">
        <div className="jeans-promo-banner__content">
          <div className="jeans-promo-banner__badge slide-up-fade">🔥 LIMITED TIME OFFER</div>
          <h2 className="jeans-promo-banner__title">
            <span className="jeans-promo-banner__price">₹1700</span>
            <span className="jeans-promo-banner__text">FOR 3 JEANS</span>
          </h2>
          <p className="jeans-promo-banner__subtitle">Mix & Match • Pick any 3 eligible jeans</p>
          <Link to="/category/jeans" className="btn btn-primary btn-lg jeans-promo-banner__cta">
            SHOP JEANS <span className="arrow">→</span>
          </Link>
        </div>
        <div className="jeans-promo-banner__image-wrapper">
          <img src="/images/jeans-black.jpg" alt="Jeans Promotion" className="jeans-promo-banner__img" />
          <div className="jeans-promo-banner__overlay"></div>
        </div>
      </div>
    </div>
  );
}
