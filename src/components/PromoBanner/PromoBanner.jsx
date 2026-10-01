import { Link } from 'react-router-dom';
import './PromoBanner.css';

export default function PromoBanner({ onBuildPackClick }) {
  return (
    <section className="promo-banner-v2" id="promo-banner">
      <div className="promo-banner-v2__bg">
        <img
          src="/images/banner-tshirts.jpg"
          alt="T-Shirt Offer"
          className="promo-banner-v2__img"
          loading="eager"
        />
        <div className="promo-banner-v2__overlay" />
      </div>
      
      <div className="promo-banner-v2__content container">
        <div className="promo-banner-v2__badge slide-down">LIMITED TIME OFFER</div>
        
        <h2 className="promo-banner-v2__title fade-in-up">
          3 T-SHIRTS
          <span className="promo-banner-v2__price highlight-pulse">@ JUST ₹500</span>
        </h2>
        
        <p className="promo-banner-v2__desc fade-in-up delay-1">
          Pick any 3 • Mix & Match
        </p>
        
        <div className="promo-banner-v2__actions fade-in-up delay-2">
          {onBuildPackClick ? (
            <button className="btn btn-primary btn-lg promo-banner-v2__cta" onClick={onBuildPackClick}>
              SHOP THE DEAL <span className="arrow">→</span>
            </button>
          ) : (
            <Link to="/category/tshirts" className="btn btn-primary btn-lg promo-banner-v2__cta">
              SHOP THE DEAL <span className="arrow">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
