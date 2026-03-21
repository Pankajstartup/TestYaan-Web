import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-content">
          <span className="trust-badge">#1 Trusted Diagnostic Partner</span>
          <h1>Accurate Reports, <br/><span>Trusted by Families.</span></h1>
          <p>Book blood tests from NABL certified labs and get reports on WhatsApp.</p>
          <Link to="/tests" className="cta-button">Browse All Tests</Link>
        </div>
        <div className="hero-image">
          <img src="https://img.freepik.com/free-photo/medium-shot-scientist-working-with-microscope_23-2148813042.jpg" alt="Lab Specialist" />
        </div>
      </section>

      {/* Why TestYaan Section */}
      <section className="why-TestYaan" style={{ padding: '80px 20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '32px' }}>Why Choose TestYaan?</h2>
        <div className="features-grid" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div className="feature-card">
            <div className="fancy-icon">🏆</div>
            <h3>NABL Certified</h3>
            <p>Only top-tier labs for maximum accuracy.</p>
          </div>
          <div className="feature-card">
            <div className="fancy-icon">🏠</div>
            <h3>Free Home Collection</h3>
            <p>Our phlebotomist comes to your doorstep.</p>
          </div>
          <div className="feature-card">
            <div className="fancy-icon">⚡</div>
            <h3>Fast Reports</h3>
            <p>Digital reports delivered within 24 hours.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div><h4>1. Search Test</h4><p>Pick from 1000+ tests</p></div>
          <div><h4>2. Book Slot</h4><p>Choose your time & lab</p></div>
          <div><h4>3. Sample Pickup</h4><p>At your home/office</p></div>
          <div><h4>4. Get Reports</h4><p>Directly on WhatsApp</p></div>
        </div>
      </section>
    </div>
  );
}
export default Home;