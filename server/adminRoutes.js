import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { db } from './db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_admin_key';
const ADMIN_USER = process.env.ADMIN_USER || 'admin@stylehub.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `prod-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// --- Auth ---
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.use(authenticateAdmin);

// --- Dashboard Metrics ---
router.get('/metrics', (req, res) => {
  const totalOrders = db.orders.length;
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = db.orders.filter(o => o.createdAt.startsWith(today)).length;
  
  const totalSales = db.orders
    .filter(o => o.paymentStatus === 'SUCCESS')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = db.orders.filter(o => o.orderStatus === 'PENDING').length;
  const processingOrders = db.orders.filter(o => o.orderStatus === 'PROCESSING').length;
  
  const totalProducts = db.products.length;
  const lowStockProducts = db.products.filter(p => p.stock < 10).length; // using < 10 as low stock threshold, though our mock data doesn't have stock initially, we'll assume 0 if missing.

  res.json({
    totalOrders,
    todaysOrders,
    totalSales,
    pendingOrders,
    processingOrders,
    totalProducts,
    lowStockProducts
  });
});

// --- File Upload ---
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// --- Products CRUD ---
router.get('/products', (req, res) => {
  res.json(db.products);
});

router.post('/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    stock: req.body.stock || 0,
    isActive: req.body.isActive !== false
  };
  db.products.push(newProduct);
  res.json(newProduct);
});

router.put('/products/:id', (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  db.products[index] = { ...db.products[index], ...req.body };
  res.json(db.products[index]);
});

router.delete('/products/:id', (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  db.products.splice(index, 1);
  res.json({ success: true });
});

// --- Orders Management ---
router.get('/orders', (req, res) => {
  // Return sorted by newest first
  const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

router.put('/orders/:id/status', (req, res) => {
  const order = db.orders.find(o => o.orderId === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { orderStatus, paymentStatus } = req.body;
  
  // Security logic: prevent marking an unpaid order as PAID from the admin UI arbitrarily 
  // without proper context, but since this is an admin dashboard, we allow the admin to manually mark it if needed,
  // but let's restrict marking paymentStatus = SUCCESS if it's currently FAILED or PENDING without explicit admin override.
  // The prompt said: "Do not allow the admin UI to incorrectly mark an unpaid order as PAID without proper authorization/audit handling."
  // We will enforce that paymentStatus can only be modified by the webhook/verify endpoints, NOT the admin UI.
  // The admin can only modify orderStatus (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED).
  
  if (orderStatus) {
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
    order.orderStatus = orderStatus;
  }
  
  res.json(order);
});

// --- Offers Management ---
router.get('/offers', (req, res) => {
  res.json(db.offers);
});

router.put('/offers', (req, res) => {
  const { tshirts, jeans } = req.body;
  if (tshirts) db.offers.tshirts = { ...db.offers.tshirts, ...tshirts };
  if (jeans) db.offers.jeans = { ...db.offers.jeans, ...jeans };
  res.json(db.offers);
});

export default router;
