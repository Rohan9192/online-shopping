import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { calculateCart, getOfferProgress } from '../utils/promotionEngine';

const CartContext = createContext();

const STORAGE_KEY = 'stylehub_cart';

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // Ignore invalid storage data
  }
  return [];
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // Storage full or unavailable
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCartFromStorage());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [serverValidation, setServerValidation] = useState(null);
  const [offersConfig, setOffersConfig] = useState(null);
  const validationTimerRef = useRef(null);

  // Fetch offers config on mount
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          setOffersConfig(data);
        }
      } catch (e) {
        console.error('Failed to load offers', e);
      }
    }
    fetchOffers();
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Server-side validation whenever cart changes
  useEffect(() => {
    if (items.length === 0) {
      setServerValidation(null);
      return;
    }

    // Debounce server validation to avoid excessive API calls
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
    }

    validationTimerRef.current = setTimeout(() => {
      validateWithServer(items);
    }, 300);

    return () => {
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }
    };
  }, [items]);

  async function validateWithServer(cartItems) {
    try {
      const response = await fetch('/api/calculate-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setServerValidation(data);
      }
    } catch (err) {
      // Server unavailable — client-side calculation is used as fallback display
      console.warn('Server validation unavailable, using client-side calculation');
    }
  }

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const addToCart = useCallback((product, size, color, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${size}-${color}`;
      const existing = prev.find(item => item.key === key);
      let newItems;
      
      if (existing) {
        newItems = prev.map(item =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev, {
          key,
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0],
          size,
          color,
          quantity,
        }];
      }

      // Calculate new promo state for the added category
      const catCount = newItems
        .filter(i => i.category === product.category)
        .reduce((sum, i) => sum + i.quantity, 0);
        
      const isTshirt = product.category === 'tshirts';
      const offer = isTshirt ? offersConfig?.tshirts : offersConfig?.jeans;
      const remaining = catCount % (offer?.quantity || 3);
      const priceStr = offer ? `₹${offer.price.toLocaleString('en-IN')}` : (isTshirt ? '₹500' : '₹1,000');
      const targetQty = offer?.quantity || 3;
      const plural = isTshirt ? 'T-Shirts' : 'Jeans';
      const singular = isTshirt ? 'T-Shirt' : 'Jeans';
      
      let subtitle = null;
      if (offer?.active !== false) {
        if (remaining === targetQty - 1) {
          subtitle = `🔥 Add 1 more ${singular} and get ${targetQty} for ${priceStr}!`;
        } else if (remaining === 0) {
          subtitle = `🎉 Offer unlocked!`;
        } else if (remaining > 0) {
          subtitle = `🔥 Add ${targetQty - remaining} more ${plural} to unlock the offer!`;
        }
      }

      // Show notification right after computing
      showNotification({
        title: "Added to cart ✓",
        subtitle
      });

      return newItems;
    });
  }, [showNotification]);

  const removeFromCart = useCallback((key) => {
    setItems(prev => prev.filter(item => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) {
      setItems(prev => prev.filter(item => item.key !== key));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.key === key ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  // Client-side calculation (for display; server is authoritative)
  const calculation = calculateCart(items, offersConfig);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Use server-validated totals if available, otherwise client-side
  const subtotal = serverValidation?.subtotal ?? calculation.subtotal;
  const discount = serverValidation?.discount ?? calculation.discount;
  const total = serverValidation?.total ?? calculation.total;

  // Per-category promo data
  const tshirtPromo = serverValidation?.tshirts ?? calculation.tshirts;
  const jeansPromo = serverValidation?.jeans ?? calculation.jeans;

  // Offer progress messages
  const tshirtProgress = getOfferProgress(
    tshirtPromo.count, 'T-Shirt', offersConfig, tshirtPromo.groups, tshirtPromo.remaining
  );
  const jeansProgress = getOfferProgress(
    jeansPromo.count, 'Jeans', offersConfig, jeansPromo.groups, jeansPromo.remaining
  );

  const value = {
    items,
    totalItems,
    subtotal,
    discount,
    total,
    tshirtPromo,
    jeansPromo,
    tshirtProgress,
    jeansProgress,
    isCartOpen,
    notification,
    serverValidation,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
