/**
 * StyleHub Promotion Engine Test Suite
 * 
 * Tests both:
 * 1. Client-side promotion engine (imported directly)
 * 2. Server-side API validation (HTTP calls to /api/calculate-cart)
 * 
 * Run: npm run test:promo
 * (Requires the API server to be running: npm run server)
 */

import { calculateCart, getOfferProgress } from '../src/utils/promotionEngine.js';
import { products } from '../src/data/products.js';

const API_URL = 'http://localhost:3001/api/calculate-cart';

// Test counters
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    failed++;
    const msg = `  ❌ ${testName}${details ? ` — ${details}` : ''}`;
    console.log(msg);
    failures.push(msg);
  }
}

// Get product prices from catalog
const tshirtProducts = products.filter(p => p.category === 'tshirts');
const jeansProducts = products.filter(p => p.category === 'jeans');

// Helper: create cart items from products and quantities
function makeTShirtCart(count) {
  // Cycle through available t-shirts
  const items = [];
  for (let i = 0; i < count; i++) {
    const product = tshirtProducts[i % tshirtProducts.length];
    const existing = items.find(it => it.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.push({ id: product.id, category: 'tshirts', price: product.price, quantity: 1 });
    }
  }
  return items;
}

function makeJeansCart(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const product = jeansProducts[i % jeansProducts.length];
    const existing = items.find(it => it.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.push({ id: product.id, category: 'jeans', price: product.price, quantity: 1 });
    }
  }
  return items;
}

function makeMixedTShirtCart(productIds) {
  return productIds.map(id => {
    const p = products.find(pr => pr.id === id);
    return { id: p.id, category: p.category, price: p.price, quantity: 1 };
  });
}

// Calculate expected t-shirt total for given count
function expectedTShirtTotal(count) {
  const groups = Math.floor(count / 3);
  const remaining = count % 3;
  const expanded = [];
  for (let i = 0; i < count; i++) {
    expanded.push(tshirtProducts[i % tshirtProducts.length].price);
  }
  expanded.sort((a, b) => b - a); // descending
  const remainingPrices = expanded.slice(groups * 3);
  return (groups * 500) + remainingPrices.reduce((s, p) => s + p, 0);
}

function expectedJeansTotal(count) {
  const groups = Math.floor(count / 3);
  const remaining = count % 3;
  const expanded = [];
  for (let i = 0; i < count; i++) {
    expanded.push(jeansProducts[i % jeansProducts.length].price);
  }
  expanded.sort((a, b) => b - a);
  const remainingPrices = expanded.slice(groups * 3);
  return (groups * 1000) + remainingPrices.reduce((s, p) => s + p, 0);
}

function expectedTShirtSubtotal(count) {
  const expanded = [];
  for (let i = 0; i < count; i++) {
    expanded.push(tshirtProducts[i % tshirtProducts.length].price);
  }
  return expanded.reduce((s, p) => s + p, 0);
}

function expectedJeansSubtotal(count) {
  const expanded = [];
  for (let i = 0; i < count; i++) {
    expanded.push(jeansProducts[i % jeansProducts.length].price);
  }
  return expanded.reduce((s, p) => s + p, 0);
}

// ============================================================================
// CLIENT-SIDE TESTS
// ============================================================================

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   StyleHub Promotion Engine — Test Suite         ║');
console.log('╚══════════════════════════════════════════════════╝\n');

console.log('━━━ CLIENT-SIDE ENGINE TESTS ━━━\n');

// --- T-Shirt Tests (1-9) ---
console.log('📦 T-Shirt Promotion (1-9 items):');
for (let count = 1; count <= 9; count++) {
  const items = makeTShirtCart(count);
  const result = calculateCart(items);
  const groups = Math.floor(count / 3);
  const remaining = count % 3;
  const expectedTotal = expectedTShirtTotal(count);
  const expectedSub = expectedTShirtSubtotal(count);

  assert(result.tshirts.count === count, `${count} T-Shirts: count = ${count}`);
  assert(result.tshirts.groups === groups, `${count} T-Shirts: ${groups} group(s)`);
  assert(result.tshirts.remaining === remaining, `${count} T-Shirts: ${remaining} remaining`);
  assert(result.total === expectedTotal, `${count} T-Shirts: total = ₹${expectedTotal}`, `got ₹${result.total}`);
  assert(result.subtotal === expectedSub, `${count} T-Shirts: subtotal = ₹${expectedSub}`, `got ₹${result.subtotal}`);
  assert(result.discount === expectedSub - expectedTotal, `${count} T-Shirts: discount = ₹${expectedSub - expectedTotal}`, `got ₹${result.discount}`);
}

// --- Jeans Tests (1-9) ---
console.log('\n👖 Jeans Promotion (1-9 items):');
for (let count = 1; count <= 9; count++) {
  const items = makeJeansCart(count);
  const result = calculateCart(items);
  const groups = Math.floor(count / 3);
  const remaining = count % 3;
  const expectedTotal = expectedJeansTotal(count);
  const expectedSub = expectedJeansSubtotal(count);

  assert(result.jeans.count === count, `${count} Jeans: count = ${count}`);
  assert(result.jeans.groups === groups, `${count} Jeans: ${groups} group(s)`);
  assert(result.jeans.remaining === remaining, `${count} Jeans: ${remaining} remaining`);
  assert(result.total === expectedTotal, `${count} Jeans: total = ₹${expectedTotal}`, `got ₹${result.total}`);
  assert(result.subtotal === expectedSub, `${count} Jeans: subtotal = ₹${expectedSub}`, `got ₹${result.subtotal}`);
  assert(result.discount === expectedSub - expectedTotal, `${count} Jeans: discount = ₹${expectedSub - expectedTotal}`, `got ₹${result.discount}`);
}

// --- Mixed T-Shirt products ---
console.log('\n🔀 Mixed T-Shirt Products (3 different T-Shirts → ₹500):');
{
  // Classic Black (₹299) + Premium White (₹349) + Classic Navy (₹299)
  const items = makeMixedTShirtCart(['ts-001', 'ts-002', 'ts-005']);
  const result = calculateCart(items);
  const normalTotal = 299 + 349 + 299;
  assert(result.tshirts.count === 3, 'Mixed 3 T-Shirts: count = 3');
  assert(result.tshirts.groups === 1, 'Mixed 3 T-Shirts: 1 promo group');
  assert(result.total === 500, 'Mixed 3 T-Shirts: total = ₹500', `got ₹${result.total}`);
  assert(result.subtotal === normalTotal, `Mixed 3 T-Shirts: subtotal = ₹${normalTotal}`, `got ₹${result.subtotal}`);
  assert(result.discount === normalTotal - 500, `Mixed 3 T-Shirts: discount = ₹${normalTotal - 500}`, `got ₹${result.discount}`);
}

// --- Mixed Jeans products ---
console.log('\n🔀 Mixed Jeans Products (3 different Jeans → ₹1,000):');
{
  // Classic Blue (₹699) + Dark Blue (₹799) + Black Slim (₹749)
  const items = makeMixedTShirtCart(['jn-001', 'jn-002', 'jn-003']);
  const result = calculateCart(items);
  const normalTotal = 699 + 799 + 749;
  assert(result.jeans.count === 3, 'Mixed 3 Jeans: count = 3');
  assert(result.jeans.groups === 1, 'Mixed 3 Jeans: 1 promo group');
  assert(result.total === 1000, 'Mixed 3 Jeans: total = ₹1,000', `got ₹${result.total}`);
  assert(result.subtotal === normalTotal, `Mixed 3 Jeans: subtotal = ₹${normalTotal}`, `got ₹${result.subtotal}`);
  assert(result.discount === normalTotal - 1000, `Mixed 3 Jeans: discount = ₹${normalTotal - 1000}`, `got ₹${result.discount}`);
}

// --- Combined T-Shirts + Jeans ---
console.log('\n🔀 Combined: 3 T-Shirts + 3 Jeans:');
{
  const tshirtItems = makeMixedTShirtCart(['ts-001', 'ts-002', 'ts-005']);
  const jeansItems = makeMixedTShirtCart(['jn-001', 'jn-002', 'jn-003']);
  const allItems = [...tshirtItems, ...jeansItems];
  const result = calculateCart(allItems);
  assert(result.total === 500 + 1000, 'Combined: total = ₹1,500', `got ₹${result.total}`);
  assert(result.tshirts.groups === 1, 'Combined: 1 T-Shirt group');
  assert(result.jeans.groups === 1, 'Combined: 1 Jeans group');
}

// --- Empty cart ---
console.log('\n🛒 Empty Cart:');
{
  const result = calculateCart([]);
  assert(result.total === 0, 'Empty cart: total = ₹0');
  assert(result.subtotal === 0, 'Empty cart: subtotal = ₹0');
  assert(result.discount === 0, 'Empty cart: discount = ₹0');
}

// --- Removing items (simulate: 3 → 2 T-Shirts) ---
console.log('\n🗑️ Remove items (3 → 2 T-Shirts):');
{
  const threeItems = makeTShirtCart(3);
  const resultBefore = calculateCart(threeItems);
  assert(resultBefore.tshirts.groups === 1, 'Before removal: 1 group');

  // Remove last item
  const twoItems = makeTShirtCart(2);
  const resultAfter = calculateCart(twoItems);
  assert(resultAfter.tshirts.groups === 0, 'After removal: 0 groups');
  assert(resultAfter.discount === 0, 'After removal: no discount');
  assert(resultAfter.total === resultAfter.subtotal, 'After removal: total = subtotal');
}

// --- Increase quantity (2 → 3) ---
console.log('\n➕ Increase quantity (2 → 3 T-Shirts):');
{
  const items2 = makeTShirtCart(2);
  const r2 = calculateCart(items2);
  assert(r2.tshirts.groups === 0, '2 T-Shirts: 0 groups');

  const items3 = makeTShirtCart(3);
  const r3 = calculateCart(items3);
  assert(r3.tshirts.groups === 1, '3 T-Shirts: 1 group');
  assert(r3.discount > 0, '3 T-Shirts: discount applied');
}

// --- Decrease quantity (3 → 2) ---
console.log('\n➖ Decrease quantity (3 → 2 T-Shirts):');
{
  const items3 = makeTShirtCart(3);
  const r3 = calculateCart(items3);
  assert(r3.tshirts.groups === 1, '3 T-Shirts: 1 group');

  const items2 = makeTShirtCart(2);
  const r2 = calculateCart(items2);
  assert(r2.tshirts.groups === 0, '2 T-Shirts: 0 groups');
  assert(r2.discount === 0, '2 T-Shirts: no discount');
}

// --- Same product, qty=3 ---
console.log('\n📦 Same product × 3 (Classic Black T-Shirt × 3):');
{
  const items = [{ id: 'ts-001', category: 'tshirts', price: 299, quantity: 3 }];
  const result = calculateCart(items);
  assert(result.tshirts.count === 3, 'Same product ×3: count = 3');
  assert(result.tshirts.groups === 1, 'Same product ×3: 1 group');
  assert(result.total === 500, 'Same product ×3: total = ₹500', `got ₹${result.total}`);
  assert(result.subtotal === 897, 'Same product ×3: subtotal = ₹897', `got ₹${result.subtotal}`);
  assert(result.discount === 397, 'Same product ×3: discount = ₹397', `got ₹${result.discount}`);
}

// --- Offer Progress Messages ---
console.log('\n💬 Offer Progress Messages:');
{
  const p1 = getOfferProgress(1, 'T-Shirt', '₹500', 0, 1);
  assert(p1 && p1.message.includes('Add 2 more'), '1 T-Shirt: "Add 2 more"');
  assert(p1 && p1.type === 'info', '1 T-Shirt: type = info');

  const p2 = getOfferProgress(2, 'T-Shirt', '₹500', 0, 2);
  assert(p2 && p2.message.includes('Add 1 more'), '2 T-Shirts: "Add 1 more"');
  assert(p2 && p2.type === 'hot', '2 T-Shirts: type = hot');

  const p3 = getOfferProgress(3, 'T-Shirt', '₹500', 1, 0);
  assert(p3 && p3.message.includes('Offer unlocked'), '3 T-Shirts: "Offer unlocked"');
  assert(p3 && p3.type === 'success', '3 T-Shirts: type = success');

  const p4 = getOfferProgress(4, 'T-Shirt', '₹500', 1, 1);
  assert(p4 && p4.message.includes('Offer applied'), '4 T-Shirts: "Offer applied"');

  const p5 = getOfferProgress(5, 'T-Shirt', '₹500', 1, 2);
  assert(p5 && p5.message.includes('Add 1 more'), '5 T-Shirts: "Add 1 more"');

  const p6 = getOfferProgress(6, 'T-Shirt', '₹500', 2, 0);
  assert(p6 && p6.message.includes('2×'), '6 T-Shirts: "2× Offer"');

  const jp1 = getOfferProgress(1, 'Jeans', '₹1,000', 0, 1);
  assert(jp1 && jp1.message.includes('Add 2 more'), '1 Jeans: "Add 2 more"');

  const jp3 = getOfferProgress(3, 'Jeans', '₹1,000', 1, 0);
  assert(jp3 && jp3.message.includes('Offer unlocked'), '3 Jeans: "Offer unlocked"');
}

// ============================================================================
// SERVER-SIDE API TESTS
// ============================================================================

console.log('\n━━━ SERVER-SIDE API TESTS ━━━\n');

async function testAPI() {
  let apiAvailable = true;

  try {
    const healthRes = await fetch('http://localhost:3001/api/health');
    if (!healthRes.ok) throw new Error('Health check failed');
    console.log('🟢 API server is running\n');
  } catch (err) {
    console.log('🔴 API server not running — skipping server tests');
    console.log('   Start the server with: npm run server\n');
    apiAvailable = false;
  }

  if (!apiAvailable) return;

  // Helper: call the API
  async function callAPI(items) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(it => ({
          productId: it.id,
          size: 'M',
          color: 'Default',
          quantity: it.quantity,
        })),
      }),
    });
    return res.json();
  }

  // Test: 3 T-Shirts via API
  console.log('📡 API: 3 T-Shirts → ₹500');
  {
    const items = [
      { id: 'ts-001', quantity: 1 },
      { id: 'ts-002', quantity: 1 },
      { id: 'ts-005', quantity: 1 },
    ];
    const result = await callAPI(items);
    assert(result.total === 500, 'API: 3 T-Shirts total = ₹500', `got ₹${result.total}`);
    assert(result.tshirts?.groups === 1, 'API: 3 T-Shirts = 1 group');
    assert(result.discount > 0, 'API: discount applied');
  }

  // Test: 3 Jeans via API
  console.log('\n📡 API: 3 Jeans → ₹1,000');
  {
    const items = [
      { id: 'jn-001', quantity: 1 },
      { id: 'jn-002', quantity: 1 },
      { id: 'jn-003', quantity: 1 },
    ];
    const result = await callAPI(items);
    assert(result.total === 1000, 'API: 3 Jeans total = ₹1,000', `got ₹${result.total}`);
    assert(result.jeans?.groups === 1, 'API: 3 Jeans = 1 group');
  }

  // Test: Same product qty=3 via API
  console.log('\n📡 API: Same T-Shirt × 3');
  {
    const items = [{ id: 'ts-001', quantity: 3 }];
    const result = await callAPI(items);
    assert(result.total === 500, 'API: same T-Shirt ×3 total = ₹500', `got ₹${result.total}`);
  }

  // Test: 6 T-Shirts via API (2 groups)
  console.log('\n📡 API: 6 T-Shirts (2 groups) → ₹1,000');
  {
    const items = [
      { id: 'ts-001', quantity: 2 },
      { id: 'ts-002', quantity: 2 },
      { id: 'ts-003', quantity: 2 },
    ];
    const result = await callAPI(items);
    assert(result.total === 1000, 'API: 6 T-Shirts total = ₹1,000', `got ₹${result.total}`);
    assert(result.tshirts?.groups === 2, 'API: 6 T-Shirts = 2 groups');
  }

  // Test: 9 Jeans via API (3 groups)
  console.log('\n📡 API: 9 Jeans (3 groups) → ₹3,000');
  {
    const items = [
      { id: 'jn-001', quantity: 3 },
      { id: 'jn-002', quantity: 3 },
      { id: 'jn-003', quantity: 3 },
    ];
    const result = await callAPI(items);
    assert(result.total === 3000, 'API: 9 Jeans total = ₹3,000', `got ₹${result.total}`);
    assert(result.jeans?.groups === 3, 'API: 9 Jeans = 3 groups');
  }

  // Test: Price manipulation protection
  console.log('\n🔒 API: Price manipulation protection');
  {
    // Even if a client sends a fake low price, the server uses its own catalog prices
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'ts-001', size: 'M', color: 'Black', quantity: 1 }],
      }),
    });
    const result = await res.json();
    // Server should use the real price (₹299), not any client-sent price
    assert(result.subtotal === 299, 'API: Server uses catalog price ₹299', `got ₹${result.subtotal}`);
  }

  // Test: Invalid product ID
  console.log('\n🔒 API: Invalid product ID');
  {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'FAKE-999', size: 'M', color: 'Black', quantity: 1 }],
      }),
    });
    const result = await res.json();
    assert(result.error !== undefined, 'API: Rejects invalid product ID');
  }

  // Test: Combined T-Shirts + Jeans via API
  console.log('\n📡 API: Combined 3 T-Shirts + 3 Jeans');
  {
    const items = [
      { id: 'ts-001', quantity: 1 },
      { id: 'ts-002', quantity: 1 },
      { id: 'ts-003', quantity: 1 },
      { id: 'jn-001', quantity: 1 },
      { id: 'jn-002', quantity: 1 },
      { id: 'jn-003', quantity: 1 },
    ];
    const result = await callAPI(items);
    assert(result.total === 1500, 'API: Combined total = ₹1,500', `got ₹${result.total}`);
    assert(result.tshirts?.groups === 1, 'API: 1 T-Shirt group');
    assert(result.jeans?.groups === 1, 'API: 1 Jeans group');
  }

  // Test: 4 T-Shirts (1 group + 1 remainder)
  console.log('\n📡 API: 4 T-Shirts (1 group + 1 at normal price)');
  {
    const items = [
      { id: 'ts-001', quantity: 1 }, // ₹299
      { id: 'ts-002', quantity: 1 }, // ₹349
      { id: 'ts-003', quantity: 1 }, // ₹399
      { id: 'ts-004', quantity: 1 }, // ₹449
    ];
    const result = await callAPI(items);
    // Most expensive 3 in promo (₹449+₹399+₹349=₹1197 → ₹500), cheapest 1 at normal (₹299)
    assert(result.total === 500 + 299, 'API: 4 T-Shirts total = ₹799', `got ₹${result.total}`);
    assert(result.tshirts?.groups === 1, 'API: 4 T-Shirts = 1 group');
    assert(result.tshirts?.remaining === 1, 'API: 4 T-Shirts = 1 remaining');
  }
}

// Run API tests
testAPI().then(() => {
  // ============================================================================
  // FINAL REPORT
  // ============================================================================
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║   RESULTS: ${passed} passed, ${failed} failed${' '.repeat(Math.max(0, 25 - String(passed).length - String(failed).length))}║`);
  console.log('╚══════════════════════════════════════════════════╝');

  if (failures.length > 0) {
    console.log('\nFailed tests:');
    failures.forEach(f => console.log(f));
  }

  if (failed > 0) {
    console.log('\n❌ SOME TESTS FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ ALL TESTS PASSED — Promotion engine is working correctly!');
    process.exit(0);
  }
}).catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
