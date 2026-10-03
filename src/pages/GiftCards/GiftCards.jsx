import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../data/products';
import './GiftCards.css';

export default function GiftCards() {
  const [amount, setAmount] = useState(1000);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const giftCardProduct = getProductById('gift-card');

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!giftCardProduct) return;
    
    // Create a modified copy of the product with the selected price
    const customGiftCard = {
      ...giftCardProduct,
      price: amount,
      name: `StyleHub E-Gift Card (₹${amount})`,
      cartItemId: `gift-card-${amount}-${Date.now()}`
    };
    
    addToCart(customGiftCard, `₹${amount}`, 'Digital');
    navigate('/cart');
  };

  return (
    <div className="gift-cards-page container page-enter">
      <div className="gift-cards-layout">
        <div className="gift-cards-image">
          <div className="gift-card-preview">
            <h2>StyleHub</h2>
            <p>E-GIFT CARD</p>
            <div className="gift-card-value">₹{amount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="gift-cards-form">
          <h1>Give the Gift of Style</h1>
          <p className="gift-cards-desc">Perfect for any occasion. Delivered instantly via email with your personal message.</p>
          
          <div className="form-section">
            <h3>Select Amount</h3>
            <div className="amount-grid">
              {[500, 1000, 2000, 5000].map(val => (
                <button 
                  key={val}
                  className={`amount-btn ${amount === val ? 'active' : ''}`}
                  onClick={() => setAmount(val)}
                >
                  ₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddToCart}>
            <div className="form-group">
              <label>Recipient's Email</label>
              <input 
                type="email" 
                required 
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Personal Message (Optional)</label>
              <textarea 
                rows="3" 
                placeholder="Happy Birthday! Buy yourself something nice."
                value={message}
                onChange={e => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full">
              Add to Cart — ₹{amount.toLocaleString('en-IN')}
            </button>
          </form>

          <div className="gift-cards-notes">
            <p><strong>Note:</strong> Gift cards are delivered digitally. The backend ledger integration is pending for automated redemption. Currently, gift cards process through standard checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
