import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom'; // ✅ Navigation ke liye add kiya
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTests, setAllTests] = useState([]); 
  const [displayTests, setDisplayTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          setAllTests(res.data);
          setDisplayTests(res.data.slice(0, 6)); 
        }
      });
    });
  }, []);

  // ✅ FIXED BOOKING FUNCTION: Ab ye WhatsApp nahi, Order Page par bhejega
  const handleBooking = (test) => {
    const query = `?test=${encodeURIComponent(test.name)}&lab=${encodeURIComponent(test.lab)}&price=${test.price}`;
    navigate(`/order${query}`); // ✅ Ye line aapko Order Page par le jayegi
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setDisplayTests(allTests.slice(0, 6));
    } else {
      const filtered = allTests.filter(test => 
        (test.name && test.name.toLowerCase().includes(value.toLowerCase())) || 
        (test.lab && test.lab.toLowerCase().includes(value.toLowerCase()))
      );
      setDisplayTests(filtered);
    }
  };

  return (
    <div className="home-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🔵 Wahi Original Blue Hero Section */}
      <section className="hero-blue" style={{ 
        height: '400px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' 
      }}>
        <div className="hero-content" style={{ width: '100%', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>
            TestYaan <span style={{ color: '#fbbf24' }}>Delhi-NCR</span>
          </h1>
          <p style={{ opacity: 0.9, marginBottom: '30px' }}>Compare 1000+ Tests from NABL Labs</p>
          
          <div className="search-bar-locked" style={{
            background: 'white', padding: '5px', borderRadius: '50px', display: 'flex', maxWidth: '600px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <input 
              type="text" placeholder="Search for CBC, Vitamin D, Lab Name..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '15px 25px', borderRadius: '50px', outline: 'none', fontSize: '16px', color: '#333' }}
            />
          </div>
        </div>
      </section>

      {/* 📦 Tests Grid */}
      <section style={{ maxWidth: '1200px', margin: '50px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {displayTests.map((test, index) => (
            <div className="test-card" key={index} style={{ background: 'white', borderRadius: '20px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                {test.logoUrl ? (
                  <img src={test.logoUrl} alt={test.lab} style={{ height: '30px', maxWidth: '100px', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{test.lab}</span>
                )}
                
                <span style={{ 
                  fontSize: '10px', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold',
                  background: test["Fasting/Non Fasting"]?.toLowerCase().includes('required') ? '#fee2e2' : '#dcfce7', 
                  color: test["Fasting/Non Fasting"]?.toLowerCase().includes('required') ? '#ef4444' : '#16a34a',
                }}>
                  {test["Fasting/Non Fasting"] || 'Non-Fasting'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', margin: '15px 0', minHeight: '50px' }}>{test.name}</h3>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e3a8a' }}>₹{test.price}</div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setSelectedTest(test)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Details</button>
                
                <button 
                  onClick={() => handleBooking(test)}
                  style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details Popup */}
      {selectedTest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', maxWidth: '450px', width: '90%', position: 'relative' }}>
            <button onClick={() => setSelectedTest(null)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: '#1e3a8a' }}>{selectedTest.name}</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>Lab: {selectedTest.lab}</p>
            
            <h4 style={{ marginBottom: '10px' }}>Parameters:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTest.Parameter ? selectedTest.Parameter.split(',').map((p, i) => (
                <span key={i} style={{ background: '#eff6ff', color: '#1e40af', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', border: '1px solid #bfdbfe' }}>
                  {p.trim()}
                </span>
              )) : <p style={{ fontSize: '12px', color: '#999' }}>Check with lab for full list.</p>}
            </div>
            
            <button 
              onClick={() => handleBooking(selectedTest)}
              style={{ width: '100%', marginTop: '25px', padding: '15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;