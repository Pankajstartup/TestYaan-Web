import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [allTests, setAllTests] = useState([]);
  const [displayTests, setDisplayTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          setAllTests(res.data);
          setDisplayTests(res.data.slice(0, 6)); // Shuruat mein 6 tests
        }
      });
    });
  }, []);

  const handleBooking = (test) => {
    const query = `?test=${encodeURIComponent(test.name)}&lab=${encodeURIComponent(test.lab)}&price=${test.price}`;
    navigate(`/order${query}`);
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
    const filtered = allTests.filter(t => 
      t.name?.toLowerCase().includes(val.toLowerCase()) || 
      t.lab?.toLowerCase().includes(val.toLowerCase())
    );
    setDisplayTests(filtered.slice(0, 6));
  };

  return (
    <div className="home-container">
      <section className="hero-blue" style={{ height: '400px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: '100%', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>TestYaan <span style={{ color: '#fbbf24' }}>Delhi-NCR</span></h1>
          <p>Book Lab Tests from NABL Certified Labs</p>
          <div style={{ background: 'white', padding: '5px', borderRadius: '50px', maxWidth: '600px', margin: '20px auto', display: 'flex' }}>
            <input type="text" placeholder="Search CBC, Thyroid, Dr Lal..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} style={{ flex: 1, border: 'none', padding: '15px 25px', borderRadius: '50px', outline: 'none' }} />
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '50px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {displayTests.map((test, i) => (
            <div key={i} className="test-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                {test.logoUrl ? <img src={test.logoUrl} style={{ height: '30px' }} alt="logo" /> : <b>{test.lab}</b>}
                <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a' }}>{test["Fasting/Non Fasting"] || 'Non-Fasting'}</span>
              </div>
              <h3>{test.name}</h3>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e3a8a' }}>₹{test.price}</div>
              <button onClick={() => handleBooking(test)} style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Book Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;