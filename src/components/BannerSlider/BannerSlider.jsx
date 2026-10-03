import React, { useEffect, useState } from 'react';
import './BannerSlider.css';

// Premium fashion banner images
const slides = [
  {
    id: 1,
    image: '/images/banner-tshirts.jpg',
    title: '🔥 3 T‑Shirts for just ₹500!',
    subtitle: 'Mix & match any three tees from our signature collection.',
    cta: '/offers',
    ctaLabel: 'Shop T-Shirts',
  },
  {
    id: 2,
    image: '/images/banner-jeans.jpg',
    title: '⚡ ₹1700 FOR 3 JEANS – Limited Time',
    subtitle: 'Premium denim crafted for perfect fit and all-day comfort.',
    cta: '/offers',
    ctaLabel: 'Shop Jeans',
  },
  {
    id: 3,
    image: '/images/banner-newarrivals.jpg',
    title: '🌟 New Arrivals – Fresh Styles Every Week',
    subtitle: 'Be the first to wear our latest seasonal drops.',
    cta: '/new-arrivals',
    ctaLabel: 'Explore Now',
  },
];

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto‑rotate every 6 seconds for better reading time
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveIndex(index);

  return (
    <section className="banner-slider" aria-label="Promotional banner slideshow">
      <div className="slides-wrapper">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`slide ${idx === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <a href={slide.cta} className="slide-cta btn btn-primary btn-lg">
                {slide.ctaLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation dots with progress indicator */}
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className="dot-progress"></div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;
