import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container" style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* 1. ULTRA MODERN HERO SECTION */}
      <section className="hero" style={{ 
        height: '500px', 
        background: 'linear-gradient(45deg, #1e3a8a 0%, #3b82f6 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div className="hero-content reveal">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px' }}>
            TestYaan <span style={{ color: '#fbbf24' }}>Delhi-NCR</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '30px' }}>
            Compare 1000+ Tests from NABL Labs at Amazon-like Prices.
          </p>
          
          {/* Floating Search Bar */}
          <div className="search-box" style={{ 
            background: 'white', 
            padding: '5px', 
            borderRadius: '50px', 
            display: 'flex', 
            maxWidth: '700px', 
            margin: '0 auto',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
          }}>
            <input type="text" placeholder="Search for CBC, Vitamin D, Full Body..." style={{ flex: 1, border: 'none', padding: '15px 25px', borderRadius: '50px', outline: 'none', fontSize: '16px' }} />
            <button style={{ background: '#fbbf24', color: '#1e3a8a', border: 'none', padding: '15px 40px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SCROLLER (Flip effect) */}
      <div className="categories" style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '-50px', padding: '20px', overflowX: 'auto' }}>
        {['Heart', 'Diabetes', 'Kidney', 'Cancer', 'Full Body'].map((cat) => (
          <div className="cat-circle reveal" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
              <img src={`https://cdn-icons-png.flaticon.com/512/3022/3022216.png`} width="50" alt={cat} />
            </div>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* 3. DYNAMIC TEST GRID (The Amazon "Flip" Style) */}
      <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#1e3a8a' }}>Trending Tests in Delhi-NCR</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          {[1, 2, 3, 4].map((i) => (
            <div className="premium-card reveal" style={{ background: 'white', borderRadius: '20px', padding: '25px', position: 'relative' }}>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Bestseller</span>
              <h3 style={{ marginTop: '15px', fontSize: '1.4rem' }}>Advanced Full Body Checkup</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>84 Parameters Included</p>
              
              <div style={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#1e3a8a' }}>₹999</span>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹2499</span>
              </div>
              
              <Link to="/tests" style={{ display: 'block', textAlign: 'center', background: '#1e3a8a', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>Compare & Book</Link>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default Home;