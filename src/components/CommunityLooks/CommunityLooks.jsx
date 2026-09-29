import { Link } from 'react-router-dom';
import { tshirtCategories } from '../../data/categories';
import './CommunityLooks.css';

export default function CommunityLooks() {
  // Use a subset of the generated 4K images to simulate user generated content
  const looks = tshirtCategories.slice(0, 6).map((cat, index) => ({
    id: `look-${index}`,
    image: cat.heroImage,
    username: `@style_${cat.slug}`,
    categoryName: cat.name,
    categorySlug: cat.slug
  }));

  return (
    <section className="community-looks container" id="community-looks">
      <div className="section-header text-center">
        <h2 className="section-title justify-center">HOW THEY WEAR IT</h2>
        <p className="section-subtitle">Real fits. Real people. Your next look.</p>
      </div>

      <div className="looks-grid">
        {looks.map((look) => (
          <div key={look.id} className="look-card">
            <div className="look-card__img-wrapper">
              <img src={look.image} alt={`${look.categoryName} style`} className="look-card__img" loading="lazy" />
              <div className="look-card__overlay">
                <div className="look-card__info">
                  <span className="look-username">{look.username}</span>
                  <Link to={`/category/${look.categorySlug}`} className="btn btn-secondary btn-sm look-shop-btn">
                    SHOP THE LOOK &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center" style={{ marginTop: '32px' }}>
        <button className="btn btn-secondary btn-lg">VIEW MORE ON INSTAGRAM</button>
      </div>
    </section>
  );
}
