import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages'; 
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy'; // Naya Import

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          
          {/* --- MODERN ONE-LINE NAVIGATION BAR --- */}
          <nav style={navStyle} className="main-navbar">
            {/* 1. LEFT: LOGO */}
            <div style={logoContainer}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <img 
                  src="/logo.png" 
                  alt="TestYaan" 
                  style={{ height: '60px', width: 'auto' }} 
                  className="main-logo"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=TestYaan"; }}
                />
              </Link>
            </div>
            
            {/* 2. CENTER: NAV LINKS */}
            <div style={navLinks} className="navLinks">
              <Link to="/" style={linkStyle}>Home</Link>
              <Link to="/tests" style={linkStyle}>Lab Tests</Link>
              <Link to="/packages" style={linkStyle}>Health Packages</Link>
            </div>

            {/* 3. RIGHT: CONTACT & BOOK NOW */}
            <div style={rightSection} className="nav-right">
              <div style={contactStyle}>
                 <span style={{fontSize: '18px'}}>📞</span>
                 <span style={{ fontWeight: '700', color: '#1e3a8a' }}>+91 8130484197</span>
              </div>
              <Link to="/tests" style={{ textDecoration: 'none' }}>
                <button style={ctaButtonStyle}>Book Now</button>
              </Link>
            </div>
          </nav>

          {/* --- ROUTES --- */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/packages" element={<Packages />} /> 
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Naya Route */}
            <Route path="*" element={<Home />} />
          </Routes>

          {/* --- FOOTER --- */}
          <footer id="contact-section" style={footerStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <img src="/logo.png" alt="TestYaan" style={{ height: '45px', marginBottom: '15px', filter: 'brightness(0) invert(1)' }} />
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
              <div>© 2026 TestYaan. All Rights Reserved.</div>
              {/* AdSense ke liye links yahan add kiye hain */}
              <div style={{ marginTop: '10px' }}>
                <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', opacity: '0.8' }}>Privacy Policy</Link>
                <a href="mailto:Helpline.Testyaan@gmail.com" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Contact Us</a>
              </div>
            </div>
          </footer>

        </div>
      </Router>
    </HelmetProvider>
  );
}

/* --- ADVANCED UI STYLES (PURE JS OBJECTS) --- */
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '10px 40px', 
  backgroundColor: 'rgba(255,255,255,0.95)', 
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
  position: 'sticky', 
  top: 0, 
  zIndex: 1000,
  borderBottom: '1px solid #f1f5f9'
};

const logoContainer = { display: 'flex', alignItems: 'center' };
const navLinks = { display: 'flex', gap: '35px' };
const linkStyle = { 
  textDecoration: 'none', 
  color: '#475569', 
  fontWeight: '600', 
  fontSize: '15px',
  transition: '0.3s',
  letterSpacing: '0.3px'
};

const rightSection = { display: 'flex', alignItems: 'center', gap: '25px' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' };

const ctaButtonStyle = { 
  backgroundColor: '#1e3a8a', 
  color: 'white', 
  border: 'none', 
  padding: '12px 28px', 
  borderRadius: '50px', 
  fontWeight: '800', 
  cursor: 'pointer',
  fontSize: '14px',
  boxShadow: '0 4px 15px rgba(30, 58, 138, 0.2)',
  transition: '0.3s'
};

const footerStyle = { backgroundColor: '#1e3a8a', color: 'white', padding: '60px 40px 30px', marginTop: '0' };

export default App;