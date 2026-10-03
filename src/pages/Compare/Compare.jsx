import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { getProductImage } from '../../utils/productImages';
import './Compare.css';

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="compare-page container page-enter">
        <div className="compare-empty">
          <h1>Compare Products</h1>
          <p>You haven't selected any products to compare yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  // Get all unique attributes to show
  const hasColors = compareItems.some(p => p.colors && p.colors.length > 0);
  const hasSizes = compareItems.some(p => p.sizes && p.sizes.length > 0);
  const hasVibes = compareItems.some(p => p.vibes && p.vibes.length > 0);

  return (
    <div className="compare-page container page-enter">
      <div className="compare-header">
        <h1>Compare Products</h1>
        <button className="btn btn-outline btn-sm" onClick={clearCompare}>
          Clear All
        </button>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-feature-col">Features</th>
              {compareItems.map(item => (
                <th key={item.id} className="compare-item-col">
                  <button className="compare-remove-btn" onClick={() => removeFromCompare(item.id)}>✕</button>
                  <img src={getProductImage(item)} alt={item.name} className="compare-item-img" />
                  <h3 className="compare-item-name"><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                  <div className="compare-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="compare-feature-col">Category</td>
              {compareItems.map(item => (
                <td key={item.id}>{item.category === 'tshirts' ? 'T-Shirt' : 'Jeans'}</td>
              ))}
            </tr>
            <tr>
              <td className="compare-feature-col">Gender</td>
              {compareItems.map(item => (
                <td key={item.id}>{item.gender === 'MEN' ? 'Men' : 'Women'}</td>
              ))}
            </tr>
            {hasSizes && (
              <tr>
                <td className="compare-feature-col">Available Sizes</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    {item.sizes ? item.sizes.join(', ') : 'Not available'}
                  </td>
                ))}
              </tr>
            )}
            {hasColors && (
              <tr>
                <td className="compare-feature-col">Colors</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    {item.colors ? (
                      <div className="compare-colors">
                        {item.colors.map(c => (
                          <span key={c.name} className="compare-color-dot" style={{ backgroundColor: c.hex }} title={c.name} />
                        ))}
                      </div>
                    ) : 'Not available'}
                  </td>
                ))}
              </tr>
            )}
            {hasVibes && (
              <tr>
                <td className="compare-feature-col">Fashion Vibes</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    {item.vibes ? item.vibes.join(', ') : 'Not available'}
                  </td>
                ))}
              </tr>
            )}
            <tr>
              <td className="compare-feature-col">Rating</td>
              {compareItems.map(item => (
                <td key={item.id}>
                  {item.rating} ★ ({item.reviews} reviews)
                </td>
              ))}
            </tr>
            <tr>
              <td className="compare-feature-col">Material</td>
              {compareItems.map(item => (
                <td key={item.id}>
                  {item.category === 'tshirts' ? '100% Premium Cotton' : '98% Cotton, 2% Elastane'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="compare-feature-col">Fit</td>
              {compareItems.map(item => (
                <td key={item.id}>
                  {item.vibes && item.vibes.includes('Oversized') ? 'Oversized Fit' : 'Regular Fit'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
