import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProductsByCategory, getNewArrivals, getSaleProducts } from '../../data/products';
import { useCollection } from '../../context/CollectionContext';
import './Category.css';

import { tshirtCategories } from '../../data/categories';

// Build meta for all 11 T-shirt sub-categories
const subCategoryMeta = {};
tshirtCategories.forEach(cat => {
  subCategoryMeta[cat.slug] = {
    title: cat.name,
    description: cat.description,
    promo: '🔥 CHECK OUT OUR LATEST COLLECTION',
    parentCategory: 'tshirts',
  };
});

const categoryMeta = {
  tshirts: {
    title: 'T-Shirts',
    description: 'Premium t-shirts crafted from the finest fabrics',
    promo: '🔥 BUY ANY 3 T-SHIRTS FOR ₹500',
  },
  jeans: {
    title: 'Jeans',
    description: 'Handcrafted denim for the modern wardrobe',
    promo: '🔥 BUY ANY 3 JEANS FOR ₹1,000',
  },
  ...subCategoryMeta,
};

export default function Category() {
  const { slug } = useParams();
  const { collection } = useCollection();
  const meta = categoryMeta[slug];

  if (!meta) {
    return (
      <div className="category-page container page-enter">
        <div className="category-empty">
          <h1>Category not found</h1>
          <p>The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // For sub-categories (waffle, polo, etc.), show tshirts products
  const productSlug = meta.parentCategory || slug;
  const products = getProductsByCategory(productSlug).filter(p => p.gender === collection);

  return (
    <div className="category-page page-enter">
      {/* Hero */}
      <div className={`category-hero category-hero--${slug}`} id={`category-hero-${slug}`}>
        <div className="container">
          <h1 className="category-hero__title">{meta.title}</h1>
          <p className="category-hero__desc">{meta.description}</p>
        </div>
      </div>

      {/* Promo Strip */}
      <div className="category-promo" id="category-promo">
        <div className="container">
          <span>{meta.promo}</span>
        </div>
      </div>

      {/* Products */}
      <div className="container">
        <div className="category-header">
          <p className="category-results">{products.length} products</p>
        </div>
        <div className="product-grid" id={`product-grid-${slug}`}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* New Arrivals page */
export function NewArrivals() {
  const { collection } = useCollection();
  const products = getNewArrivals().filter(p => p.gender === collection);
  return (
    <div className="category-page page-enter">
      <div className="category-hero category-hero--new" id="new-arrivals-hero">
        <div className="container">
          <h1 className="category-hero__title">New Arrivals</h1>
          <p className="category-hero__desc">The latest additions to our collection</p>
        </div>
      </div>
      <div className="container">
        <div className="category-header">
          <p className="category-results">{products.length} products</p>
        </div>
        <div className="product-grid" id="product-grid-new">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Offers page */
export function Offers() {
  const { collection } = useCollection();
  const products = getSaleProducts().filter(p => p.gender === collection);
  return (
    <div className="category-page page-enter">
      <div className="category-hero category-hero--sale" id="offers-hero">
        <div className="container">
          <h1 className="category-hero__title">🔥 LIMITED TIME SALE</h1>
          <p className="category-hero__desc">3 T-Shirts for ₹500 | 3 Jeans for ₹1,000</p>
        </div>
      </div>
      <div className="offers-promos container">
        <div className="offer-promo offer-promo--tshirts">
          <span className="offer-promo__emoji">👕</span>
          <div>
            <h3>3 T-Shirts for ₹500</h3>
            <p>Mix & match any three t-shirts</p>
          </div>
        </div>
        <div className="offer-promo offer-promo--jeans">
          <span className="offer-promo__emoji">👖</span>
          <div>
            <h3>3 Jeans for ₹1,000</h3>
            <p>Pick any three jeans from the collection</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="category-header">
          <p className="category-results">{products.length} products on sale</p>
        </div>
        <div className="product-grid" id="product-grid-sale">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
