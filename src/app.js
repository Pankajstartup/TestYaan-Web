import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages'; // 1. PEHLE ISSE IMPORT KAREIN
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        
        {/* --- NAVIGATION BAR --- */}
        <nav style={navStyle}>
          <div style={logoContainer}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/favicon.ico" 
                alt="TestYaan Logo" 
                style={{ height: '35px', marginRight: '10px', objectFit: 'contain' }} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
              <h1 style={logoStyle}>Test<span style={{ color: '#ffbf00' }}>Yaan</span></h1>
            </Link>
          </div>
          
          <div style={navLinks} className="navLinks">
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/tests" style={linkStyle}>Lab Tests</Link>
            <Link to="/packages" style={linkStyle}>Health Packages</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e3a8a' }}>📞 +91 8130484197</span>
            <Link to="/tests">
              <button style={ctaButtonStyle}>Book Now</button>
            </Link>
          </div>
        </nav>

        {/* --- ROUTING LOGIC --- */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          {/* 2. YAHAN PACKAGES KA ROUTE ADD KIYA HAI */}
          <Route path="/packages" element={<Packages />} /> 
          <Route path="*" element={<Home />} />
        </Routes>

        {/* --- FOOTER --- */}
        <footer id="contact-section" style={footerStyle}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h2 style={{ color: '#ffbf00', marginBottom: '15px' }}>TestYaan</h2>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                Delhi-NCR's leading platform to compare and book lab tests from NABL certified laboratories.
              </p>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ marginBottom: '20px' }}>Contact Details</h3>
              <p style={{ marginBottom: '10px' }}>📍 Tuglakabad, New Delhi - 110044</p>
              <p style={{ marginBottom: '10px' }}>📧 Helpline.Testyaan@gmail.com</p>
              <p style={{ marginBottom: '10px' }}>📞 +91 8130484197</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '14px', opacity: 0.6 }}>
            © 2026 TestYaan. All Rights Reserved.
          </div>
        </footer>

      </div>
    </Router>
  );
}

// Styles (Aapke original styles locked hain)
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 };
const logoContainer = { display: 'flex', alignItems: 'center' };
const logoStyle = { fontSize: '24px', fontWeight: '900', color: '#1e3a8a', margin: 0 };
const navLinks = { display: 'flex', gap: '30px' };
const linkStyle = { textDecoration: 'none', color: '#334155', fontWeight: '600', fontSize: '15px' };
const ctaButtonStyle = { backgroundColor: '#1e3a8a', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const footerStyle = { backgroundColor: '#1e3a8a', color: 'white', padding: '80px 60px 30px', marginTop: '50px' };

export default App;