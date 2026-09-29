import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/productImages';
import { getProductById } from '../../data/products';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    items, totalItems, subtotal, discount, total,
    tshirtPromo, jeansPromo, tshirtProgress, jeansProgress,
    isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart,
  } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your Cart
            {totalItems > 0 && <span className="cart-drawer__count">({totalItems})</span>}
          </h2>
          <button
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
            id="close-cart-drawer"
          >
            ✕
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="cart-drawer__empty-title">Your cart is empty</p>
            <p className="cart-drawer__empty-subtitle">Looks like you haven't added any items yet.</p>
            <Link to="/category/tshirts" className="btn btn-primary" onClick={closeCart}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Offer Progress Banners */}
            <div className="cart-drawer__promos">
              {tshirtProgress && (
                <div className={`cart-promo-banner cart-promo-banner--${tshirtProgress.type}`} id="tshirt-offer-progress">
                  <span className="cart-promo-banner__text">{tshirtProgress.message}</span>
                  {tshirtPromo.count > 0 && tshirtPromo.remaining > 0 && (
                    <div className="cart-promo-banner__bar">
                      <div
                        className="cart-promo-banner__fill"
                        style={{ width: `${((tshirtPromo.count % 3) / 3) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
              {jeansProgress && (
                <div className={`cart-promo-banner cart-promo-banner--${jeansProgress.type}`} id="jeans-offer-progress">
                  <span className="cart-promo-banner__text">{jeansProgress.message}</span>
                  {jeansPromo.count > 0 && jeansPromo.remaining > 0 && (
                    <div className="cart-promo-banner__bar">
                      <div
                        className="cart-promo-banner__fill"
                        style={{ width: `${((jeansPromo.count % 3) / 3) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="cart-drawer__items">
              {items.map(item => {
                const product = getProductById(item.id);
                const img = product ? getProductImage(product) : '';
                return (
                  <div className="cart-item" key={item.key} id={`cart-item-${item.key}`}>
                    <div className="cart-item__image">
                      <img src={img} alt={item.name} />
                    </div>
                    <div className="cart-item__details">
                      <h4 className="cart-item__name">{item.name}</h4>
                      <div className="cart-item__meta">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>
                      <div className="cart-item__price">₹{item.price}</div>
                      <div className="cart-item__actions">
                        <div className="cart-item__quantity">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="qty-btn"
                          >−</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="qty-btn"
                          >+</button>
                        </div>
                        <button
                          className="cart-item__remove"
                          onClick={() => removeFromCart(item.key)}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="cart-drawer__summary">
              <button className="cart-drawer__clear" onClick={clearCart}>
                Clear Cart
              </button>
              <div className="cart-drawer__totals">
                <div className="cart-drawer__row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-drawer__row cart-drawer__row--discount">
                    <span>Promo Discount</span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="cart-drawer__row cart-drawer__row--total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {discount > 0 && (
                <div className="cart-drawer__savings" id="cart-drawer-savings">
                  🎉 You save ₹{discount.toLocaleString('en-IN')}!
                </div>
              )}
              <Link
                to="/cart"
                className="btn btn-secondary btn-full"
                onClick={closeCart}
                id="view-full-cart"
              >
                View Full Cart
              </Link>
              <Link
                to="/checkout"
                className="btn btn-primary btn-full"
                onClick={closeCart}
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
