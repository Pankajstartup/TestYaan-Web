import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import { useNavigate } from 'react-router-dom'; 
import CompareModal from '../components/CompareModal';
import BookingModal from '../components/BookingModal'; // ✅ Modal Import

const stylishInput = {
  padding: '16px 20px',
  borderRadius: '14px',
  border: '2px solid #f1f5f9',
  outline: 'none',
  fontSize: '15px',
  color: '#1e293b',
  width: '100%',
  boxSizing: 'border-box'
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

  // ✅ 1. Booking State
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

  // ✅ 2. Universal Booking Handler (Pop-up open karne ke liye)
  const handleBooking = (test) => {
    setTestToBook(test);
    setIsBookingOpen(true);
    setSelectedTestDetails(null); // Agar details modal khula hai to use band kar do
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

  const removeCompareItem = (testId) => {
    setCompareList(compareList.filter(t => t.id !== testId));
  };

  const labOptions = ["All", ...Array.from(new Set(allTests.map(t => t.lab))).filter(Boolean)];

  return (
    <div className="tests-page" style={{ padding: '120px 20px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1a365d', fontSize: '32px' }}>Find & Book Lab Tests</h1>
      </div>

      {/* Lab Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {labOptions.map(labName => (
            <button key={labName} onClick={() => setSelectedLab(labName)} style={{ padding: '10px 20px', background: selectedLab === labName ? '#1e3a8a' : 'white', color: selectedLab === labName ? 'white' : '#333', border: '1px solid #ddd', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
                {labName}
            </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 50px auto' }}>
        <input type="text" placeholder={`Search in ${selectedLab}...`} style={{...stylishInput, borderRadius: '40px'}} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* TESTS GRID */}
      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Searching database...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', maxWidth: '1400px', margin: '0 auto' }}>
          {filteredTests.map((test, index) => (
            <div key={index} className="test-card" style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 5 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={compareList.some(t => t.id === test.id)} onChange={(e) => handleCompareClick(test, e.target.checked)} style={{ cursor: 'pointer' }} />
                    ⚖️ Compare
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                {test.logoUrl ? (
                    <img src={test.logoUrl} alt={test.lab} style={{ height: '30px', maxWidth: '80px', objectFit: 'contain' }} />
                ) : (
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{test.lab}</span>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{test.name}</h3>
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px' }}>⏱ {test.Fasting || "Non-Fasting"}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a365d' }}>₹{test.price}</div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  onClick={() => setSelectedTestDetails(test)}
                  style={{ flex: 1, padding: '12px', border: '1px solid #1a365d', background: 'none', color: '#1a365d', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  View Parameters
                </button>
                {/* ✅ Card wala Book Now button */}
                <button 
                  onClick={() => handleBooking(test)}
                  style={{ flex: 1, padding: '12px', background: '#1a365d', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW PARAMETERS MODAL */}
      {selectedTestDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setSelectedTestDetails(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f5f9', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: '#1e3a8a' }}>{selectedTestDetails.name}</h2>
            {selectedTestDetails.logoUrl && <img src={selectedTestDetails.logoUrl} alt={selectedTestDetails.lab} style={{ height: '25px', marginBottom: '15px', objectFit: 'contain' }} />}
            <h4 style={{ marginBottom: '10px' }}>Parameters Included:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTestDetails.Parameters ? selectedTestDetails.Parameters.split(',').map((p, i) => (
                <span key={i} style={{ background: '#eff6ff', color: '#1e40af', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', border: '1px solid #bfdbfe' }}>
                  {p.trim()}
                </span>
              )) : <p style={{ fontSize: '12px', color: '#999' }}>Consult lab for all {selectedTestDetails.name} parameters.</p>}
            </div>
            {/* ✅ View Details ke andar wala Book Now button bhi ab Pop-up kholega */}
            <button 
              onClick={() => handleBooking(selectedTestDetails)}
              style={{ width: '100%', marginTop: '30px', padding: '15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Confirm Booking (₹{selectedTestDetails.price})
            </button>
          </div>
        </div>
      )}

      {/* ✅ BOOKING FORM MODAL (Pop-up) */}
      {isBookingOpen && testToBook && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          testName={testToBook.name} 
          price={testToBook.price} 
          labName={testToBook.lab} 
        />
      )}

      {/* Floating Compare Bar */}
      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1a365d', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', zIndex: 4000 }}>
          <span>{compareList.length} Tests selected</span>
          <button onClick={() => setIsCompareOpen(true)} style={{ background: '#ff9900', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', color: 'black' }}>Compare Now</button>
          <button onClick={() => setCompareList([])} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Clear</button>
        </div>
      )}

      {isCompareOpen && (
        <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={removeCompareItem} />
      )}

    </div>
  );
}

export default Tests;