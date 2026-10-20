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

  // Dynamic Labs extracted ONLY from Sheet data
  const [dynamicLabs, setDynamicLabs] = useState([]);

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

  // Render Full Lab Logo Image Dynamically
  const renderLabLogo = (item, height = '32px') => {
    const logoUrl = getColValue(item, 'Lab Logo') || getColValue(item, 'LabLogo');
    const labName = getColValue(item, 'Lab Name');
    
    if (logoUrl && logoUrl.trim().length > 5) {
      return (
        <img 
          src={logoUrl} 
          alt={labName} 
          style={{ height, maxWidth: '140px', objectFit: 'contain', display: 'block' }} 
        />
      );
    }
    return <span style={{ fontWeight: '800', color: '#00205b', fontSize: '14px' }}>🏥 {labName}</span>;
  };

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const validData = res.data.filter(item => getColValue(item, 'Test Name'));
          setAllData(validData);

          // Extract ONLY labs that actually exist in the Sheet rows
          const labsMap = {};
          validData.forEach(item => {
            const lName = getColValue(item, 'Lab Name');
            const lLogo = getColValue(item, 'Lab Logo') || getColValue(item, 'LabLogo');
            if (lName && lName.trim().length > 0 && !labsMap[lName.trim()]) {
              labsMap[lName.trim()] = lLogo;
            }
          });

          const labsList = [];
          Object.keys(labsMap).forEach(lab => {
            labsList.push({ name: lab, logo: labsMap[lab] });
          });
          setDynamicLabs(labsList);

          filterData(validData, 'All', 'All', 'All');
      }});
    });
  }, []);

  const filterData = (data, lab, category, disease) => {
    let filtered = data;

    if (lab !== 'All') {
      filtered = filtered.filter(item => getColValue(item, 'Lab Name').toLowerCase().includes(lab.toLowerCase()));
    }

    const flyers = filtered.filter(item => {
      const flyerView = getColValue(item, 'FlyerView');
      const flyerImg = getColValue(item, 'FlyerImage');
      return flyerView && flyerView.trim().toUpperCase() === 'YES' && flyerImg && flyerImg.trim().length > 5;
    });
    setFlyerPackages(flyers.length > 0 ? flyers : filtered.filter(item => getColValue(item, 'Type')?.trim() === 'Package').slice(0, 5));
    setCurrentSlide(0);

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

  useEffect(() => {
    if (flyerPackages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % flyerPackages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [flyerPackages]);

  const handleLabChange = (labName) => {
    const newLab = selectedLab === labName ? 'All' : labName;
    setSelectedLab(newLab);
    filterData(allData, newLab, activeCategory, activeDisease);
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
    <div style={{ overflowX: 'hidden', backgroundColor: '#f8fafc', fontFamily: 'Roboto, Arial, sans-serif' }}>
      
      <SEO 
        title="TestYaan | Multi-Lab Diagnostic Marketplace"
        description="Compare and Book Blood Tests across NABL Accredited Labs in Delhi-NCR."
        path="/"
        testsData={allData.slice(0, 20)}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": "TestYaan Aggregator",
            "url": "https://testyaan.online"
          })}
        </script>
      </Helmet>

      {/* --- TOP DYNAMIC LAB STRIP --- */}
      {dynamicLabs.length > 0 && (
        <div style={{ background: '#ffffff', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '14px', overflowX: 'auto', justifyContent: 'flex-start' }}>
            {dynamicLabs.map((labObj) => {
              const isSelected = selectedLab === labObj.name;
              return (
                <button
                  key={labObj.name}
                  onClick={() => handleLabChange(labObj.name)}
                  style={{
                    background: isSelected ? '#f0f7ff' : '#ffffff',
                    border: isSelected ? '2px solid #00205b' : '1px solid #cbd5e1',
                    borderRadius: '30px',
                    padding: '8px 22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    minHeight: '42px',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,32,91,0.12)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {labObj.logo && labObj.logo.trim().length > 5 ? (
                    <img src={labObj.logo} alt={labObj.name} style={{ height: '28px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontWeight: '800', color: '#00205b', fontSize: '13px' }}>🏥 {labObj.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- HERO SECTION WITH FLYER BANNER --- */}
      <section style={{ background: 'linear-gradient(180deg, #e8f1f9 0%, #f8fafc 100%)', padding: '20px 20px 35px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* FLYER BANNER CAROUSEL */}
          {flyerPackages.length > 0 ? (
            <div 
              style={{ 
                position: 'relative', 
                width: '100%',
                borderRadius: '18px', 
                overflow: 'hidden', 
                boxShadow: '0 12px 30px rgba(0,32,91,0.1)', 
                cursor: 'pointer',
                minHeight: '250px',
                border: '1px solid #cbd5e1',
                background: '#00205b'
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
                <div style={{ padding: '35px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ maxWidth: '700px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{ background: '#e31837', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>
                        FEATURED PACKAGE
                      </span>
                      <div style={{ background: 'white', padding: '6px 12px', borderRadius: '6px' }}>
                        {renderLabLogo(flyerPackages[currentSlide], '26px')}
                      </div>
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '10px 0', fontWeight: '800', lineHeight: '1.2' }}>
                      {getColValue(flyerPackages[currentSlide], 'Test Name')}
                    </h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '18px', background: 'rgba(255,255,255,0.1)', padding: '10px 22px', borderRadius: '8px', marginTop: '12px' }}>
                      <span style={{ fontSize: '1.7rem', fontWeight: '900', color: '#ffffff' }}>₹{getPrice(flyerPackages[currentSlide])}</span>
                      <button style={{ background: '#e31837', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                        Book Now »
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '90px', opacity: 0.15 }}>🩺</div>
                </div>
              )}
            </div>
          ) : null}

          {/* CAROUSEL DOTS */}
          {flyerPackages.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
              {flyerPackages.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  style={{ 
                    width: currentSlide === idx ? '28px' : '8px', 
                    height: '6px', 
                    borderRadius: '4px', 
                    background: currentSlide === idx ? '#e31837' : '#cbd5e1', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}

          {/* SEARCH BAR */}
          <div style={{ position: 'relative', maxWidth: '800px', margin: '25px auto 0' }}>
            <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '4px 6px', boxShadow: '0 8px 20px rgba(0,32,91,0.08)', border: '2px solid #00205b', alignItems: 'center' }}>
              <span style={{ paddingLeft: '18px', fontSize: '18px', color: '#00205b' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search for Tests, Health Packages or Labs (e.g. CBC, Lipid)..." 
                style={{ flex: 1, border: 'none', padding: '12px 14px', outline: 'none', color: '#0f172a', fontSize: '14px', fontWeight: '600' }} 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button style={{ backgroundColor: '#e31837', color: 'white', border: 'none', borderRadius: '50px', padding: '12px 30px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                Search
              </button>
            </div>

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown" style={{ position: 'absolute', top: '108%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', zIndex: 99999, maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                {searchResults.map((item, i) => (
                  <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }} onClick={() => openBooking(item)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                          {getColValue(item, 'Type') || 'Test'}
                        </span>
                        <div style={{ fontWeight: '800', marginTop: '2px', color: '#00205b', fontSize: '13px' }}>{getColValue(item, 'Test Name')}</div>
                        <div style={{ marginTop: '6px' }}>
                          {renderLabLogo(item, '22px')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e31837', fontWeight: '900', fontSize: '14px' }}>₹{getPrice(item)}</div>
                        <div style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>{getColValue(item, 'Fasting Status')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* --- ORGAN / CONDITION CARDS --- */}
      <section style={{ padding: '30px 20px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#00205b', fontWeight: '800', marginBottom: '4px' }}>
            Browse Tests By Organ / Health Condition
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Select an organ category to compare test rates across all labs</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', maxWidth: '1100px', margin: '0 auto' }}>
            {diseasesList.map(d => {
              const isActive = activeDisease === d.name;
              return (
                <div
                  key={d.name}
                  onClick={() => handleDiseaseChange(d.name)}
                  style={{
                    background: isActive ? '#00205b' : '#f8fafc',
                    color: isActive ? 'white' : '#334155',
                    border: isActive ? 'none' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '12px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  className="organ-card"
                >
                  <span style={{ fontSize: '22px' }}>{d.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- TEST / PACKAGES GRID WITH FULL LAB LOGO HEADERS --- */}
      <section style={{ padding: '35px 20px 60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* CATEGORY PILLS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  background: activeCategory === cat ? '#e31837' : 'white',
                  color: activeCategory === cat ? 'white' : '#475569',
                  border: activeCategory === cat ? 'none' : '1px solid #cbd5e1',
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat === 'All' ? 'All Demographic Packages' : cat}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', color: '#00205b', fontWeight: '800', textAlign: 'center', marginBottom: '25px' }}>
            Top Health Packages
          </h2>

          <div className="test-grid-system">
            {displayPackages.map((pkg, i) => {
              const testName = getColValue(pkg, 'Test Name');
              const fasting = getColValue(pkg, 'Fasting Status');
              return (
                <div key={i} className="test-card-advanced">
                  
                  {/* CARD HEADER: Full Lab Logo on Left, Compare Checkbox on Right */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '36px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {renderLabLogo(pkg, '32px')}
                    </div>
                    <label className="compare-checkbox">
                      <input 
                        type="checkbox" 
                        checked={compareList.some(t => getColValue(t, 'Test Name') === testName)} 
                        onChange={(e) => handleCompareClick(pkg, e.target.checked)} 
                      /> Compare
                    </label>
                  </div>

                  <h3 className="card-title">{testName}</h3>
                  
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
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#e31837', color: 'white', padding: '12px 24px', borderRadius: '50px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 10px 25px rgba(227,24,55,0.4)', zIndex: 4000 }}>
          <span style={{fontWeight: '800'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setShowCompareOverlay(true)} className="confirm-btn" style={{ background: '#00205b', color: 'white', padding: '6px 18px', width: 'auto', boxShadow: 'none', fontWeight: '800' }}>Compare Now</button>
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
          <div className="modal-content-wrapper" onClick={e => e.stopPropagation()} style={{ padding: '25px', borderRadius: '16px', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#00205b', margin: 0, fontWeight: '800' }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <p style={{ fontWeight: '800', color: '#0f172a', marginBottom: '6px', fontSize: '1rem' }}>{getColValue(selectedPkg, 'Test Name')}</p>
            <div style={{ marginBottom: '14px' }}>
              {renderLabLogo(selectedPkg, '32px')}
            </div>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', fontSize: '13px', color: '#334155', maxHeight: '260px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
              <strong>Included Parameters:</strong><br/>
              {getColValue(selectedPkg, 'Parameter') || "Parameters details updated soon."}
            </div>
            
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} className="confirm-btn" style={{ marginTop: '18px', padding: '12px', background: '#e31837', fontWeight: '800', fontSize: '14px' }}>
              Book Now at ₹{getPrice(selectedPkg)}
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
        .test-grid-system { display: grid; gap: 16px; max-width: 1300px; margin: 0 auto; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 768px) { .test-grid-system { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .test-grid-system { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1440px) { .test-grid-system { grid-template-columns: repeat(5, 1fr); } }
        .test-card-advanced { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; transition: all 0.25s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .test-card-advanced:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,32,91,0.08); border-color: #00205b; }
        .organ-card:hover { transform: translateY(-3px); border-color: #00205b !important; }
        .compare-checkbox { font-size: 11px; color: #64748b; display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600; }
        .card-title { font-size: 1rem; font-weight: 800; color: #00205b; margin: 8px 0 6px; line-height: 1.3; height: 2.6em; overflow: hidden; }
        .fasting-info { font-size: 11px; color: #059669; font-weight: 700; margin: 0 0 10px; }
        .card-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9; }
        .mrp-text { font-size: 1.4rem; font-weight: 900; color: #e31837; }
        .button-group { display: flex; gap: 6px; margin-top: 10px; }
        .details-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-weight: 700; font-size: 11px; color: #334155; }
        .book-btn { flex: 1; padding: 8px; border-radius: 8px; background: #e31837; color: white; border: none; cursor: pointer; font-weight: 800; font-size: 11px; }
      `}</style>
    </div>
  );
};

export default Home;