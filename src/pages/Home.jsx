import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';

const Home = () => {
  const [displayPackages, setDisplayPackages] = useState([]);
  const [allData, setAllData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showParamModal, setShowParamModal] = useState(false);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const validData = res.data.filter(item => item['Test Name']);
          setAllData(validData); 
          const pkgs = validData.filter(item => item.Type?.trim() === 'Package');
          setDisplayPackages(pkgs.slice(0, 8)); 
      }});
    });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) {
      const filtered = allData.filter(item => 
        item['Test Name'].toLowerCase().includes(value.toLowerCase()) ||
        (item['Parameter'] && item['Parameter'].toLowerCase().includes(value.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 10));
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const openParams = (pkg) => {
    setSelectedPkg(pkg);
    setShowParamModal(true);
  };

  const openBooking = (pkg) => {
    setSelectedPkg(pkg);
    setIsBookingOpen(true);
    setShowSearchDropdown(false); 
    setSearchTerm(''); 
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION (Updated with Stylish Theme) --- */}
      <section className="universal-hero">
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title">
            Compare & Book Lab Tests <br/>
            <span style={{ color: '#ffbf00' }}>Delhi-NCR</span>
          </h1>
          <div className="city-badge">AVAILABLE IN DELHI-NCR</div>
          <p style={{ margin: '10px 0 30px', fontSize: '1.1rem', opacity: 0.9 }}>
            NABL Certified Labs | Free Home Collection | 10% Discount
          </p>
          
          {/* Modern Search Box */}
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '6px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
              <input 
                type="text" 
                placeholder="Search for Tests or Packages (e.g. CBC, Lipid...)" 
                style={{ flex: 1, border: 'none', padding: '14px 25px', borderRadius: '50px', outline: 'none', color: '#333', fontSize: '16px' }} 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button style={{ backgroundColor: '#ffbf00', border: 'none', borderRadius: '50px', padding: '0 25px', cursor: 'pointer', fontSize: '18px' }}>🔍</button>
            </div>

            {/* Dropdown remains functional */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown" style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                {searchResults.map((item, i) => (
                  <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }} onClick={() => openBooking(item)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={item['Type'] === 'Package' ? { fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold' } : { fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold' }}>
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

      {/* --- TOP HEALTH PACKAGES GRID (Updated with Modern Cards) --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#1e3a8a', fontWeight: '800', textAlign: 'center', marginBottom: '40px' }}>Top Health Packages</h2>
        
        <div className="universal-grid">
          {displayPackages.map((pkg, i) => (
            <div key={i} className="modern-card hover-card">
              <span style={{ alignSelf: 'flex-start', backgroundColor: '#fef3c7', color: '#92400e', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>PACKAGE</span>
              <h3 style={{ marginTop: '15px', fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{pkg['Test Name']}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>By {pkg['Lab Name']}</p>
              
              <div style={{ margin: '15px 0', borderTop: '1px dashed #cbd5e1', paddingTop: '15px', flexGrow: 1 }}>
                <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '13px' }}>🕒 {pkg['Fasting Status']}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e3a8a' }}>₹{pkg['MRP']}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openParams(pkg)} className="btn-secondary" style={{ padding: '10px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 'bold' }}>Details</button>
                  <button onClick={() => openBooking(pkg)} className="confirm-btn" style={{ padding: '10px 18px', fontSize: '13px', width: 'auto' }}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODALS (Code remains same as original) --- */}
      {showParamModal && selectedPkg && (
        <div className="modal-overlay" onClick={() => setShowParamModal(false)}>
          <div className="modal-content-wrapper" onClick={e => e.stopPropagation()} style={{ padding: '30px', borderRadius: '24px', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1e3a8a', margin: 0 }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <p style={{ fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>{selectedPkg['Test Name']}</p>
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', fontSize: '14px', color: '#475569', maxHeight: '300px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
              <strong>Parameters Included:</strong><br/>
              {selectedPkg['Parameter'] || "Details updated soon."}
            </div>
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} className="confirm-btn" style={{ marginTop: '20px', padding: '15px' }}>Book Now</button>
          </div>
        </div>
      )}

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

export default Home;