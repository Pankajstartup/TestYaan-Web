import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const phoneNumber = "9873271763";

  return (
    <header style={{ width: '100%', fontFamily: 'Roboto, Arial, sans-serif' }}>
      
      {/* --- TOP ROYAL BLUE UTILITY BAR --- */}
      <div style={{ background: '#0a3880', color: 'white', padding: '6px 20px', fontSize: '12px', fontWeight: '600' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            ⚡ <span>Compare & Book NABL Accredited Diagnostic Labs in Delhi-NCR</span>
          </div>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <a href={`tel:${phoneNumber}`} style={{ color: '#ffcc00', textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📞 Helpline: +91 {phoneNumber}
            </a>
            <a href={`https://wa.me/91${phoneNumber}?text=Hi%20TestYaan,%20I%20want%20to%20book%20a%20test`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              💬 WhatsApp Booking
            </a>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVIGATION BAR --- */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '12px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* BRAND LOGO */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🩸</span>
            <div>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#0a3880', letterSpacing: '-0.5px' }}>TEST</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#e31837' }}>YAAN</span>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', marginTop: '-4px', letterSpacing: '0.5px' }}>COMPARE & BOOK LABS</div>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#0a3880', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>Home</Link>
            <Link to="/lab-tests" style={{ color: '#334155', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Lab Tests</Link>
            <Link to="/health-packages" style={{ color: '#334155', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Health Packages</Link>
            <Link to="/contact" style={{ color: '#334155', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Contact Us</Link>
          </nav>

          {/* TOP RIGHT BOOK NOW BUTTON */}
          <a 
            href={`tel:${phoneNumber}`} 
            style={{ 
              background: '#e31837', 
              color: 'white', 
              padding: '10px 22px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '800', 
              fontSize: '13px', 
              boxShadow: '0 4px 12px rgba(227,24,55,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📞 Call & Book Now
          </a>

        </div>
      </div>

    </header>
  );
};

export default Navbar;