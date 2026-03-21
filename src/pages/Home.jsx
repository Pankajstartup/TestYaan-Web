import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Search Section */}
      <section className="main-search-area">
        <div className="content-box">
          <h1 className="main-title">Modern Diagnostics, <span className="blue-text">Trusted Care.</span></h1>
          <p className="sub-title">Book NABL Lab Tests & Health Packages from the comfort of your home.</p>
          
          <div className="search-bar-wrap">
            <input type="text" placeholder="Search for 'Full Body Checkup' or 'CBC'..." />
            <button className="search-trigger">Search</button>
          </div>

          <div className="mini-features">
            <div className="f-item">✨ 60 Min Collection</div>
            <div className="f-item">📄 Digital Reports</div>
            <div className="f-item">🛡️ Safe & Hygenic</div>
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="test-grid-section">
        <div className="container">
          <div className="header-flex">
            <h2>Popular Health Checkups</h2>
            <a href="/tests" className="view-link">Explore All Tests →</a>
          </div>

          <div className="cards-container">
            {/* Card 1 */}
            <div className="modern-card">
              <div className="card-top">
                <span className="tag-green">MOST POPULAR</span>
                <h3>Full Body Advance</h3>
                <p>Includes 84 Parameters</p>
              </div>
              <div className="card-bottom">
                <div className="pricing">
                  <span className="amt">₹999</span>
                  <span className="old-amt">₹2499</span>
                </div>
                <button className="add-to-cart">Book Now</button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="modern-card">
              <div className="card-top">
                <span className="tag-blue">SMART CHOICE</span>
                <h3>Vital Care Package</h3>
                <p>Includes 60 Parameters</p>
              </div>
              <div className="card-bottom">
                <div className="pricing">
                  <span className="amt">₹699</span>
                  <span className="old-amt">₹1500</span>
                </div>
                <button className="add-to-cart">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;