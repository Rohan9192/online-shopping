/**
 * StyleHub Delivery & Shipping Configuration
 *
 * ⚠️  IMPORTANT: These are placeholder delivery zones, rates, and estimates.
 *     Replace all values with verified business data before launch.
 *     Do not treat these as real carrier rates or delivery guarantees.
 *
 * Structure:
 * - Zones are defined by PIN code prefix ranges
 * - Each zone has a name, delivery charge, estimated days, and COD availability
 * - Free shipping threshold can be configured per zone or globally
 * - Unserviceable areas are explicitly listed
 */

/**
 * Delivery zones configuration.
 * PIN codes are matched by their first 2–3 digits (prefix).
 */
export const DELIVERY_ZONES = [
  {
    id: 'local',
    name: 'Local Delivery',
    // Mumbai metro area PIN prefixes
    pinPrefixes: ['400', '401', '410'],
    charge: 0,
    estimatedDays: { min: 1, max: 2 },
    codAvailable: true,
    codFee: 0,
    freeAbove: 0, // Always free for local
  },
  {
    id: 'regional',
    name: 'Regional Delivery',
    // Maharashtra + nearby states
    pinPrefixes: [
      '402', '403', '404', '405', '406', '407', '408', '409',
      '411', '412', '413', '414', '415', '416', '417', '418', '419',
      '420', '421', '422', '423', '424', '425', '426', '427', '428', '429',
      '430', '431', '432', '433', '434', '435', '436', '437', '438', '439',
      '440', '441', '442', '443', '444', '445',
      '450', '451', '452', '453', '454', '455', '456', '457',
      '460', '461', '462', '463', '464', '465', '466', '467',
      '470', '471', '472', '473',
      '380', '382', '383', '384', '385', '386', '387', '388', '389',
      '390', '391', '392', '393', '394', '395', '396',
      '360', '361', '362', '363', '364', '365',
    ],
    charge: 49,
    estimatedDays: { min: 3, max: 5 },
    codAvailable: true,
    codFee: 30,
    freeAbove: 999,
  },
  {
    id: 'national',
    name: 'National Delivery',
    // Catch-all for rest of India — matched if no other zone matches
    pinPrefixes: null, // null = catch-all
    charge: 79,
    estimatedDays: { min: 5, max: 7 },
    codAvailable: true,
    codFee: 50,
    freeAbove: 1499,
  },
];

/**
 * PIN code prefixes that are NOT serviceable.
 * These take priority over zone matching.
 */
export const UNSERVICEABLE_PREFIXES = [
  // Remote/restricted areas (placeholder examples)
  '194', // Ladakh (example — replace with real unserviceable codes)
  '795', // Manipur remote (example)
  '796', // Mizoram remote (example)
];

/**
 * Global free shipping threshold.
 * If the cart subtotal (after discounts) exceeds this value,
 * delivery is free regardless of zone.
 * Set to null to use per-zone thresholds instead.
 */
export const GLOBAL_FREE_SHIPPING_ABOVE = null;

/**
 * Validates an Indian PIN code format.
 * @param {string} pin - The PIN code to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePinCode(pin) {
  if (!pin || typeof pin !== 'string') {
    return { valid: false, error: 'Please enter a PIN code' };
  }

  const trimmed = pin.trim();

  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'PIN code must contain only digits' };
  }

  if (trimmed.length !== 6) {
    return { valid: false, error: 'PIN code must be exactly 6 digits' };
  }

  // Indian PIN codes start with 1–9 (never 0)
  if (trimmed.startsWith('0')) {
    return { valid: false, error: 'Invalid PIN code' };
  }

  return { valid: true };
}

/**
 * Checks if a PIN code is in the unserviceable list.
 * @param {string} pin - 6-digit PIN code
 * @returns {boolean}
 */
function isUnserviceable(pin) {
  return UNSERVICEABLE_PREFIXES.some(prefix => pin.startsWith(prefix));
}

/**
 * Finds the delivery zone for a given PIN code.
 * @param {string} pin - 6-digit PIN code
 * @returns {Object|null} The matching zone, or null if unserviceable
 */
function findZone(pin) {
  // Check unserviceable first
  if (isUnserviceable(pin)) {
    return null;
  }

  // Try to match specific zones (non-catch-all)
  for (const zone of DELIVERY_ZONES) {
    if (zone.pinPrefixes === null) continue; // Skip catch-all
    if (zone.pinPrefixes.some(prefix => pin.startsWith(prefix))) {
      return zone;
    }
  }

  // Fall through to catch-all zone
  const catchAll = DELIVERY_ZONES.find(z => z.pinPrefixes === null);
  return catchAll || null;
}

export function calculateDelivery(pin, orderTotal = 0) {
  const validation = validatePinCode(pin);
  if (!validation.valid) {
    return { serviceable: false, charge: 0, freeShipping: false, error: validation.error };
  }

  // Mandatory Requirement: Fixed ₹120 delivery charge for every order
  // Ignore location-based zones, dynamic fees, and free shipping thresholds.
  return {
    serviceable: true,
    zone: {
      id: 'fixed_fee',
      name: 'Standard Delivery',
    },
    charge: 120,
    estimatedDays: { min: 3, max: 7 },
    codAvailable: true,
    codFee: 50,
    freeShipping: false,
    freeShippingThreshold: undefined,
    amountForFreeShipping: undefined,
  };
}
