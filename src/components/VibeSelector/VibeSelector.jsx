import { useState, useMemo } from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { useCollection } from '../../context/CollectionContext';
import './VibeSelector.css';

const VIBES = [
  { id: 'all', label: 'ALL', icon: '✨' },
  { id: 'minimal', label: 'MINIMAL', icon: '🖤' },
  { id: 'street', label: 'STREET', icon: '🔥' },
  { id: 'graphic', label: 'GRAPHIC', icon: '🎨' },
  { id: 'oversized', label: 'OVERSIZED', icon: '🧊' },
  { id: 'retro', label: 'RETRO', icon: '🕹️' },
  { id: 'athletic', label: 'ATHLETIC', icon: '🏋️' },
  { id: 'summer', label: 'SUMMER', icon: '☀️' }
];

/**
 * Vibe descriptions shown below the title when a vibe is selected.
 */
const VIBE_DESCRIPTIONS = {
  all: 'Explore our entire collection.',
  minimal: 'Clean silhouettes. Neutral tones. Understated premium style.',
  street: 'Urban-inspired. Relaxed silhouettes. Contemporary edge.',
  graphic: 'Bold prints. Statement artwork. Wearable art.',
  oversized: 'Dropped shoulders. Boxy cuts. Effortlessly cool.',
  retro: 'Vintage-inspired colours. Classic prints. Timeless appeal.',
  athletic: 'Sport-inspired cuts. Performance styling. Active energy.',
  summer: 'Light fabrics. Seasonal colours. Breathable comfort.',
};

export default function VibeSelector() {
  const [activeVibe, setActiveVibe] = useState('all');
  const { collection } = useCollection();

  const filteredProducts = useMemo(() => {
    const allItems = products.filter(p => p.gender === collection);

    if (activeVibe === 'all') {
      return allItems.filter(p => p.category === 'tshirts').slice(0, 8);
    }

    // Filter by the vibes tag array — products can appear in multiple vibes
    return allItems.filter(p => p.vibes && p.vibes.includes(activeVibe));
  }, [activeVibe, collection]);

  const hasResults = filteredProducts.length > 0;
  const activeVibeData = VIBES.find(v => v.id === activeVibe);

  return (
    <section className="vibe-selector container" id="vibe-selector">
      <div className="section-header text-center">
        <h2 className="section-title justify-center">WHAT'S YOUR VIBE?</h2>
        <p className="section-subtitle">{VIBE_DESCRIPTIONS[activeVibe] || "Pick your mood. We'll show you the fit."}</p>
      </div>

      <div className="vibe-pills-wrapper">
        <div className="vibe-pills">
          {VIBES.map(vibe => (
            <button
              key={vibe.id}
              className={`vibe-pill ${activeVibe === vibe.id ? 'active' : ''}`}
              onClick={() => setActiveVibe(vibe.id)}
              id={`vibe-pill-${vibe.id}`}
            >
              <span className="vibe-icon">{vibe.icon}</span>
              <span className="vibe-label">{vibe.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active vibe indicator */}
      {activeVibe !== 'all' && (
        <div className="vibe-active-indicator">
          <span className="vibe-active-tag">
            {activeVibeData?.icon} {activeVibeData?.label}
          </span>
          <button
            className="vibe-clear-btn"
            onClick={() => setActiveVibe('all')}
            aria-label="Show all products"
          >
            Show All ×
          </button>
        </div>
      )}

      {hasResults ? (
        <div className="product-grid vibe-results" key={activeVibe}>
          {filteredProducts.map(product => (
            <div key={`${activeVibe}-${product.id}`} className="vibe-result-anim">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="vibe-empty" key={`empty-${activeVibe}`}>
          <div className="vibe-empty__icon">{activeVibeData?.icon || '🔍'}</div>
          <h3 className="vibe-empty__title">No {activeVibeData?.label || ''} fits yet</h3>
          <p className="vibe-empty__text">
            We're curating the perfect {activeVibeData?.label?.toLowerCase()} collection for you. Check back soon!
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveVibe('all')}
          >
            Browse All Products
          </button>
        </div>
      )}
    </section>
  );
}
