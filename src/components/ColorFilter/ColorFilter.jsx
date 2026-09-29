import { useState, useMemo } from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { useCollection } from '../../context/CollectionContext';
import './ColorFilter.css';

const COLORS = [
  { name: 'BLACK', hex: '#111111' },
  { name: 'WHITE', hex: '#FFFFFF' },
  { name: 'GREY', hex: '#888888' },
  { name: 'BLUE', hex: '#2B4261' },
  { name: 'GREEN', hex: '#3E5C49' },
  { name: 'BROWN', hex: '#634735' },
  { name: 'BEIGE', hex: '#D2C1A7' },
  { name: 'RED', hex: '#8B1A1A' }
];

export default function ColorFilter() {
  const [activeColor, setActiveColor] = useState('BLACK');
  const { collection } = useCollection();

  const filteredProducts = useMemo(() => {
    // Basic logic mapping color to product name or mock colors
    const tshirts = products.filter(p => p.category === 'tshirts' && p.gender === collection);
    const colorLower = activeColor.toLowerCase();
    
    // Fallback logic for mock data where color isn't strictly defined
    const matched = tshirts.filter(p => 
      p.name.toLowerCase().includes(colorLower) || 
      p.colors?.includes(colorLower) ||
      (activeColor === 'BLACK' && (p.id % 2 === 0)) || // mock distribution
      (activeColor === 'WHITE' && (p.id % 3 === 0))
    );

    return matched.length > 0 ? matched.slice(0, 4) : tshirts.slice(0, 4);
  }, [activeColor, collection]);

  return (
    <section className="color-filter-section container" id="shop-by-color">
      <div className="section-header text-center">
        <h2 className="section-title justify-center">SHOP BY COLOR</h2>
      </div>

      <div className="color-swatches">
        {COLORS.map(color => (
          <button
            key={color.name}
            className={`color-swatch-btn ${activeColor === color.name ? 'active' : ''}`}
            onClick={() => setActiveColor(color.name)}
            aria-label={`Shop ${color.name}`}
          >
            <div 
              className="color-swatch-circle" 
              style={{ backgroundColor: color.hex, border: color.name === 'WHITE' ? '1px solid #ddd' : 'none' }}
            >
              {activeColor === color.name && (
                <span className={`color-swatch-check ${color.name === 'WHITE' ? 'dark-check' : ''}`}>✓</span>
              )}
            </div>
            <span className="color-swatch-label">{color.name}</span>
          </button>
        ))}
      </div>

      <div className="product-grid color-results">
        {filteredProducts.map(product => (
          <div key={`${activeColor}-${product.id}`} className="vibe-result-anim">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
