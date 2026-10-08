import React from 'react';
import { useParams, Link } from 'react-router-dom';

const POLICIES = {
  shipping: {
    title: 'Shipping & Delivery Policy',
    content: (
      <>
        <h3>Delivery Charges</h3>
        <p>At StyleHub, we keep things simple and transparent. We charge a <strong>fixed ₹120 delivery fee per order</strong>, regardless of your location, the weight of your items, or how many items you purchase.</p>
        <p>This fee is applied consistently at checkout and there are no hidden distance or location-based variations.</p>
        
        <h3>Processing Time</h3>
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        
        <h3>Delivery Estimates</h3>
        <p>Standard delivery typically takes 3-7 business days depending on your PIN code. You can verify serviceability and estimated delivery times using the delivery checker on the checkout page.</p>
      </>
    )
  },
  returns: {
    title: 'Returns & Exchanges',
    content: (
      <>
        <h3>Return Window</h3>
        <p>We offer a 30-day easy return policy for all unworn and unwashed items with tags attached.</p>
        
        <h3>Promotional Items</h3>
        <p>Items purchased under the "3 FOR ₹500" T-shirt promotion or "₹1700 FOR 3 JEANS" promotion can be returned. However, returning individual items from a promotional bundle may result in the remaining items being charged at their regular individual prices.</p>
        
        <h3>Refunds</h3>
        <p>Refunds will be processed to the original payment method within 5-7 business days of us receiving the returned item. Note that the <strong>₹120 delivery charge is non-refundable</strong>.</p>
      </>
    )
  },
  terms: {
    title: 'Terms of Service',
    content: (
      <>
        <h3>Promotions & Pricing</h3>
        <p>Our signature promotions (e.g., 3 T-shirts for ₹500) apply automatically at checkout when eligible items are added to your cart. The server calculates all prices authoritatively to ensure fairness.</p>
        <p>StyleHub reserves the right to modify or terminate promotions at any time.</p>
      </>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <>
        <h3>Data Collection</h3>
        <p>We only collect the information necessary to fulfill your order, such as your name, shipping address, email, and mobile number.</p>
        <h3>Notifications</h3>
        <p>If you subscribe to our "New Drop Notifications," we use your email solely to notify you of relevant product launches based on your preferences. You can unsubscribe at any time.</p>
      </>
    )
  },
  about: {
    title: 'About StyleHub',
    content: (
      <>
        <h3>Our Story</h3>
        <p>StyleHub was founded with a simple mission: Premium fashion at unbeatable prices. We believe looking good shouldn't break the bank.</p>
        <h3>Sustainability</h3>
        <p>We are committed to ethical manufacturing and sustainable sourcing for all our materials.</p>
      </>
    )
  },
  faq: {
    title: 'Frequently Asked Questions',
    content: (
      <>
        <h3>How does the 3 for ₹500 offer work?</h3>
        <p>Simply add any 3 eligible T-Shirts to your cart and the discount applies automatically. Mix and match sizes and colors!</p>
        <h3>Do you ship internationally?</h3>
        <p>Currently, we only ship within India. Stay tuned for international shipping updates!</p>
      </>
    )
  },
  contact: {
    title: 'Contact Us',
    content: (
      <>
        <h3>Get In Touch</h3>
        <p>Email: support@stylehub.com</p>
        <p>Phone: 1800-STYLE-HUB (Mon-Fri, 9am-6pm)</p>
        <p>Address: StyleHub HQ, Fashion District, Mumbai, India</p>
      </>
    )
  },
  'size-guide': {
    title: 'Size Guide',
    content: (
      <>
        <h3>How to measure</h3>
        <p>Use our interactive Find My Size tool on any product page for personalized recommendations based on your height, weight, and fit preference.</p>
      </>
    )
  },
  material: {
    title: 'Material & Care',
    content: (
      <>
        <h3>Care Instructions</h3>
        <p>Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.</p>
      </>
    )
  },
  tracking: {
    title: 'Order Tracking',
    content: (
      <>
        <h3>Track Your Order</h3>
        <p>Once your order ships, you will receive an email with a tracking link. You can also track your order from your Account dashboard.</p>
      </>
    )
  }
};

export default function Policies() {
  const { policyId } = useParams();
  const policy = POLICIES[policyId];

  if (!policy) {
    return (
      <div className="container page-enter" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1>Policy Not Found</h1>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '24px' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container page-enter" style={{ padding: '64px 0', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px' }}>
        {policy.title}
      </h1>
      <div className="policy-content" style={{ lineHeight: 1.6, color: 'var(--color-dark-gray)' }}>
        {policy.content}
      </div>
      <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
        <p><strong>Need more help?</strong> Contact our support team at support@stylehub.com</p>
      </div>
    </div>
  );
}
