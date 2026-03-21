import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import './Tests.css'; // Apni purani style file use karein
// import LabCard from '../components/LabCard'; // Is code mein cards isi file mein hain

// Optional: Comparison Modal component ko alag file mein bhi rakh sakte hain
import CompareModal from '../components/CompareModal'; 

function Tests() {
  const [allTests, setAllTests] = useState([]); 
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState("All"); 
  const [isLoading, setIsLoading] = useState(true);
  
  // COMPARISON STATE
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // 1. Google Sheet Data Fetch (Same logic as Home)
  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          setAllTests(res.data);
          setFilteredTests(res.data);
          setIsLoading(false);
        }
      });
    });
  }, []);

  // 2. Search & Filter Logic
  useEffect(() => {
    const filtered = allTests.filter(test => {
      const matchesSearch = test.name?.toLowerCase().includes(searchTerm.toLowerCase()) || test.lab?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLab = selectedLab === "All" || test.lab === selectedLab;
      return matchesSearch && matchesLab;
    });
    setFilteredTests(filtered);
  }, [searchTerm, selectedLab, allTests]);

  // 3. Comparison Logic functions
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

  // Lab list dynamically banana filters ke liye
  const labOptions = ["All", ...Array.from(new Set(allTests.map(t => t.lab))).filter(Boolean)];

  return (
    <div className="tests-page" style={{ padding: '120px 20px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1a365d', fontSize: '32px' }}>Find & Book Lab Tests</h1>
      </div>

      {/* FILTER BAR (Lab Logos or Dropdown - Amazon like) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
        {labOptions.map(labName => (
            <button 
                key={labName}
                onClick={() => setSelectedLab(labName)}
                style={{
                    padding: '10px 20px',
                    background: selectedLab === labName ? '#1e3a8a' : 'white',
                    color: selectedLab === labName ? 'white' : '#333',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                {labName}
            </button>
        ))}
      </div>

      {/* SEARCH BAR (Center) */}
      <div style={{ maxWidth: '600px', margin: '0 auto 50px auto' }}>
        <input 
          type="text" 
          placeholder={`Search in ${selectedLab === "All" ? "Delhi-NCR" : selectedLab}...`} 
          style={{ width: '100%', padding: '15px 25px', borderRadius: '40px', border: '1px solid #ddd', outline: 'none', fontSize: '16px'}}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TESTS GRID */}
      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Searching database...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', maxWidth: '1400px', margin: '0 auto' }}>
          {filteredTests.map(test => (
            // CARD DESIGN (image_0.png wala look + Compare Checkbox)
            <div key={test.id} className="test-card" style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}>
              
              {/* Compare Checkbox */}
              <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 5 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={compareList.some(t => t.id === test.id)}
                        onChange={(e) => handleCompareClick(test, e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    ⚖️ Compare
                </label>
              </div>

              {/* Lab Logo & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                {test.logoUrl && <img src={test.logoUrl} alt={test.lab} style={{ height: '30px', maxWidth: '80px', objectFit: 'contain' }} />}
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{test.lab}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{test.name}</h3>
              
              {/* Fasting Info from Google Sheet */}
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px' }}>
                ⏱ {test["Fasting/Non Fasting"] || "Non-Fasting"}
              </p>

              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a365d' }}>₹{test.price}</div>
              
              <button style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#1a365d', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING COMPARE BAR (Niche se float karega jab selection ho) */}
      {compareList.length > 0 && !isCompareOpen && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1a365d', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', zIndex: 4000 }}>
          <span>{compareList.length} Tests selected for comparison</span>
          <button 
            onClick={() => setIsCompareOpen(true)}
            style={{ background: '#ff9900', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', color: 'black' }}
          >
            Compare Now
          </button>
          <button 
            onClick={() => setCompareList([])}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '10px' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* COMPARISON MODAL (Dino tests ka side-by-side data) */}
      {isCompareOpen && (
        <CompareModal 
            compareList={compareList} 
            onClose={() => setIsCompareOpen(false)} 
            removeCompareItem={removeCompareItem}
        />
      )}

    </div>
  );
}

export default Tests;