import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { products } from '../../data/products';

export default function Recommendations({ title = "Recommended For You", type = "trending", currentProductId = null, limit = 4 }) {
  // Use existing product data safely
  let recommended = [];
  
  if (type === "trending") {
    recommended = [...products].sort((a, b) => b.reviews - a.reviews);
  } else if (type === "similar" && currentProductId) {
    const current = products.find(p => p.id === currentProductId);
    if (current) {
      recommended = products.filter(p => p.id !== current.id && p.category === current.category && p.gender === current.gender);
    }
  } else if (type === "complete-look" && currentProductId) {
    const current = products.find(p => p.id === currentProductId);
    if (current) {
      // Suggest opposite category (if tshirt suggest jeans, etc)
      const targetCategory = current.category === 'tshirts' ? 'jeans' : 'tshirts';
      recommended = products.filter(p => p.category === targetCategory && p.gender === current.gender);
    }
  } else {
    recommended = [...products].sort(() => 0.5 - Math.random());
  }

  recommended = recommended.slice(0, limit);

  if (recommended.length === 0) return null;

  return (
    <section className="product-section container recommendations-section" style={{ marginTop: '40px', marginBottom: '40px' }}>
      <div className="section-header text-center" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: 600 }}>{title}</h2>
      </div>
      <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {recommended.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
