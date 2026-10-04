import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';
import CompareModal from '../components/CompareModal';
import SEO from '../components/SEO';

const Tests = () => {
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLab, setActiveLab] = useState("All");

  const [selectedTest, setSelectedTest] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [compareList, setCompareList] = useState([]);
  const [showCompareOverlay, setShowCompareOverlay] = useState(false);

  useEffect(() => {
    // Spreadsheet CSV URL
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    
    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, { 
          header: true, 
          skipEmptyLines: true,
          transformHeader: header => header.trim().toLowerCase(), // ALL HEADERS TO LOWERCASE
          complete: (res) => {
            // Normalize all row keys to lowercase for 100% safe property reading
            const normalizedData = res.data.map(row => {
              const newRow = {};
              for (let key in row) {
                newRow[key.trim().toLowerCase()] = row[key] ? row[key].trim() : '';
              }
              return newRow;
            });

            // Filter out empty rows and keep non-packages
            const testsData = normalizedData.filter(item => {
              const name = item['test name'] || item['testname'] || item['name'];
              return name && name !== '';
            });

            setAllTests(testsData);
            setFilteredTests(testsData);
          }
        });
      });
  }, []);

  useEffect(() => {
    let result = allTests;
    if (activeLab !== "All") {
      result = result.filter(test => {
        const labVal = test['lab name'] || test['labname'] || test['lab'] || "";
        return labVal.toLowerCase().includes(activeLab.toLowerCase());
      });
    }
    if (searchTerm) {
      result = result.filter(test => {
        const testName = test['test name'] || test['testname'] || test['name'] || "";
        const param = test['parameter'] || "";
        return testName.toLowerCase().includes(searchTerm.toLowerCase()) || param.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    setFilteredTests(result);
  }, [searchTerm, activeLab, allTests]);

  const openBooking = (test) => {
    setSelectedTest(test);
    setIsBookingOpen(true);
  };

  const handleCompareClick = (test, isChecked) => {
    const testName = test['test name'] || test['testname'] || test['name'];
    if (isChecked) {
      if (compareList.length >= 3) return alert("Maximum 3 tests compare kar sakte hain!");
      setCompareList([...compareList, test]);
    } else {
      setCompareList(compareList.filter(t => (t['test name'] || t['testname'] || t['name']) !== testName));
    }
  };

  const removeCompareItem = (name) => {
    setCompareList(compareList.filter(t => (t['test name'] || t['testname'] || t['name']) !== name));
  };

  // Helper to extract Price safely
  const getDisplayPrice = (test) => {
    const p = test['rate'] || test['price'] || test['mrp'] || test['starting price'];
    return (p && p !== '') ? p : 'N/A';
  };

  const labs = ["All", "Redcliffe Labs", "Thyrocare", "Dr Lal Pathlabs", "Metropolis"];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      <SEO 
        title="Book Blood Tests & Diagnostics Online in Delhi NCR" 
        description="Book CBC, Lipid, Thyroid, HbA1c and all individual lab tests at lowest prices in Delhi-NCR. Free Home Collection."
        path="/tests"
        testsData={allTests}
      />

      {/* Hero Section */}
      <section className="universal-hero">
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="city-badge">💫 Trusted Pathology Partner in Delhi-NCR</div>
          <h2 className="hero-title">Book Individual <br/>Lab Tests Online</h2>
          
          <div className="hero-search-wrapper">
            <input 
              type="text" 
              placeholder="Search for tests (e.g. CBC, Vitamin D, Thyroid)..." 
              style={{ color: '#333' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <button className="hero-search-button">FIND TEST</button>
          </div>
        </div>
      </section>

      {/* Lab Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', padding: '30px 20px', overflowX: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        {labs.map(lab => (
          <button 
            key={lab}
            onClick={() => setActiveLab(lab)}
            style={{
              padding: '10px 22px', borderRadius: '50px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', flexShrink: 0, transition: '0.3s',
              border: '1px solid #e2e8f0',
              backgroundColor: activeLab === lab ? '#E31E25' : 'white',
              color: activeLab === lab ? 'white' : '#64748b'
            }}
          >
            {lab}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="universal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
        {filteredTests.map((test, i) => {
          const testName = test['test name'] || test['testname'] || test['name'] || 'Diagnostic Test';
          const labName = test['lab name'] || test['labname'] || test['lab'] || 'Certified Lab';
          const fastingStatus = test['fasting status'] || test['fasting'] || '';
          const testType = test['type'] || 'TEST';
          const price = getDisplayPrice(test);

          return (
            <div key={i} className="modern-card hover-card" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>
                    {testType.toUpperCase()}
                  </span>
                  
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    <input 
                      type="checkbox" 
                      checked={compareList.some(t => (t['test name'] || t['testname'] || t['name']) === testName)} 
                      onChange={(e) => handleCompareClick(test, e.target.checked)} 
                    /> COMPARE
                  </label>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '5px' }}>{testName}</h3>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  {fastingStatus && (
                    <span style={{ fontSize: '11px', color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold' }}>
                      {fastingStatus}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#1e40af', background: '#dbeafe', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold' }}>
                    {labName}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Starting Price</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#E31E25' }}>₹{price}</div>
                </div>
                <button onClick={() => openBooking(test)} className="confirm-btn" style={{ padding: '10px 20px', fontSize: '13px', width: 'auto', background: '#E31E25', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Overlay */}
      {compareList.length > 0 && !showCompareOverlay && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#E31E25', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', zIndex: 4000 }}>
          <span style={{fontWeight: '700'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setShowCompareOverlay(true)} className="confirm-btn" style={{ background: '#ffbf00', color: '#1e3a8a', padding: '8px 20px', width: 'auto', boxShadow: 'none' }}>Compare Now</button>
        </div>
      )}

      {showCompareOverlay && (
        <CompareModal 
          compareList={compareList} 
          onClose={() => setShowCompareOverlay(false)} 
          removeCompareItem={removeCompareItem} 
        />
      )}

      {/* Booking Modal */}
      {isBookingOpen && selectedTest && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          testName={selectedTest['test name'] || selectedTest['name']} 
          price={getDisplayPrice(selectedTest)} 
          labName={selectedTest['lab name'] || selectedTest['lab']} 
        />
      )}
    </div>
  );
};

export default Tests;