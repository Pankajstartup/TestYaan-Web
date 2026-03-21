import React from 'react';
import './Home.css'; // Iska CSS niche diya hai

const Home = () => {
  return (
    <div className="home-container">
      {/* 1. Hero Section with Search */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>India's Most Trusted <span className="highlight">Diagnostic Partner</span></h1>
          <p>Book 2000+ Tests from NABL Certified Labs at Home</p>
          
          <div className="search-container">
            <input type="text" placeholder="Search for Blood Test, Thyroid, Full Body Checkup..." />
            <button className="search-btn">Search</button>
          </div>

          <div className="trust-badges">
            <span>✓ NABL Accredited</span>
            <span>✓ 60 Min Collection</span>
            <span>✓ Digital Reports</span>
          </div>
        </div>
      </section>

      {/* 2. Popular Test Packages */}
      <section className="packages-section">
        <div className="section-header">
          <h2>Popular Health Packages</h2>
          <button className="view-all">View All</button>
        </div>

        <div className="package-grid">
          {/* Package Card 1 */}
          <div className="package-card bestseller">
            <span className="badge">Bestseller</span>
            <h3>Full Body Checkup</h3>
            <p className="test-includes">Includes 80+ Parameters</p>
            <div className="price-tag">
              <span className="current">₹799</span>
              <span className="original">₹1999</span>
              <span className="discount">60% OFF</span>
            </div>
            <button className="book-btn">Book Now</button>
          </div>

          {/* Package Card 2 */}
          <div className="package-card">
            <h3>Diabetes Care</h3>
            <p className="test-includes">HbA1c, FBS, PPBS</p>
            <div className="price-tag">
              <span className="current">₹499</span>
              <span className="original">₹999</span>
              <span className="discount">50% OFF</span>
            </div>
            <button className="book-btn">Book Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;