import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { tshirtCategories, womensCategories } from '../../data/categories';
import { useCollection } from '../../context/CollectionContext';
import './HeroSlideshow.css';

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const intervalRef = useRef(null);
  const categoryNavRef = useRef(null);
  const { collection } = useCollection();

  const activeCategories = collection === 'WOMEN' ? womensCategories : tshirtCategories;
  const totalSlides = activeCategories.length;

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((activeIndex + 1) % totalSlides);
  }, [activeIndex, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeIndex - 1 + totalSlides) % totalSlides);
  }, [activeIndex, totalSlides, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(nextSlide, 4500);
    return () => clearInterval(intervalRef.current);
  }, [nextSlide, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Scroll active category into view in nav bar without pulling page up
  useEffect(() => {
    if (categoryNavRef.current) {
      const activeBtn = categoryNavRef.current.querySelector('.hero-cat-nav__btn.active');
      const container = categoryNavRef.current.querySelector('.hero-cat-nav__inner');
      if (activeBtn && container) {
        // Calculate the center position
        const scrollLeft = activeBtn.offsetLeft - (container.offsetWidth / 2) + (activeBtn.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeIndex, collection]);

  // Touch swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) nextSlide();
      else prevSlide();
    }
  };

  // Preload first image eagerly
  const currentCategory = activeCategories[activeIndex] || activeCategories[0];

  return (
    <section
      className="hero-slideshow"
      id="hero-slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Category hero slideshow"
      role="region"
    >
      {/* Slides */}
      <div className="hero-slideshow__slides">
        {activeCategories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`hero-slide ${idx === activeIndex ? 'hero-slide--active' : ''}`}
            aria-hidden={idx !== activeIndex}
          >
            <div className="hero-slide__split container">
              {/* Left Content */}
              <div className="hero-slide__left">
                <div className="hero-slide__text">
                  <div className="hero-slide__progress-wrapper">
                    <span className="hero-slide__number">
                      {String(idx + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </span>
                    <div className="hero-slide__progress-bar">
                      {idx === activeIndex && !isPaused && (
                        <div className="hero-slide__progress-fill" />
                      )}
                    </div>
                  </div>

                  <span className="hero-slide__label">NEW COLLECTION</span>
                  <h1 className="hero-slide__title">{cat.name}</h1>
                  <p className="hero-slide__tagline">{cat.tagline}</p>
                  <p className="hero-slide__desc">{cat.description}</p>
                  
                  <div className="hero-slide__actions">
                    <Link to={`/category/${cat.slug}`} className="btn btn-primary btn-lg hero-slide__cta">
                      {cat.ctaText}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                    <Link to={`/category/${cat.slug}`} className="btn btn-secondary btn-lg hero-slide__cta-secondary">
                      VIEW COLLECTION
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="hero-slide__right">
                <div className="hero-slide__img-wrapper">
                  <img
                    src={cat.heroImage}
                    alt={`${cat.name} T-shirt collection`}
                    className="hero-slide__img"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                  />
                  <div className="hero-slide__overlay" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-slideshow__arrow hero-slideshow__arrow--prev"
        onClick={prevSlide}
        aria-label="Previous category"
        id="hero-prev"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="hero-slideshow__arrow hero-slideshow__arrow--next"
        onClick={nextSlide}
        aria-label="Next category"
        id="hero-next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>



      {/* Category Navigation Bar */}
      <div className="hero-cat-nav" ref={categoryNavRef} id="hero-category-nav">
        <div className="hero-cat-nav__inner">
          {activeCategories.map((cat, idx) => (
            <button
              key={cat.id}
              className={`hero-cat-nav__btn ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to ${cat.name}`}
              id={`hero-nav-${cat.id}`}
            >
              <span className="hero-cat-nav__text">{String(idx + 1).padStart(2, '0')} &nbsp; {cat.name}</span>
              {idx === activeIndex && (
                <span className="hero-cat-nav__indicator" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
