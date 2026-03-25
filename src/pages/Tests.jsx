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
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero Section - Optimized for Mobile Padding */}
      <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, padding: 'clamp(50px, 8vw, 80px) 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: '800', marginBottom: '10px' }}>Individual Lab Tests</h1>
        <p style={{ opacity: 0.9, marginBottom: '30px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>Search by Test Name or Lab Name</p>
        
        <div style={{ background: 'white', maxWidth: '600px', margin: '0 auto', padding: '6px', borderRadius: '50px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <input 
            type="text" 
            placeholder="Search e.g. 'CBC'..." 
            style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '50px', color: '#333', width: '100%' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lab Filters - Horizontal Scroll for Mobile */}
      <div style={{ 
        padding: '25px 15px', 
        display: 'flex', 
        gap: '10px', 
        overflowX: 'auto', 
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {labOptions.map(labName => (
          <button key={labName} onClick={() => setSelectedLab(labName)} style={{ 
            padding: '10px 22px', 
            background: selectedLab === labName ? colors.primary : 'white', 
            color: selectedLab === labName ? 'white' : colors.text, 
            border: '1px solid #ddd', 
            borderRadius: '25px', 
            cursor: 'pointer', 
            fontWeight: '600',
            flexShrink: 0,
            fontSize: '14px'
          }}>{labName}</button>
        ))}
      </div>

      {/* Grid - Responsive columns */}
      <div style={{ padding: '0 20px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        {isLoading ? <p style={{textAlign: 'center'}}>Loading Tests...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredTests.map((item, index) => (
              <div key={index} className="hover-card" style={{ background: 'white', borderRadius: '24px', padding: '25px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <img src={`/lab-logos/${item['Lab Logo']}`} style={{ height: '20px' }} alt="lab" onError={(e) => e.target.src = '/lab-logos/default.png'} />
                  <label style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="checkbox" checked={compareList.some(t => t['Test Name'] === item['Test Name'])} onChange={(e) => handleCompareClick(item, e.target.checked)} /> Compare
                  </label>
                </div>
                <h3 style={{ margin: '15px 0 5px', color: '#1a1a1a', fontSize: '1.2rem', fontWeight: '800' }}>{item['Test Name']}</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Lab: {item['Lab Name']}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: colors.primary }}>₹{item['MRP']}</span>
                  <button onClick={() => handleBooking(item)} style={{ padding: '10px 20px', background: colors.primary, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Book Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals & Bottom Bar logic wahi rahegi jo aapne bheji thi */}
      {isBookingOpen && testToBook && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} testName={testToBook['Test Name']} price={testToBook['MRP']} labName={testToBook['Lab Name']} />
      )}

      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: colors.primary, color: 'white', padding: '12px 25px', borderRadius: '50px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 4000, width: 'max-content' }}>
          <span style={{fontSize: '14px'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setIsCompareOpen(true)} style={{ background: colors.accent, border: 'none', padding: '8px 18px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', color: '#1e3a8a', fontSize: '13px' }}>Compare</button>
        </div>
      )}

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(name) => setCompareList(compareList.filter(t => t['Test Name'] !== name))} />}
    </div>
  );
}

export default Tests;