import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="main-nav">
      <div className="top-strip">
        <div className="location-box">
          📍 Serving: <b>Delhi-NCR</b> (Gurgaon, Noida, Delhi)
        </div>
        <div className="contact-info">
          📞 Support: 999-XXX-XXXX | ✉️ info@testyaan.online
        </div>
      </div>
      <div className="nav-body">
        <div className="logo">Test<span>Yaan</span></div>
        <ul className="nav-links">
          <li>Full Body Checkup</li>
          <li>Heart</li>
          <li>Diabetes</li>
          <li>Cancer</li>
          <li>Thyroid</li>
        </ul>
        <button className="login-btn">Login / Signup</button>
      </div>
    </nav>
  );
};

export default Navbar;