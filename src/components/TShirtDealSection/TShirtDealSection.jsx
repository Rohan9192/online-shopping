import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ProductCard/ProductCard';
import './TShirtDealSection.css';

export default function TShirtDealSection({ tshirts }) {
  const { addToCart } = useCart();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState([]);

  // Featured 3 t-shirts for the collapsed view
  const featured = tshirts.slice(0, 3);
  
  // The items to show (either 3 featured or all if builder is open)
  const displayItems = isBuilderOpen ? tshirts : featured;

  const handleSelect = (product) => {
    if (!isBuilderOpen) {
      setIsBuilderOpen(true);
    }
    
    if (selectedPack.length < 3) {
      setSelectedPack([...selectedPack, product]);
    }
  };

  const handleRemove = (indexToRemove) => {
    setSelectedPack(selectedPack.filter((_, i) => i !== indexToRemove));
  };

  const handleAddToCart = () => {
    if (selectedPack.length === 3) {
      // Add each item to cart
      selectedPack.forEach(product => {
        addToCart(product, product.sizes[0], product.colors[0]?.name || 'Default', 1);
      });
      // Reset pack
      setSelectedPack([]);
      setIsBuilderOpen(false);
      
      // The CartContext handles notification, but we can also scroll to top or open cart
      // window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onClick={() => handleSelect(product)}
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
                      <img src={selectedPack[i].images[0]} alt="Selected" className="tshirt-deal__slot-img" />
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
            
            <button 
              className={`btn btn-lg ${selectedPack.length === 3 ? 'btn-primary' : 'btn-disabled'}`}
              disabled={selectedPack.length < 3}
              onClick={handleAddToCart}
            >
              ADD 3 T-SHIRTS TO CART
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
