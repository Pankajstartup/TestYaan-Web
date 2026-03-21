import React from 'react';

// onBookClick prop ko yahan add kiya gaya hai
export default function LabCard({ name, price, lab, logoUrl, onBookClick }) {
  return (
    <div className="card" style={cardContainerStyle}>
      {/* Logo Section */}
      <div className="lab-logo-wrapper" style={logoWrapperStyle}>
        {logoUrl ? (
          <img src={logoUrl} alt={lab} style={logoImageStyle} />
        ) : (
          <span style={textLogoStyle}>{lab}</span>
        )}
      </div>

      <div style={{ padding: '10px 0' }}>
        <h3 style={titleStyle}>{name}</h3>
        <p style={{ fontSize: '12px', color: '#888', margin: '5px 0' }}>By {lab}</p>
        <div className="price-tag" style={priceStyle}>₹{price}</div>
      </div>

      {/* Link ko hata kar Button banaya gaya hai jo onBookClick trigger karega */}
      <button 
        onClick={onBookClick} 
        className="book-btn"
        style={buttonStyle}
      >
        Book Now
      </button>
    </div>
  );
}

const cardContainerStyle = {
  background: '#fff',
  borderRadius: '20px', // Thoda zyada round modern look ke liye
  padding: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  textAlign: 'center',
  width: '100%', // Parent grid (Tests.jsx) ise control karega
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid #edf2f7',
  transition: 'transform 0.3s ease'
};

const logoWrapperStyle = {
  width: '100%',
  height: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  padding: '10px',
  boxSizing: 'border-box',
  marginBottom: '15px',
  overflow: 'hidden'
};

const logoImageStyle = {
  maxHeight: '80%',
  maxWidth: '90%',
  objectFit: 'contain',
  display: 'block'
};

const textLogoStyle = { fontWeight: 'bold', color: '#0056b3', fontSize: '16px' };
const titleStyle = { fontSize: '16px', fontWeight: '700', color: '#1a365d', margin: '0', height: '40px', overflow: 'hidden' };
const priceStyle = { fontSize: '22px', fontWeight: '800', color: '#1a365d', margin: '10px 0' };

const buttonStyle = { 
  display: 'block', 
  width: '100%',
  background: '#0056b3', 
  color: '#fff', 
  border: 'none', // Button ke liye border none zaruri hai
  padding: '12px', 
  borderRadius: '10px', 
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background 0.3s'
};