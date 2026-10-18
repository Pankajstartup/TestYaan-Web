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
    { name: "All Labs", icon: "🏥" },
    { name: "Thyrocare", icon: "🔴" },
    { name: "Dr Lal PathLabs", icon: "🔵" },
    { name: "Metropolis", icon: "🟢" },
    { name: "SRL Diagnostics", icon: "🟡" },
    { name: "Apollo", icon: "🟣" }
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
    <div style={{ overflowX: 'hidden', backgroundColor: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <SEO 
        title="TestYaan | Multi-Lab Health Aggregator & Comparison"
        description="Compare and Book Blood Tests and Health Packages across NABL Accredited Labs in Delhi-NCR."
        path="/"
        testsData={allData.slice(0, 20)}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": "TestYaan Marketplace",
            "url": "https://testyaan.online"
          })}
        </script>
      </Helmet>

      {/* --- GOIBIBO STYLE LAB SELECTION STRIP --- */}
      <div style={{ background: '#0a192f', padding: '14px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '14px', overflowX: 'auto' }}>
          <span style={{ fontWeight: '800', fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Choose Certified Lab:
          </span>
          {labPartners.map((partner) => {
            const isSelected = (selectedLab === 'All' && partner.name === 'All Labs') || selectedLab === partner.name;
            return (
              <button
                key={partner.name}
                onClick={() => handleLabChange(partner.name === 'All Labs' ? 'All' : partner.name)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  border: isSelected ? '1px solid #fda4af' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '30px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 15px rgba(225,29,72,0.4)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <span>{partner.icon}</span>
                <span>{partner.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- PREMIUM AGODA/AMAZON STYLE HERO BANNER & SEARCH --- */}
      <section style={{ background: 'linear-gradient(180deg, #0a192f 0%, #1e293b 100%)', padding: '30px 20px 50px', position: 'relative' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* BANNER CAROUSEL */}
          {flyerPackages.length > 0 ? (
            <div 
              style={{ 
                position: 'relative', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
                cursor: 'pointer',
                minHeight: '260px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => openParams(flyerPackages[currentSlide])}
            >
              {getColValue(flyerPackages[currentSlide], 'FlyerImage') ? (
                <img 
                  src={getColValue(flyerPackages[currentSlide], 'FlyerImage')} 
                  alt={getColValue(flyerPackages[currentSlide], 'Test Name')} 
                  style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                /* Premium Fallback Banner (Agoda Style Gradient) */
                <div style={{ 
                  padding: '40px 35px', 
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', 
                  color: 'white', 
                  display: 'flex', 
                  justify: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '20px',
                  borderRadius: '24px'
                }}>
                  <div style={{ maxWidth: '650px' }}>
                    <span style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', color: '#0f172a', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '900', letterSpacing: '0.5px' }}>
                      ⚡ EXCLUSIVE MARKETPLACE OFFER
                    </span>
                    <h2 style={{ fontSize: '2.2rem', margin: '16px 0 10px', fontWeight: '900', lineHeight: '1.2', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                      {getColValue(flyerPackages[currentSlide], 'Test Name')}
                    </h2>
                    <p style={{ fontSize: '15px', color: '#cbd5e1', marginBottom: '22px', fontWeight: '500' }}>
                      Certified Lab Partner: <strong style={{ color: '#6366f1' }}>{getColValue(flyerPackages[currentSlide], 'Lab Name')}</strong> | NABL Accredited
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '18px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '10px 22px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fbbf24' }}>₹{getPrice(flyerPackages[currentSlide])}</span>
                      <button style={{ background: '#e11d48', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '30px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 15px rgba(225,29,72,0.4)' }}>
                        Book Special Deal »
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '110px', opacity: 0.15, userSelect: 'none' }}>🩺</div>
                </div>
              )}
            </div>
          ) : null}

          {/* DOT INDICATORS */}
          {flyerPackages.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
              {flyerPackages.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  style={{ 
                    width: currentSlide === idx ? '32px' : '10px', 
                    height: '8px', 
                    borderRadius: '10px', 
                    background: currentSlide === idx ? '#e11d48' : 'rgba(255,255,255,0.3)', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}

          {/* FLOATING MARKETPLACE SEARCH BAR */}
          <div style={{ position: 'relative', maxWidth: '780px', margin: '30px auto 0' }}>
            <div style={{ display: 'flex', background: 'white', borderRadius: '50px', padding: '6px 8px', boxShadow: '0 15px 35px rgba(0,0,0,0.25)', border: '2px solid #38bdf8', alignItems: 'center' }}>
              <span style={{ paddingLeft: '18px', fontSize: '20px', color: '#0284c7' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search Blood Tests, Packages or Diagnostic Labs (e.g. CBC, Thyrocare)..." 
                style={{ flex: 1, border: 'none', padding: '14px 14px', outline: 'none', color: '#0f172a', fontSize: '15px', fontWeight: '600' }} 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', border: 'none', borderRadius: '50px', padding: '14px 32px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 15px rgba(2,132,199,0.4)' }}>
                Search
              </button>
            </div>

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown" style={{ position: 'absolute', top: '108%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 99999, maxHeight: '380px', overflowY: 'auto', border: '1px solid #cbd5e1' }}>
                {searchResults.map((item, i) => (
                  <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }} onClick={() => openBooking(item)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '5px', fontWeight: '800' }}>
                          {getColValue(item, 'Type') || 'Test'}
                        </span>
                        <div style={{ fontWeight: '800', marginTop: '3px', color: '#0f172a', fontSize: '14px' }}>{getColValue(item, 'Test Name')}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Lab: {getColValue(item, 'Lab Name')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e11d48', fontWeight: '900', fontSize: '15px' }}>₹{getPrice(item)}</div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>{getColValue(item, 'Fasting Status')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* --- ORGAN / CONDITION CARDS (AMAZON STYLE CATEGORIES) --- */}
      <section style={{ padding: '40px 20px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: '900', marginBottom: '6px' }}>
            Browse Tests By Organ / Health Condition
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Select an organ category to compare test rates across all labs</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '14px', maxWidth: '1100px', margin: '0 auto' }}>
            {diseasesList.map(d => {
              const isActive = activeDisease === d.name;
              return (
                <div
                  key={d.name}
                  onClick={() => handleDiseaseChange(d.name)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#f8fafc',
                    color: isActive ? 'white' : '#334155',
                    border: isActive ? 'none' : '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '16px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '8px',
                    boxShadow: isActive ? '0 8px 20px rgba(2,132,199,0.3)' : '0 2px 5px rgba(0,0,0,0.02)',
                    transition: 'all 0.25s ease'
                  }}
                  className="organ-card"
                >
                  <span style={{ fontSize: '28px' }}>{d.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800' }}>{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- DEMOGRAPHIC PACKAGES GRID --- */}
      <section style={{ padding: '45px 20px 70px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Demographic Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  background: activeCategory === cat ? '#e11d48' : 'white',
                  color: activeCategory === cat ? 'white' : '#475569',
                  border: activeCategory === cat ? 'none' : '1px solid #cbd5e1',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeCategory === cat ? '0 6px 18px rgba(225,29,72,0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat === 'All' ? 'All Demographic Packages' : cat}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: '900', textAlign: 'center', marginBottom: '30px' }}>
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
                  <p className="card-lab">Lab: <strong>{labName}</strong></p>
                  
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
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#e11d48', color: 'white', padding: '14px 28px', borderRadius: '50px', display: 'flex', gap: '18px', alignItems: 'center', boxShadow: '0 15px 35px rgba(225,29,72,0.4)', zIndex: 4000 }}>
          <span style={{fontWeight: '800'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setShowCompareOverlay(true)} className="confirm-btn" style={{ background: '#fbbf00', color: '#0f172a', padding: '8px 22px', width: 'auto', boxShadow: 'none', fontWeight: '900' }}>Compare Now</button>
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
          <div className="modal-content-wrapper" onClick={e => e.stopPropagation()} style={{ padding: '30px', borderRadius: '24px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: 0, fontWeight: '900' }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <p style={{ fontWeight: '800', color: '#0f172a', marginBottom: '4px', fontSize: '1.1rem' }}>{getColValue(selectedPkg, 'Test Name')}</p>
            <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: '700', marginBottom: '16px' }}>Certified Lab: {getColValue(selectedPkg, 'Lab Name')}</p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', fontSize: '14px', color: '#334155', maxHeight: '280px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
              <strong>Included Parameters:</strong><br/>
              {getColValue(selectedPkg, 'Parameter') || "Parameters details updated soon."}
            </div>
            
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} className="confirm-btn" style={{ marginTop: '20px', padding: '14px', background: '#e11d48', fontWeight: '800', fontSize: '15px' }}>
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
        .test-grid-system { display: grid; gap: 20px; max-width: 1300px; margin: 0 auto; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 768px) { .test-grid-system { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .test-grid-system { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1440px) { .test-grid-system { grid-template-columns: repeat(5, 1fr); } }
        .test-card-advanced { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .test-card-advanced:hover { transform: translateY(-6px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: #38bdf8; }
        .organ-card:hover { transform: translateY(-4px); border-color: #0284c7 !important; }
        .package-tag { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 800; }
        .compare-checkbox { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 5px; cursor: pointer; font-weight: 600; }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 12px 0 4px; line-height: 1.3; height: 2.6em; overflow: hidden; }
        .card-lab { font-size: 12px; color: #64748b; margin-bottom: 12px; }
        .fasting-info { font-size: 12px; color: #059669; font-weight: 700; margin: 0; }
        .card-footer { margin-top: auto; padding-top: 15px; border-top: 1px solid #f1f5f9; }
        .mrp-text { font-size: 1.5rem; font-weight: 900; color: #e11d48; }
        .button-group { display: flex; gap: 8px; margin-top: 12px; }
        .details-btn { flex: 1; padding: 10px; border-radius: 12px; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-weight: 700; font-size: 12px; color: #334155; }
        .book-btn { flex: 1; padding: 10px; border-radius: 12px; background: #e11d48; color: white; border: none; cursor: pointer; font-weight: 800; font-size: 12px; boxShadow: 0 4px 12px rgba(225,29,72,0.3); }
      `}</style>
    </div>
  );
};

export default Home;