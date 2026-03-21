import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; // PapaParse import karein (Google Sheet ke liye)
import './Home.css'; // Apni purani style file

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [liveTests, setLiveTests] = useState([]);
  const navigate = useNavigate();

  // 1. Google Sheet (PapaParse) se Trending Tests Fetch karna
  useEffect(() => {
    // Ye wahi CSV link hai jo aapne pehle use kiya tha
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    
    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (res) => {
            // Hum sirf top 5 trending tests dikhayenge (slice se)
            setLiveTests(res.data.slice(0, 10)); 
          }
        });
      });
  }, []);

  // 2. Search Bar Activation Logic
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // User ko 'Tests' page par query ke saath bhej rahe hain
      navigate(`/tests?search=${searchTerm}`);
    }
  };

  return (
    <div className="home-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* SECTION 1: Blue Hero (bilkul image_2.png jaisa) */}
      <section className="hero-blue" style={{ 
        height: '450px', 
        background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px' }}>
            TestYaan <span style={{ color: '#fbbf24' }}>Delhi-NCR</span>
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.2rem', marginBottom: '30px' }}>
            Compare 1000+ Tests from NABL Labs at Amazon-like Prices.
          </p>
          
          {/* Rounded Search Bar - Active Logic */}
          <form className="search-form-active" onSubmit={handleSearchSubmit} style={{
            background: 'white', padding: '5px', borderRadius: '50px', display: 'flex', maxWidth: '650px', margin: '0 auto', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
          }}>
            <input 
              type="text" 
              placeholder="Search for CBC, Vitamin D, Full Body Checkup..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '15px 25px', borderRadius: '50px', outline: 'none', fontSize: '16px' }}
            />
            <button type="submit" style={{ background: '#fbbf24', color: '#1e3a8a', border: 'none', padding: '15px 35px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 2: Categories (Yahan Real Tests dikhenge round categories ke niche) */}
      <section className="trending-tests-section" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '30px', color: '#1e3a8a' }}>Book Tests in Delhi-NCR</h2>
        
        {/* Real Dynamic Grid from Google Sheet */}
        <div className="live-test-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {liveTests.map((test, index) => (
            <div className="live-card" key={index} style={{ background: 'white', borderRadius: '20px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div className="lab-logo-placeholder" style={{ background: '#f1f5f9', height: '50px', width: '50px', borderRadius: '12px', marginBottom: '15px' }}>
                 {/* Agar Sheet mein logoUrl hai toh wahan daalein */}
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#1e293b' }}>{test.name}</h3>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '5px 0 20px 0' }}>Available at: <span style={{fontWeight:'bold', color: '#2563eb'}}>{test.lab}</span></p>
              
              <div className="price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '20px 0' }}>
                <span className="current-price" style={{ fontSize: '2rem', fontWeight: '900', color: '#1e3a8a' }}>₹{test.price}</span>
                <span className="was-price" style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{test.originalPrice || (Number(test.price) + 500)}</span>
              </div>
              
              <button onClick={() => navigate('/tests')} style={{ display: 'block', textAlign: 'center', background: '#1e3a8a', color: 'white', padding: '12px', width: '100%', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Compare Labs</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;