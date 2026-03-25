import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTests, setAllTests] = useState([]); 
  const [displayTests, setDisplayTests] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [testToBook, setTestToBook] = useState(null);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          setAllTests(res.data);
          setDisplayTests(res.data.slice(0, 4)); 
        }
      });
    });
  }, []);

  const handleBooking = (test) => {
    setTestToBook(test);
    setIsBookingOpen(true);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f0f7ff' }}>
      
      {/* 1. TOP NAVBAR (Contact & Book Now) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 50px', backgroundColor: 'white', gap: '20px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: '14px', color: '#333' }}>📞 +91 9876543210</span>
        <button style={{ backgroundColor: '#ffb800', border: 'none', padding: '8px 20px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Book Now</button>
      </div>

      {/* 2. HERO SECTION (Blue Gradient + Image) */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
        padding: '60px 50px', 
        color: 'white', 
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2' }}>
            Compare & Book Lab Tests <br />
            <span style={{ color: '#ffb800' }}>Delhi-NCR</span>
          </h1>
          <p style={{ fontSize: '1.1rem', margin: '20px 0', opacity: 0.9 }}>Save upto 50% on lab tests from top NABL certified labs.</p>
          
          {/* SEARCH BAR */}
          <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '5px', marginTop: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
            <input 
              type="text" 
              placeholder="Search for CBC, Vitamin D, Lab..." 
              style={{ flex: 1, border: 'none', padding: '15px 25px', borderRadius: '50px', outline: 'none' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button style={{ backgroundColor: '#ffb800', border: 'none', borderRadius: '50px', padding: '0 25px', cursor: 'pointer' }}>🔍</button>
          </div>

          {/* BADGES */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '12px' }}>🛡️ Trusted Labs</div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '12px' }}>🚲 Home Sample</div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '12px' }}>⭐ 4.8 Rating</div>
          </div>
        </div>

        {/* TEST TUBE DESIGN (IMAGE) */}
        <div style={{ zIndex: 1 }}>
           <img 
             src="https://img.freepik.com/free-photo/medical-test-tubes-centrifuge_23-2149115291.jpg" 
             alt="Test Tubes" 
             style={{ width: '450px', borderRadius: '100px 0 0 100px', opacity: 0.8 }}
           />
        </div>
      </section>

      {/* 3. POPULAR TESTS GRID */}
      <section style={{ padding: '60px 50px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '40px' }}>Popular Lab Tests</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' }}>
          {displayTests.map((test, index) => (
            <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f4f8' }}>
              <span style={{ fontSize: '12px', background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px' }}>20% OFF</span>
              <h3 style={{ margin: '15px 0 10px 0', fontSize: '1.2rem' }}>{test.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a' }}>₹{test.price}</span>
                <span style={{ fontSize: '14px', textDecoration: 'line-through', color: '#94a3b8' }}>₹{test.oldPrice || 1000}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                <button style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: 'none', borderRadius: '12px', cursor: 'pointer' }}>Compare</button>
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

      {/* 4. WHATSAPP FLOATING BUTTON */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noreferrer"
        style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 1000, textDecoration: 'none' }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{ width: '35px' }} />
      </a>

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

export default Home;