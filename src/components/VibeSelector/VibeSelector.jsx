import { useState, useMemo } from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { useCollection } from '../../context/CollectionContext';
import './VibeSelector.css';

const VIBES = [
  { id: 'minimal', label: 'MINIMAL', icon: '🖤' },
  { id: 'street', label: 'STREET', icon: '🔥' },
  { id: 'graphic', label: 'GRAPHIC', icon: '🎨' },
  { id: 'oversized', label: 'OVERSIZED', icon: '🧊' },
  { id: 'retro', label: 'RETRO', icon: '🕹️' },
  { id: 'athletic', label: 'ATHLETIC', icon: '🏋️' },
  { id: 'summer', label: 'SUMMER', icon: '☀️' }
];

export default function VibeSelector() {
  const [activeVibe, setActiveVibe] = useState(VIBES[0].id);
  const { collection } = useCollection();

  const filteredProducts = useMemo(() => {
    // Basic logic mapping vibe to keywords in product name/description
    // In a real app this would query the DB by tag or style attribute
    const tshirts = products.filter(p => p.category === 'tshirts' && p.gender === collection);
    
    switch (activeVibe) {
      case 'oversized':
        return tshirts.filter(p => p.name.toLowerCase().includes('oversized') || p.name.toLowerCase().includes('boxy'));
      case 'retro':
        return tshirts.filter(p => p.name.toLowerCase().includes('ringer') || p.name.toLowerCase().includes('raglan'));
      case 'street':
        return tshirts.filter(p => p.name.toLowerCase().includes('zipper') || p.name.toLowerCase().includes('oversized'));
      case 'minimal':
        return tshirts.filter(p => p.name.toLowerCase().includes('crew') || p.name.toLowerCase().includes('waffle'));
      case 'summer':
        return tshirts.filter(p => p.name.toLowerCase().includes('tank') || p.name.toLowerCase().includes('crop'));
      case 'graphic':
        return tshirts.slice(0, 4); // mock
      case 'athletic':
        return tshirts.filter(p => p.name.toLowerCase().includes('raglan') || p.name.toLowerCase().includes('tank'));
      default:
        return tshirts.slice(0, 4);
    }
  }, [activeVibe, collection]);

  // Ensure we always have some products to show
  const displayProducts = filteredProducts.length > 0 ? filteredProducts.slice(0, 4) : products.filter(p => p.category === 'tshirts' && p.gender === collection).slice(0, 4);

  return (
    <section className="vibe-selector container" id="vibe-selector">
      <div className="section-header text-center">
        <h2 className="section-title justify-center">WHAT'S YOUR VIBE?</h2>
        <p className="section-subtitle">Pick your mood. We'll show you the fit.</p>
      </div>

      <div className="vibe-pills-wrapper">
        <div className="vibe-pills">
          {VIBES.map(vibe => (
            <button
              key={vibe.id}
              className={`vibe-pill ${activeVibe === vibe.id ? 'active' : ''}`}
              onClick={() => setActiveVibe(vibe.id)}
            >
              <span className="vibe-icon">{vibe.icon}</span>
              <span className="vibe-label">{vibe.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid vibe-results">
        {displayProducts.map(product => (
          <div key={`${activeVibe}-${product.id}`} className="vibe-result-anim">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
