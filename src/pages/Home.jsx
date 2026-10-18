import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';
import CompareModal from '../components/CompareModal';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const featureBadgeStyle = {
  background: 'white',
  padding: '6px 12px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
};

const featureTextStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#334155'
};

const Home = () => {
  const [allData, setAllData] = useState([]);
  const [displayPackages, setDisplayPackages] = useState([]);
  const [flyerPackages, setFlyerPackages] = useState([]);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDisease, setActiveDisease] = useState('All');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showParamModal, setShowParamModal] = useState(false);

  const [compareList, setCompareList] = useState([]);
  const [showCompareOverlay, setShowCompareOverlay] = useState(false);

  const partners = [
    { name: "Thyrocare", logo: "https://www.thyrocare.com/assets/images/logo.png" },
    { name: "Dr Lal PathLabs", logo: "https://www.lalpathlabs.com/images/logo.png" },
    { name: "Metropolis", logo: "https://www.metropolisindia.com/assets/images/logo.png" },
    { name: "SRL Diagnostics", logo: "https://www.srlworld.com/assets/images/logo.png" },
    { name: "Apollo", logo: "https://www.apollodiagnostics.in/assets/images/logo.png" }
  ];

  const diseasesList = [
    { name: 'All', icon: '🩺' },
    { name: 'Heart', icon: '🫀' },
    { name: 'Liver', icon: '🧪' },
    { name: 'Kidney', icon: '🫘' },
    { name: 'Joints', icon: '🦴' },
    { name: 'Diabetes', icon: '🩸' },
    { name: 'Brain', icon: '🧠' },
    { name: 'Thyroid', icon: '🦋' },
    { name: 'Full Body', icon: '🧘' }
  ];

  const categoriesList = ['All', 'Male', 'Female', 'Senior Citizen', 'Adult', 'Child'];

  // Helper function to safely get column value regardless of case
  const getColValue = (item, keyName) => {
    if (!item) return '';
    const keys = Object.keys(item);
    const matchedKey = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
    return matchedKey ? item[matchedKey] : '';
  };

  const getPrice = (item) => {
    if (!item) return 'N/A';
    return getColValue(item, 'RATE') || getColValue(item, 'price') || getColValue(item, 'rate') || getColValue(item, 'MRP') || 'N/A';
  };

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const validData = res.data.filter(item => getColValue(item, 'Test Name'));
          setAllData(validData);

          // Filter Flyers
          const flyers = validData.filter(item => {
            const flyerView = getColValue(item, 'FlyerView');
            const flyerImg = getColValue(item, 'FlyerImage');
            return flyerView && flyerView.trim().toUpperCase() === 'YES' && flyerImg && flyerImg.trim().length > 5;
          });
          setFlyerPackages(flyers.length > 0 ? flyers : validData.filter(item => getColValue(item, 'Type')?.trim() === 'Package').slice(0, 5));

          // Filter Packages for main grid
          filterData(validData, 'All', 'All');
      }});
    });
  }, []);

  const filterData = (data, category, disease) => {
    let filtered = data.filter(item => {
      const type = getColValue(item, 'Type');
      return type ? type.trim().toLowerCase() === 'package' : true;
    });

    // ShowOnHome check
    const homeOnly = filtered.filter(item => getColValue(item, 'ShowOnHome').trim().toUpperCase() === 'YES');
    if (homeOnly.length > 0) {
      filtered = homeOnly;
    }

    if (category !== 'All') {
      filtered = filtered.filter(item => {
        const catVal = getColValue(item, 'Category').toLowerCase();
        return catVal.includes(category.toLowerCase()) || catVal.includes('all');
      });
    }

    if (disease !== 'All') {
      filtered = filtered.filter(item => {
        const disVal = getColValue(item, 'Disease').toLowerCase();
        const testName = getColValue(item, 'Test Name').toLowerCase();
        const param = getColValue(item, 'Parameter').toLowerCase();
        return disVal.includes(disease.toLowerCase()) || testName.includes(disease.toLowerCase()) || param.includes(disease.toLowerCase());
      });
    }

    setDisplayPackages(filtered.slice(0, 12));
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    filterData(allData, cat, activeDisease);
  };

  const handleDiseaseChange = (dis) => {
    setActiveDisease(dis);
    filterData(allData, activeCategory, dis);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) {
      const filtered = allData.filter(item => {
        const name = getColValue(item, 'Test Name');
        const param = getColValue(item, 'Parameter');
        return name.toLowerCase().includes(value.toLowerCase()) || param.toLowerCase().includes(value.toLowerCase());
      });
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

  const handleCompareClick = (test, isChecked) => {
    const tName = getColValue(test, 'Test Name');
    if (isChecked) {
      if (compareList.length >= 3) return alert("Maximum 3 tests compare kar sakte hain!");
      setCompareList([...compareList, test]);
    } else {
      setCompareList(compareList.filter(t => getColValue(t, 'Test Name') !== tName));
    }
  };

  const removeCompareItem = (name) => {
    setCompareList(compareList.filter(t => getColValue(t, 'Test Name') !== name));
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* HOME PAGE SEO ENGINES */}
      <SEO 
        title="TestYaan | Compare & Book Lab Tests Online in Delhi-NCR"
        description="Book CBC, Blood Tests, and Health Packages at lowest prices in Delhi, Tuglakabad & NCR. Free Home Sample Collection. CSIR NET Expert Managed Lab Service."
        path="/"
        testsData={allData.slice(0, 20)}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": "TestYaan",
            "url": "https://testyaan.online",
            "logo": "https://testyaan.online/favicon.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-8130484197",
              "contactType": "customer service"
            },
            "location": {
              "@type": "Place",
              "name": "Delhi NCR, Tuglakabad"
            }
          })}
        </script>
      </Helmet>

      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
        Online Lab Test Booking Delhi, Best Diagnostic Center Tuglakabad, Home Blood Test Collection NCR
      </h1>

      {/* --- HERO SECTION --- */}
      <section style={{ backgroundColor: '#f0f7ff', padding: '25px 20px 30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>
              COMPARE & BOOK LAB TESTS
            </span>
            
            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a', margin: '6px 0', lineHeight: '1.1' }}>
              Your Health, <br/>
              <span style={{ color: '#E31E25' }}>Our Priority</span>
            </h1>

            <p style={{ color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
              NABL Certified Labs | Free Home Collection | Lowest Price Guarantee
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={featureBadgeStyle}><span>🛡️</span><span style={featureTextStyle}>NABL Accredited</span></div>
              <div style={featureBadgeStyle}><span>🏠</span><span style={featureTextStyle}>Free Home Collection</span></div>
              <div style={featureBadgeStyle}><span>🏷️</span><span style={featureTextStyle}>Lowest Price</span></div>
              <div style={featureBadgeStyle}><span>📋</span><span style={featureTextStyle}>Fast Reports</span></div>
            </div>

            <div style={{ position: 'relative', maxWidth: '580px' }}>
              <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '4px 6px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <span style={{ paddingLeft: '12px', fontSize: '16px', color: '#94a3b8' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search for Tests or Packages (e.g. CBC, Lipid Profile...)" 
                  style={{ flex: 1, border: 'none', padding: '10px 10px', outline: 'none', color: '#333', fontSize: '14px' }} 
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button style={{ backgroundColor: '#E31E25', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 22px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                  Search
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap', fontSize: '12px' }}>
                <span style={{ fontWeight: '700', color: '#475569' }}>Popular Searches:</span>
                {['CBC', 'Lipid Profile', 'Thyroid', 'Vitamin D', 'HbA1c', 'Liver Function'].map((tag) => (
                  <span 
                    key={tag} 
                    onClick={() => { setSearchTerm(tag); handleSearch({ target: { value: tag } }); }}
                    style={{ background: 'white', padding: '3px 10px', borderRadius: '15px', border: '1px solid #cbd5e1', cursor: 'pointer', color: '#334155', fontWeight: '600' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {showSearchDropdown && searchResults.length > 0 && (
                <div className="search-dropdown" style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 99999, maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                  {searchResults.map((item, i) => (
                    <div key={i} style={{ padding: '10px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }} onClick={() => openBooking(item)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={getColValue(item, 'Type') === 'Package' ? { fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold' } : { fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '5px', fontWeight: 'bold' }}>
                            {getColValue(item, 'Type') || 'Test'}
                          </span>
                          <div style={{ fontWeight: '700', marginTop: '2px', color: '#1e293b', fontSize: '13px' }}>{getColValue(item, 'Test Name')}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>By {getColValue(item, 'Lab Name')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#E31E25', fontWeight: '900', fontSize: '14px' }}>₹{getPrice(item)}</div>
                          <div style={{ fontSize: '10px', color: '#dc2626' }}>{getColValue(item, 'Fasting Status')}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: '0 0 340px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
              borderRadius: '20px',
              padding: '20px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
              textAlign: 'center',
              width: '100%'
            }}>
              <div style={{ width: '90px', height: '90px', margin: '0 auto 10px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', border: '3px solid #E31E25' }}>
                👩‍⚕️
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                TestYaan Certified Team
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px', fontWeight: '600' }}>
                Expert Blood Collection at Your Home
              </p>
              <div style={{ background: '#E31E25', color: 'white', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                ✨ Healthy Today, Brighter Tomorrow
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- POPULAR FLYERS HORIZONTAL CAROUSEL --- */}
      {flyerPackages.length > 0 && (
        <section style={{ padding: '30px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#1e3a8a', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>
              🔥 Trending Lab Packages & Offers
            </h2>
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollSnapType: 'x mandatory' }}>
              {flyerPackages.map((item, idx) => {
                const imgUrl = getColValue(item, 'FlyerImage');
                return (
                  <div 
                    key={idx} 
                    onClick={() => openParams(item)} 
                    style={{ 
                      flex: '0 0 280px', 
                      scrollSnapAlign: 'start', 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)', 
                      cursor: 'pointer', 
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.3s ease',
                      background: 'white'
                    }}
                    className="flyer-card-item"
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt={getColValue(item, 'Test Name')} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ padding: '20px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '10px', background: '#ffbf00', color: '#1e3a8a', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>OFFER</span>
                          <h3 style={{ fontSize: '1.1rem', marginTop: '10px', fontWeight: '800' }}>{getColValue(item, 'Test Name')}</h3>
                          <p style={{ fontSize: '12px', opacity: 0.9 }}>By {getColValue(item, 'Lab Name')}</p>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: '900', fontSize: '1.4rem', color: '#ffbf00' }}>
                          ₹{getPrice(item)}
                        </div>
                      </div>
                    )}
                    <div style={{ padding: '12px 15px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{getColValue(item, 'Test Name')}</span>
                      <button style={{ background: '#E31E25', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- BROWSE BY DISEASE / ORGAN SECTION --- */}
      <section style={{ padding: '40px 20px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: '800', marginBottom: '8px' }}>Browse Tests By Organ / Condition</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Select an organ or disease category to see specialized lab tests</p>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {diseasesList.map(d => (
              <button
                key={d.name}
                onClick={() => handleDiseaseChange(d.name)}
                style={{
                  background: activeDisease === d.name ? '#1e3a8a' : 'white',
                  color: activeDisease === d.name ? 'white' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: activeDisease === d.name ? '0 4px 12px rgba(30,58,138,0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{d.icon}</span>
                <span>{d.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- GENDER & AGE CATEGORY TABS + PACKAGES GRID --- */}
      <section style={{ padding: '30px 20px 60px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Category Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  background: activeCategory === cat ? '#E31E25' : 'white',
                  color: activeCategory === cat ? 'white' : '#475569',
                  border: activeCategory === cat ? 'none' : '1px solid #e2e8f0',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(227,30,37,0.2)' : 'none'
                }}
              >
                {cat === 'All' ? 'All Packages' : cat}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: '800', textAlign: 'center', marginBottom: '30px' }}>
            {activeCategory !== 'All' ? `${activeCategory} Health Packages` : 'Top Health Packages'}
          </h2>

          <div className="test-grid-system">
            {displayPackages.map((pkg, i) => {
              const testName = getColValue(pkg, 'Test Name');
              const labName = getColValue(pkg, 'Lab Name');
              const fasting = getColValue(pkg, 'Fasting Status');
              return (
                <div key={i} className="test-card-advanced">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="package-tag">PACKAGE</span>
                    <label className="compare-checkbox">
                      <input 
                        type="checkbox" 
                        checked={compareList.some(t => getColValue(t, 'Test Name') === testName)} 
                        onChange={(e) => handleCompareClick(pkg, e.target.checked)} 
                      /> Compare
                    </label>
                  </div>

                  <h3 className="card-title">{testName}</h3>
                  <p className="card-lab">By {labName}</p>
                  
                  <div className="card-info">
                    <p className="fasting-info">🕒 {fasting || 'No Fasting Required'}</p>
                  </div>

                  <div className="card-footer">
                    <div className="price-box">
                        <span className="mrp-text">₹{getPrice(pkg)}</span>
                    </div>
                    <div className="button-group">
                      <button onClick={() => openParams(pkg)} className="details-btn">Details</button>
                      <button onClick={() => openBooking(pkg)} className="book-btn">Book</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- PARTNERS SLIDER --- */}
      <section style={{ padding: '50px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '35px', fontWeight: '800' }}>Our Associated Partners</h2>
          <div className="logos-slider">
              <div className="logos-track">
                  {[...partners, ...partners].map((p, index) => (
                      <div className="logo-slide" key={index}>
                          <img src={p.logo} alt={`${p.name} laboratory partner`} style={{ height: '40px', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.6 }} />
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- FLOATING COMPARE BAR & MODALS --- */}
      {compareList.length > 0 && !showCompareOverlay && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#E31E25', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', zIndex: 4000 }}>
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

      {showParamModal && selectedPkg && (
        <div className="modal-overlay" onClick={() => setShowParamModal(false)}>
          <div className="modal-content-wrapper" onClick={e => e.stopPropagation()} style={{ padding: '30px', borderRadius: '24px', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1e3a8a', margin: 0 }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <p style={{ fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>{getColValue(selectedPkg, 'Test Name')}</p>
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', fontSize: '14px', color: '#475569', maxHeight: '300px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
              <strong>Parameters Included:</strong><br/>
              {getColValue(selectedPkg, 'Parameter') || "Details updated soon."}
            </div>
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} className="confirm-btn" style={{ marginTop: '20px', padding: '15px' }}>Book Now</button>
          </div>
        </div>
      )}

      {isBookingOpen && selectedPkg && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          testName={getColValue(selectedPkg, 'Test Name')} 
          price={getPrice(selectedPkg)} 
          labName={getColValue(selectedPkg, 'Lab Name')} 
        />
      )}

      <style>{`
        .test-grid-system { display: grid; gap: 20px; max-width: 1300px; margin: 0 auto; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 768px) { .test-grid-system { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .test-grid-system { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1440px) { .test-grid-system { grid-template-columns: repeat(5, 1fr); } }
        .test-card-advanced { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .test-card-advanced:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); border-color: #E31E25; }
        .flyer-card-item:hover { transform: translateY(-5px); }
        .package-tag { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; }
        .compare-checkbox { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 5px; cursor: pointer; }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 12px 0 4px; line-height: 1.3; height: 2.6em; overflow: hidden; }
        .card-lab { font-size: 12px; color: #64748b; margin-bottom: 12px; }
        .fasting-info { font-size: 12px; color: #dc2626; font-weight: 600; margin: 0; }
        .card-footer { margin-top: auto; padding-top: 15px; border-top: 1px solid #f1f5f9; }
        .mrp-text { font-size: 1.5rem; font-weight: 900; color: #E31E25; }
        .button-group { display: flex; gap: 8px; margin-top: 12px; }
        .details-btn { flex: 1; padding: 8px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 700; font-size: 12px; }
        .book-btn { flex: 1; padding: 8px; border-radius: 10px; background: #E31E25; color: white; border: none; cursor: pointer; font-weight: 700; font-size: 12px; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-200px * 5)); } }
        .logos-slider { overflow: hidden; position: relative; width: 100%; }
        .logos-track { display: flex; width: calc(200px * 10); animation: scroll 25s linear infinite; }
        .logo-slide { width: 200px; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
};

export default Home;