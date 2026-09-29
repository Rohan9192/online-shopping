import { useState } from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { useCollection } from '../../context/CollectionContext';
import './FindMyFit.css';

export default function FindMyFit() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ vibe: '', fit: '', budget: '', color: '' });
  const [results, setResults] = useState([]);
  const { collection } = useCollection();

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Calculate results (Simple rule-based recommendation engine as requested)
      let matches = products.filter(p => p.category === 'tshirts' && p.gender === collection);
      
      if (answers.fit === 'OVERSIZED') matches = matches.filter(p => p.name.toLowerCase().includes('oversized') || p.name.toLowerCase().includes('boxy'));
      if (answers.fit === 'CROPPED') matches = matches.filter(p => p.name.toLowerCase().includes('crop'));
      
      // Ensure we always show some results even if filters are too strict
      if (matches.length === 0) matches = products.filter(p => p.category === 'tshirts' && p.gender === collection).slice(0, 4);
      else matches = matches.slice(0, 4);
      
      setResults(matches);
      setStep(5); // Results step
    }
  };

  const reset = () => {
    setStep(1);
    setAnswers({ vibe: '', fit: '', budget: '', color: '' });
    setResults([]);
  };

  if (!isOpen) {
    return (
      <section className="find-fit-teaser container" id="find-my-fit">
        <div className="find-fit-teaser__content">
          <span className="find-fit-teaser__icon">✨</span>
          <h2 className="find-fit-teaser__title">Not sure what to wear?</h2>
          <p className="find-fit-teaser__desc">Take our 30-second style quiz to find your perfect fit.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setIsOpen(true)}>
            FIND MY FIT &rarr;
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="find-fit-active container" id="find-my-fit">
      <div className="find-fit-active__inner">
        <div className="find-fit-active__header">
          <h2>FIND MY FIT</h2>
          <button className="btn-close" onClick={() => setIsOpen(false)} aria-label="Close">×</button>
        </div>

        <div className="find-fit-active__progress">
          <div className="progress-bar" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>

        <div className="find-fit-active__body">
          {step === 1 && (
            <div className="fit-step slide-in">
              <h3>What's your vibe?</h3>
              <div className="fit-options grid-2">
                {['MINIMAL', 'STREET', 'RETRO', 'ATHLETIC', 'CASUAL'].map(opt => (
                  <button key={opt} className="fit-btn" onClick={() => handleAnswer('vibe', opt)}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fit-step slide-in">
              <h3>What's your preferred fit?</h3>
              <div className="fit-options grid-2">
                {['OVERSIZED', 'BOXY', 'REGULAR', 'RELAXED', 'CROPPED'].map(opt => (
                  <button key={opt} className="fit-btn" onClick={() => handleAnswer('fit', opt)}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fit-step slide-in">
              <h3>What's your budget?</h3>
              <div className="fit-options grid-2">
                {['UNDER ₹699', '₹699–₹999', '₹999–₹1499', '₹1500+'].map(opt => (
                  <button key={opt} className="fit-btn" onClick={() => handleAnswer('budget', opt)}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="fit-step slide-in">
              <h3>Choose a color preference.</h3>
              <div className="fit-options colors">
                {['BLACK', 'WHITE', 'GREY', 'BLUE', 'GREEN', 'BROWN'].map(color => (
                  <button 
                    key={color} 
                    className="fit-color-btn" 
                    style={{ backgroundColor: color === 'WHITE' ? '#f7f7f7' : color.toLowerCase(), border: color === 'WHITE' ? '1px solid #ddd' : 'none' }} 
                    onClick={() => handleAnswer('color', color)}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="fit-step slide-in results-step">
              <div className="results-header">
                <h3>YOUR {collection === 'WOMEN' ? "WOMEN'S" : "MEN'S"} FIT PICKS</h3>
                <p>Based on your vibe: <strong>{answers.vibe}</strong> & <strong>{answers.fit}</strong></p>
              </div>
              <div className="product-grid" style={{ marginTop: '24px' }}>
                {results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div className="results-actions">
                <button className="btn btn-secondary mt-xl" onClick={reset}>START OVER</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
