import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../data/products';
import { getProductImage } from '../../utils/productImages';
import './Cart.css';

export default function Cart() {
  const {
    items, totalItems, subtotal, discount, total,
    tshirtPromo, jeansPromo, tshirtProgress, jeansProgress,
    removeFromCart, updateQuantity, clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="container">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <div className="cart-empty" id="cart-empty-state">
            <div className="cart-empty__icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Discover our amazing collection and find something you love.</p>
            <div className="cart-empty__actions">
              <Link to="/category/tshirts" className="btn btn-primary">Shop T-Shirts</Link>
              <Link to="/category/jeans" className="btn btn-secondary">Shop Jeans</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter" id="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <span className="cart-page__count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </div>

        {/* Offer Progress Banners */}
        <div className="cart-page__promos">
          {tshirtProgress && (
            <div className={`cart-page-promo cart-page-promo--${tshirtProgress.type}`} id="cart-tshirt-progress">
              <span>{tshirtProgress.message}</span>
              {tshirtPromo.count > 0 && tshirtPromo.remaining > 0 && (
                <div className="cart-page-promo__bar">
                  <div
                    className="cart-page-promo__fill"
                    style={{ width: `${((tshirtPromo.count % 3) / 3) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}
          {jeansProgress && (
            <div className={`cart-page-promo cart-page-promo--${jeansProgress.type}`} id="cart-jeans-progress">
              <span>{jeansProgress.message}</span>
              {jeansPromo.count > 0 && jeansPromo.remaining > 0 && (
                <div className="cart-page-promo__bar">
                  <div
                    className="cart-page-promo__fill"
                    style={{ width: `${((jeansPromo.count % 3) / 3) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {/* Table Header */}
            <div className="cart-table-header">
              <span className="cart-col-product">Product</span>
              <span className="cart-col-price">Price</span>
              <span className="cart-col-qty">Quantity</span>
              <span className="cart-col-total">Total</span>
              <span className="cart-col-action"></span>
            </div>

            {items.map(item => {
              const product = getProductById(item.id);
              const img = product ? getProductImage(product) : '';
              return (
                <div className="cart-row" key={item.key} id={`cart-row-${item.key}`}>
                  <div className="cart-col-product">
                    <div className="cart-row__image">
                      <img src={img} alt={item.name} />
                    </div>
                    <div className="cart-row__info">
                      <Link to={`/product/${item.id}`} className="cart-row__name">{item.name}</Link>
                      <div className="cart-row__meta">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="cart-col-price">₹{item.price}</div>
                  <div className="cart-col-qty">
                    <div className="cart-row__quantity">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-col-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  <div className="cart-col-action">
                    <button
                      className="cart-row__remove"
                      onClick={() => removeFromCart(item.key)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="cart-items__footer">
              <button className="cart-clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/" className="cart-continue-btn">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary" id="cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>

            {/* Per-category breakdown */}
            {tshirtPromo.count > 0 && (
              <div className="cart-summary__breakdown" id="tshirt-breakdown">
                <h4 className="cart-summary__breakdown-title">T-Shirts ({tshirtPromo.count})</h4>
                <div className="cart-summary__row">
                  <span>Normal price</span>
                  <span>₹{tshirtPromo.normalTotal.toLocaleString('en-IN')}</span>
                </div>
                {tshirtPromo.groups > 0 && (
                  <>
                    <div className="cart-summary__row">
                      <span>{tshirtPromo.groups}× promo (3 for ₹500)</span>
                      <span>₹{(tshirtPromo.groups * 500).toLocaleString('en-IN')}</span>
                    </div>
                    {tshirtPromo.remaining > 0 && (
                      <div className="cart-summary__row">
                        <span>{tshirtPromo.remaining} at regular price</span>
                        <span>₹{tshirtPromo.remainingTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="cart-summary__row cart-summary__row--savings">
                      <span>You save</span>
                      <span>−₹{tshirtPromo.savings.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {jeansPromo.count > 0 && (
              <div className="cart-summary__breakdown" id="jeans-breakdown">
                <h4 className="cart-summary__breakdown-title">Jeans ({jeansPromo.count})</h4>
                <div className="cart-summary__row">
                  <span>Normal price</span>
                  <span>₹{jeansPromo.normalTotal.toLocaleString('en-IN')}</span>
                </div>
                {jeansPromo.groups > 0 && (
                  <>
                    <div className="cart-summary__row">
                      <span>{jeansPromo.groups}× promo (3 for ₹1,000)</span>
                      <span>₹{(jeansPromo.groups * 1000).toLocaleString('en-IN')}</span>
                    </div>
                    {jeansPromo.remaining > 0 && (
                      <div className="cart-summary__row">
                        <span>{jeansPromo.remaining} at regular price</span>
                        <span>₹{jeansPromo.remainingTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="cart-summary__row cart-summary__row--savings">
                      <span>You save</span>
                      <span>−₹{jeansPromo.savings.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Totals */}
            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span className="cart-summary__free">Free</span>
              </div>
              {discount > 0 && (
                <div className="cart-summary__row cart-summary__row--discount">
                  <span>Promo Discount</span>
                  <span>−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
            <div className="cart-summary__total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="cart-summary__savings-badge" id="total-savings">
                🎉 Total savings: ₹{discount.toLocaleString('en-IN')}
              </div>
            )}

            <Link to="/checkout" className="btn btn-primary btn-lg btn-full">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
