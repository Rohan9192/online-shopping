import crypto from 'crypto';

const API_URL = 'http://localhost:3001/api';

async function runTests() {
  let passed = 0;
  let failed = 0;
  const failures = [];

  function assert(condition, message) {
    if (!condition) {
      console.error('❌ FAIL:', message);
      failures.push(message);
      failed++;
    } else {
      console.log('✅ PASS:', message);
      passed++;
    }
  }

  // Helper to calculate cart via API
  async function calcCart(items) {
    const res = await fetch(`${API_URL}/calculate-cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    return res.json();
  }

  // --- TEST 2 & 3: PROMOTIONS ---
  console.log('\n--- TESTING PROMOTIONS ---');
  // T-Shirts: 3 for 500. Individual price ~ 299 (Classic Black T-Shirt)
  const ts1 = { productId: 'ts-001', quantity: 1, size: 'M', color: 'Black' };
  const ts3 = { productId: 'ts-001', quantity: 3, size: 'M', color: 'Black' };
  const ts4 = { productId: 'ts-001', quantity: 4, size: 'M', color: 'Black' };
  const ts6 = { productId: 'ts-001', quantity: 6, size: 'M', color: 'Black' };
  const ts9 = { productId: 'ts-001', quantity: 9, size: 'M', color: 'Black' };
  
  let res = await calcCart([ts1]);
  assert(res.tshirts.count === 1 && res.total === 299, `1 T-Shirt = ₹299 (Actual: ${res.total})`);

  res = await calcCart([ts3]);
  assert(res.tshirts.count === 3 && res.total === 500, `3 T-Shirts = ₹500 (Actual: ${res.total})`);

  res = await calcCart([ts4]);
  assert(res.tshirts.count === 4 && res.total === 799, `4 T-Shirts = ₹799 (Actual: ${res.total})`);

  res = await calcCart([ts6]);
  assert(res.tshirts.count === 6 && res.total === 1000, `6 T-Shirts = ₹1000 (Actual: ${res.total})`);

  res = await calcCart([ts9]);
  assert(res.tshirts.count === 9 && res.total === 1500, `9 T-Shirts = ₹1500 (Actual: ${res.total})`);

  // Jeans: 3 for 1000. Individual price ~ 699 (Classic Blue Jeans)
  const j1 = { productId: 'jn-001', quantity: 1, size: '32', color: 'Blue' };
  const j3 = { productId: 'jn-001', quantity: 3, size: '32', color: 'Blue' };
  const j4 = { productId: 'jn-001', quantity: 4, size: '32', color: 'Blue' };
  const j6 = { productId: 'jn-001', quantity: 6, size: '32', color: 'Blue' };
  
  res = await calcCart([j1]);
  assert(res.jeans.count === 1 && res.total === 699, `1 Jeans = ₹699`);

  res = await calcCart([j3]);
  assert(res.jeans.count === 3 && res.total === 1000, `3 Jeans = ₹1000`);

  res = await calcCart([j4]);
  assert(res.jeans.count === 4 && res.total === 1699, `4 Jeans = ₹1699`);

  res = await calcCart([j6]);
  assert(res.jeans.count === 6 && res.total === 2000, `6 Jeans = ₹2000`);

  // Mix
  res = await calcCart([ts3, j3]);
  assert(res.total === 1500, `3 T-Shirts + 3 Jeans = ₹1500`);

  // --- TEST 5 & 6: SECURITY & CHECKOUT VALIDATION ---
  console.log('\n--- TESTING SECURITY & VALIDATION ---');
  
  // Try to manipulate total
  const badCheckout = await fetch(`${API_URL}/checkout/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [ts3],
      customer: { fullName: 'Hacker', email: 'h@hack.com', mobile: '9999999999', address: 'A', city: 'C', state: 'S', pinCode: '123456' },
      total: 10 // Try to pay 10 instead of 500
    })
  });
  const badRes = await badCheckout.json();
  assert(badRes.total === 500, `Backend rejected manipulated total and used 500 (Actual: ${badRes.total})`);

  // Invalid phone validation (missing/short) - Let's see if we actually validate phone length on backend
  // Currently, our backend just requires 'customer' but doesn't deep validate customer fields in server/index.js!
  const emptyCustomer = await fetch(`${API_URL}/checkout/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [ts1]
      // missing customer
    })
  });
  assert(emptyCustomer.status === 400, `Backend rejects missing customer details (Status: ${emptyCustomer.status})`);

  // --- TEST 7 & 8: PAYMENT WEBHOOKS ---
  console.log('\n--- TESTING WEBHOOKS ---');
  
  // Webhook without signature
  const whRes1 = await fetch(`${API_URL}/checkout/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'payment.captured' })
  });
  assert(whRes1.status === 400, `Webhook without signature rejected`);

  // Webhook Idempotency & Order States
  // Let's create a real order first
  const orderReq = await fetch(`${API_URL}/checkout/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [ts1],
      customer: { fullName: 'Test', email: 't@t.com', mobile: '1234567890', address: 'A', city: 'C', state: 'S', pinCode: '123456' }
    })
  });
  const orderData = await orderReq.json();
  const rzpId = orderData.razorpayOrderId;
  const orderId = orderData.orderId;

  const payload = {
    event: 'payment.captured',
    payload: { payment: { entity: { order_id: rzpId, id: 'pay_test' } } }
  };
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
  const whSig = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

  // Trigger success
  await fetch(`${API_URL}/checkout/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': whSig },
    body: JSON.stringify(payload)
  });

  const getOrder = await fetch(`${API_URL}/orders/${orderId}`);
  const fetchedOrder = await getOrder.json();
  assert(fetchedOrder.paymentStatus === 'SUCCESS', `Webhook marked payment as SUCCESS`);

  // Send failed webhook for SAME order - should NOT revert SUCCESS
  const payloadFail = {
    event: 'payment.failed',
    payload: { payment: { entity: { order_id: rzpId, id: 'pay_fail' } } }
  };
  const whSigFail = crypto.createHmac('sha256', secret).update(JSON.stringify(payloadFail)).digest('hex');
  await fetch(`${API_URL}/checkout/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': whSigFail },
    body: JSON.stringify(payloadFail)
  });

  const getOrder2 = await fetch(`${API_URL}/orders/${orderId}`);
  const fetchedOrder2 = await getOrder2.json();
  assert(fetchedOrder2.paymentStatus === 'SUCCESS', `Failed webhook cannot override SUCCESS status`);

  console.log(`\nRESULTS: ${passed} PASS, ${failed} FAIL`);
}

runTests();
