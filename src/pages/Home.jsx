import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="healthians-home">
      {/* 1. TestYaan Hero Search Section */}
      <section className="main-search-container">
        <div className="grid-layer">
          <div className="text-content">
            <h1>India's No. 1 <span className="highlight-text">TestYaan Partner</span> at Home</h1>
            <p className="sub-header">Book NABL certified full body checkups & blood tests with TestYaan.</p>
            
            <div className="search-box-wrapper">
              <input type="text" placeholder="Search for 'Full Body Advance' or 'Vitamin D'..." />
              <button className="search-btn">Search</button>
            </div>

            <div className="trust-bars">
              <div className="t-item"><span className="icon">✓</span> NABL Accredited Labs</div>
              <div className="t-item"><span className="icon">✓</span> 60 Min Sample Collection</div>
              <div className="t-item"><span className="icon">✓</span> Accredited Reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Health Packages */}
      <section className="packages-container">
        <div className="section-header-flex">
          <h2>Most Booked Health Checkups on TestYaan</h2>
          <a href="/tests" className="view-link">Explore More Tests →</a>
        </div>

        <div className="packages-grid">
          {/* Package Card 1 */}
          <div className="package-card bestselling">
            <span className="bestseller-badge">Bestseller</span>
            <div className="card-top">
              <h3>Full Body Advance</h3>
              <p className="param-count">84+ Parameters</p>
              <ul className="test-list">
                <li>Complete Hemogram</li>
                <li>Vitamin D, B12</li>
                <li>Liver & Kidney Profile</li>
              </ul>
            </div>
            <div className="card-bottom">
              <div className="price-tag">
                <span className="final">₹999</span>
                <span className="original">₹2499</span>
                <span className="save-amount">60% OFF</span>
              </div>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>

          {/* Package Card 2 */}
          <div className="package-card">
            <div className="card-top">
              <h3>Diabetes Care</h3>
              <p className="param-count">3 Parameters</p>
              <ul className="test-list">
                <li>HbA1c</li>
                <li>Fasting Blood Sugar</li>
                <li>PPBS</li>
              </ul>
            </div>
            <div className="card-bottom">
              <div className="price-tag">
                <span className="final">₹499</span>
                <span className="original">₹999</span>
                <span className="save-amount">50% OFF</span>
              </div>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why TestYaan Section */}
      <section className="why-healthians-section">
        <div className="container">
          <h2>Why Choose TestYaan?</h2>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">🏠</div>
              <h4>Free Home Collection</h4>
              <p>Sample collection in 60 minutes by TestYaan experts.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🔬</div>
              <h4>Accredited Labs</h4>
              <p>Reports verified by NABL certified partners.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">📄</div>
              <h4>Digital Reports</h4>
              <p>Get your TestYaan reports online anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;