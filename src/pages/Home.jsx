import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal'; // Pop-up import

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTests, setAllTests] = useState([]); 
  const [displayTests, setDisplayTests] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [testToBook, setTestToBook] = useState(null);

  useEffect(() => {
    // Apni Google Sheet ka CSV link yahan dalein
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          setAllTests(res.data);
          setDisplayTests(res.data.slice(0, 4)); // Sirf 4 tests dikhane ke liye
        }
      });
    });
  }, []);

  const handleBooking = (test) => {
    setTestToBook(test);
    setIsBookingOpen(true);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', position: 'relative' }}>
      
      {/* 1. TOP NAVBAR (Contact & Book Now) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '12px 60px', backgroundColor: 'white', gap: '25px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '500' }}>📞 +91 9876543210</span>
        <button style={{ backgroundColor: '#ffbf00', border: 'none', padding: '10px 25px', borderRadius: '10px', color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.3s' }}>Book Now</button>
      </div>

      {/* 2. HERO SECTION (Locked Design - Dittoo!) */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
        padding: '80px 60px 100px', 
        color: 'white', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ flex: 1.2, zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontSize: '3.2rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '15px' }}>
            Compare & Book Lab Tests <br />
            <span style={{ color: '#ffbf00' }}>Delhi-NCR</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '35px', opacity: 0.9, maxWidth: '550px' }}>Save upto 50% on lab tests from top NABL certified labs.</p>
          
          {/* SEARCH BAR */}
          <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '6px', maxWidth: '650px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <input 
              type="text" 
              placeholder="Search for CBC, Vitamin D, Lab..." 
              style={{ flex: 1, border: 'none', padding: '16px 30px', borderRadius: '50px', outline: 'none', fontSize: '16px', color: '#333' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button style={{ backgroundColor: '#ffbf00', border: 'none', borderRadius: '50px', padding: '0 30px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</button>
          </div>

          {/* FLOATING BADGES (Glassmorphism) */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '50px', position: 'absolute', bottom: '-70px' }}>
            <div style={badgeStyle}>🛡️ Trusted NABL Labs</div>
            <div style={badgeStyle}>🚲 Home Sample Collection</div>
            <div style={badgeStyle}>⭐ 100% Safe (4.8 Rating)</div>
          </div>
        </div>

        {/* ✅ DITTO IMAGE INTEGRATION (Image Path Locked) */}
        <div style={{ flex: 0.8, zIndex: 1, position: 'relative', textAlign: 'center' }}>
           <img 
             src="/images/test-tubes.png" // 👈 Aapne public folder mein image save ki hai, uska path yahan likhein
             alt="TestTube Centrifuge" 
             style={{ width: '480px', position: 'absolute', top: '-150px', right: '-50px', transform: 'rotate(-5deg)', opacity: 0.9 }}
           />
        </div>
      </section>

      {/* 3. POPULAR TESTS GRID (Glassmorphism Cards) */}
      <section style={{ padding: '120px 60px 80px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a8a', fontSize: '2.5rem', fontWeight: '800', marginBottom: '50px' }}>Popular Lab Tests</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1300px', margin: '0 auto' }}>
          {displayTests.map((test, index) => (
            <div key={index} className="hover-card" style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                 <div style={{ backgroundColor: '#fffbe6', color: '#b27a00', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>Dr Lal Pathlabs</div>
                 <span style={{ fontSize: '13px', color: '#666', border: '1px solid #e0e0e0', padding: '4px 10px', borderRadius: '20px' }}><input type="checkbox" /> Compare</span>
              </div>
              <h3 style={{ margin: '20px 0 10px 0', fontSize: '1.4rem', color: '#1a1a1a', fontWeight: '700' }}>{test.name}</h3>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '25px' }}>⏱ {test.Fasting || "Non-Fasting"}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e3a8a' }}>₹{test.price}</span>
                <span style={{ fontSize: '15px', textDecoration: 'line-through', color: '#999' }}>₹1000</span>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
                <button style={{ flex: 1, padding: '14px', border: '1px solid #e0e0e0', background: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', transition: '0.3s' }}>Compare</button>
                <button 
                   onClick={() => handleBooking(test)}
                   style={{ flex: 1, padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.3s' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHATSAPP FLOATING BUTTON (DITTO!) */}
      <a 
        href="https://wa.me/919876543210" // Apne WhatsApp number se replace karein
        target="_blank" 
        rel="noreferrer"
        style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', color: 'white', width: '65px', height: '65px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 1000, textDecoration: 'none' }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{ width: '35px' }} />
      </a>

      {/* Booking Form Pop-up */}
      {isBookingOpen && testToBook && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          testName={testToBook.name} 
          price={testToBook.price} 
          labName={testToBook.lab} 
        />
      )}
    </div>
  );
};

// --- STYLES ---
const badgeStyle = { 
  background: 'rgba(255,255,255,0.1)', // Transparent glass effect
  color: 'white', 
  padding: '12px 20px', 
  borderRadius: '15px', 
  backdropFilter: 'blur(10px)', // Blur effect for glassmorphism
  fontSize: '14px', 
  fontWeight: '500',
  border: '1px solid rgba(255,255,255,0.2)' // Border for glass effect
};

const cardStyle = { 
  background: 'rgba(255,255,255,0.8)', // Semi-transparent card
  backdropFilter: 'blur(10px)',
  padding: '30px', 
  borderRadius: '28px', 
  boxShadow: '0 15px 35px rgba(0,0,0,0.06)', 
  border: '1px solid rgba(255,255,255,0.5)', // Border for glass effect
  transition: '0.3s'
};

export default Home;