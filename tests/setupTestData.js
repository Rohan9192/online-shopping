import crypto from 'crypto';

async function setupTestData() {
  // Create an order
  const createRes = await fetch('http://localhost:3001/api/checkout/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'ts-001', quantity: 3, size: 'M', color: 'Black' }],
      customer: { fullName: 'John Doe', email: 'john@example.com', mobile: '1234567890', address: '123 Test', city: 'City', state: 'State', pinCode: '123456' }
    })
  });
  
  const order1 = await createRes.json();
  console.log('Pending Order ID:', order1.orderId);

  // Create another order and mark as success
  const createRes2 = await fetch('http://localhost:3001/api/checkout/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'ts-001', quantity: 3, size: 'M', color: 'Black' }],
      customer: { fullName: 'Jane Doe', email: 'jane@example.com', mobile: '0987654321', address: '456 Test', city: 'City', state: 'State', pinCode: '654321' }
    })
  });
  const order2 = await createRes2.json();
  const sig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
    .update(order2.razorpayOrderId + '|pay_123')
    .digest('hex');

  await fetch('http://localhost:3001/api/checkout/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: order2.razorpayOrderId,
      razorpay_payment_id: 'pay_123',
      razorpay_signature: sig
    })
  });
  console.log('Success Order ID:', order2.orderId);

  // Create another and mark as failed via webhook
  const createRes3 = await fetch('http://localhost:3001/api/checkout/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'ts-001', quantity: 3, size: 'M', color: 'Black' }],
      customer: { fullName: 'Jim Doe', email: 'jim@example.com', mobile: '1111111111', address: '789 Test', city: 'City', state: 'State', pinCode: '111111' }
    })
  });
  const order3 = await createRes3.json();
  
  const payload = {
    event: 'payment.failed',
    payload: { payment: { entity: { order_id: order3.razorpayOrderId, id: 'pay_fail_123' } } }
  };
  const whSig = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret')
    .update(JSON.stringify(payload)).digest('hex');

  await fetch('http://localhost:3001/api/checkout/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': whSig },
    body: JSON.stringify(payload)
  });
  console.log('Failed Order ID:', order3.orderId);
}

setupTestData();
