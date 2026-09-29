import { products as initialProducts } from '../src/data/products.js';

export const db = {
  products: [...initialProducts],
  orders: [],
  offers: {
    tshirts: { active: true, quantity: 3, price: 500 },
    jeans: { active: true, quantity: 3, price: 1000 }
  }
};
