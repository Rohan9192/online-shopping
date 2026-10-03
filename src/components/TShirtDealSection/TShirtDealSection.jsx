import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/productImages';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import './TShirtDealSection.css';

export default function TShirtDealSection({ tshirts }) {
  const { addToCart, openCart } = useCart();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  
  // Array of { product, size, color }
  const [selectedPack, setSelectedPack] = useState([]);
  
  // State for variant selection modal
  const [variantModalItem, setVariantModalItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // State for sharing
  const [shareLink, setShareLink] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);
  const [shareError, setShareError] = useState('');

  // Handle incoming shared bundle from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const bundleParam = searchParams.get('bundle');
    
    if (bundleParam) {
      try {
        const items = bundleParam.split(',');
        const parsedPack = items.map(itemStr => {
          const [id, size, color] = itemStr.split(':');
          const product = products.find(p => p.id === id);
          if (!product || product.category !== 'tshirts') return null; // Only tshirts
          
          // Validate variants
          const validSize = product.sizes.includes(size) ? size : product.sizes[0];
          let validColor = 'Default';
          if (product.colors && product.colors.length > 0) {
             validColor = product.colors.find(c => c.name === color)?.name || product.colors[0].name;
          }
          
          return { product, size: validSize, color: validColor };
        }).filter(Boolean);

        if (parsedPack.length > 0) {
          setSelectedPack(parsedPack.slice(0, 3));
          setIsBuilderOpen(true);
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        console.error("Failed to parse shared bundle", err);
      }
    }
  }, []);

  // Featured 3 t-shirts for the collapsed view
  const featured = tshirts.slice(0, 3);
  const displayItems = isBuilderOpen ? tshirts : featured;

  const handleSelectClick = (product) => {
    if (!isBuilderOpen) setIsBuilderOpen(true);
    if (selectedPack.length >= 3) return;
    
    // Open variant selector
    setVariantModalItem(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default');
  };

  const confirmSelection = () => {
    if (variantModalItem && selectedPack.length < 3) {
      setSelectedPack([
        ...selectedPack, 
        { product: variantModalItem, size: selectedSize, color: selectedColor }
      ]);
    }
    setVariantModalItem(null);
  };

  const handleRemove = (indexToRemove) => {
    setSelectedPack(selectedPack.filter((_, i) => i !== indexToRemove));
    setShareLink('');
  };

  const handleAddToCart = () => {
    if (selectedPack.length === 3) {
      // Add each item to cart
      selectedPack.forEach(item => {
        addToCart(item.product, item.size, item.color, 1);
      });
      // Reset pack
      setSelectedPack([]);
      setIsBuilderOpen(false);
      openCart();
    }
  };

  const generateShareLink = () => {
    if (selectedPack.length !== 3) return;
    try {
      const bundleData = selectedPack.map(item => 
        `${item.product.id}:${item.size}:${item.color}`
      ).join(',');
      
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('bundle', bundleData);
      
      const link = url.toString();
      
      if (navigator.share) {
        navigator.share({
          title: 'My StyleHub ₹500 T-Shirt Bundle',
          text: 'Check out the 3 T-Shirts I picked for just ₹500!',
          url: link
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(link);
        setShareLink(link);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      }
    } catch (err) {
      setShareError('Failed to generate link.');
    }
  };

  return (
    <section className="tshirt-deal-section container" id="tshirt-deal-section">
      <div className="tshirt-deal__header">
        <h2 className="tshirt-deal__title">🔥 THE ₹500 T-SHIRT DEAL</h2>
        <p className="tshirt-deal__subtitle">Pick ANY 3 T-Shirts for just ₹500</p>
      </div>

      <div className="product-grid">
        {displayItems.map(product => (
          <div key={product.id} className="tshirt-deal__card-wrapper">
            <ProductCard product={product} />
            <div className="tshirt-deal__select-overlay">
              <button 
                className="btn btn-secondary btn-sm tshirt-deal__select-btn"
                onClick={() => handleSelectClick(product)}
                disabled={selectedPack.length >= 3 && isBuilderOpen}
              >
                {selectedPack.length >= 3 && isBuilderOpen ? 'Pack Full' : 'Select for Pack +'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isBuilderOpen ? (
        <div className="tshirt-deal__footer">
          <button className="btn btn-primary btn-lg" onClick={() => setIsBuilderOpen(true)}>
            BUILD YOUR 3-PACK <span className="arrow">→</span>
          </button>
        </div>
      ) : (
        <div className="tshirt-deal__progress-bar slide-up">
          <div className="tshirt-deal__progress-inner container">
            <div className="tshirt-deal__progress-status">
              <div className="tshirt-deal__slots">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i} 
                    className={`tshirt-deal__slot ${selectedPack[i] ? 'filled' : ''}`}
                    onClick={() => selectedPack[i] && handleRemove(i)}
                  >
                    {selectedPack[i] ? (
                      <>
                        <img src={getProductImage(selectedPack[i].product)} alt="Selected" className="tshirt-deal__slot-img" />
                        <div className="tshirt-deal__slot-variant-badge">
                          {selectedPack[i].size}
                        </div>
                      </>
                    ) : (
                      <span className="tshirt-deal__slot-empty">+</span>
                    )}
                    {selectedPack[i] && <div className="tshirt-deal__slot-remove">×</div>}
                  </div>
                ))}
              </div>
              <div className="tshirt-deal__status-text">
                {selectedPack.length < 3 ? (
                  <h3>{selectedPack.length} / 3 SELECTED</h3>
                ) : (
                  <h3>3 / 3 SELECTED ✓</h3>
                )}
                {selectedPack.length === 3 && <p className="tshirt-deal__price-calc">YOUR 3-T-SHIRT PACK = ₹500</p>}
              </div>
            </div>
            
            <div className="tshirt-deal__actions">
              {selectedPack.length === 3 && (
                <div className="tshirt-deal__share-wrapper">
                  <button 
                    className="btn btn-outline"
                    onClick={generateShareLink}
                  >
                    Share Bundle
                  </button>
                  {showShareToast && <span className="tshirt-deal__share-toast">Link Copied!</span>}
                  {shareError && <span className="tshirt-deal__share-error">{shareError}</span>}
                </div>
              )}
              
              <button 
                className={`btn btn-lg ${selectedPack.length === 3 ? 'btn-primary' : 'btn-disabled'}`}
                disabled={selectedPack.length < 3}
                onClick={handleAddToCart}
              >
                ADD 3 T-SHIRTS TO CART
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variant Selection Modal for Builder */}
      {variantModalItem && (
        <div className="deal-variant-modal-overlay">
          <div className="deal-variant-modal slide-up">
            <button className="deal-variant-modal__close" onClick={() => setVariantModalItem(null)}>✕</button>
            <div className="deal-variant-modal__content">
              <img src={getProductImage(variantModalItem)} alt={variantModalItem.name} />
              <div>
                <h3>{variantModalItem.name}</h3>
                
                <div className="deal-variant-modal__group">
                  <label>Size:</label>
                  <div className="deal-variant-modal__options">
                    {variantModalItem.sizes.map(s => (
                      <button 
                        key={s} 
                        className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {variantModalItem.colors && variantModalItem.colors.length > 0 && (
                  <div className="deal-variant-modal__group">
                    <label>Color:</label>
                    <div className="deal-variant-modal__options">
                      {variantModalItem.colors.map(c => (
                        <button 
                          key={c.name}
                          className={`color-btn ${selectedColor === c.name ? 'active' : ''}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          onClick={() => setSelectedColor(c.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <button className="btn btn-primary btn-full mt-4" onClick={confirmSelection}>
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
