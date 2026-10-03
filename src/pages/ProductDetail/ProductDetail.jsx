import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { getProductById, getProductsByCategory } from '../../data/products';
import { getProductImage } from '../../utils/productImages';
import ProductCard from '../../components/ProductCard/ProductCard';
import DeliveryChecker from '../../components/DeliveryChecker/DeliveryChecker';
import SizeRecommendationModal from '../../components/SizeRecommendationModal/SizeRecommendationModal';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart, tshirtPromo, jeansPromo, tshirtProgress, jeansProgress } = useCart();
  const { compareItems, addToCompare, removeFromCompare } = useCompare();
  const product = getProductById(id);
  
  const isComparing = product ? compareItems.some(p => p.id === product.id) : false;
  
  const handleCompareToggle = (e) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="product-detail container page-enter">
        <div className="product-not-found">
          <h1>Product not found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const imageSrc = getProductImage(product);
  const related = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id && p.gender === product.gender)
    .sort((a, b) => {
      const aVibeMatch = (a.vibes || []).filter(v => (product.vibes || []).includes(v)).length;
      const bVibeMatch = (b.vibes || []).filter(v => (product.vibes || []).includes(v)).length;
      return bVibeMatch - aVibeMatch;
    })
    .slice(0, 4);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const promoText = product.category === 'tshirts'
    ? '🔥 BUY ANY 3 T-SHIRTS FOR ₹500'
    : '🔥 ₹1700 FOR 3 JEANS';
    
  const isTshirt = product.category === 'tshirts';
  const promoState = isTshirt ? tshirtPromo : jeansPromo;
  const progressMsg = isTshirt ? tshirtProgress : jeansProgress;

  const validateSelection = () => {
    let isValid = true;
    if (!selectedSize) {
      setSizeError(true);
      isValid = false;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      setColorError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    setSizeError(false);
    setColorError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    setSizeError(false);
    setColorError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/cart');
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
    <div className="product-detail page-enter" id={`product-detail-${product.id}`}>
      {/* Breadcrumb */}
      <div className="container">
        <nav className="breadcrumb" id="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`}>
            {product.category === 'tshirts' ? 'T-Shirts' : 'Jeans'}
          </Link>
          <span>/</span>
          <span className="breadcrumb__current">{product.name}</span>
        </nav>
      </div>

      {/* Promo Strip */}
      <div className="pdp-promo" id="pdp-promo">
        <div className="container">
          <span>{promoText}</span>
        </div>
      </div>

      {progressMsg && (
        <div className="container">
          <div className={`pdp-progress pdp-progress--${progressMsg.type}`}>
            {progressMsg.type !== 'success' && (
              <div className="pdp-progress__status">
                {progressMsg.remaining} of 3 selected
              </div>
            )}
            <div className="pdp-progress__text">{progressMsg.message}</div>
            {progressMsg.type !== 'success' && progressMsg.count > 0 && (
              <div className="pdp-progress__bar">
                <div 
                  className="pdp-progress__fill" 
                  style={{ width: `${(progressMsg.remaining / 3) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container">
        <div className="pdp-layout">
          {/* Image Gallery */}
          <div className="pdp-gallery" id="pdp-gallery">
            <div className="pdp-gallery__main">
              <img src={imageSrc} alt={product.name} className="pdp-gallery__image" />
              {product.badge && (
                <span className="pdp-gallery__badge">{product.badge}</span>
              )}
            </div>
            {/* Thumbnail strip */}
            <div className="pdp-gallery__thumbs">
              {[0, 1, 2].map(i => (
                <div key={i} className={`pdp-gallery__thumb ${i === 0 ? 'active' : ''}`}>
                  <img src={imageSrc} alt={`${product.name} view ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="pdp-info" id="pdp-info">
            <p className="pdp-info__category">
              {product.category === 'tshirts' ? 'T-Shirt' : 'Jeans'}
            </p>
            <h1 className="pdp-info__name">{product.name}</h1>

            {/* Rating */}
            <div className="pdp-info__rating">
              <div className="stars">{renderStars(product.rating)}</div>
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="pdp-info__price">
              <span className="pdp-info__current">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="pdp-info__original">₹{product.originalPrice}</span>
                  <span className="pdp-info__discount">-{discountPercent}% off</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="pdp-info__desc">{product.description}</p>

            {/* Size */}
            <div className="pdp-info__section">
              <div className="pdp-info__label-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="pdp-info__label" style={{ marginBottom: 0 }}>
                  Size {sizeError && <span className="pdp-info__error">— Please select a size</span>}
                </label>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={() => setIsSizeModalOpen(true)}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  ✨ Find My Size
                </button>
              </div>
              <div className="pdp-info__sizes">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''} ${sizeError && !selectedSize ? 'error' : ''}`}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="pdp-info__section">
              <label className="pdp-info__label">
                Color {colorError && <span className="pdp-info__error">— Please select a color</span>}
                {!colorError && selectedColor && `: ${selectedColor}`}
              </label>
              <div className="pdp-info__colors">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    className={`color-btn ${selectedColor === color.name ? 'active' : ''} ${colorError && !selectedColor ? 'error' : ''}`}
                    style={{ background: color.hex }}
                    onClick={() => { setSelectedColor(color.name); setColorError(false); }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pdp-info__section">
              <label className="pdp-info__label">Quantity</label>
              <div className="pdp-info__quantity">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="pdp-info__actions">
              {product.stock === 0 ? (
                <div className="pdp-out-of-stock-alert" style={{ background: 'var(--color-off-white)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '8px' }}>Currently Out of Stock</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      style={{ flex: 1, padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                      id="notify-email"
                    />
                    <button className="btn btn-outline" onClick={() => {
                      const email = document.getElementById('notify-email').value;
                      if(email) {
                        alert('You will be notified when this item is back in stock!');
                      }
                    }}>
                      Notify Me
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-lg btn-full"
                    onClick={handleAddToCart}
                    id={`pdp-add-to-cart-${product.id}`}
                  >
                    Add to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </button>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="btn btn-accent btn-lg"
                      style={{ flex: 1 }}
                      onClick={handleBuyNow}
                      id={`pdp-buy-now-${product.id}`}
                    >
                      Buy Now
                    </button>
                    <button
                      className={`btn btn-outline btn-lg ${isComparing ? 'active' : ''}`}
                      onClick={handleCompareToggle}
                      title={isComparing ? "Remove from Compare" : "Add to Compare"}
                      style={{ minWidth: '60px', padding: 0 }}
                    >
                      {isComparing ? '✓' : '⇄'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Delivery Checker */}
            <DeliveryChecker 
              orderTotal={product.price * quantity}
            />

            {/* Benefits */}
            <div className="pdp-info__benefits">
              <div className="benefit">🚚 Free shipping on orders above ₹999</div>
              <div className="benefit">↩️ 30-day easy returns</div>
              <div className="benefit">✅ 100% authentic products</div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pdp-related" id="related-products">
            <h2 className="section-title text-center">BASED ON YOUR VIBE</h2>
            <p className="text-center section-subtitle" style={{marginBottom: '32px'}}>Perfectly paired essentials matching this style.</p>
            <div className="product-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="text-center" style={{marginTop: '32px'}}>
              <button className="btn btn-secondary btn-lg">BUILD YOUR LOOK &rarr;</button>
            </div>
          </section>
        )}
      </div>
      
      <SizeRecommendationModal 
        isOpen={isSizeModalOpen} 
        onClose={() => setIsSizeModalOpen(false)} 
        product={product}
        onApplySize={(size) => {
          setSelectedSize(size);
          setSizeError(false);
        }}
      />
    </div>
  );
}
