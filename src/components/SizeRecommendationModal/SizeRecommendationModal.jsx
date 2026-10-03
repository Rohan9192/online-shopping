import React, { useState, useEffect } from 'react';
import './SizeRecommendationModal.css';

export default function SizeRecommendationModal({ isOpen, onClose, product, onApplySize }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [fitPref, setFitPref] = useState('regular');
  
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  // Reset state when opened for a new product
  useEffect(() => {
    if (isOpen) {
      setRecommendation(null);
      setError('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const isTop = product.category === 'tshirts' || product.category === 'shirts';
  const isBottom = product.category === 'jeans' || product.category === 'pants';

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!height || height < 100 || height > 250) {
      setError('Please enter a valid height (100-250 cm).');
      return;
    }
    
    if (!weight || weight < 30 || weight > 200) {
      setError('Please enter a valid weight (30-200 kg).');
      return;
    }

    if (isTop && (!chest || chest < 60 || chest > 150)) {
      setError('Please enter a valid chest measurement (60-150 cm).');
      return;
    }

    if (isBottom && (!waist || waist < 50 || waist > 140)) {
      setError('Please enter a valid waist measurement (50-140 cm).');
      return;
    }

    // Deterministic sizing logic based on charts
    let suggestedSize = '';
    
    if (isTop) {
      // Simplified deterministic logic for tops based on chest size
      if (chest < 86) suggestedSize = 'S';
      else if (chest < 96) suggestedSize = 'M';
      else if (chest < 106) suggestedSize = 'L';
      else if (chest < 116) suggestedSize = 'XL';
      else suggestedSize = 'XXL';
      
      // Adjust for height/weight
      if (height > 185 && suggestedSize === 'S') suggestedSize = 'M';
      if (weight > 90 && suggestedSize === 'M') suggestedSize = 'L';
      
    } else if (isBottom) {
      // Logic for bottoms based on waist size (in cm, roughly converted to inches for jeans size or standard sizes)
      if (waist < 76) suggestedSize = '28';
      else if (waist < 81) suggestedSize = '30';
      else if (waist < 86) suggestedSize = '32';
      else if (waist < 91) suggestedSize = '34';
      else if (waist < 96) suggestedSize = '36';
      else suggestedSize = '38';
      
      // Map numeric to S/M/L if the product uses alpha sizing
      const alphaSizes = ['S', 'M', 'L', 'XL', 'XXL'];
      if (product.sizes.some(s => alphaSizes.includes(s))) {
        if (waist < 76) suggestedSize = 'S';
        else if (waist < 84) suggestedSize = 'M';
        else if (waist < 92) suggestedSize = 'L';
        else if (waist < 100) suggestedSize = 'XL';
        else suggestedSize = 'XXL';
      }
    }

    // Adjust based on fit preference (if not already at extremes)
    const sizesArr = product.sizes;
    let currentIndex = sizesArr.indexOf(suggestedSize);
    
    if (currentIndex !== -1) {
      if (fitPref === 'slim' && currentIndex > 0) {
        suggestedSize = sizesArr[currentIndex - 1];
      } else if (fitPref === 'relaxed' && currentIndex < sizesArr.length - 1) {
        suggestedSize = sizesArr[currentIndex + 1];
      }
    } else {
      // Fallback if calculated size is not in array
      suggestedSize = sizesArr[Math.floor(sizesArr.length / 2)] || 'M';
    }
    
    // Check if suggested size is actually available
    const isAvailable = product.sizes.includes(suggestedSize);

    setRecommendation({
      size: suggestedSize,
      isAvailable
    });
  };

  const handleApply = () => {
    if (recommendation && recommendation.isAvailable) {
      onApplySize(recommendation.size);
      onClose();
    }
  };

  return (
    <div className="size-modal-overlay">
      <div className="size-modal">
        <button className="size-modal__close" onClick={onClose} aria-label="Close modal">✕</button>
        
        <div className="size-modal__header">
          <h3>Find Your Perfect Size</h3>
          <p>Enter your measurements to get a personalized size recommendation for this item.</p>
        </div>

        {!recommendation ? (
          <form className="size-modal__form" onSubmit={handleCalculate}>
            <div className="size-modal__row">
              <div className="size-modal__group">
                <label>Height (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  placeholder="e.g. 175"
                  required
                />
              </div>
              <div className="size-modal__group">
                <label>Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  placeholder="e.g. 70"
                  required
                />
              </div>
            </div>

            {isTop && (
              <div className="size-modal__group">
                <label>Chest Measurement (cm)</label>
                <input 
                  type="number" 
                  value={chest} 
                  onChange={(e) => setChest(e.target.value)} 
                  placeholder="e.g. 96"
                  required
                />
              </div>
            )}

            {isBottom && (
              <div className="size-modal__group">
                <label>Waist Measurement (cm)</label>
                <input 
                  type="number" 
                  value={waist} 
                  onChange={(e) => setWaist(e.target.value)} 
                  placeholder="e.g. 82"
                  required
                />
              </div>
            )}

            <div className="size-modal__group">
              <label>Fit Preference</label>
              <div className="size-modal__fit-options">
                <button 
                  type="button" 
                  className={`fit-btn ${fitPref === 'slim' ? 'active' : ''}`}
                  onClick={() => setFitPref('slim')}
                >
                  Slim
                </button>
                <button 
                  type="button" 
                  className={`fit-btn ${fitPref === 'regular' ? 'active' : ''}`}
                  onClick={() => setFitPref('regular')}
                >
                  Regular
                </button>
                <button 
                  type="button" 
                  className={`fit-btn ${fitPref === 'relaxed' ? 'active' : ''}`}
                  onClick={() => setFitPref('relaxed')}
                >
                  Relaxed
                </button>
              </div>
            </div>

            {error && <div className="size-modal__error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full mt-4">
              Get Recommendation
            </button>
          </form>
        ) : (
          <div className="size-modal__result slide-up">
            <div className="result-icon">✨</div>
            <h4>We recommend Size <span className="highlight-text">{recommendation.size}</span></h4>
            <p>Based on your measurements and this product's size chart, we suggest Size {recommendation.size}. Fit may vary slightly by product.</p>
            
            {!recommendation.isAvailable && (
              <div className="size-modal__unavailable">
                Sorry, Size {recommendation.size} is currently out of stock for this item.
              </div>
            )}

            <div className="size-modal__actions">
              <button 
                className={`btn btn-lg btn-full ${recommendation.isAvailable ? 'btn-primary' : 'btn-disabled'}`}
                onClick={handleApply}
                disabled={!recommendation.isAvailable}
              >
                Use Recommended Size
              </button>
              <button 
                className="btn btn-outline btn-full"
                onClick={() => setRecommendation(null)}
              >
                Recalculate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
