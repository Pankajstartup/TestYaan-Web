import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Papa from 'papaparse';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [liveTests, setLiveTests] = useState([]);
  const navigate = useNavigate();

  // 1. Google Sheet se Data Fetch karna (Sirf Top 4-5 Tests ke liye)
  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (res) => {
            // Sirf wahi tests dikhao jo "Bestseller" ya important hain
            setLiveTests(res.data.slice(0, 5)); 
          }
        });
      });
  }, []);

  // 2. Search Activate karna
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // User ko Tests page par bhej rahe hain query ke saath
      navigate(`/tests?search=${searchTerm}`);
    }
  };

  return (
    <div className="home-container">
      {/* HERO SECTION WITH ACTIVE SEARCH */}
      <section className="hero-amazon">
        <div className="hero-content reveal">
          <h1>TestYaan <span className="yellow">Delhi-NCR</span></h1>
          <p>Book 1000+ Tests from Certified Labs</p>
          
          <form className="search-box-active" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for CBC, Thyroid, PCOD..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* LIVE TESTS FROM GOOGLE SHEET */}
      <section className="trending-section">
        <div className="section-header">
          <h2>Trending Tests in Delhi-NCR</h2>
          <Link to="/tests" className="view-all">View All Labs & Prices →</Link>
        </div>

        <div className="live-test-grid">
          {liveTests.map((test, index) => (
            <div className="premium-card reveal" key={index}>
              <div className="lab-tag">{test.lab}</div>
              <h3>{test.name}</h3>
              <div className="price-row">
                <span className="now">₹{test.price}</span>
                <span className="was">₹{test.originalPrice || (Number(test.price) + 500)}</span>
              </div>
              <p className="reporting">⏱ Reports in 24 Hours</p>
              <button 
                className="compare-btn" 
                onClick={() => navigate('/tests')}
              >
                Compare & Book
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;