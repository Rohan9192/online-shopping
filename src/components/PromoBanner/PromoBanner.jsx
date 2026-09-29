import { Link } from 'react-router-dom';
import { useState } from 'react';
import './PromoBanner.css';

export default function PromoBanner() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="promo-banner" id="promo-banner">
      <div className="promo-banner__bg">
        <img
          src="/images/heroes/promo-banner.jpg"
          alt="StyleHub T-shirt collection"
          className={`promo-banner__img ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="promo-banner__overlay" />
      </div>
      <div className="promo-banner__content container">
        <span className="promo-banner__label">THE T-SHIRT EDIT</span>
        <h2 className="promo-banner__title">YOUR STYLE. YOUR FIT.</h2>
        <p className="promo-banner__desc">Discover T-shirts made for every mood.</p>
        <Link to="/category/tshirts" className="btn btn-primary btn-lg promo-banner__cta">
          SHOP COLLECTION
        </Link>
      </div>
    </section>
  );
}
