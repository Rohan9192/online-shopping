import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Order not found');
          throw new Error('Failed to load order details');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-confirmation page-enter container">
        <div className="order-loading">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation page-enter container">
        <div className="order-card error-card">
          <h2>Order Not Found</h2>
          <p>{error || 'The requested order does not exist or you do not have permission to view it.'}</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  const isSuccess = order.paymentStatus === 'SUCCESS';
  const isFailed = order.paymentStatus === 'FAILED';
  const isPending = order.paymentStatus === 'PENDING';

  return (
    <div className="order-confirmation page-enter container">
      <div className={`order-card ${isSuccess ? 'success' : isFailed ? 'failed' : 'pending'}`}>
        
        {/* SUCCESS STATE */}
        {isSuccess && (
          <div className="order-header success-header">
            <div className="icon-circle">🎉</div>
            <h1>ORDER CONFIRMED!</h1>
            <p>Thank you for shopping with StyleHub.</p>
          </div>
        )}

        {/* FAILED STATE */}
        {isFailed && (
          <div className="order-header failed-header">
            <div className="icon-circle">⚠️</div>
            <h1>PAYMENT FAILED</h1>
            <p>Payment could not be completed.</p>
          </div>
        )}

        {/* PENDING STATE */}
        {isPending && (
          <div className="order-header pending-header">
            <div className="icon-circle">⏳</div>
            <h1>PAYMENT PENDING</h1>
            <p>Your payment is being verified.</p>
          </div>
        )}

        {/* ORDER DETAILS (Show for all except failed maybe, but let's show for all) */}
        <div className="order-details-section">
          <div className="order-meta">
            <div className="meta-item">
              <span className="meta-label">Order Number</span>
              <span className="meta-value">{order.orderId}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Order Date</span>
              <span className="meta-value">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Payment Status</span>
              <span className={`meta-value status-badge ${order.paymentStatus.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="order-summary-box">
            <h3>Items</h3>
            <div className="order-items-list">
              {order.products.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <div className="item-name">
                    {item.quantity} × {item.name} 
                    <span className="item-variants">({item.size}, {item.color})</span>
                  </div>
                  <div className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.promotionDiscount > 0 && (
                <div className="totals-row discount-row">
                  <span>Promotion Discount</span>
                  <span>−₹{order.promotionDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="totals-row">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="totals-row final-total">
                <span>Total Paid</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="order-delivery-box">
            <h3>Delivery Details</h3>
            <p className="delivery-name">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}, {order.customer.state} {order.customer.pinCode}</p>
            <p>Mobile: {order.customer.mobile}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="order-actions">
          {isSuccess && (
            <>
              <button className="btn btn-primary btn-lg">TRACK ORDER</button>
              <Link to="/" className="btn btn-secondary btn-lg">CONTINUE SHOPPING</Link>
            </>
          )}

          {isFailed && (
            <>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/cart')}>TRY AGAIN</button>
              <Link to="/cart" className="btn btn-secondary btn-lg">RETURN TO CART</Link>
            </>
          )}

          {isPending && (
            <>
              <button className="btn btn-secondary btn-lg" onClick={() => window.location.reload()}>REFRESH STATUS</button>
              <Link to="/" className="btn btn-primary btn-lg">RETURN TO HOME</Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
