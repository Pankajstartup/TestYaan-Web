import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages'; 
import './style.css';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy'; 
import ContactUs from './pages/ContactUs';
import Register from './pages/Register';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-container">
          
          {/* GLOBAL COMPONENTS */}
          <Register /> 

          {/* TOP ANNOUNCEMENT BAR */}
          <div className="top-bar">
            <div>⚡ Get Up to 70% Off on NABL Accredited Lab Tests in Delhi-NCR</div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <a href="tel:+918130484197">
                📞 Helpline: +91 8130484197
              </a>
            </div>
          </div>

          {/* MAIN NAVIGATION BAR */}
          <nav className="main-navbar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/logo.png" 
                  alt="TestYaan Logo" 
                  style={{ height: '55px', width: 'auto' }} 
                  className="main-logo"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=TestYaan"; }}
                />
              </Link>
            </div>
            
            <div className="nav-links">
              <Link to="/" className="nav-item">Home</Link>
              <Link to="/tests" className="nav-item">Lab Tests</Link>
              <Link to="/packages" className="nav-item">Health Packages</Link>
              <Link to="/contact" className="nav-item">Contact Us</Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="nav-right">
              <Link to="/tests" style={{ textDecoration: 'none' }}>
                <button className="cta-btn">Book Test Now</button>
              </Link>
            </div>
          </nav>

          {/* MAIN CONTENT ROUTES */}
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/packages" element={<Packages />} /> 
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>

          {/* FOOTER */}
          <footer id="contact-section" className="main-footer-style">
            <div className="footer-content-grid">
              <div style={{ flex: '1 1 300px' }}>
                <img 
                  src="/logo.png" 
                  alt="TestYaan Footer Logo" 
                  style={{ height: '45px', marginBottom: '15px', filter: 'brightness(0) invert(1)' }} 
                />
                <p style={{ opacity: 0.85, lineHeight: '1.7', fontSize: '14px' }}>
                  Delhi-NCR's premier digital health platform. We simplify diagnostics by 
                  allowing users to compare prices and book NABL certified lab tests online.
                </p>
              </div>

              <div style={{ flex: '1 1 180px' }}>
                <h3 className="footer-header-style">Quick Links</h3>
                <p><Link to="/tests" className="footer-bottom-link">All Lab Tests</Link></p>
                <p><Link to="/packages" className="footer-bottom-link">Popular Packages</Link></p>
                <p><Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link></p>
              </div>

              <div style={{ flex: '1 1 250px' }}>
                <h3 className="footer-header-style">Contact Details</h3>
                <p className="footer-link-item">📍 Tuglakabad, New Delhi - 110044</p>
                <p className="footer-link-item">📧 Helpline.Testyaan@gmail.com</p>
                <p className="footer-link-item">📞 +91 8130484197</p>
              </div>
            </div>
            
            <div className="copyright-bar">
              <div>© 2026 TestYaan Diagnostics & Research. All Rights Reserved.</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
                <Link to="/contact" className="footer-bottom-link">Contact Us</Link>
                <Link to="/admin" className="footer-bottom-link">Admin Login</Link>
              </div>
            </div>
          </footer>

        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;