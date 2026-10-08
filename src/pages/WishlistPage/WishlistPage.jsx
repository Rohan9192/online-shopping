import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { products } from '../../data/products';

export default function WishlistPage() {
  // Mock wishlist items for display (taking some best sellers)
  const wishlistItems = products.filter(p => p.badge === 'Bestseller').slice(0, 3);

  return (
    <div className="container page-enter" style={{ padding: '64px 0', minHeight: '60vh' }}>
      <div className="section-header" style={{ marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2rem' }}>My Wishlist ({wishlistItems.length})</h1>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button className="btn btn-outline btn-sm">Share Wishlist</button>
          <button className="btn btn-outline btn-sm">Create Collection</button>
        </div>
      </div>
      
      {wishlistItems.length > 0 ? (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {wishlistItems.map(item => (
            <div key={item.id} style={{ position: 'relative' }}>
              {/* Optional: Add a "Price Drop" or "Back in Stock" indicator here if needed */}
              {item.price < item.originalPrice && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 10 }}>
                  Price Dropped!
                </div>
              )}
              <ProductCard product={item} />
              <button className="btn btn-outline btn-full" style={{ marginTop: '8px' }}>Remove from Wishlist</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="account-empty-state text-center" style={{ padding: '64px 0' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Your wishlist is empty</h3>
          <p style={{ marginBottom: '24px', color: 'var(--color-text-light)' }}>Save items you love and buy them later.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
