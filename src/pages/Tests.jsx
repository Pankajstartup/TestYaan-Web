import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import CompareModal from '../components/CompareModal';
import BookingModal from '../components/BookingModal';
import { Helmet } from 'react-helmet-async';

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

  // --- 2. FIXED SEARCH & FILTER LOGIC ---
  useEffect(() => {
    const filtered = allTests.filter(item => {
      const s = searchTerm.toLowerCase().trim();
      const tName = (item['Test Name'] || "").toLowerCase();
      const lName = (item['Lab Name'] || "").toLowerCase();
      
      const matchesSearch = tName.includes(s) || lName.includes(s);
      const matchesLab = selectedLab === "All" || item['Lab Name'] === selectedLab;
      
      return matchesSearch && matchesLab;
    });
    setFilteredTests(filtered);
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
      
      {/* SEO Section */}
      <SEO 
      title="All Lab Tests" 
      description="Compare and book 500+ lab tests at discounted prices." 
      testsData={allTests}  // Ye line aapke saare tests ko SEO file mein bhej degi
      />
      <Helmet>
        <title>All Lab Tests | TestYaan - Compare and Book Online</title>
        <meta name="description" content="Compare blood test prices from top NABL labs like Dr Lal Pathlabs and Thyrocare. Book online with home collection at TestYaan." />
      </Helmet>
      
      {/* SECTION 1: HERO & SEARCH (ULTRA STYLISH) */}
      <section className="universal-hero">
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="city-badge">✨ Trusted Pathology Partner</div>
          <h1 className="hero-title">Book Individual <br/>Lab Tests Online</h1>
          
          <div className="hero-search-wrapper">
            <input 
              type="text" 
              placeholder="Search for tests (e.g. CBC, Vitamin D, Thyroid)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button className="hero-search-button">FIND TEST</button>
          </div>
        </div>
        {/* Decorative Floating Elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '350px', height: '350px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
      </section>

      {/* SECTION 2: LAB FILTERS (Upgraded Look) */}
      <div style={{ padding: '40px 20px 20px', display: 'flex', gap: '12px', overflowX: 'auto', maxWidth: '1200px', margin: '0 auto', scrollbarWidth: 'none' }}>
        {labOptions.map(lab => (
          <button 
            key={lab} 
            onClick={() => setSelectedLab(lab)}
            style={{ 
              padding: '12px 28px', borderRadius: '50px', border: '1px solid #e2e8f0',
              background: selectedLab === lab ? '#1e40af' : 'white',
              color: selectedLab === lab ? 'white' : '#64748b',
              cursor: 'pointer', fontWeight: '700', flexShrink: 0, transition: '0.3s',
              boxShadow: selectedLab === lab ? '0 10px 20px rgba(30, 64, 175, 0.2)' : 'none'
            }}
          >{lab}</button>
        ))}
      </div>

      {/* SECTION 3: CARDS GRID */}
      <div className="universal-grid" style={{ paddingBottom: '120px' }}>
        {isLoading ? (
          <div style={{gridColumn: '1/-1', textAlign:'center', padding: '50px'}}>
             <div className="loading-spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #1e40af', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
             <p style={{marginTop: '15px', fontWeight: '600', color: '#64748b'}}>Loading Tests...</p>
          </div>
        ) : (
          filteredTests.map((item, index) => (
            <div key={index} className="modern-card hover-card">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px' }}>
                  <img src={`/lab-logos/${item['Lab Logo']}`} alt="lab" style={{ height: '24px', objectFit: 'contain' }} onError={(e) => e.target.src = '/lab-logos/default.png'} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', textTransform: 'uppercase' }}>
                    <input type="checkbox" style={{ transform: 'scale(1.2)' }} checked={compareList.some(t => t['Test Name'] === item['Test Name'])} onChange={(e) => handleCompareClick(item, e.target.checked)} />
                    Compare
                  </label>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>{item['Test Name']}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '800', background: '#fee2e2', padding: '3px 10px', borderRadius: '6px' }}>
                    {item['Fasting Status'] || 'Non-Fasting'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: '800', background: '#e0e7ff', padding: '3px 10px', borderRadius: '6px' }}>
                    {item['Lab Name']}
                  </span>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, fontWeight: '700' }}>Price</p>
                  <span style={{ fontSize: '1.7rem', fontWeight: '900', color: '#1e40af' }}>₹{item['MRP']}</span>
                </div>
                <button onClick={() => handleBooking(item)} className="confirm-btn" style={{ width: 'auto', padding: '12px 25px' }}>Book Now</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECTION 4: COMPARE BAR & MODALS */}
      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: 'white', padding: '15px 35px', borderRadius: '100px', display: 'flex', gap: '25px', alignItems: 'center', zIndex: 5000, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{fontWeight: '800', letterSpacing: '0.5px'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setIsCompareOpen(true)} className="confirm-btn" style={{ background: '#fbbf24', color: '#000', width: 'auto', padding: '8px 25px' }}>Compare Now</button>
        </div>
      )}

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(n) => setCompareList(compareList.filter(t => t['Test Name'] !== n))} />}
      
      {isBookingOpen && testToBook && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} testName={testToBook['Test Name']} price={testToBook['MRP']} labName={testToBook['Lab Name']} />
      )}

      <style>{` @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );
}

export default Tests;