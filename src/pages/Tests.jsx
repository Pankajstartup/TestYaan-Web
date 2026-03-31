import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import CompareModal from '../components/CompareModal';
import BookingModal from '../components/BookingModal';

const colors = { 
  primary: '#1e40af', 
  secondary: '#3b82f6', 
  accent: '#ffbf00', 
  bg: '#ffffff', 
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
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [testToBook, setTestToBook] = useState(null);

  // --- 1. DATA FETCHING (Logic Safe) ---
  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            const onlyTests = res.data.filter(item => 
              item.Type && item.Type.trim().toLowerCase() === 'test'
            );
            setAllTests(onlyTests);
            setFilteredTests(onlyTests);
            setIsLoading(false);
          }
        });
      })
      .catch(err => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, []);

  // --- 2. SEARCH & FILTER LOGIC (FIXED) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = allTests.filter(item => {
        const s = searchTerm.toLowerCase().trim();
        const tName = (item['Test Name'] || "").toLowerCase();
        const lName = (item['Lab Name'] || "").toLowerCase();
        
        const matchesSearch = tName.includes(s) || lName.includes(s);
        const matchesLab = selectedLab === "All" || item['Lab Name'] === selectedLab;
        
        return matchesSearch && matchesLab;
      });
      setFilteredTests(filtered);
    }, 100); // Debounce added for smooth typing
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLab, allTests]);

  // --- 3. COMPARE HANDLERS ---
  const handleCompareClick = (test, isChecked) => {
    if (isChecked) {
      if (compareList.length >= 3) return alert("Max 3 tests allowed!");
      setCompareList([...compareList, test]);
    } else {
      setCompareList(compareList.filter(t => t['Test Name'] !== test['Test Name']));
    }
  };

  const handleBooking = (test) => {
    setTestToBook(test);
    setIsBookingOpen(true);
  };

  const labOptions = ["All", ...Array.from(new Set(allTests.map(t => t['Lab Name']))).filter(Boolean)];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* SECTION 1: HERO & SEARCH */}
      <section className="universal-hero">
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Individual Lab Tests</h1>
          <div className="city-badge">BOOK AT BEST PRICES</div>
          
          <div style={{ 
            background: 'white', maxWidth: '600px', margin: '30px auto', 
            padding: '8px', borderRadius: '50px', display: 'flex', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)', position: 'relative', zIndex: 100
          }}>
            <input 
              type="text" 
              placeholder="Type test name here (e.g. CBC)..." 
              style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 25px', fontSize: '16px', borderRadius: '50px', color: '#333' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button style={{ background: '#ffbf00', border: 'none', borderRadius: '50px', padding: '12px 25px', fontWeight: 'bold' }}>🔍</button>
          </div>
        </div>
      </section>

      {/* SECTION 2: LAB FILTERS */}
      <div style={{ padding: '20px', display: 'flex', gap: '10px', overflowX: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        {labOptions.map(lab => (
          <button 
            key={lab} 
            onClick={() => setSelectedLab(lab)}
            style={{ 
              padding: '10px 20px', borderRadius: '25px', border: '1px solid #e2e8f0',
              background: selectedLab === lab ? '#1e3a8a' : 'white',
              color: selectedLab === lab ? 'white' : '#64748b',
              cursor: 'pointer', fontWeight: '600', flexShrink: 0
            }}
          >{lab}</button>
        ))}
      </div>

      {/* SECTION 3: CARDS GRID (FASTING ADDED BACK) */}
      <div className="universal-grid" style={{ paddingBottom: '100px' }}>
        {isLoading ? <p style={{gridColumn: '1/-1', textAlign:'center'}}>Loading...</p> : (
          filteredTests.map((item, index) => (
            <div key={index} className="modern-card hover-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <img src={`/lab-logos/${item['Lab Logo']}`} alt="lab" style={{ height: '22px' }} onError={(e) => e.target.src = '/lab-logos/default.png'} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* FASTING STATUS WAPAS AA GAYA */}
                  <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: '800', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>
                    {item['Fasting Status'] || 'Non-Fasting'}
                  </span>
                  <label style={{ fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="checkbox" checked={compareList.some(t => t['Test Name'] === item['Test Name'])} onChange={(e) => handleCompareClick(item, e.target.checked)} />
                    Compare
                  </label>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{item['Test Name']}</h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Lab: {item['Lab Name']}</p>
              
              <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1e3a8a' }}>₹{item['MRP']}</span>
                <button onClick={() => handleBooking(item)} className="confirm-btn" style={{ width: 'auto', padding: '10px 20px' }}>Book Now</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECTION 4: COMPARE BAR & MODALS */}
      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#1e3a8a', color: 'white', padding: '15px 35px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 5000 }}>
          <span style={{fontWeight: '700'}}>{compareList.length} Selected</span>
          <button onClick={() => setIsCompareOpen(true)} className="confirm-btn" style={{ background: '#ffbf00', color: '#1e3a8a', width: 'auto' }}>Compare Now</button>
        </div>
      )}

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(n) => setCompareList(compareList.filter(t => t['Test Name'] !== n))} />}
      
      {isBookingOpen && testToBook && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} testName={testToBook['Test Name']} price={testToBook['MRP']} labName={testToBook['Lab Name']} />
      )}
    </div>
  );
}

export default Tests;