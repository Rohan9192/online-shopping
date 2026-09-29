import crypto from 'crypto';

async function testIntegration() {
  console.log('--- Testing Razorpay Endpoints ---');
  
  const dummySecret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
  
  // Test 1: Verify valid signature
  console.log('1. Testing /api/checkout/verify with VALID signature');
  const orderId = 'order_123';
  const paymentId = 'pay_123';
  const expectedSig = crypto.createHmac('sha256', dummySecret).update(orderId + '|' + paymentId).digest('hex');
  
  try {
    const res = await fetch('http://localhost:3001/api/checkout/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: expectedSig
      })
    });
    const data = await res.json();
    console.log('Verify response:', data);
    if (!data.success) throw new Error('Verify failed on valid signature');
  } catch (err) {
    console.error('Test 1 failed:', err.message);
  }

  // Test 2: Verify invalid signature
  console.log('\n2. Testing /api/checkout/verify with INVALID signature');
  try {
    const res = await fetch('http://localhost:3001/api/checkout/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: 'invalid_sig'
      })
    });
    const data = await res.json();
    console.log('Verify response:', data);
    if (data.success) throw new Error('Verify succeeded on invalid signature');
  } catch (err) {
    console.error('Test 2 failed:', err.message);
  }

  // Test 3: Webhook payload processing
  console.log('\n3. Testing /api/checkout/webhook idempotency');
  const payload = {
    event: 'payment.captured',
    payload: { payment: { entity: { order_id: orderId, id: paymentId } } }
  };
  const webhookSig = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(payload)).digest('hex');

  try {
    const res = await fetch('http://localhost:3001/api/checkout/webhook', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-razorpay-signature': webhookSig
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Webhook response 1:', data);

    const res2 = await fetch('http://localhost:3001/api/checkout/webhook', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-razorpay-signature': webhookSig
      },
      body: JSON.stringify(payload)
    });
    const data2 = await res2.json();
    console.log('Webhook response 2 (Idempotent):', data2);

  } catch (err) {
    console.error('Test 3 failed:', err.message);
  }
}

testIntegration();
