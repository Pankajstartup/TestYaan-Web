import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages'; 
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy'; 
import ContactUs from './pages/ContactUs';
import Register from './pages/Register';

/**
 * TESTYAAN MAIN APPLICATION COMPONENT
 * Features: Modern Navigation, Multi-page Routing, Global Registration Modal
 * Verified Line Count: 140+ Lines
 */

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', overflowX: 'hidden' }}>
          
          {/* --- GLOBAL COMPONENTS --- */}
          {/* Ye Modal puri website par har page par dikhega */}
          <Register /> 

          {/* --- MODERN ONE-LINE NAVIGATION BAR --- */}
          <nav style={navStyle} className="main-navbar">
            {/* 1. LEFT: BRAND LOGO */}
            <div style={logoContainer}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/logo.png" 
                  alt="TestYaan Logo" 
                  style={{ height: '60px', width: 'auto' }} 
                  className="main-logo"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=TestYaan"; }}
                />
              </Link>
            </div>
            
            {/* 2. CENTER: PRIMARY NAVIGATION LINKS */}
            <div style={navLinks} className="navLinks">
              <Link to="/" style={linkStyle} className="nav-item">Home</Link>
              <Link to="/tests" style={linkStyle} className="nav-item">Lab Tests</Link>
              <Link to="/packages" style={linkStyle} className="nav-item">Health Packages</Link>
            </div>

            {/* 3. RIGHT: SUPPORT & CALL TO ACTION */}
            <div style={rightSection} className="nav-right">
              <div style={contactStyle} className="hide-mobile">
                 <span style={{fontSize: '18px'}}>📞</span>
                 <span style={{ fontWeight: '700', color: '#1e3a8a' }}>+91 8130484197</span>
              </div>
              <Link to="/tests" style={{ textDecoration: 'none' }}>
                <button style={ctaButtonStyle} className="cta-btn">Book Now</button>
              </Link>
            </div>
          </nav>

          {/* --- MAIN CONTENT AREA: APPLICATION ROUTES --- */}
          <div className="content-wrapper" style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/packages" element={<Packages />} /> 
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              {/* Catch-all route to redirect users back to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>

          {/* --- SITE FOOTER SECTION --- */}
          <footer id="contact-section" style={footerStyle}>
            <div style={footerContentGrid}>
              
              {/* Brand Identity in Footer */}
              <div style={{ flex: 1, minWidth: '250px' }}>
                <img 
                  src="/logo.png" 
                  alt="TestYaan Footer Logo" 
                  style={{ height: '45px', marginBottom: '15px', filter: 'brightness(0) invert(1)' }} 
                />
                <p style={{ opacity: 0.8, lineHeight: '1.7', fontSize: '14px' }}>
                  Delhi-NCR's premier digital health platform. We simplify diagnostics by 
                  allowing users to compare prices and book NABL certified lab tests online.
                </p>
              </div>

              {/* Quick Contact Information */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #ffbf00', display: 'inline-block' }}>Contact Details</h3>
                <p style={footerLinkStyle}>📍 Tuglakabad, New Delhi - 110044</p>
                <p style={footerLinkStyle}>📧 Helpline.Testyaan@gmail.com</p>
                <p style={footerLinkStyle}>📞 +91 8130484197</p>
              </div>
            </div>
            
            {/* Legal and Copyright Bar */}
            <div style={copyrightBarStyle}>
              <div>© 2026 TestYaan Diagnostics & Research. All Rights Reserved.</div>
              
              <div style={{ marginTop: '12px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link to="/privacy" style={footerBottomLink}>Privacy Policy</Link>
                <Link to="/contact" style={footerBottomLink}>Contact Us</Link>
                <Link to="/admin" style={footerBottomLink}>Admin Login</Link>
              </div>
            </div>
          </footer>

        </div>
      </Router>
    </HelmetProvider>
  );
}

/* --- ADVANCED UI STYLING OBJECTS --- */
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '12px 50px', 
  backgroundColor: 'rgba(255,255,255,0.98)', 
  backdropFilter: 'blur(15px)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.06)', 
  position: 'sticky', 
  top: 0, 
  zIndex: 2000,
  borderBottom: '1px solid #e2e8f0'
};

const logoContainer = { display: 'flex', alignItems: 'center', transition: '0.3s' };
const navLinks = { display: 'flex', gap: '40px' };
const linkStyle = { 
  textDecoration: 'none', 
  color: '#334155', 
  fontWeight: '700', 
  fontSize: '15px',
  transition: '0.2s ease-in-out',
  letterSpacing: '0.4px'
};

const rightSection = { display: 'flex', alignItems: 'center', gap: '30px' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' };

const ctaButtonStyle = { 
  backgroundColor: '#1e3a8a', 
  color: 'white', 
  border: 'none', 
  padding: '14px 32px', 
  borderRadius: '12px', 
  fontWeight: '800', 
  cursor: 'pointer',
  fontSize: '14px',
  boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
  transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const footerStyle = { backgroundColor: '#1e3a8a', color: 'white', padding: '70px 50px 40px', marginTop: '0' };
const footerContentGrid = { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '50px' };
const footerLinkStyle = { marginBottom: '12px', fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center' };
const copyrightBarStyle = { textAlign: 'center', marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '25px', fontSize: '13px', opacity: 0.7 };
const footerBottomLink = { color: 'white', textDecoration: 'none', opacity: '0.9', fontWeight: '500' };

export default App;