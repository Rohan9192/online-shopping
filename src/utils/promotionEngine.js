/**
 * StyleHub Promotion Engine
 * 
 * Rules:
 * - 3 eligible T-Shirts → ₹500 (per group of 3)
 * - 3 eligible Jeans → ₹1,000 (per group of 3)
 * - Remaining items (not in complete groups) are charged at normal prices
 * - Most expensive items are placed into promo groups first (maximizes customer savings)
 * 
 * This module is used by BOTH the server (authoritative) and client (display).
 * The server copy is the source of truth for all price calculations.
 */

/**
 * Applies a group-based promotion to a list of items.
 * Items are sorted by price descending so the most expensive go into promo groups,
 * maximizing savings for the customer.
 */
function applyGroupPromo(items, groupSize, groupPrice, isActive) {
  if (items.length === 0 || !isActive || groupSize <= 0) {
    const normalTotal = items.reduce((sum, item) => sum + item.price, 0);
    return {
      count: items.length,
      groups: 0,
      remaining: items.length,
      normalTotal,
      promoTotal: normalTotal,
      savings: 0,
      groupedNormalPrice: 0,
      remainingTotal: normalTotal,
    };
  }

  // Sort descending by price → most expensive items go into promo groups
  const sorted = [...items].sort((a, b) => b.price - a.price);

  const count = sorted.length;
  const groups = Math.floor(count / groupSize);
  const remaining = count % groupSize;

  const normalTotal = sorted.reduce((sum, item) => sum + item.price, 0);

  // Items in promo groups (first groups * groupSize items)
  const promoGroupItems = sorted.slice(0, groups * groupSize);
  const remainingItems = sorted.slice(groups * groupSize);

  const groupedNormalPrice = promoGroupItems.reduce((sum, item) => sum + item.price, 0);
  const remainingTotal = remainingItems.reduce((sum, item) => sum + item.price, 0);

  const promoTotal = (groups * groupPrice) + remainingTotal;
  const savings = normalTotal - promoTotal;

  return {
    count,
    groups,
    remaining,
    normalTotal,
    promoTotal,
    savings,
    groupedNormalPrice,
    remainingTotal,
  };
}

/**
 * Calculates the full cart with all promotions applied.
 * 
 * @param {Array<{id: string, category: string, price: number, quantity: number}>} cartItems
 * @param {Object} offersConfig - Configuration of offers from database
 * @returns {Object} Full cart calculation
 */
export function calculateCart(cartItems, offersConfig) {
  // Fallback defaults if config isn't provided (during load)
  const config = offersConfig || {
    tshirts: { active: true, quantity: 3, price: 500 },
    jeans: { active: true, quantity: 3, price: 1000 }
  };

  // Expand items to individual units for grouping
  const expandedTshirts = [];
  const expandedJeans = [];

  cartItems.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      const unit = { id: item.id, price: item.price };
      if (item.category === 'tshirts') {
        expandedTshirts.push(unit);
      } else if (item.category === 'jeans') {
        expandedJeans.push(unit);
      }
    }
  });

  const tshirts = applyGroupPromo(expandedTshirts, config.tshirts.quantity, config.tshirts.price, config.tshirts.active);
  const jeans = applyGroupPromo(expandedJeans, config.jeans.quantity, config.jeans.price, config.jeans.active);

  const subtotal = tshirts.normalTotal + jeans.normalTotal;
  const total = tshirts.promoTotal + jeans.promoTotal;
  const discount = subtotal - total;

  return {
    subtotal,
    discount,
    total,
    tshirts,
    jeans,
  };
}

/**
 * Generates an offer progress message for a category.
 */
export function getOfferProgress(count, categoryName, offersConfig, groups, remaining) {
  if (count === 0) return null;
  
  const categoryKey = categoryName.toLowerCase() === 'jeans' ? 'jeans' : 'tshirts';
  const offer = offersConfig?.[categoryKey];
  
  if (!offer || !offer.active) return null;

  const plural = categoryName === 'Jeans' ? 'Jeans' : 'T-Shirts';
  const singular = categoryName === 'Jeans' ? 'Jeans' : 'T-Shirt';
  const promoPriceStr = `₹${offer.price.toLocaleString('en-IN')}`;
  const targetQty = offer.quantity;

  if (remaining === 0 && groups > 0) {
    if (groups === 1) {
      return { message: `🎉 ${targetQty} ${plural} for ${promoPriceStr} unlocked`, type: 'success', remaining, count };
    }
    return { message: `🎉 ${groups * targetQty} ${plural} for ₹${(offer.price * groups).toLocaleString('en-IN')} unlocked`, type: 'success', remaining, count };
  }

  const needed = targetQty - remaining;

  if (needed === targetQty - 1) {
    if (groups > 0) {
      return { message: `Add ${needed} more ${plural} for another ${targetQty} for ${promoPriceStr}`, type: 'progress', remaining, count };
    }
    return { message: `Add ${needed} more ${plural} to unlock this offer`, type: 'info', remaining, count };
  }

  if (needed === 1) {
    if (groups > 0) {
      return { message: `🔥 Add ${needed} more ${singular} to unlock another ${targetQty} for ${promoPriceStr}`, type: 'hot', remaining, count };
    }
    return { message: `Add ${needed} more ${singular} to unlock this offer`, type: 'hot', remaining, count };
  }
  
  // Generic fallback
  return { message: `Add ${needed} more ${plural} to unlock offer`, type: 'info', remaining, count };
}
