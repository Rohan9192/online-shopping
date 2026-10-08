import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import HeroSlideshow from '../../components/HeroSlideshow/HeroSlideshow';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid';
import StyleSection from '../../components/StyleSection/StyleSection';
import PromoBanner from '../../components/PromoBanner/PromoBanner';
import TShirtDealSection from '../../components/TShirtDealSection/TShirtDealSection';
import JeansPromoBanner from '../../components/JeansPromoBanner/JeansPromoBanner';
import VibeSelector from '../../components/VibeSelector/VibeSelector';
import FindMyFit from '../../components/FindMyFit/FindMyFit';
import DropSection from '../../components/DropSection/DropSection';
import ColorFilter from '../../components/ColorFilter/ColorFilter';
import CommunityLooks from '../../components/CommunityLooks/CommunityLooks';
import ShopTheLook from '../../components/features/ShopTheLook';
import StyleQuiz from '../../components/features/StyleQuiz';
import Recommendations from '../../components/features/Recommendations';
import NewDropAlerts from '../../components/features/NewDropAlerts';
import { products, getNewArrivals } from '../../data/products';
import { useCollection } from '../../context/CollectionContext';
import './Home.css';

export default function Home() {
  const { collection } = useCollection();

  const allProducts = products.filter(p => p.gender === collection);
  const tshirts = allProducts.filter(p => p.category === 'tshirts');
  const jeans = allProducts.filter(p => p.category === 'jeans');
  const newArrivals = getNewArrivals().filter(p => p.gender === collection);

  // Trending: products with highest reviews or a badge
  const trending = [...allProducts]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8);

  // Best sellers: products with 'Bestseller' badge, then highest rating
  const bestSellers = [...allProducts]
    .sort((a, b) => {
      if (a.badge === 'Bestseller' && b.badge !== 'Bestseller') return -1;
      if (b.badge === 'Bestseller' && a.badge !== 'Bestseller') return 1;
      return b.rating - a.rating;
    })
    .slice(0, 8);

  // Fits under 999
  const fitsUnder999 = [...allProducts]
    .filter(p => p.price < 999)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <div className="home page-enter">
      {/* ===== 1. HERO CATEGORY SLIDESHOW ===== */}
      <HeroSlideshow />

      {/* ===== 2. 3 T-SHIRTS FOR ₹500 PROMO ===== */}
      <PromoBanner onBuildPackClick={() => {
        const el = document.getElementById('tshirt-deal-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* ===== 3. T-SHIRT DEAL SECTION ===== */}
      <TShirtDealSection tshirts={tshirts} />

      {/* ===== 3.5 JEANS PROMO BANNER ===== */}
      <JeansPromoBanner />

      {/* ===== 4. WHAT'S YOUR VIBE? ===== */}
      <VibeSelector />

      {/* ===== 5. TRENDING NOW ===== */}
      <ProductCarousel
        title="TRENDING NOW"
        icon="🔥"
        products={trending}
        viewAllLink="/offers"
        viewAllText="View All →"
      />

      {/* ===== 6. THE FIT CHECK ===== */}
      <CategoryGrid />

      {/* ===== 7. FIND MY FIT ===== */}
      <FindMyFit />

      {/* ===== 8. THE LATEST DROP ===== */}
      <DropSection />

      {/* ===== 9. NEW ARRIVALS ===== */}
      {newArrivals.length > 0 && (
        <section className="product-section container" id="new-arrivals-section">
          <div className="section-header">
            <h2 className="section-title">NEW ARRIVALS</h2>
            <Link to="/new-arrivals" className="section-link">View All →</Link>
          </div>
          <div className="product-grid">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ===== 10. SHOP BY COLOR ===== */}
      <ColorFilter />

      {/* ===== FEATURE: SHOP THE LOOK ===== */}
      <ShopTheLook productsData={allProducts} />

      {/* ===== 11. HOW THEY WEAR IT ===== */}
      <CommunityLooks />

      {/* ===== 12. BEST SELLERS ===== */}
      <ProductCarousel
        title="BEST SELLERS"
        icon="⭐"
        products={bestSellers}
        viewAllLink="/category/tshirts"
        viewAllText="View All →"
      />

      {/* ===== 13. FITS UNDER ₹999 ===== */}
      <ProductCarousel
        title="FITS UNDER ₹999"
        icon="💸"
        products={fitsUnder999}
        viewAllLink="/category/tshirts"
        viewAllText="View All →"
      />

      {/* ===== FEATURE: STYLE QUIZ ===== */}
      <StyleQuiz />

      {/* ===== FEATURE: PERSONALIZED RECOMMENDATIONS ===== */}
      <Recommendations title="Your Style Picks" type="trending" limit={4} />

      {/* ===== EXTRAS ===== */}
      <StyleSection />
      <PromoBanner />



      {/* ===== T-SHIRTS ===== */}
      <section className="product-section container" id="tshirts-section">
        <div className="section-header">
          <h2 className="section-title">T-Shirts</h2>
          <Link to="/category/tshirts" className="section-link">View All →</Link>
        </div>
        <div className="product-grid">
          {tshirts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== JEANS ===== */}
      <section className="product-section container" id="jeans-section">
        <div className="section-header">
          <h2 className="section-title">Jeans</h2>
          <Link to="/category/jeans" className="section-link">View All →</Link>
        </div>
        <div className="product-grid">
          {jeans.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features container" id="features-section">
        <div className="features__grid">
          <div className="feature">
            <div className="feature__icon">🚚</div>
            <h4 className="feature__title">Free Shipping</h4>
            <p className="feature__desc">On orders above ₹999</p>
          </div>
          <div className="feature">
            <div className="feature__icon">↩️</div>
            <h4 className="feature__title">Easy Returns</h4>
            <p className="feature__desc">30-day hassle-free returns</p>
          </div>
          <div className="feature">
            <div className="feature__icon">🔒</div>
            <h4 className="feature__title">Secure Payment</h4>
            <p className="feature__desc">100% secure checkout</p>
          </div>
          <div className="feature">
            <div className="feature__icon">💬</div>
            <h4 className="feature__title">24/7 Support</h4>
            <p className="feature__desc">We're always here to help</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURE: NEW DROP ALERTS ===== */}
      <NewDropAlerts />
    </div>
  );
}
