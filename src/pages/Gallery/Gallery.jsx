import React, { useState } from 'react';
import './Gallery.css';

const MOCK_GALLERY = [
  { id: 1, img: '/images/gallery-1.jpg', username: '@minimal_fit', likes: 124 },
  { id: 2, img: '/images/gallery-2.jpg', username: '@streetstyle', likes: 89 },
  { id: 3, img: '/images/gallery-3.jpg', username: '@daily_wear', likes: 256 },
  { id: 4, img: '/images/gallery-4.jpg', username: '@urban_chic', likes: 42 }
];

export default function Gallery() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate upload and moderation queue
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="gallery-page page-enter">
      <div className="gallery-hero">
        <h1>Customer Gallery</h1>
        <p>Real fits from the StyleHub community.</p>
        <button className="btn btn-primary" onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}>
          Submit Your Fit
        </button>
      </div>

      <div className="container">
        <div className="gallery-grid">
          {MOCK_GALLERY.map(item => (
            <div key={item.id} className="gallery-item">
              <img src={item.img} alt={`Outfit by ${item.username}`} className="gallery-img" />
              <div className="gallery-overlay">
                <span className="gallery-username">{item.username}</span>
                <span className="gallery-likes">♥ {item.likes}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-upload-section" id="upload-section">
          <h2>Feature Your Fit</h2>
          <p>Upload a photo wearing StyleHub gear. Our team reviews all submissions before they go live on the gallery!</p>
          
          {uploadSuccess ? (
            <div className="gallery-success slide-up-fade">
              <h3>Upload Successful!</h3>
              <p>Thanks for sharing! Your photo is now in our moderation queue and will be published once approved.</p>
            </div>
          ) : (
            <form className="gallery-form" onSubmit={handleUpload}>
              <div className="form-group">
                <label>Select Photo</label>
                <input type="file" accept="image/*" required />
              </div>
              <div className="form-group">
                <label>Instagram Handle (Optional)</label>
                <input type="text" placeholder="@username" />
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="consent" required />
                <label htmlFor="consent">I confirm I have the right to share this image and agree to it being displayed publicly.</label>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Submit Photo'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
