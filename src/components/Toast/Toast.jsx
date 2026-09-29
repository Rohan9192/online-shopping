import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className="toast-container">
      <div className="toast" id="cart-notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <div className="toast-content">
          <div className="toast-title">{typeof notification === 'string' ? notification : notification.title}</div>
          {typeof notification === 'object' && notification.subtitle && (
            <div className="toast-subtitle">{notification.subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}
