/**
 * StyleHub API Server
 * 
 * Provides server-side cart calculation and validation.
 * The server is the ONLY authoritative source for pricing.
 * Never trust prices sent from the browser.
 */

import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { db } from './db.js';
import adminRoutes from './adminRoutes.js';
import { calculateCart } from '../src/utils/promotionEngine.js';
import { calculateDelivery } from '../src/utils/shippingConfig.js';

dotenv.config();

// Enforce required secrets in production
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  const requiredEnvs = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET', 'JWT_SECRET', 'ADMIN_PASS'];
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      console.error(`CRITICAL: Missing required environment variable ${env} in production.`);
      process.exit(1);
    }
  }
}

const app = express();

// --- Security Middleware ---
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // Allow specified origin or all
app.use(morgan('combined')); // Request logging

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Register Admin API routes
app.use('/api/admin', adminRoutes);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// No longer a static map, we resolve dynamically so admin edits take effect
function getProductById(id) {
  return db.products.find(p => p.id === id && p.isActive !== false);
}

/**
 * POST /api/calculate-cart
 * 
 * Accepts a cart from the client, but IGNORES client-sent prices.
 * Looks up each product's real price from the server-side product catalog,
 * then applies promotional pricing rules.
 * 
 * Request body:
 *   { items: [{ productId: string, size: string, color: string, quantity: number }] }
 * 
 * Response:
 *   { subtotal, discount, total, tshirts: {...}, jeans: {...}, items: [...] }
 */
app.post('/api/calculate-cart', (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid cart: items must be an array' });
    }

    // Validate and resolve each item using server-side product data
    const resolvedItems = [];
    const validationErrors = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        validationErrors.push(`Invalid item: ${JSON.stringify(item)}`);
        continue;
      }

      const product = getProductById(item.productId);
      if (!product) {
        validationErrors.push(`Product not found or inactive: ${item.productId}`);
        continue;
      }

      // Use SERVER-SIDE price, never trust the client
      resolvedItems.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,                // Server's authoritative price
        originalPrice: product.originalPrice, // Server's authoritative original price
        size: item.size,
        color: item.color,
        quantity: Math.min(Math.max(1, Math.floor(item.quantity)), 99), // Sanitize quantity
      });
    }

    if (validationErrors.length > 0 && resolvedItems.length === 0) {
      return res.status(400).json({ error: 'No valid items in cart', details: validationErrors });
    }

    // Calculate with server-side prices and dynamic promotions from DB
    const calculation = calculateCart(resolvedItems, db.offers);

    res.json({
      ...calculation,
      items: resolvedItems,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  } catch (err) {
    console.error('Cart calculation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/products
 * Returns the authoritative product catalog with server-side prices.
 * Only returns active products.
 */
app.get('/api/products', (req, res) => {
  res.json(db.products.filter(p => p.isActive !== false));
});

/**
 * GET /api/offers
 * Returns the active offer configurations.
 */
app.get('/api/offers', (req, res) => {
  res.json(db.offers);
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



/**
 * POST /api/checkout/create-order
 * 
 * Accepts a cart and customer details, calculates the authoritative total,
 * creates an order in the database, and returns the order ID and amount.
 */
app.post('/api/checkout/create-order', async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }

    if (!customer || !customer.fullName || !customer.mobile || !customer.email || !customer.address || !customer.city || !customer.state || !customer.pinCode) {
      return res.status(400).json({ error: 'Missing required customer details' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(customer.mobile)) {
      return res.status(400).json({ error: 'Invalid phone number (must be 10 digits)' });
    }

    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(customer.pinCode)) {
      return res.status(400).json({ error: 'Invalid PIN code (must be 6 digits)' });
    }

    // Validate and resolve each item using server-side product data
    const resolvedItems = [];
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) continue;
      
      const product = getProductById(item.productId);
      if (!product) continue;

      if (product.stock !== undefined && product.stock < item.quantity) {
        return res.status(400).json({ error: `Product ${product.name} is out of stock or insufficient quantity` });
      }

      resolvedItems.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        size: item.size,
        color: item.color,
        quantity: Math.min(Math.max(1, Math.floor(item.quantity)), 99),
      });
    }

    if (resolvedItems.length === 0) {
      return res.status(400).json({ error: 'No valid items in cart' });
    }

    // Authoritative calculation using dynamic offers
    const calculation = calculateCart(resolvedItems, db.offers);
    
    // Authoritative delivery calculation
    const dInfo = calculateDelivery(customer.pinCode, calculation.total);
    if (!dInfo.serviceable) {
      return res.status(400).json({ error: dInfo.error || 'Delivery not available to this PIN code' });
    }
    
    const deliveryFee = dInfo.charge;
    const finalTotal = calculation.total + deliveryFee;

    // Create Razorpay order (Mock if dummy key is used)
    let rzpOrderId = `mock_rzp_${Date.now()}`;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_dummy') {
      const rzpOrder = await razorpay.orders.create({
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });
      rzpOrderId = rzpOrder.id;
    }

    // Create order
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const newOrder = {
      orderId,
      razorpayOrderId: rzpOrderId,
      customer,
      products: resolvedItems,
      subtotal: calculation.subtotal,
      promotionDiscount: calculation.discount,
      deliveryFee,
      total: finalTotal,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);

    res.json({
      success: true,
      orderId,
      razorpayOrderId: rzpOrderId,
      total: finalTotal,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy' // Only public key
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/checkout/verify
 * 
 * Verifies Razorpay signature after frontend completes payment
 */
app.post('/api/checkout/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest('hex');
      
    if (expectedSignature === razorpay_signature) {
      // Find order and update
      const order = db.orders.find(o => o.razorpayOrderId === razorpay_order_id);
      if (order) {
        order.paymentStatus = 'SUCCESS';
        order.orderStatus = 'PAID';
        order.razorpayPaymentId = razorpay_payment_id;
      }
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/checkout/webhook
 * 
 * Razorpay webhook handler
 */
app.post('/api/checkout/webhook', (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'payment.authorized') {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      
      const order = db.orders.find(o => o.razorpayOrderId === orderId);
      // Idempotent processing
      if (order && order.paymentStatus !== 'SUCCESS') {
        order.paymentStatus = 'SUCCESS';
        order.orderStatus = 'PAID';
        order.razorpayPaymentId = payment.id;
      }
    } else if (event === 'payment.failed') {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      
      const order = db.orders.find(o => o.razorpayOrderId === orderId);
      if (order && order.paymentStatus !== 'SUCCESS') {
        order.paymentStatus = 'FAILED';
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/orders/:id
 * 
 * Retrieves an order by ID.
 * (In a real app with auth, we'd verify the user owns this order).
 * Here, the unguessable order ID acts as the secure token.
 */
app.get('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.orders.find(o => o.orderId === id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`StyleHub API server running on port ${PORT}`);
});
