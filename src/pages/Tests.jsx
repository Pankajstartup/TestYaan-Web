import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import CompareModal from '../components/CompareModal';
import BookingModal from '../components/BookingModal';

// --- Theme Colors (Synced with Home) ---
const colors = {
  primary: '#1e40af',    // Matching Home Page
  secondary: '#3b82f6', 
  accent: '#ffbf00',     // Yellow like Home
  bg: '#ffffff',         
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
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdjwfomAdUnXXo8mN4MIv_jRATEdHk3QFPpOzEzcDloGrRym7FKpXNjLaha3KKRoByFJLZG9NhL_8j/pubhtml?gid=0&single=true";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          // Sirf 'Test' type wala data filter karein agar sheet mein mixed hai
          const onlyTests = res.data.filter(item => item.type === 'Test');
          setAllTests(onlyTests);
          setFilteredTests(onlyTests);
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
      const matchesSearch = test.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
      setCompareList(compareList.filter(t => t.name !== test.name)); // ID na ho toh name se filter
    }
  };

  const labOptions = ["All", ...Array.from(new Set(allTests.map(t => t.lab))).filter(Boolean)];

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. HERO SECTION (DITTO HOME PAGE DESIGN) */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        padding: '100px 20px 140px', // Bottom padding extra for curve
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>All Medical Tests</h1>
        <p style={{ opacity: 0.9, fontSize: '1.2rem', marginBottom: '35px' }}>Find and compare {allTests.length}+ tests from top labs</p>
        
        {/* ROUNDED SEARCH BAR (Active) */}
        <div style={{ 
          background: 'white', maxWidth: '700px', margin: '0 auto', padding: '6px', borderRadius: '50px', 
          display: 'flex', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', alignItems: 'center', zIndex: 10, position: 'relative'
        }}>
          <input 
            type="text" 
            placeholder="Search for CBC, Vitamin D, Thyroid..." 
            style={{ flex: 1, border: 'none', outline: 'none', padding: '15px 30px', fontSize: '16px', borderRadius: '50px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{ background: colors.accent, border: 'none', padding: '12px 30px', borderRadius: '30px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        </div>

        {/* 🌊 Curve Divider (For smooth flow) */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '80px' }}>
            <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* 2. LAB FILTERS */}
      <div style={{ padding: '40px 20px 20px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {labOptions.map(labName => (
          <button 
            key={labName} 
            onClick={() => setSelectedLab(labName)} 
            style={{ 
              padding: '10px 24px', 
              background: selectedLab === labName ? colors.primary : 'white', 
              color: selectedLab === labName ? 'white' : colors.text, 
              border: '1px solid #e2e8f0', borderRadius: '25px', fontWeight: '600', cursor: 'pointer'
            }}>
            {labName}
          </button>
        ))}
      </div>

      {/* 3. TESTS GRID (Design Matched with Home Cards) */}
      <div style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto 100px' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading tests from Google Sheet...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {filteredTests.map((test, index) => (
              <div key={index} style={{ 
                background: 'white', borderRadius: '28px', padding: '30px', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.06)', position: 'relative', border: '1px solid #f0f4f8'
              }}>
                {/* Compare Checkbox */}
                <div style={{ position: 'absolute', top: '25px', right: '25px' }}>
                  <label style={{ fontSize: '12px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="checkbox" checked={compareList.some(t => t.name === test.name)} onChange={(e) => handleCompareClick(test, e.target.checked)} /> 
                    ⚖️ Compare
                  </label>
                </div>

                {/* Fasting Badge */}
                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                  {test.Fasting || "Non-Fasting"}
                </span>

                <h3 style={{ fontSize: '1.4rem', color: '#1a1a1a', margin: '20px 0 5px' }}>{test.name}</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '25px' }}>Lab: <strong>{test.lab}</strong></p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '30px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: colors.primary }}>₹{test.price}</span>
                  <span style={{ fontSize: '15px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{parseInt(test.price) + 500}</span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setSelectedTestDetails(test)}
                    style={{ flex: 1, padding: '12px', border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Details
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

      {/* --- MODALS (DETAILS & BOOKING) --- */}
      {selectedTestDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '30px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setSelectedTestDetails(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: colors.primary, marginBottom: '10px' }}>{selectedTestDetails.name}</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Lab: {selectedTestDetails.lab}</p>
            
            <h4 style={{ marginBottom: '10px' }}>Included Parameters:</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#f8fafc', padding: '15px', borderRadius: '15px', marginBottom: '30px' }}>
               {selectedTestDetails.Parameters ? selectedTestDetails.Parameters.split(',').map((p, i) => (
                 <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #eee', fontSize: '14px' }}>✅ {p.trim()}</div>
               )) : "Parameters update ho rahe hain..."}
            </div>

            <button onClick={() => handleBooking(selectedTestDetails)} style={{ width: '100%', padding: '15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
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

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(name) => setCompareList(compareList.filter(t => t.name !== name))} />}
    </div>
  );
}

export default Tests;