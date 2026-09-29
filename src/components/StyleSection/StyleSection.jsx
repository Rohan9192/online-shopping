import { Link } from 'react-router-dom';
import './StyleSection.css';

const styles = [
  {
    id: 'everyday',
    title: 'EVERYDAY ESSENTIALS',
    desc: 'Basics that never go out of style',
    slug: 'crewneck',
    bg: 'linear-gradient(135deg, #2c2c2c, #1a1a1a)',
  },
  {
    id: 'streetwear',
    title: 'STREETWEAR',
    desc: 'Bold, oversized and unapologetic',
    slug: 'oversized',
    bg: 'linear-gradient(135deg, #1f1f2e, #0d0d1a)',
  },
  {
    id: 'minimal',
    title: 'MINIMAL',
    desc: 'Clean lines, premium fabrics',
    slug: 'boxy',
    bg: 'linear-gradient(135deg, #3a3a3a, #222)',
  },
  {
    id: 'retro',
    title: 'RETRO',
    desc: 'Vintage vibes, modern comfort',
    slug: 'ringer',
    bg: 'linear-gradient(135deg, #4a3728, #2a1f18)',
  },
  {
    id: 'oversized',
    title: 'OVERSIZED',
    desc: 'Relaxed fits that make a statement',
    slug: 'oversized',
    bg: 'linear-gradient(135deg, #1a2a1a, #0d1a0d)',
  },
  {
    id: 'athletic',
    title: 'ATHLETIC',
    desc: 'Performance meets street style',
    slug: 'raglan',
    bg: 'linear-gradient(135deg, #1a2a4a, #0d1a30)',
  },
];

export default function StyleSection() {
  return (
    <section className="style-section" id="find-your-style">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Find Your Style</h2>
        </div>
        <div className="style-grid">
          {styles.map((style, idx) => (
            <Link
              key={style.id}
              to={`/category/${style.slug}`}
              className={`style-tile ${idx < 2 ? 'style-tile--large' : ''}`}
              style={{ background: style.bg }}
              id={`style-tile-${style.id}`}
            >
              <div className="style-tile__content">
                <h3 className="style-tile__title">{style.title}</h3>
                <p className="style-tile__desc">{style.desc}</p>
                <span className="style-tile__link">SHOP STYLE →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
