import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';
import CompareModal from '../components/CompareModal';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const phoneNumber = "9873271763";

  const [allData, setAllData] = useState([]);
  const [displayPackages, setDisplayPackages] = useState([]);
  const [flyerPackages, setFlyerPackages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // --- PINCODE CHECKER STATES ---
  const [pincodeList, setPincodeList] = useState([]);
  const [inputPincode, setInputPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null); // { status: 'success' | 'error', message: '', district: '' }

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

  const renderLabLogo = (item, height = '30px') => {
    const logoUrl = getColValue(item, 'Lab Logo') || getColValue(item, 'LabLogo');
    const labName = getColValue(item, 'Lab Name');
    
    if (logoUrl && logoUrl.trim().length > 5) {
      return (
        <img 
          src={logoUrl} 
          alt={labName} 
          style={{ height, maxWidth: '130px', objectFit: 'contain', display: 'block' }} 
        />
      );
    }
    return <span style={{ fontWeight: '800', color: '#0a3880', fontSize: '13px' }}>🏥 {labName}</span>;
  };

  useEffect(() => {
    // 1. Fetch Tests Data (Sheet 1)
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const validData = res.data.filter(item => getColValue(item, 'Test Name'));
          setAllData(validData);

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

    // 2. Fetch Pincode Data (Sheet 2 / Pincodes Tab)
    const pincodeSheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?gid=1836064115&single=true&output=csv"; 
    // Fallback logic for Gurugram if fetch fails
    fetch(pincodeSheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, { header: true, complete: (res) => {
          if (res.data && res.data.length > 0) {
            setPincodeList(res.data);
          }
        }});
      })
      .catch(() => {
        console.log("Using default Gurugram Pincode checker");
      });
  }, []);

  // PINCODE SERVICEABILITY CHECK FUNCTION
  const handleCheckPincode = (e) => {
    e.preventDefault();
    const cleanPin = inputPincode.trim();

    if (cleanPin.length !== 6 || isNaN(cleanPin)) {
      setPincodeResult({
        status: 'error',
        message: 'Kripya 6 digit ka valid pincode dalein.'
      });
      return;
    }

    // Gurugram / Gurgaon fallback check
    const gurugramPins = ['122001', '122002', '122003', '122004', '122006', '122008', '122009', '122010', '122011', '122015', '122016', '122017', '122018', '122050', '122051', '122052', '122101', '122102'];

    let matched = pincodeList.find(row => {
      const p = getColValue(row, 'Pin code') || getColValue(row, 'Pincode') || getColValue(row, 'PinCode');
      return p && p.trim() === cleanPin;
    });

    if (matched) {
      const statusVal = (getColValue(matched, 'Status') || '').toUpperCase();
      const district = getColValue(matched, 'District') || 'Gurugram';

      if (statusVal === 'ACTIVE' || statusVal === 'YES' || district.toLowerCase().includes('gurga') || district.toLowerCase().includes('gurug')) {
        setPincodeResult({
          status: 'success',
          district: district,
          message: `✅ Service Available in ${district} (${cleanPin})! Home Sample Collection Available.`
        });
      } else {
        setPincodeResult({
          status: 'error',
          message: `❌ Currently not active in ${district} (${cleanPin}). We are serving Gurugram region.`
        });
      }
    } else if (gurugramPins.includes(cleanPin)) {
      setPincodeResult({
        status: 'success',
        district: 'Gurugram',
        message: `✅ Service Available in Gurugram (${cleanPin})! Home Sample Collection Available.`
      });
    } else {
      setPincodeResult({
        status: 'error',
        message: `❌ Currently we are active only in Gurugram region. Stay tuned for ${cleanPin}!`
      });
    }
  };

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
    <div style={{ overflowX: 'hidden', backgroundColor: '#f4f7fa', fontFamily: 'Roboto, Arial, sans-serif' }}>
      
      <SEO 
        title="TestYaan | Compare & Book Diagnostic Labs in Delhi-NCR"
        description="Multi-Lab Healthcare Aggregator. Compare blood test prices across NABL Accredited Labs in Gurugram."
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

      {/* --- MULTI-LAB FILTER STRIP --- */}
      {dynamicLabs.length > 0 && (
        <div style={{ background: '#ffffff', padding: '10px 20px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#0a3880', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Filter By Lab:
            </span>
            {dynamicLabs.map((labObj) => {
              const isSelected = selectedLab === labObj.name;
              return (
                <button
                  key={labObj.name}
                  onClick={() => handleLabChange(labObj.name)}
                  style={{
                    background: isSelected ? '#eef4ff' : '#ffffff',
                    border: isSelected ? '2px solid #0a3880' : '1px solid #cbd5e1',
                    borderRadius: '25px',
                    padding: '6px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    minHeight: '38px',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 10px rgba(10,56,128,0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {labObj.logo && labObj.logo.trim().length > 5 ? (
                    <img src={labObj.logo} alt={labObj.name} style={{ height: '24px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontWeight: '800', color: '#0a3880', fontSize: '12px' }}>🏥 {labObj.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- DR LAL PATHLABS STYLE SPLIT-SCREEN HERO SECTION --- */}
      <section style={{ background: 'linear-gradient(180deg, #eef4ff 0%, #f4f7fa 100%)', padding: '25px 20px 35px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="hero-split-grid">
          
          {/* LEFT SIDE (65%): DYNAMIC BANNER CAROUSEL */}
          <div style={{ position: 'relative' }}>
            {flyerPackages.length > 0 ? (
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 8px 24px rgba(10,56,128,0.12)', 
                  cursor: 'pointer',
                  minHeight: '320px',
                  border: '1px solid #cbd5e1',
                  background: '#0a3880'
                }}
                onClick={() => openParams(flyerPackages[currentSlide])}
              >
                {getColValue(flyerPackages[currentSlide], 'FlyerImage') ? (
                  <img 
                    src={getColValue(flyerPackages[currentSlide], 'FlyerImage')} 
                    alt={getColValue(flyerPackages[currentSlide], 'Test Name')} 
                    style={{ width: '100%', height: '100%', minHeight: '320px', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ padding: '40px 30px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{ background: '#ffcc00', color: '#0a3880', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '900' }}>
                        POPULAR PACKAGE
                      </span>
                      <div style={{ background: 'white', padding: '4px 10px', borderRadius: '6px' }}>
                        {renderLabLogo(flyerPackages[currentSlide], '22px')}
                      </div>
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '10px 0', fontWeight: '900', lineHeight: '1.2' }}>
                      {getColValue(flyerPackages[currentSlide], 'Test Name')}
                    </h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '18px', marginTop: '15px' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffcc00' }}>₹{getPrice(flyerPackages[currentSlide])}</span>
                      <button style={{ background: '#e31837', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                        Book Now »
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* SLIDER DOTS */}
            {flyerPackages.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                {flyerPackages.map((_, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    style={{ 
                      width: currentSlide === idx ? '26px' : '8px', 
                      height: '6px', 
                      borderRadius: '4px', 
                      background: currentSlide === idx ? '#0a3880' : '#cbd5e1', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE (35%): BOOKING & SERVICEABILITY PINCODE WIDGET */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 24px rgba(10,56,128,0.1)', border: '2px solid #0a3880', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0a3880', fontWeight: '900', textTransform: 'uppercase' }}>
                  📍 CHECK SERVICEABILITY
                </h3>
                <span style={{ fontSize: '10px', background: '#ffcc00', color: '#0a3880', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>
                  GURUGram ACTIVE
                </span>
              </div>

              {/* PINCODE CHECKER WIDGET */}
              <form onSubmit={handleCheckPincode} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', border: '2px solid #0a3880', borderRadius: '8px', overflow: 'hidden' }}>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit Pincode (e.g. 122001)" 
                    maxLength={6}
                    value={inputPincode}
                    onChange={(e) => setInputPincode(e.target.value)}
                    style={{ flex: 1, border: 'none', padding: '10px 12px', outline: 'none', fontSize: '13px', fontWeight: '700' }}
                  />
                  <button type="submit" style={{ background: '#0a3880', color: '#ffcc00', border: 'none', padding: '0 16px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}>
                    CHECK
                  </button>
                </div>
              </form>

              {/* PINCODE RESULT NOTIFICATION */}
              {pincodeResult && (
                <div style={{ 
                  padding: '10px 12px', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  marginBottom: '14px',
                  lineHeight: '1.4',
                  background: pincodeResult.status === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: pincodeResult.status === 'success' ? '#047857' : '#b91c1c',
                  border: pincodeResult.status === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca'
                }}>
                  {pincodeResult.message}
                  {pincodeResult.status === 'error' && (
                    <div style={{ marginTop: '6px' }}>
                      <a href={`https://wa.me/91${phoneNumber}?text=Hi%20TestYaan,%20please%20notify%20me%20when%20service%20starts%20at%20pincode%20${inputPincode}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0a3880', textDecoration: 'underline', fontWeight: '800' }}>
                        Request service on WhatsApp »
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* SEARCH TEST BAR */}
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                  <input 
                    type="text" 
                    placeholder="Search CBC, Lipid, Diabetes, Labs..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ flex: 1, border: 'none', padding: '10px 12px', outline: 'none', fontSize: '12px', fontWeight: '600' }}
                  />
                  <span style={{ padding: '8px 12px', color: '#0a3880' }}>🔍</span>
                </div>

                {showSearchDropdown && searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999, maxHeight: '250px', overflowY: 'auto', border: '1px solid #cbd5e1' }}>
                    {searchResults.map((item, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => openBooking(item)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '800', color: '#0a3880', fontSize: '12px' }}>{getColValue(item, 'Test Name')}</div>
                            <div style={{ marginTop: '2px' }}>{renderLabLogo(item, '16px')}</div>
                          </div>
                          <div style={{ color: '#e31837', fontWeight: '900', fontSize: '13px' }}>₹{getPrice(item)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <a 
                  href={`https://wa.me/91${phoneNumber}?text=Hi%20TestYaan,%20I%20want%20to%20upload%20my%20prescription`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ background: '#25D366', color: 'white', textDecoration: 'none', padding: '10px 12px', borderRadius: '8px', fontWeight: '800', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>📄 Upload Prescription on WhatsApp</span>
                  <span>📲</span>
                </a>
              </div>
            </div>

            {/* ACTION TILES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <a href={`tel:${phoneNumber}`} style={{ textDecoration: 'none', background: '#f8fafc', padding: '8px 4px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '16px' }}>📞</div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#0a3880', marginTop: '2px' }}>Call & Book</div>
              </a>
              <a href={`https://wa.me/91${phoneNumber}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#f8fafc', padding: '8px 4px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '16px' }}>📋</div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#0a3880', marginTop: '2px' }}>Get Quote</div>
              </a>
              <div onClick={() => setShowCompareOverlay(true)} style={{ background: compareList.length > 0 ? '#ffcc00' : '#f8fafc', padding: '8px 4px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div style={{ fontSize: '16px' }}>⚖️</div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#0a3880', marginTop: '2px' }}>Compare ({compareList.length})</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- BROWSE BY ORGAN SECTION --- */}
      <section style={{ padding: '30px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#0a3880', fontWeight: '900', marginBottom: '4px' }}>
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
                    background: isActive ? '#0a3880' : '#f8fafc',
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

      {/* --- AGODA/AMAZON MARKETPLACE PACKAGES GRID --- */}
      <section style={{ padding: '35px 20px 60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* CATEGORY FILTER PILLS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  background: activeCategory === cat ? '#0a3880' : 'white',
                  color: activeCategory === cat ? '#ffcc00' : '#475569',
                  border: activeCategory === cat ? 'none' : '1px solid #cbd5e1',
                  padding: '7px 18px',
                  borderRadius: '20px',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat === 'All' ? 'All Health Packages' : cat}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', color: '#0a3880', fontWeight: '900', textAlign: 'center', marginBottom: '25px' }}>
            Top Diagnostic Packages Across Labs
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
                      {renderLabLogo(pkg, '30px')}
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
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#0a3880', color: 'white', padding: '12px 24px', borderRadius: '50px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 10px 25px rgba(10,56,128,0.4)', zIndex: 4000, border: '2px solid #ffcc00' }}>
          <span style={{fontWeight: '800'}}>{compareList.length} Tests Selected</span>
          <button onClick={() => setShowCompareOverlay(true)} style={{ background: '#e31837', color: 'white', border: 'none', padding: '6px 18px', borderRadius: '20px', fontWeight: '800', cursor: 'pointer' }}>Compare Now</button>
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
              <h2 style={{ fontSize: '1.3rem', color: '#0a3880', margin: 0, fontWeight: '800' }}>Package Details</h2>
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
        @media (min-width: 900px) {
          .hero-split-grid { grid-template-columns: 1.8fr 1fr !important; }
        }
        .test-grid-system { display: grid; gap: 16px; max-width: 1300px; margin: 0 auto; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 768px) { .test-grid-system { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .test-grid-system { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1440px) { .test-grid-system { grid-template-columns: repeat(5, 1fr); } }
        .test-card-advanced { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; transition: all 0.25s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .test-card-advanced:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(10,56,128,0.1); border-color: #0a3880; }
        .organ-card:hover { transform: translateY(-3px); border-color: #0a3880 !important; }
        .compare-checkbox { font-size: 11px; color: #64748b; display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600; }
        .card-title { font-size: 1rem; font-weight: 800; color: #0a3880; margin: 8px 0 6px; line-height: 1.3; height: 2.6em; overflow: hidden; }
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