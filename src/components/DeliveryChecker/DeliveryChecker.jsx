import { useState, useCallback } from 'react';
import { validatePinCode, calculateDelivery } from '../../utils/shippingConfig';
import './DeliveryChecker.css';

/**
 * DeliveryChecker — PIN code-based delivery availability checker.
 * Can be used on ProductDetail pages, Cart, or anywhere delivery info is needed.
 *
 * Props:
 *   orderTotal (number) — Current order/cart total for free shipping calculation
 *   compact (boolean) — Use compact layout (for cart sidebar)
 *   onDeliveryChange (function) — Callback with delivery result when PIN changes
 */
export default function DeliveryChecker({ orderTotal = 0, compact = false, onDeliveryChange }) {
  const [pinCode, setPinCode] = useState('');
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = useCallback(() => {
    const validation = validatePinCode(pinCode);
    if (!validation.valid) {
      const errorResult = { serviceable: false, error: validation.error, charge: 0, freeShipping: false };
      setResult(errorResult);
      setHasChecked(true);
      onDeliveryChange?.(errorResult);
      return;
    }

    // Simulate a brief loading state (in production, this would hit a real API)
    setIsChecking(true);
    setHasChecked(false);

    setTimeout(() => {
      const deliveryResult = calculateDelivery(pinCode, orderTotal);
      setResult(deliveryResult);
      setHasChecked(true);
      setIsChecking(false);
      onDeliveryChange?.(deliveryResult);
    }, 400);
  }, [pinCode, orderTotal, onDeliveryChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPinCode(val);
    // Reset result when user changes PIN
    if (hasChecked) {
      setResult(null);
      setHasChecked(false);
      onDeliveryChange?.(null);
    }
  };

  return (
    <div className={`delivery-checker ${compact ? 'delivery-checker--compact' : ''}`} id="delivery-checker">
      <div className="delivery-checker__header">
        <svg className="delivery-checker__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span className="delivery-checker__label">Check Delivery</span>
      </div>

      <div className="delivery-checker__input-row">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter PIN code"
          value={pinCode}
          onChange={handlePinChange}
          onKeyDown={handleKeyDown}
          className="delivery-checker__input"
          maxLength={6}
          id="delivery-pin-input"
          aria-label="Delivery PIN code"
        />
        <button
          className="delivery-checker__btn"
          onClick={handleCheck}
          disabled={isChecking || pinCode.length < 6}
          id="delivery-check-btn"
        >
          {isChecking ? (
            <span className="delivery-checker__spinner" />
          ) : (
            'Check'
          )}
        </button>
      </div>

      {/* Results */}
      {hasChecked && result && (
        <div className={`delivery-checker__result ${result.serviceable ? 'delivery-checker__result--success' : 'delivery-checker__result--error'}`} id="delivery-result">
          {result.serviceable ? (
            <>
              <div className="delivery-result__row delivery-result__row--location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Deliver to <strong>{pinCode}</strong></span>
              </div>

              <div className="delivery-result__row">
                <span className="delivery-result__label">Delivery charge:</span>
                <span className={`delivery-result__value ${result.freeShipping ? 'delivery-result__value--free' : ''}`}>
                  {result.charge === 0 ? 'FREE' : `₹${result.charge}`}
                </span>
              </div>

              {result.estimatedDays && (
                <div className="delivery-result__row">
                  <span className="delivery-result__label">Estimated delivery:</span>
                  <span className="delivery-result__value">
                    {result.estimatedDays.min}–{result.estimatedDays.max} business days
                  </span>
                </div>
              )}

              {result.codAvailable && (
                <div className="delivery-result__row delivery-result__row--cod">
                  <span>💰 Cash on Delivery available{result.codFee > 0 ? ` (₹${result.codFee} fee)` : ''}</span>
                </div>
              )}

              {result.amountForFreeShipping > 0 && (
                <div className="delivery-result__row delivery-result__row--hint">
                  <span>🚚 Add ₹{result.amountForFreeShipping.toLocaleString('en-IN')} more for free delivery</span>
                </div>
              )}
            </>
          ) : (
            <div className="delivery-result__row delivery-result__row--error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{result.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
