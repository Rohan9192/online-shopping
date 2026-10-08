import React, { useState } from 'react';

export default function ShopTheLook({ productsData }) {
  // Take 3 items from productsData to form a look
  const lookProducts = productsData.slice(0, 3);
  if (lookProducts.length < 2) return null;

  return (
    <section className="shop-the-look container" style={{ marginTop: '60px', marginBottom: '60px', padding: '40px', background: 'var(--color-off-white)', borderRadius: '16px' }}>
      <div className="section-header text-center" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop The Look</h2>
        <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>Curated outfits from our top stylists.</p>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
        {lookProducts.map((product, index) => (
          <React.Fragment key={product.id}>
            <div className="look-item" style={{ width: '200px', textAlign: 'center', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <img src={product.images ? product.images[0] : (product.image || 'https://via.placeholder.com/200')} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
              <p style={{ fontWeight: 600 }}>₹{product.price}</p>
              <a href={`/product/${product.id}`} className="btn btn-outline btn-sm" style={{ marginTop: '12px', width: '100%' }}>View</a>
            </div>
            {index < lookProducts.length - 1 && (
              <div style={{ fontSize: '2rem', color: 'var(--color-border)', fontWeight: 'bold' }}>+</div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center" style={{ marginTop: '40px' }}>
        <button className="btn btn-primary btn-lg" onClick={() => alert('Look added to cart! (Demo)')}>Buy The Entire Look</button>
      </div>
    </section>
  );
}
