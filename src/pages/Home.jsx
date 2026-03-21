import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTests, setAllTests] = useState([]); 
  const [displayTests, setDisplayTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null); // Popup Modal ke liye
  const [loading, setLoading] = useState(true);

  // 1. Google Sheet Data Fetch
  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          setAllTests(res.data);
          setDisplayTests(res.data.slice(0, 6)); // Shuru mein top 6 dikhao
          setLoading(false);
        }
      });
    });
  }, []);

  // 2. Live Search Logic (Same Page par results)
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setDisplayTests(allTests.slice(0, 6));
    } else {
      const filtered = allTests.filter(test => 
        test.name?.toLowerCase().includes(value.toLowerCase()) || 
        test.lab?.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayTests(filtered);
    }
  };

  return (
    <div className="home-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* SECTION 1: Blue Hero (Locked Design) */}
      <section className="hero-blue" style={{ 
        height: '450px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' 
      }}>
        <div className="hero-content" style={{ width: '100%', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px' }}>
            TestYaan <span style={{ color: '#fbbf24' }}>Delhi-NCR</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '30px' }}>
            Compare 1000+ Tests from NABL Labs at Amazon-like Prices.
          </p>
          
          {/* Rounded Search Bar */}
          <div className="search-bar-locked" style={{
            background: 'white', padding: '5px', borderRadius: '50px', display: 'flex', maxWidth: '650px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <input 
              type="text" placeholder="Search for CBC, Thyroid, PCOD..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '15px 25px', borderRadius: '50px', outline: 'none', fontSize: '16px', color: '#333' }}
            />
            <button style={{ background: '#fbbf24', color: '#1e3a8a', border: 'none', padding: '0 35px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Dynamic Real Tests Grid */}
      <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#1e3a8a' }}>
          {searchTerm ? `Results for "${searchTerm}"` : 'Trending Health Checks'}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {displayTests.map((test, index) => (
            <div className="test-card" key={index} style={{ 
              background: 'white', borderRadius: '20px', padding: '25px', border: '1px solid #e2e8f0', position: 'relative', transition: '0.3s'
            }}>
              {/* Fasting Badge from Google Sheet */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{test.lab}</span>
                <span style={{ 
                  fontSize: '10px', padding: '3px 10px', borderRadius: '12px', 
                  background: test.Fasting === 'Required' ? '#fee2e2' : '#dcfce7', 
                  color: test.Fasting === 'Required' ? '#ef4444' : '#16a34a',
                  fontWeight: 'bold'
                }}>
                  {test.Fasting === 'Required' ? '⏱ Fasting Required' : '🍕 Non-Fasting'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', margin: '15px 0 5px 0', color: '#1e293b' }}>{test.name}</h3>
              
              <div style={{ margin: '15px 0', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e3a8a' }}>₹{test.price}</span>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '14px' }}>₹{test.originalPrice || (Number(test.price) + 500)}</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  onClick={() => setSelectedTest(test)}
                  style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}>
                  View Details
                </button>
                <button style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPUP MODAL: Parameters from Google Sheet */}
      {selectedTest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setSelectedTest(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f5f9', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            
            <h2 style={{ color: '#1e3a8a', marginBottom: '5px' }}>{selectedTest.name}</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Lab: <b>{selectedTest.lab}</b></p>
            
            <h4 style={{ marginBottom: '10px' }}>Included Parameters:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTest.Parameters ? selectedTest.Parameters.split(',').map((p, i) => (
                <span key={i} style={{ background: '#eff6ff', color: '#1e40af', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', border: '1px solid #bfdbfe' }}>
                  {p.trim()}
                </span>
              )) : "Contact lab for details"}
            </div>

            <button style={{ width: '100%', marginTop: '30px', padding: '15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Confirm Booking (₹{selectedTest.price})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;