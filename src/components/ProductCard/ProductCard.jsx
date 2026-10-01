import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/productImages';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const imageSrc = getProductImage(product);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0]?.name || 'Default');
  };

  const handleSaveFit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (!isSaved) {
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= Math.floor(rating) ? 'filled' : i - 0.5 <= rating ? 'half' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-card__link">
        {/* Image */}
        <div className="product-card__image-wrapper">
          {!imageLoaded && <div className="skeleton product-card__skeleton" />}
          <img
            src={imageSrc}
            alt={product.name}
            className={`product-card__image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {/* Badges */}
          <div className="product-card__badges">
            {product.category === 'tshirts' && (
              <span className="product-card__badge product-card__badge--promo">3 FOR ₹500</span>
            )}
            {product.badge && (
              <span className="product-card__badge">{product.badge}</span>
            )}
            {discountPercent > 0 && (
              <span className="product-card__badge product-card__badge--sale">-{discountPercent}%</span>
            )}
            {product.isNew && !product.badge && (
              <span className="product-card__badge product-card__badge--new">New</span>
            )}
          </div>

          {/* Quick Add Overlay */}
          <div className="product-card__overlay">
            <button
              className="btn btn-primary btn-sm product-card__add-btn"
              onClick={handleAddToCart}
              id={`add-to-cart-${product.id}`}
            >
              Add to Cart
            </button>
          </div>

          {/* Save to fits (Wishlist) */}
          <button 
            className={`product-card__save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveFit}
            aria-label="Save to Wishlist"
          >
            {isSaved ? '♥' : '♡'}
          </button>
          
          {showSavedFeedback && (
            <div className="product-card__save-feedback slide-up-fade">
              Saved to your fits
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-card__info">
          <p className="product-card__category">
            {product.category === 'tshirts' ? 'T-Shirt' : 'Jeans'}
          </p>
          <h3 className="product-card__name">{product.name}</h3>

          {/* Rating */}
          <div className="product-card__rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-count">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="product-card__price">
            <span className="product-card__current-price">₹{product.price}</span>
            {product.originalPrice && (
              <span className="product-card__original-price">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Colors */}
          <div className="product-card__colors">
            {product.colors.map(color => (
              <span
                key={color.name}
                className="product-card__color-dot"
                style={{ background: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
