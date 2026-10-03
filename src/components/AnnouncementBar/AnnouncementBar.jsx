import { useCart } from '../../context/CartContext';
import './AnnouncementBar.css';

export default function AnnouncementBar() {
  const { tshirtProgress, jeansProgress, totalItems } = useCart();

  // Determine what message to show
  let activeMessage = "🔥 3 T-SHIRTS FOR ₹500 • ₹1700 FOR 3 JEANS 🔥";
  let type = "default"; // default, warning (near unlock), success (unlocked)

  // Prioritize showing progress over default message
  if (totalItems > 0) {
    if (tshirtProgress && tshirtProgress.type === 'success') {
      activeMessage = tshirtProgress.message;
      type = 'success';
    } else if (jeansProgress && jeansProgress.type === 'success') {
      activeMessage = jeansProgress.message;
      type = 'success';
    } else if (tshirtProgress && (tshirtProgress.type === 'hot' || tshirtProgress.type === 'info' || tshirtProgress.type === 'progress')) {
      activeMessage = tshirtProgress.message;
      type = tshirtProgress.type === 'hot' ? 'warning' : 'default';
    } else if (jeansProgress && (jeansProgress.type === 'hot' || jeansProgress.type === 'info' || jeansProgress.type === 'progress')) {
      activeMessage = jeansProgress.message;
      type = jeansProgress.type === 'hot' ? 'warning' : 'default';
    }
  }

  return (
    <div className={`announcement-bar announcement-bar--${type}`}>
      <div className="announcement-bar__content container">
        {type === 'default' ? (
          <p>🔥 3 T-SHIRTS FOR ₹500 • ₹1700 FOR 3 JEANS 🔥 — <a href="/offers" style={{color: 'var(--color-accent)', textDecoration: 'underline'}}>Shop Now</a></p>
        ) : (
          <p>{activeMessage}</p>
        )}
      </div>
    </div>
  );
}
