import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Footer tak scroll karne ka function ab yahan hai
  const scrollToFooter = () => {
    const footer = document.getElementById('contact-section');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
           <img src="/favicon.ico" alt="Logo" style={{ height: '35px' }} />
           <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a', marginLeft: '10px' }}>Test<span style={{ color: '#ffbf00' }}>Yaan</span></span>
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '30px', fontWeight: '600', color: '#475569' }}>
        <Link to="/" style={linkItem}>Home</Link>
        <Link to="/tests" style={linkItem}>Lab Tests</Link>
        <Link to="/packages" style={linkItem}>Health Packages</Link>
        {/* Contact Us par click karne par footer tak jayega */}
        <span onClick={scrollToFooter} style={{ ...linkItem, cursor: 'pointer' }}>Contact Us</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontWeight: '700', color: '#1e3a8a' }}>📞 +91 8130484197</span>
        <Link to="/tests">
          <button style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Book Now</button>
        </Link>
      </div>
    </nav>
  );
};

const linkItem = { textDecoration: 'none', color: 'inherit', fontSize: '15px' };

export default Navbar;