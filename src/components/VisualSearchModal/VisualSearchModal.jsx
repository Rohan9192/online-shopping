import React, { useState, useRef } from 'react';
import './VisualSearchModal.css';

export default function VisualSearchModal({ isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsSearching(true);
    // Simulate delay
    setTimeout(() => {
      setIsSearching(false);
      setError("Visual embedding service and vector search infrastructure are not yet configured. Please configure an image search provider in the backend to enable this feature.");
    }, 1500);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="visual-search-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Visual Search</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <p className="visual-search-desc">Upload a photo to find visually similar items from our catalogue.</p>
          
          {!selectedImage ? (
            <div className="visual-search-upload" onClick={() => fileInputRef.current?.click()}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px', color: 'var(--color-gray)'}}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Click to browse or drag image here</p>
              <span className="upload-hint">Supports JPG, PNG (Max 5MB)</span>
            </div>
          ) : (
            <div className="visual-search-preview">
              <img src={selectedImage} alt="Search reference" />
              <div className="preview-actions">
                <button className="btn btn-outline btn-sm" onClick={handleClear} disabled={isSearching}>
                  Choose Another
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search Catalogue'}
                </button>
              </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png,image/webp" 
            style={{ display: 'none' }} 
          />

          {error && (
            <div className="visual-search-error slide-up-fade">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
