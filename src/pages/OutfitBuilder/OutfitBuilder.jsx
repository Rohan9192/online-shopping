import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products } from '../../data/products';
import { getProductImage } from '../../utils/productImages';
import { useCart } from '../../context/CartContext';
import { useCollection } from '../../context/CollectionContext';
import './OutfitBuilder.css';

export default function OutfitBuilder() {
  const { collection } = useCollection();
  const { addToCart, isCartOpen, openCart } = useCart();
  const location = useLocation();

  // Selected products for each category
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  
  // Selected variants (size and color) for the chosen products
  const [variants, setVariants] = useState({
    top: { size: null, color: null },
    bottom: { size: null, color: null }
  });

  // Category view state (mobile UI)
  const [activeTab, setActiveTab] = useState('top'); // 'top' or 'bottom'

  // Pre-filter products based on gender collection
  const availableTops = useMemo(() => 
    products.filter(p => p.category === 'tshirts' && p.gender === collection),
  [collection]);

  const availableBottoms = useMemo(() => 
    products.filter(p => p.category === 'jeans' && p.gender === collection),
  [collection]);

  // Filter bottoms based on top vibe
  const matchingBottoms = useMemo(() => {
    if (!selectedTop || !selectedTop.vibes) return availableBottoms;
    
    // Suggest bottoms that share at least one vibe with the top
    const topVibes = selectedTop.vibes;
    const sorted = [...availableBottoms].sort((a, b) => {
      const aMatches = a.vibes?.some(v => topVibes.includes(v)) ? 1 : 0;
      const bMatches = b.vibes?.some(v => topVibes.includes(v)) ? 1 : 0;
      return bMatches - aMatches;
    });
    return sorted;
  }, [selectedTop, availableBottoms]);

  // Auto-select first variant when a product is chosen
  useEffect(() => {
    if (selectedTop) {
      setVariants(prev => ({
        ...prev,
        top: {
          size: prev.top.size || selectedTop.sizes[0],
          color: prev.top.color || (selectedTop.colors[0] ? selectedTop.colors[0].name : 'Default')
        }
      }));
    }
  }, [selectedTop]);

  useEffect(() => {
    if (selectedBottom) {
      setVariants(prev => ({
        ...prev,
        bottom: {
          size: prev.bottom.size || selectedBottom.sizes[0],
          color: prev.bottom.color || (selectedBottom.colors[0] ? selectedBottom.colors[0].name : 'Default')
        }
      }));
    }
  }, [selectedBottom]);

  // Clear selections if collection changes (Men -> Women)
  useEffect(() => {
    setSelectedTop(null);
    setSelectedBottom(null);
    setVariants({
      top: { size: null, color: null },
      bottom: { size: null, color: null }
    });
  }, [collection]);

  const handleSelectProduct = (type, product) => {
    if (type === 'top') {
      setSelectedTop(product);
      setVariants(prev => ({ ...prev, top: { size: null, color: null } }));
    } else {
      setSelectedBottom(product);
      setVariants(prev => ({ ...prev, bottom: { size: null, color: null } }));
    }
  };

  const handleVariantChange = (type, field, value) => {
    setVariants(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleRemove = (type) => {
    if (type === 'top') setSelectedTop(null);
    if (type === 'bottom') setSelectedBottom(null);
  };

  const totalPrice = (selectedTop ? selectedTop.price : 0) + (selectedBottom ? selectedBottom.price : 0);
  const originalTotalPrice = (selectedTop ? selectedTop.originalPrice : 0) + (selectedBottom ? selectedBottom.originalPrice : 0);

  const canAddToCart = selectedTop && selectedBottom && 
                       variants.top.size && variants.top.color && 
                       variants.bottom.size && variants.bottom.color;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    
    // Add top
    addToCart(selectedTop, variants.top.size, variants.top.color, 1);
    // Add bottom
    addToCart(selectedBottom, variants.bottom.size, variants.bottom.color, 1);
    
    openCart();
  };

  return (
    <div className="outfit-builder page-enter">
      <div className="container">
        <div className="outfit-builder__header text-center">
          <h1 className="section-title justify-center">MIX & MATCH</h1>
          <p className="section-subtitle">Build your perfect look. Select a top and matching bottom.</p>
        </div>

        <div className="outfit-builder__layout">
          {/* Left Column: Visual Preview */}
          <div className="outfit-builder__preview-pane">
            <div className="outfit-preview">
              <div className="outfit-preview__slot outfit-preview__top">
                {selectedTop ? (
                  <>
                    <img src={getProductImage(selectedTop)} alt={selectedTop.name} className="outfit-preview__img" />
                    <button className="outfit-preview__remove" onClick={() => handleRemove('top')} aria-label="Remove top">✕</button>
                  </>
                ) : (
                  <div className="outfit-preview__empty" onClick={() => setActiveTab('top')}>
                    <span className="outfit-preview__plus">+</span>
                    <span>Select Top</span>
                  </div>
                )}
              </div>
              <div className="outfit-preview__slot outfit-preview__bottom">
                {selectedBottom ? (
                  <>
                    <img src={getProductImage(selectedBottom)} alt={selectedBottom.name} className="outfit-preview__img" />
                    <button className="outfit-preview__remove" onClick={() => handleRemove('bottom')} aria-label="Remove bottom">✕</button>
                  </>
                ) : (
                  <div className="outfit-preview__empty" onClick={() => setActiveTab('bottom')}>
                    <span className="outfit-preview__plus">+</span>
                    <span>Select Bottom</span>
                  </div>
                )}
              </div>
            </div>

            <div className="outfit-builder__summary">
              <div className="outfit-builder__summary-row">
                <span>Outfit Total:</span>
                <div className="outfit-builder__summary-price">
                  <span className="outfit-builder__current-price">₹{totalPrice.toLocaleString('en-IN')}</span>
                  {originalTotalPrice > totalPrice && (
                    <span className="outfit-builder__original-price">₹{originalTotalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
              <button 
                className={`btn btn-lg btn-full ${canAddToCart ? 'btn-primary' : 'btn-disabled'}`}
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                {canAddToCart ? 'Add Outfit to Cart' : 'Select items & sizes to continue'}
              </button>
            </div>
          </div>

          {/* Right Column: Selection Pane */}
          <div className="outfit-builder__selection-pane">
            <div className="outfit-tabs">
              <button 
                className={`outfit-tab ${activeTab === 'top' ? 'active' : ''}`}
                onClick={() => setActiveTab('top')}
              >
                1. TOPS {selectedTop ? '✓' : ''}
              </button>
              <button 
                className={`outfit-tab ${activeTab === 'bottom' ? 'active' : ''}`}
                onClick={() => setActiveTab('bottom')}
              >
                2. BOTTOMS {selectedBottom ? '✓' : ''}
              </button>
            </div>

            <div className="outfit-selection-content">
              {activeTab === 'top' && (
                <>
                  {selectedTop ? (
                    <div className="outfit-selected-item">
                      <div className="outfit-selected-item__header">
                        <img src={getProductImage(selectedTop)} alt={selectedTop.name} />
                        <div>
                          <h3 className="outfit-selected-item__name">{selectedTop.name}</h3>
                          <div className="outfit-selected-item__price">₹{selectedTop.price.toLocaleString('en-IN')}</div>
                        </div>
                        <button className="btn btn-sm btn-outline ml-auto" onClick={() => handleRemove('top')}>Change</button>
                      </div>
                      
                      <div className="outfit-variants">
                        <div className="outfit-variant-group">
                          <label>Size</label>
                          <div className="outfit-variant-options">
                            {selectedTop.sizes.map(size => (
                              <button 
                                key={size}
                                className={`outfit-size-btn ${variants.top.size === size ? 'active' : ''}`}
                                onClick={() => handleVariantChange('top', 'size', size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {selectedTop.colors && selectedTop.colors.length > 0 && (
                          <div className="outfit-variant-group">
                            <label>Color</label>
                            <div className="outfit-variant-options">
                              {selectedTop.colors.map(color => (
                                <button 
                                  key={color.name}
                                  className={`outfit-color-btn ${variants.top.color === color.name ? 'active' : ''}`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                  onClick={() => handleVariantChange('top', 'color', color.name)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="outfit-grid">
                      {availableTops.map(product => (
                        <div 
                          key={product.id} 
                          className="outfit-grid-item"
                          onClick={() => handleSelectProduct('top', product)}
                        >
                          <img src={getProductImage(product)} alt={product.name} />
                          <div className="outfit-grid-item__info">
                            <h4>{product.name}</h4>
                            <span>₹{product.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'bottom' && (
                <>
                  {selectedBottom ? (
                    <div className="outfit-selected-item">
                      <div className="outfit-selected-item__header">
                        <img src={getProductImage(selectedBottom)} alt={selectedBottom.name} />
                        <div>
                          <h3 className="outfit-selected-item__name">{selectedBottom.name}</h3>
                          <div className="outfit-selected-item__price">₹{selectedBottom.price.toLocaleString('en-IN')}</div>
                        </div>
                        <button className="btn btn-sm btn-outline ml-auto" onClick={() => handleRemove('bottom')}>Change</button>
                      </div>
                      
                      <div className="outfit-variants">
                        <div className="outfit-variant-group">
                          <label>Size</label>
                          <div className="outfit-variant-options">
                            {selectedBottom.sizes.map(size => (
                              <button 
                                key={size}
                                className={`outfit-size-btn ${variants.bottom.size === size ? 'active' : ''}`}
                                onClick={() => handleVariantChange('bottom', 'size', size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {selectedBottom.colors && selectedBottom.colors.length > 0 && (
                          <div className="outfit-variant-group">
                            <label>Color</label>
                            <div className="outfit-variant-options">
                              {selectedBottom.colors.map(color => (
                                <button 
                                  key={color.name}
                                  className={`outfit-color-btn ${variants.bottom.color === color.name ? 'active' : ''}`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                  onClick={() => handleVariantChange('bottom', 'color', color.name)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {selectedTop && (
                        <div className="outfit-hint">
                          ✨ Showing bottoms that match your top's vibe
                        </div>
                      )}
                      <div className="outfit-grid">
                        {matchingBottoms.map(product => (
                          <div 
                            key={product.id} 
                            className="outfit-grid-item"
                            onClick={() => handleSelectProduct('bottom', product)}
                          >
                            <img src={getProductImage(product)} alt={product.name} />
                            <div className="outfit-grid-item__info">
                              <h4>{product.name}</h4>
                              <span>₹{product.price}</span>
                            </div>
                            {selectedTop && product.vibes?.some(v => selectedTop.vibes.includes(v)) && (
                              <div className="outfit-match-badge">Match</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
