import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <button className="footer-icon-btn" aria-label="Share">
        <span className="material-symbols-rounded">upload</span>
      </button>
      <button className="footer-icon-btn" aria-label="Add">
        <span className="material-symbols-rounded">add_comment</span>
      </button>
      <a
        className="footer-pill"
        href="https://x.com/anshpng"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="footer-pill-label">Created by:</span>
        <span className="footer-pill-handle">@ansh.png</span>
        <span className="material-symbols-rounded footer-pill-link">arrow_outward</span>
      </a>
    </div>
  );
}

export default Footer; 