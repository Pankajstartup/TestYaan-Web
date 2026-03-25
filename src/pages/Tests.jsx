import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import CompareModal from '../components/CompareModal';
import BookingModal from '../components/BookingModal';

// --- Theme Colors ---
const colors = {
  primary: '#1e3a8a',    // Deep Blue
  secondary: '#3b82f6',  // Bright Blue
  accent: '#f59e0b',     // Orange for Search/Buttons
  bg: '#f8fafc',         // Light Grayish Blue background
  white: '#ffffff',
  text: '#1e293b'
};

function Tests() {
  const [allTests, setAllTests] = useState([]); 
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState("All"); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState(null); 

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [testToBook, setTestToBook] = useState(null);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          setAllTests(res.data);
          setFilteredTests(res.data);
          setIsLoading(false);
        }
      });
    });
  }, []);

  const handleBooking = (test) => {
    setTestToBook(test);
    setIsBookingOpen(true);
    setSelectedTestDetails(null);
  };

  useEffect(() => {
    const filtered = allTests.filter(test => {
      const matchesSearch = test.name?.toLowerCase().includes(searchTerm.toLowerCase()) || test.lab?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLab = selectedLab === "All" || test.lab === selectedLab;
      return matchesSearch && matchesLab;
    });
    setFilteredTests(filtered);
  }, [searchTerm, selectedLab, allTests]);

  const handleCompareClick = (test, isChecked) => {
    if (isChecked) {
      if (compareList.length >= 3) {
        alert("Maximum 3 tests compare kar sakte hain!");
        return;
      }
      setCompareList([...compareList, test]);
    } else {
      setCompareList(compareList.filter(t => t.id !== test.id));
    }
  };

  const labOptions = ["All", ...Array.from(new Set(allTests.map(t => t.lab))).filter(Boolean)];

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. HERO SECTION (Screenshot jaisa Blue Gradient) */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        padding: '100px 20px 80px',
        textAlign: 'center',
        color: 'white',
        borderRadius: '0 0 40px 40px'
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '15px' }}>Compare & Book Lab Tests</h1>
        <p style={{ opacity: 0.9, fontSize: '1.2rem', marginBottom: '30px' }}>Delhi-NCR | Save up to 50% on lab tests from top NABL labs</p>
        
        {/* 2. ROUNDED SEARCH BAR (Hero mein Centered) */}
        <div style={{ 
          background: 'white', 
          maxWidth: '700px', 
          margin: '0 auto', 
          padding: '8px', 
          borderRadius: '50px', 
          display: 'flex', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          alignItems: 'center'
        }}>
          <span style={{ padding: '0 15px', color: '#666' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search for CBC, Vitamin D, Lab Name..." 
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', color: colors.text }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ 
            background: colors.accent, 
            border: 'none', 
            padding: '12px 25px', 
            borderRadius: '30px', 
            color: 'white', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}>Search</button>
        </div>
      </div>

      {/* 3. LAB FILTERS (Capsule Design) */}
      <div style={{ padding: '40px 20px 20px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {labOptions.map(labName => (
          <button 
            key={labName} 
            onClick={() => setSelectedLab(labName)} 
            style={{ 
              padding: '10px 24px', 
              background: selectedLab === labName ? colors.primary : 'white', 
              color: selectedLab === labName ? 'white' : colors.text, 
              border: '1px solid #e2e8f0', 
              borderRadius: '25px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
            {labName}
          </button>
        ))}
      </div>

      {/* 4. TESTS GRID (Modern Cards) */}
      <div style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading tests...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {filteredTests.map((test, index) => (
              <div key={index} style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '24px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                position: 'relative',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <label style={{ fontSize: '12px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="checkbox" checked={compareList.some(t => t.id === test.id)} onChange={(e) => handleCompareClick(test, e.target.checked)} /> 
                    ⚖️ Compare
                  </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  {test.logoUrl ? (
                    <img src={test.logoUrl} alt={test.lab} style={{ height: '30px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.primary }}>{test.lab}</span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', color: colors.text, margin: '10px 0' }}>{test.name}</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>⏱ {test.Fasting || "Non-Fasting"}</p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.7rem', fontWeight: '800', color: colors.primary }}>₹{test.price}</span>
                  <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{test.oldPrice || (parseInt(test.price) + 500)}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setSelectedTestDetails(test)}
                    style={{ flex: 1, padding: '12px', border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleBooking(test)}
                    style={{ flex: 1, padding: '12px', background: colors.primary, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {selectedTestDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'white', padding: '35px', borderRadius: '30px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setSelectedTestDetails(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f5f9', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: colors.primary, marginBottom: '20px' }}>{selectedTestDetails.name}</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Provided by: <strong>{selectedTestDetails.lab}</strong></p>
            <h4 style={{ marginBottom: '15px' }}>Included Parameters:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' }}>
              {selectedTestDetails.Parameters ? selectedTestDetails.Parameters.split(',').map((p, i) => (
                <span key={i} style={{ background: '#f0f7ff', color: colors.secondary, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', border: '1px solid #dbeafe' }}>
                  {p.trim()}
                </span>
              )) : <p>Contact lab for details.</p>}
            </div>
            <button onClick={() => handleBooking(selectedTestDetails)} style={{ width: '100%', padding: '16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Confirm Booking (₹{selectedTestDetails.price})
            </button>
          </div>
        </div>
      )}

      {isBookingOpen && testToBook && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} testName={testToBook.name} price={testToBook.price} labName={testToBook.lab} />
      )}

      {/* Floating Compare Bar */}
      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: colors.primary, color: 'white', padding: '15px 35px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 4000 }}>
          <span>{compareList.length} Tests Selected</span>
          <button onClick={() => setIsCompareOpen(true)} style={{ background: colors.accent, border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>Compare Now</button>
          <button onClick={() => setCompareList([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Clear</button>
        </div>
      )}

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(id) => setCompareList(compareList.filter(t => t.id !== id))} />}
    </div>
  );
}

export default Tests;