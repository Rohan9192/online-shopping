import { Link } from 'react-router-dom';
import './DropSection.css';

export default function DropSection() {
  return (
    <section className="drop-section container" id="latest-drop">
      <div className="drop-banner">
        <div className="drop-banner__bg">
          <img 
            src="/images/heroes/boxy.jpg" 
            alt="Latest Drop Collection" 
            className="drop-banner__img"
            loading="lazy"
          />
          <div className="drop-banner__overlay"></div>
        </div>
        <div className="drop-banner__content">
          <span className="drop-badge">DROP 03</span>
          <h2 className="drop-title">STREET FORM</h2>
          <p className="drop-desc">THE NEXT FIT IS COMING.</p>
          <div className="drop-actions">
            <Link to="/category/boxy" className="btn btn-primary btn-lg">
              SHOP THE DROP &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
