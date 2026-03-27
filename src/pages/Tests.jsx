import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import CompareModal from '../components/CompareModal';
import BookingModal from '../components/BookingModal';

const colors = { primary: '#1e40af', secondary: '#3b82f6', accent: '#ffbf00', bg: '#ffffff', text: '#1e293b' };

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

  // --- Logic Safe: Fetching Data ---
  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const onlyTests = res.data.filter(item => 
            item.Type && item.Type.trim() === 'Test'
          );
          setAllTests(onlyTests);
          setFilteredTests(onlyTests);
          setIsLoading(false);
        }
      });
    });
  }, []);

  // --- Logic Safe: Filter Logic ---
  useEffect(() => {
    const filtered = allTests.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const testName = (item['Test Name'] || "").toLowerCase();
      const labName = (item['Lab Name'] || "").toLowerCase();
      const matchesSearch = testName.includes(searchLower) || labName.includes(searchLower);
      const matchesLab = selectedLab === "All" || item['Lab Name'] === selectedLab;
      return matchesSearch && matchesLab;
    });
    setFilteredTests(filtered);
  }, [searchTerm, selectedLab, allTests]);

  const handleCompareClick = (test, isChecked) => {
    if (isChecked) {
      if (compareList.length >= 3) return alert("Maximum 3 tests compare kar sakte hain!");
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
      
      {/* 1. Stylish Hero Section (Using Global Class) */}
      <section className="universal-hero">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 className="hero-title">Individual Lab Tests</h1>
          <div className="city-badge">BOOK AT BEST PRICES</div>
          <p style={{ opacity: 0.9, marginBottom: '30px' }}>Search by Test Name or Lab Name</p>
          
          <div style={{ background: 'white', maxWidth: '600px', margin: '0 auto', padding: '6px', borderRadius: '50px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <input 
              type="text" 
              placeholder="Search e.g. 'CBC'..." 
              style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '50px', color: '#333' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button style={{ background: '#ffbf00', border: 'none', borderRadius: '50px', padding: '12px 20px', cursor: 'pointer' }}>🔍</button>
          </div>
        </div>
      </section>

      {/* 2. Lab Filters (Keeping Horizontal Scroll Logic) */}
      <div style={{ 
        padding: '25px 15px', display: 'flex', gap: '10px', overflowX: 'auto', 
        scrollbarWidth: 'none', maxWidth: '1200px', margin: '0 auto'
      }}>
        {labOptions.map(labName => (
          <button key={labName} onClick={() => setSelectedLab(labName)} style={{ 
            padding: '10px 22px', 
            background: selectedLab === labName ? '#1e3a8a' : 'white', 
            color: selectedLab === labName ? 'white' : '#1e293b', 
            border: '1px solid #e2e8f0', borderRadius: '25px', cursor: 'pointer', 
            fontWeight: '600', flexShrink: 0, fontSize: '14px', transition: '0.3s'
          }}>{labName}</button>
        ))}
      </div>

      {/* 3. Grid & Cards (Using Universal Grid & Modern Cards) */}
      <div className="universal-grid" style={{ paddingTop: '0' }}>
        {isLoading ? <p style={{textAlign: 'center', gridColumn: '1/-1'}}>Loading Tests...</p> : (
          <>
            {filteredTests.map((item, index) => (
              <div key={index} className="modern-card hover-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <img src={`/lab-logos/${item['Lab Logo']}`} style={{ height: '20px' }} alt="lab" onError={(e) => e.target.src = '/lab-logos/default.png'} />
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={compareList.some(t => t['Test Name'] === item['Test Name'])} onChange={(e) => handleCompareClick(item, e.target.checked)} /> Compare
                  </label>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '5px' }}>{item['Test Name']}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Lab: {item['Lab Name']}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.7rem', fontWeight: '900', color: '#1e3a8a' }}>₹{item['MRP']}</span>
                  <button onClick={() => handleBooking(item)} className="confirm-btn" style={{ padding: '10px 20px', fontSize: '14px', width: 'auto' }}>Book Now</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* 4. Modals (Keeping Logic Identical) */}
      {isBookingOpen && testToBook && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} testName={testToBook['Test Name']} price={testToBook['MRP']} labName={testToBook['Lab Name']} />
      )}

      {/* Compare Floating Bar */}
      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#1e3a8a', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', zIndex: 4000 }}>
          <span style={{fontWeight: '700'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setIsCompareOpen(true)} className="confirm-btn" style={{ background: '#ffbf00', color: '#1e3a8a', padding: '8px 20px', width: 'auto', boxShadow: 'none' }}>Compare Now</button>
        </div>
      )}

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(name) => setCompareList(compareList.filter(t => t['Test Name'] !== name))} />}
    </div>
  );
}

export default Tests;