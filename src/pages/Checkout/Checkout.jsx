import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { items, totalItems, subtotal, discount, total, serverValidation, clearCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // If cart is empty, redirect to cart
  useEffect(() => {
    if (items.length === 0 && !orderCreated) {
      navigate('/cart');
    }
  }, [items, navigate, orderCreated]);

  const validate = () => {
    const newErrors = {};
    if (!customer.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email)) newErrors.email = 'Valid email is required';
    if (!customer.mobile.trim() || !/^\d{10}$/.test(customer.mobile)) newErrors.mobile = 'Valid 10-digit mobile number is required';
    if (!customer.address.trim()) newErrors.address = 'Address is required';
    if (!customer.city.trim()) newErrors.city = 'City is required';
    if (!customer.state.trim()) newErrors.state = 'State is required';
    if (!customer.pinCode.trim() || !/^\d{6}$/.test(customer.pinCode)) newErrors.pinCode = 'Valid 6-digit PIN code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.id,
            size: i.size,
            color: i.color,
            quantity: i.quantity
          })),
          customer
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you offline?');
      }

      // Options for Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.total * 100, // Amount is in currency subunits.
        currency: data.currency,
        name: 'StyleHub',
        description: 'Premium Fashion Store',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify signature on backend
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              clearCart();
              navigate(`/order/${data.orderId}`);
            } else {
              setServerError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setServerError('Error verifying payment.');
          }
        },
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.mobile
        },
        theme: {
          color: '#000000'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setServerError(`Payment failed: ${response.error.description}`);
        // Optionally redirect to the failed order page if you want them to see the FAILED state
        // navigate(`/order/${data.orderId}`);
      });
      rzp.open();

    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use authoritative totals from server validation if available (to ensure UI matches backend exactly)
  const displayTotal = serverValidation?.total ?? total;
  const displaySubtotal = serverValidation?.subtotal ?? subtotal;
  const displayDiscount = serverValidation?.discount ?? discount;

  return (
    <div className="checkout-page page-enter">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>

        <div className="checkout-layout">
          {/* Customer Details Form */}
          <div className="checkout-form-section">
            <h2>Customer Details</h2>
            
            {serverError && (
              <div className="checkout-error-banner">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={customer.fullName} 
                  onChange={handleInputChange} 
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={customer.email} 
                    onChange={handleInputChange} 
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input 
                    type="tel" 
                    id="mobile" 
                    name="mobile" 
                    value={customer.mobile} 
                    onChange={handleInputChange} 
                    className={errors.mobile ? 'error' : ''}
                  />
                  {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={customer.address} 
                  onChange={handleInputChange} 
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row three-cols">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={customer.city} 
                    onChange={handleInputChange} 
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    value={customer.state} 
                    onChange={handleInputChange} 
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="pinCode">PIN Code</label>
                  <input 
                    type="text" 
                    id="pinCode" 
                    name="pinCode" 
                    value={customer.pinCode} 
                    onChange={handleInputChange} 
                    className={errors.pinCode ? 'error' : ''}
                  />
                  {errors.pinCode && <span className="error-text">{errors.pinCode}</span>}
                </div>
              </div>

              <div className="checkout-payment-selection">
                <h3>Payment Method</h3>
                <div className="payment-option selected">
                  <span className="radio-circle"></span>
                  <span className="payment-label">Online Payment (Cards, UPI, NetBanking)</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg btn-full submit-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order & Pay'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">
            <div className="checkout-summary-card">
              <h2>Order Summary</h2>
              
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item.key} className="checkout-item">
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-meta">Size: {item.size} | Color: {item.color}</span>
                    </div>
                    <div className="checkout-item-price">
                      {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="checkout-row">
                  <span>Normal Subtotal</span>
                  <span>₹{displaySubtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {displayDiscount > 0 && (
                  <div className="checkout-row checkout-row--discount">
                    <span>Promotion Discount</span>
                    <span>−₹{displayDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="checkout-row">
                  <span>Delivery</span>
                  <span className="checkout-free">FREE</span>
                </div>
                
                <div className="checkout-final-total">
                  <span>Total to Pay</span>
                  <span>₹{displayTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="checkout-secure-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secure Checkout. Total amount is verified by our servers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
