/**
 * Product Image Mapping
 * Maps each product to its corresponding high-quality product photograph.
 * Images are matched by product ID for precise, stable mappings that
 * persist across sorting, filtering, and rearranging.
 */

/**
 * Product ID → image path mapping.
 * Each product ID maps to the exact image file that visually matches
 * the product name, color, fit, and style.
 */
const productImageMap = {
  // ── Men's T-Shirts ──
  'ts-001': '/images/tshirt-black.jpg',     // Classic Black T-Shirt
  'ts-002': '/images/tshirt-white.jpg',     // Premium White T-Shirt
  'ts-003': '/images/tshirt-beige.jpg',     // Oversized Beige T-Shirt
  'ts-004': '/images/tshirt-graphic.jpg',   // Graphic Black T-Shirt
  'ts-005': '/images/tshirt-navy.jpg',      // Classic Navy T-Shirt
  'ts-006': '/images/tshirt-gray.jpg',      // Premium Gray T-Shirt

  // ── Women's T-Shirts ──
  'w-ts-001': '/images/tshirt-black.jpg',   // Classic Black T-Shirt
  'w-ts-002': '/images/tshirt-white.jpg',   // Premium White T-Shirt
  'w-ts-003': '/images/tshirt-beige.jpg',   // Oversized Beige T-Shirt
  'w-ts-004': '/images/tshirt-graphic.jpg', // Graphic Black T-Shirt
  'w-ts-005': '/images/tshirt-navy.jpg',    // Classic Navy T-Shirt
  'w-ts-006': '/images/tshirt-gray.jpg',    // Premium Gray T-Shirt

  // ── Men's Jeans ──
  'jn-001': '/images/jeans-blue.jpg',       // Classic Blue Jeans
  'jn-002': '/images/jeans-dark.jpg',       // Dark Blue Denim
  'jn-003': '/images/jeans-black.jpg',      // Black Slim Jeans
  'jn-004': '/images/jeans-relaxed.jpg',    // Relaxed Fit Jeans
  'jn-005': '/images/jeans-light.jpg',      // Light Wash Jeans
  'jn-006': '/images/jeans-straight.jpg',   // Straight Fit Denim

  // ── Women's Jeans ──
  'w-jn-001': '/images/jeans-blue.jpg',     // Classic Blue Jeans
  'w-jn-002': '/images/jeans-dark.jpg',     // Dark Blue Denim
  'w-jn-003': '/images/jeans-black.jpg',    // Black Slim Jeans
  'w-jn-004': '/images/jeans-relaxed.jpg',  // Relaxed Fit Jeans
  'w-jn-005': '/images/jeans-light.jpg',    // Light Wash Jeans
  'w-jn-006': '/images/jeans-straight.jpg', // Straight Fit Denim
};

/**
 * Returns the product image path for a given product.
 * Uses the product ID for stable, accurate matching regardless of
 * sorting, filtering, or grid position.
 *
 * Falls back to the product's own images array if the ID isn't mapped,
 * and finally to a minimal SVG placeholder as a last resort.
 */
export function getProductImage(product) {
  // 1. Look up by product ID (primary, stable mapping)
  if (productImageMap[product.id]) {
    return productImageMap[product.id];
  }

  // 2. Fall back to the product's own images array
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  // 3. Last resort: generate a minimal placeholder
  return createFallbackSVG(product);
}

/**
 * Generates a minimal fallback SVG placeholder.
 * Only used if no mapped image or product image is available.
 */
function createFallbackSVG(product) {
  const isTshirt = product.category === 'tshirts';
  const bgColor = isTshirt ? '#1a1a1a' : '#2c3e6b';
  const label = product.name || 'Product';

  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="${bgColor}"/>
  <text x="200" y="250" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="300" letter-spacing="2" fill="rgba(255,255,255,0.5)">${label}</text>
</svg>`)}`;
}

// Category hero images
export function getCategoryImage(category) {
  if (category === 'tshirts') {
    return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#1a1a1a"/>
  <path d="M320,80 L290,110 L230,90 L215,170 L290,185 L290,330 L510,330 L510,185 L585,170 L570,90 L510,110 L480,80 
    C465,55 435,40 400,40 C365,40 335,55 320,80 Z" 
    fill="#0a0a0a" stroke="#333" stroke-width="2"/>
  <ellipse cx="400" cy="95" rx="50" ry="25" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
  <text x="400" y="375" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="300" letter-spacing="4" fill="rgba(255,255,255,0.5)">T-SHIRTS COLLECTION</text>
</svg>`)}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#2c3e6b"/>
  <path d="M300,40 L275,40 L260,180 L245,340 L355,340 L380,180 L400,150 L420,180 L445,340 L555,340 L540,180 L525,40 L500,40 
    L500,65 L400,85 L300,65 Z" 
    fill="#1f305a" stroke="#4a6fa5" stroke-width="2"/>
  <rect x="275" y="35" width="250" height="30" rx="3" fill="#1f305a" stroke="#4a6fa5" stroke-width="1"/>
  <text x="400" y="375" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="300" letter-spacing="4" fill="rgba(255,255,255,0.5)">JEANS COLLECTION</text>
</svg>`)}`;
}
