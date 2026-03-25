import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  // Navigation Links ki styling
  const getNavLinkStyle = (path) => ({
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: location.pathname === path ? '#1e40af' : '#4b5563', // Active tab blue dikhega
    padding: '8px 12px',
    borderRadius: '8px',
    transition: '0.3s',
    backgroundColor: location.pathname === path ? '#eff6ff' : 'transparent',
  });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      {/* --- GLOBAL HEADER --- */}
      <header style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 5000, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '15px 60px', maxWidth: '1400px', margin: '0 auto' 
        }}>
          
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#1e40af', letterSpacing: '-1px' }}>
              TestYaan<span style={{ color: '#ffbf00' }}>.</span>
            </div>
          </Link>
          
          {/* NAVIGATION TABS */}
          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/" style={getNavLinkStyle('/')}>Home</Link>
            <Link to="/tests" style={getNavLinkStyle('/tests')}>Tests</Link>
            <Link to="/packages" style={getNavLinkStyle('/packages')}>Packages</Link>
            
            {/* VETICAL DIVIDER */}
            <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb', margin: '0 10px' }}></div>
            
            {/* CONTACT & BOOK NOW */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>
                📞 +91 9876543210
              </span>
              <button style={{ 
                backgroundColor: '#ffbf00', color: 'white', border: 'none', 
                padding: '10px 22px', borderRadius: '12px', fontWeight: 'bold', 
                fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255, 191, 0, 0.3)' 
              }}>
                Book Now
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      {/* Margin top is important taaki header content ko na chhupaye */}
      <main style={{ paddingTop: '75px' }}>
        {children}
      </main>

      {/* --- WHATSAPP FLOATING BUTTON (DITTO!) --- */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noreferrer"
        style={{ 
          position: 'fixed', bottom: '30px', right: '30px', 
          backgroundColor: '#25d366', width: '60px', height: '60px', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.4)', 
          zIndex: 10000, transition: '0.3s'
        }}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="Chat" 
          style={{ width: '32px' }} 
        />
      </a>
    </div>
  );
};

export default Layout;