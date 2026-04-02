import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';
import CompareModal from '../components/CompareModal';

const Home = () => {
  const [displayPackages, setDisplayPackages] = useState([]);
  const [allData, setAllData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showParamModal, setShowParamModal] = useState(false);

  // --- NAYA STATE: COMPARE KE LIYE (TESTS.JSX STYLE) ---
  const [compareList, setCompareList] = useState([]);
  const [showCompareOverlay, setShowCompareOverlay] = useState(false);

  // Partner Logos Data
  const partners = [
    { name: "Thyrocare", logo: "https://www.thyrocare.com/assets/images/logo.png" },
    { name: "Dr Lal PathLabs", logo: "https://www.lalpathlabs.com/images/logo.png" },
    { name: "Metropolis", logo: "https://www.metropolisindia.com/assets/images/logo.png" },
    { name: "SRL Diagnostics", logo: "https://www.srlworld.com/assets/images/logo.png" },
    { name: "Apollo", logo: "https://www.apollodiagnostics.in/assets/images/logo.png" }
  ];

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const validData = res.data.filter(item => item['Test Name']);
          setAllData(validData); 
          const pkgs = validData.filter(item => item.Type?.trim() === 'Package');
          setDisplayPackages(pkgs.slice(0, 10)); // PC par 10 tests dikhayenge (2 lines of 5)
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

  // --- EXACT TESTS.JSX LOGIC ---
  const handleCompareClick = (test, isChecked) => {
    if (isChecked) {
      if (compareList.length >= 3) return alert("Maximum 3 tests compare kar sakte hain!");
      setCompareList([...compareList, test]);
    } else {
      setCompareList(compareList.filter(t => t['Test Name'] !== test['Test Name']));
    }
  };

  const removeCompareItem = (name) => {
    setCompareList(compareList.filter(t => t['Test Name'] !== name));
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
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

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown" style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 99999, maxHeight: '400px', overflowY: 'visible', border: '1px solid #e2e8f0' }}>
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

      {/* --- TOP HEALTH PACKAGES GRID (REVISED FOR PC VIEW) --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8fafc' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#1e3a8a', fontWeight: '800', textAlign: 'center', marginBottom: '40px' }}>Top Health Packages</h2>
        
        <div className="test-grid-system">
          {displayPackages.map((pkg, i) => (
            <div key={i} className="test-card-advanced">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="package-tag">PACKAGE</span>
                <label className="compare-checkbox">
                  <input 
                    type="checkbox" 
                    checked={compareList.some(t => t['Test Name'] === pkg['Test Name'])} 
                    onChange={(e) => handleCompareClick(pkg, e.target.checked)} 
                  /> Compare
                </label>
              </div>

              <h3 className="card-title">{pkg['Test Name']}</h3>
              <p className="card-lab">By {pkg['Lab Name']}</p>
              
              <div className="card-info">
                <p className="fasting-info">🕒 {pkg['Fasting Status']}</p>
              </div>

              <div className="card-footer">
                <div className="price-box">
                    <span className="mrp-text">₹{pkg['MRP']}</span>
                </div>
                <div className="button-group">
                  <button onClick={() => openParams(pkg)} className="details-btn">Details</button>
                  <button onClick={() => openBooking(pkg)} className="book-btn">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ASSOCIATED PARTNERS SLIDER --- */}
      <section style={{ padding: '60px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '40px', fontWeight: '800' }}>Our Associated Partners</h2>
          <div className="logos-slider">
              <div className="logos-track">
                  {[...partners, ...partners].map((p, index) => (
                      <div className="logo-slide" key={index}>
                          <img src={p.logo} alt={p.name} style={{ height: '40px', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.6 }} />
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- MODALS --- */}
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

      {/* FLOATING BAR */}
      {compareList.length > 0 && !showCompareOverlay && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#1e3a8a', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', zIndex: 4000 }}>
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

      {isBookingOpen && selectedPkg && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          testName={selectedPkg['Test Name']} 
          price={selectedPkg['MRP']} 
          labName={selectedPkg['Lab Name']} 
        />
      )}

      <style>{`
        /* Advanced PC Grid System */
        .test-grid-system {
          display: grid;
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
          grid-template-columns: repeat(1, 1fr); /* Mobile */
        }

        @media (min-width: 768px) { .test-grid-system { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .test-grid-system { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1440px) { .test-grid-system { grid-template-columns: repeat(5, 1fr); } }

        /* Healthians Style Card */
        .test-card-advanced {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .test-card-advanced:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }

        .package-tag { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; }
        .compare-checkbox { font-size: 12px; color: #64748b; display: flex; alignItems: center; gap: 5px; cursor: pointer; }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 12px 0 4px; line-height: 1.3; height: 2.6em; overflow: hidden; }
        .card-lab { font-size: 12px; color: #64748b; margin-bottom: 12px; }
        .fasting-info { font-size: 12px; color: #dc2626; font-weight: 600; margin: 0; }
        .card-footer { margin-top: auto; padding-top: 15px; border-top: 1px solid #f1f5f9; }
        .mrp-text { font-size: 1.5rem; font-weight: 900; color: #1e3a8a; }
        .button-group { display: flex; gap: 8px; margin-top: 12px; }
        .details-btn { flex: 1; padding: 8px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 700; font-size: 12px; }
        .book-btn { flex: 1; padding: 8px; border-radius: 10px; background: #1e3a8a; color: white; border: none; cursor: pointer; font-weight: 700; font-size: 12px; }

        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-200px * 5)); } }
        .logos-slider { overflow: hidden; position: relative; width: 100%; }
        .logos-track { display: flex; width: calc(200px * 10); animation: scroll 25s linear infinite; }
        .logo-slide { width: 200px; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
};

export default Home;