import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tshirtCategories, womensCategories, mensPantsCategories, womensPantsCategories, mensShirtsCategories, womensShirtsCategories } from '../../data/categories';
import { useCollection } from '../../context/CollectionContext';
import { useClothingType } from '../../context/ClothingTypeContext';
import './CategoryGrid.css';

export default function CategoryGrid() {
  const { collection } = useCollection();
  const { clothingType } = useClothingType();

  const getActiveCategories = () => {
    if (clothingType === 'PANTS') {
      return collection === 'WOMEN' ? womensPantsCategories : mensPantsCategories;
    }
    if (clothingType === 'SHIRTS') {
      return collection === 'WOMEN' ? womensShirtsCategories : mensShirtsCategories;
    }
    return collection === 'WOMEN' ? womensCategories : tshirtCategories;
  };

  const activeCategories = getActiveCategories();
  
  let sectionTitle = 'THE FIT CHECK';
  let sectionSubtitle = 'Find the silhouette that feels like you.';
  if (clothingType === 'PANTS') {
    sectionTitle = 'THE PANT CHECK';
    sectionSubtitle = 'Find the perfect pants silhouette for your style.';
  } else if (clothingType === 'SHIRTS') {
    sectionTitle = 'THE SHIRT CHECK';
    sectionSubtitle = 'Find the perfect shirt style for any occasion.';
  }

  return (
    <section className="cat-grid-section container" id="shop-by-category">
      <div className="section-header text-center" style={{ flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
        <h2 className="section-title justify-center" style={{ fontSize: '32px' }}>{sectionTitle}</h2>
        <p className="section-subtitle">{sectionSubtitle}</p>
      </div>
      <div className="cat-grid">
        {activeCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} clothingType={clothingType} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, clothingType }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const altText = clothingType === 'PANTS' ? `${category.name} pants` : clothingType === 'SHIRTS' ? `${category.name} shirts` : `${category.name} T-shirts`;
  const linkLabel = 'SHOP THE FIT →';

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
          alt={altText}
          className={`cat-card__image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="cat-card__overlay" />
      </div>
      <div className="cat-card__info">
        <h3 className="cat-card__name">{category.name}</h3>
        <p className="cat-card__desc">{category.shortDesc}</p>
        <span className="cat-card__link">{linkLabel}</span>
      </div>
    </Link>
  );
}
