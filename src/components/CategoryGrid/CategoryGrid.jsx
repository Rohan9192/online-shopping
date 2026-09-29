import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tshirtCategories, womensCategories } from '../../data/categories';
import { useCollection } from '../../context/CollectionContext';
import './CategoryGrid.css';

export default function CategoryGrid() {
  const { collection } = useCollection();
  const activeCategories = collection === 'WOMEN' ? womensCategories : tshirtCategories;

  return (
    <section className="cat-grid-section container" id="shop-by-category">
      <div className="section-header text-center" style={{ flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
        <h2 className="section-title justify-center" style={{ fontSize: '32px' }}>THE FIT CHECK</h2>
        <p className="section-subtitle">Find the silhouette that feels like you.</p>
      </div>
      <div className="cat-grid">
        {activeCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/category/${category.slug}`}
      className="cat-card"
      id={`cat-card-${category.id}`}
    >
      <div className="cat-card__image-wrapper">
        {!imageLoaded && <div className="skeleton cat-card__skeleton" />}
        <img
          src={category.cardImage}
          alt={`${category.name} T-shirts`}
          className={`cat-card__image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="cat-card__overlay" />
      </div>
      <div className="cat-card__info">
        <h3 className="cat-card__name">{category.name}</h3>
        <p className="cat-card__desc">{category.shortDesc}</p>
        <span className="cat-card__link">SHOP THE FIT &rarr;</span>
      </div>
    </Link>
  );
}
