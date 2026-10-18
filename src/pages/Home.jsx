import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';
import CompareModal from '../components/CompareModal';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [allData, setAllData] = useState([]);
  const [displayPackages, setDisplayPackages] = useState([]);
  const [flyerPackages, setFlyerPackages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [selectedLab, setSelectedLab] = useState('All');
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

  const labPartners = [
    { name: "All Labs", logo: "🏥" },
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

  // Case-Insensitive Column Value Extraction
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
          filterData(validData, 'All', 'All', 'All');
      }});
    });
  }, []);

  // Filter Data Logic Across Labs, Categories, and Diseases
  const filterData = (data, lab, category, disease) => {
    let filtered = data;

    // Filter by Lab
    if (lab !== 'All') {
      filtered = filtered.filter(item => getColValue(item, 'Lab Name').toLowerCase().includes(lab.toLowerCase()));
    }

    // Filter Flyers for Slider
    const flyers = filtered.filter(item => {
      const flyerView = getColValue(item, 'FlyerView');
      const flyerImg = getColValue(item, 'FlyerImage');
      return flyerView && flyerView.trim().toUpperCase() === 'YES' && flyerImg && flyerImg.trim().length > 5;
    });
    setFlyerPackages(flyers.length > 0 ? flyers : filtered.filter(item => getColValue(item, 'Type')?.trim() === 'Package').slice(0, 5));
    setCurrentSlide(0);

    // Packages Grid Filtering
    let pkgs = filtered.filter(item => {
      const type = getColValue(item, 'Type');
      return type ? type.trim().toLowerCase() === 'package' : true;
    });

    const homeOnly = pkgs.filter(item => getColValue(item, 'ShowOnHome').trim().toUpperCase() === 'YES');
    if (homeOnly.length > 0 && lab === 'All' && category === 'All' && disease === 'All') {
      pkgs = homeOnly;
    }

    if (category !== 'All') {
      pkgs = pkgs.filter(item => {
        const catVal = getColValue(item, 'Category').toLowerCase();
        return catVal.includes(category.toLowerCase()) || catVal.includes('all');
      });
    }

    if (disease !== 'All') {
      pkgs = pkgs.filter(item => {
        const disVal = getColValue(item, 'Disease').toLowerCase();
        const testName = getColValue(item, 'Test Name').toLowerCase();
        const param = getColValue(item, 'Parameter').toLowerCase();
        return disVal.includes(disease.toLowerCase()) || testName.includes(disease.toLowerCase()) || param.includes(disease.toLowerCase());
      });
    }

    setDisplayPackages(pkgs.slice(0, 12));
  };

  // Hero Slider Auto-Rotate Effect (Every 4.5 Seconds)
  useEffect(() => {
    if (flyerPackages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % flyerPackages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [flyerPackages]);

  const handleLabChange = (labName) => {
    setSelectedLab(labName);
    filterData(allData, labName, activeCategory, activeDisease);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    filterData(allData, selectedLab, cat, activeDisease);
  };

  const handleDiseaseChange = (dis) => {
    setActiveDisease(dis);
    filterData(allData, selectedLab, activeCategory, dis);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) {
      const filtered = allData.filter(item => {
        const name = getColValue(item, 'Test Name');
        const param = getColValue(item, 'Parameter');
        const lab = getColValue(item, 'Lab Name');
        return name.toLowerCase().includes(value.toLowerCase()) || 
               param.toLowerCase().includes(value.toLowerCase()) ||
               lab.toLowerCase().includes(value.toLowerCase());
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
    <div style={{ overflowX: 'hidden', backgroundColor: '#f8fafc' }}>
      
      {/* HOME PAGE SEO ENGINES */}
      <SEO 
        title="TestYaan | Multi-Lab Diagnostics Aggregator Delhi-NCR"
        description="Compare and Book Blood Tests and Health Packages across NABL Certified Labs in Delhi-NCR. Compare Prices of Thyrocare, Dr Lal, SRL, Metropolis & Book Online."
        path="/"
        testsData={allData.slice(0, 20)}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": "TestYaan Aggregator",
            "url": "https://testyaan.online",
            "logo": "https://testyaan.online/favicon.png",
            "description": "Multi-Lab Diagnostics Comparison & Booking Marketplace"
          })}
        </script>
      </Helmet>

      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
        Compare & Book Tests Across All NABL Certified Labs in Delhi NCR - TestYaan Marketplace
      </h1>

      {/* --- TOP BRAND LAB SELECTOR BAR --- */}
      <div style={{ background: '#ffffff', padding: '12px 15px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontWeight: '800', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap', marginRight: '5px' }}>
            Select Preferred Lab:
          </span>
          {labPartners.map((partner) => (
            <button
              key={partner.name}
              onClick={() => handleLabChange(partner.name === 'All Labs' ? 'All' : partner.name)}
              style={{
                background: (selectedLab === 'All' && partner.name === 'All Labs') || selectedLab === partner.name ? '#1e3a8a' : '#f1f5f9',
                color: (selectedLab === 'All' && partner.name === 'All Labs') || selectedLab === partner.name ? 'white' : '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '25px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {typeof partner.logo === 'string' && partner.logo.startsWith('http') ? (
                <img src={partner.logo} alt={partner.name} style={{ height: '18px', objectFit: 'contain' }} />
              ) : (
                <span>{partner.logo}</span>
              )}
              <span>{partner.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- HERO BANNER AUTO-SLIDER (DYNAMIC LAB FLYERS) --- */}
      <section style={{ padding: '20px 15px', backgroundColor: '#eef2ff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {flyerPackages.length > 0 ? (
            <div 
              style={{ 
                position: 'relative', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)', 
                cursor: 'pointer',
                minHeight: '250px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)'
              }}
              onClick={() => openParams(flyerPackages[currentSlide])}
            >
              {getColValue(flyerPackages[currentSlide], 'FlyerImage') ? (
                <img 
                  src={getColValue(flyerPackages[currentSlide], 'FlyerImage')} 
                  alt={getColValue(flyerPackages[currentSlide], 'Test Name')} 
                  style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                /* Fallback Branded Card Design */
                <div style={{ padding: '35px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ maxWidth: '600px' }}>
                    <span style={{ background: '#ffbf00', color: '#000', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      FEATURED LAB OFFER
                    </span>
                    <h2 style={{ fontSize: '2rem', margin: '12px 0 8px', fontWeight: '900', lineHeight: '1.2' }}>
                      {getColValue(flyerPackages[currentSlide], 'Test Name')}
                    </h2>
                    <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '18px' }}>
                      Offered By: <strong>{getColValue(flyerPackages[currentSlide], 'Lab Name')}</strong> | NABL Certified
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '50px' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffbf00' }}>₹{getPrice(flyerPackages[currentSlide])}</span>
                      <button style={{ background: '#E31E25', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Book Now »
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '90px', opacity: 0.2 }}>🩺</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '40px', background: 'white', borderRadius: '24px', textAlign: 'center', color: '#64748b' }}>No lab flyers available for this selection.</div>
          )}

          {/* SLIDER DOT INDICATORS */}
          {flyerPackages.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              {flyerPackages.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  style={{ 
                    width: currentSlide === idx ? '30px' : '10px', 
                    height: '8px', 
                    borderRadius: '10px', 
                    background: currentSlide === idx ? '#E31E25' : '#cbd5e1', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}

          {/* SEARCH ENGINE UNDER SLIDER */}
          <div style={{ position: 'relative', maxWidth: '720px', margin: '20px auto 0' }}>
            <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '5px 8px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', border: '1px solid #cbd5e1', alignItems: 'center' }}>
              <span style={{ paddingLeft: '15px', fontSize: '18px', color: '#94a3b8' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search Tests, Packages or Labs (e.g. CBC, Thyrocare, Lipid...)" 
                style={{ flex: 1, border: 'none', padding: '12px 12px', outline: 'none', color: '#333', fontSize: '15px' }} 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button style={{ backgroundColor: '#E31E25', color: 'white', border: 'none', borderRadius: '50px', padding: '12px 28px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                Search
              </button>
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
      </section>

      {/* --- BROWSE BY ORGAN / DISEASE SECTION --- */}
      <section style={{ padding: '30px 20px 15px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#1e3a8a', fontWeight: '800', marginBottom: '6px' }}>Filter Tests By Organ / Condition</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Select an organ category to compare test rates across all labs</p>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {diseasesList.map(d => (
              <button
                key={d.name}
                onClick={() => handleDiseaseChange(d.name)}
                style={{
                  background: activeDisease === d.name ? '#1e3a8a' : '#f8fafc',
                  color: activeDisease === d.name ? 'white' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeDisease === d.name ? '0 4px 12px rgba(30,58,138,0.2)' : 'none'
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
      <section style={{ padding: '35px 20px 60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  background: activeCategory === cat ? '#E31E25' : 'white',
                  color: activeCategory === cat ? 'white' : '#475569',
                  border: activeCategory === cat ? 'none' : '1px solid #e2e8f0',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(227,30,37,0.2)' : 'none'
                }}
              >
                {cat === 'All' ? 'All Demographic Packages' : cat}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.7rem', color: '#1e3a8a', fontWeight: '800', textAlign: 'center', marginBottom: '25px' }}>
            {selectedLab !== 'All' ? `${selectedLab} Packages` : 'Top Health Packages Across Labs'}
          </h2>

          <div className="test-grid-system">
            {displayPackages.map((pkg, i) => {
              const testName = getColValue(pkg, 'Test Name');
              const labName = getColValue(pkg, 'Lab Name');
              const fasting = getColValue(pkg, 'Fasting Status');
              return (
                <div key={i} className="test-card-advanced">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="package-tag">{labName.toUpperCase()}</span>
                    <label className="compare-checkbox">
                      <input 
                        type="checkbox" 
                        checked={compareList.some(t => getColValue(t, 'Test Name') === testName)} 
                        onChange={(e) => handleCompareClick(pkg, e.target.checked)} 
                      /> Compare
                    </label>
                  </div>

                  <h3 className="card-title">{testName}</h3>
                  <p className="card-lab">Lab: {labName}</p>
                  
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

      {/* --- FLOATING COMPARE BAR & MODALS --- */}
      {compareList.length > 0 && !showCompareOverlay && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#E31E25', color: 'white', padding: '14px 28px', borderRadius: '50px', display: 'flex', gap: '18px', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', zIndex: 4000 }}>
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
            <p style={{ fontWeight: '800', color: '#0f172a', marginBottom: '5px' }}>{getColValue(selectedPkg, 'Test Name')}</p>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>By {getColValue(selectedPkg, 'Lab Name')}</p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px', fontSize: '14px', color: '#475569', maxHeight: '280px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
              <strong>Included Test Parameters:</strong><br/>
              {getColValue(selectedPkg, 'Parameter') || "Parameters details updated soon."}
            </div>
            
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} className="confirm-btn" style={{ marginTop: '20px', padding: '14px' }}>
              Book Now (₹{getPrice(selectedPkg)})
            </button>
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
        .package-tag { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; }
        .compare-checkbox { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 5px; cursor: pointer; }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 12px 0 4px; line-height: 1.3; height: 2.6em; overflow: hidden; }
        .card-lab { font-size: 12px; color: #64748b; margin-bottom: 12px; }
        .fasting-info { font-size: 12px; color: #dc2626; font-weight: 600; margin: 0; }
        .card-footer { margin-top: auto; padding-top: 15px; border-top: 1px solid #f1f5f9; }
        .mrp-text { font-size: 1.5rem; font-weight: 900; color: #E31E25; }
        .button-group { display: flex; gap: 8px; margin-top: 12px; }
        .details-btn { flex: 1; padding: 8px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 700; font-size: 12px; }
        .book-btn { flex: 1; padding: 8px; border-radius: 10px; background: #E31E25; color: white; border: none; cursor: pointer; font-weight: 700; font-size: 12px; }
      `}</style>
    </div>
  );
};

export default Home;