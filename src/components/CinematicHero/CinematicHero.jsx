import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../../context/CollectionContext';
import './CinematicHero.css';

export default function CinematicHero() {
  const { setCollection } = useCollection();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className={`cinematic-hero ${loaded ? 'is-loaded' : ''}`}>
      <div className="cinematic-hero__bg">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
          alt="Fashion Hero" 
          className="cinematic-hero__img"
        />
        <div className="cinematic-hero__overlay" />
      </div>
      
      <div className="cinematic-hero__content container">
        <div className="cinematic-hero__label">STYLEHUB / NEW SEASON</div>
        <h1 className="cinematic-hero__title">
          WEAR YOUR<br />
          <span className="serif-text">STATEMENT.</span>
        </h1>
        <p className="cinematic-hero__subtext">
          Discover the latest styles designed for the way you move.
        </p>
        
        <div className="cinematic-hero__actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              setCollection('MEN');
              const el = document.getElementById('new-arrivals-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            SHOP MEN
          </button>
          <button 
            className="btn btn-secondary btn-lg btn-white"
            onClick={() => {
              setCollection('WOMEN');
              const el = document.getElementById('new-arrivals-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            SHOP WOMEN
          </button>
        </div>
      </div>

      <div className="cinematic-hero__scroll">
        <span>SCROLL TO EXPLORE</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}
