import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal'; // Modal Import

const Home = () => {
  const [displayPackages, setDisplayPackages] = useState([]);
  const [allData, setAllData] = useState([]); // Global Search ke liye pura data
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // Modals State
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showParamModal, setShowParamModal] = useState(false);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const validData = res.data.filter(item => item['Test Name']);
          setAllData(validData); // Sabhi Tests/Packages search ke liye save kiye
          
          const pkgs = validData.filter(item => item.Type?.trim() === 'Package');
          setDisplayPackages(pkgs.slice(0, 6)); // Top 6 packages display ke liye
      }});
    });
  }, []);

  // --- Search Logic ---
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      const filtered = allData.filter(item => 
        item['Test Name'].toLowerCase().includes(value.toLowerCase()) ||
        (item['Parameter'] && item['Parameter'].toLowerCase().includes(value.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 10)); // Top 10 results
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  // Handlers
  const openParams = (pkg) => {
    setSelectedPkg(pkg);
    setShowParamModal(true);
  };

  const openBooking = (pkg) => {
    setSelectedPkg(pkg);
    setIsBookingOpen(true);
    setShowSearchDropdown(false); // Search close kar do booking khulte hi
    setSearchTerm(''); // Input clear kar do
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <h1 style={heroTitleStyle}>
            Compare & Book Lab Tests <br/>
            <span style={{ color: '#ffbf00' }}>Delhi-NCR</span>
          </h1>
          <p style={heroSubtitleStyle}>
            NABL Certified Labs | Free Home Collection | 10% Discount
          </p>
          
          {/* Search Box with Dropdown */}
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <div style={searchBoxStyle}>
              <input 
                type="text" 
                placeholder="Search for Tests or Packages (e.g. CBC, Lipid...)" 
                style={inputStyle} 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button style={searchBtnStyle}>🔍</button>
            </div>

            {/* Search Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div style={dropdownStyle}>
                {searchResults.map((item, i) => (
                  <div key={i} style={resultItemStyle} onClick={() => openBooking(item)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={item['Type'] === 'Package' ? pkgPillStyle : testPillStyle}>
                          {item['Type'] || 'Test'}
                        </span>
                        <div style={{ fontWeight: '700', marginTop: '4px', color: '#1e293b' }}>{item['Test Name']}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>By {item['Lab Name']}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#1e3a8a', fontWeight: '900', fontSize: '14px' }}>₹{item['MRP']}</div>
                        <div style={{ fontSize: '10px', color: '#dc2626' }}>{item['Fasting Status']}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Health Packages Grid */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 20px', backgroundColor: '#ffffff' }}>
        <h2 style={sectionTitleStyle}>Top Health Packages</h2>
        <div style={gridStyle}>
          {displayPackages.map((pkg, i) => (
            <div key={i} className="hover-card" style={cardStyle}>
              <span style={pillStyle}>PACKAGE</span>
              <h3 style={pkgTitleStyle}>{pkg['Test Name']}</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>By {pkg['Lab Name']}</p>
              <div style={dividerStyle}>
                <p style={{ color: '#dc2626', fontWeight: '600' }}>🕒 {pkg['Fasting Status']}</p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1e3a8a' }}>₹{pkg['MRP']}</span>
              </div>
              <div style={buttonGroupStyle}>
                <button onClick={() => openParams(pkg)} style={viewBtnStyle}>Details</button>
                <button onClick={() => openBooking(pkg)} style={bookBtnStyle}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- POPUP WINDOW FOR PARAMETERS --- */}
      {showParamModal && selectedPkg && (
        <div style={modalOverlayStyle} onClick={() => setShowParamModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1e3a8a', margin: 0 }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={closeIconStyle}>✕</button>
            </div>
            <p style={{ fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>{selectedPkg['Test Name']}</p>
            <div style={paramBoxStyle}>
              <strong>Parameters Included:</strong><br/>
              {selectedPkg['Parameter'] || "Details updated soon."}
            </div>
            <button 
              onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} 
              style={{...bookBtnStyle, width: '100%', marginTop: '20px', padding: '15px'}}
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* --- BOOKING MODAL --- */}
      {isBookingOpen && selectedPkg && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          testName={selectedPkg['Test Name']} 
          price={selectedPkg['MRP']} 
          labName={selectedPkg['Lab Name']} 
        />
      )}

    </div>
  );
};

// --- STYLES (Keep in Original Format + New Search Styles) ---

const dropdownStyle = {
  position: 'absolute', top: '105%', left: 0, right: 0,
  backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000,
  maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0'
};

const resultItemStyle = {
  padding: '12px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
  transition: 'background 0.2s', ':hover': { background: '#f8fafc' }
};

const pkgPillStyle = { fontSize: '8px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '5px', fontWeight: 'bold' };
const testPillStyle = { fontSize: '8px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '5px', fontWeight: 'bold' };

const heroStyle = { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', padding: 'clamp(40px, 10vw, 100px) 20px', color: 'white', textAlign: 'center' };
const heroTitleStyle = { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', lineHeight: '1.1' };
const heroSubtitleStyle = { margin: '20px 0', fontSize: 'clamp(1rem, 2vw, 1.2rem)', opacity: 0.9 };
const searchBoxStyle = { display: 'flex', background: 'white', borderRadius: '50px', padding: '6px', maxWidth: '600px', margin: '0 auto' };
const inputStyle = { flex: 1, border: 'none', padding: '12px 20px', borderRadius: '50px', outline: 'none', color: '#333', width: '100%' };
const searchBtnStyle = { backgroundColor: '#ffbf00', border: 'none', borderRadius: '50px', padding: '0 20px', cursor: 'pointer' };
const sectionTitleStyle = { fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#1e3a8a', fontWeight: '800', textAlign: 'center', marginBottom: '40px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' };
const cardStyle = { padding: '25px', border: '1px solid #e2e8f0', borderRadius: '32px', textAlign: 'left', background: 'white', display: 'flex', flexDirection: 'column' };
const pkgTitleStyle = { marginTop: '15px', fontSize: '1.3rem', fontWeight: '800' };
const pillStyle = { alignSelf: 'flex-start', backgroundColor: '#fef3c7', color: '#92400e', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' };
const dividerStyle = { margin: '20px 0', borderTop: '1px dashed #cbd5e1', paddingTop: '15px', fontSize: '13px', flexGrow: 1 };
const buttonGroupStyle = { display: 'flex', gap: '10px' };
const viewBtnStyle = { flex: 1, background: '#f1f5f9', color: '#1e3a8a', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const bookBtnStyle = { flex: 1, background: '#1e3a8a', color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001, padding: '20px' };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative' };
const closeIconStyle = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' };
const paramBoxStyle = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', fontSize: '14px', color: '#475569', maxHeight: '300px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' };

export default Home;