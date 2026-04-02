import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';
import CompareModal from '../components/CompareModal';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';

const Packages = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLab, setActiveLab] = useState("All");

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showParamModal, setShowParamModal] = useState(false);

  const [compareList, setCompareList] = useState([]);
  const [showCompareOverlay, setShowCompareOverlay] = useState(false);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => {
          const pkgs = res.data.filter(item => item.Type?.trim() === 'Package');
          setAllPackages(pkgs);
          setFilteredPackages(pkgs);
      }});
    });
  }, []);

  useEffect(() => {
    let result = allPackages;
    if (activeLab !== "All") {
      result = result.filter(pkg => pkg['Lab Name'] === activeLab);
    }
    if (searchTerm) {
      result = result.filter(pkg => pkg['Test Name'].toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredPackages(result);
  }, [searchTerm, activeLab, allPackages]);

  const openParams = (pkg) => {
    setSelectedPkg(pkg);
    setShowParamModal(true);
  };

  const openBooking = (pkg) => {
    setSelectedPkg(pkg);
    setIsBookingOpen(true);
  };

  const handleCompareClick = (test, isChecked) => {
    if (isChecked) {
      if (compareList.length >= 3) return alert("Maximum 3 packages compare kar sakte hain!");
      setCompareList([...compareList, test]);
    } else {
      setCompareList(compareList.filter(t => t['Test Name'] !== test['Test Name']));
    }
  };

  const removeCompareItem = (name) => {
    setCompareList(compareList.filter(t => t['Test Name'] !== name));
  };

  const labs = ["All", "Thyrocare", "Dr Lal Pathlabs", "Metropolis", "Redcliffe Labs"];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* RANK 1 SEO ENGINES */}
      <SEO 
        title="Full Body Checkup Packages Delhi NCR - Save 70%" 
        description="Book affordable health checkup packages in Delhi, Tuglakabad & NCR. Compare Thyrocare, Dr Lal Pathlabs and more. Free home sample collection included."
        path="/packages"
        testsData={allPackages}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": allPackages.slice(0, 15).map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": p['Test Name'],
              "url": `https://testyaan.online/packages`,
              "description": `Health package by ${p['Lab Name']} at ₹${p['MRP']}`
            }))
          })}
        </script>
      </Helmet>

      {/* Invisible SEO Content for Google */}
      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
        Best Health Checkup Packages in Delhi, Full Body Test Tuglakabad, Cheap Diagnostic Packages NCR
      </h1>

      {/* 1. HERO SECTION */}
      <section className="universal-hero">
        <div style={{ maxWidth: '1200px', margin: '5 auto', position: 'relative', zIndex: 2 }}>
          <div className="city-badge">🛡️ Complete Health Protection in Delhi-NCR</div>
          <h2 className="hero-title">Family Health <br/>Checkup Packages</h2>
          
          <div className="hero-search-wrapper">
            <input 
              type="text" 
              placeholder="Search health packages (e.g. Wellness)..." 
              style={{ color: '#333' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <button className="hero-search-button">FIND</button>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
      </section>

      {/* 2. LAB FILTERS */}
      <div style={{ display: 'flex', gap: '12px', padding: '30px 20px', overflowX: 'auto', maxWidth: '1200px', margin: '0 auto' }}>
        {labs.map(lab => (
          <button 
            key={lab}
            onClick={() => setActiveLab(lab)}
            style={{
              padding: '10px 22px', borderRadius: '50px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', flexShrink: 0, transition: '0.3s',
              border: '1px solid #e2e8f0',
              backgroundColor: activeLab === lab ? '#1e3a8a' : 'white',
              color: activeLab === lab ? 'white' : '#64748b'
            }}
          >
            {lab}
          </button>
        ))}
      </div>

      {/* 3. CARDS GRID */}
      <div className="universal-grid">
        {filteredPackages.map((pkg, i) => (
          <div key={i} className="modern-card hover-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>PACKAGE</span>
              
              <label style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={compareList.some(t => t['Test Name'] === pkg['Test Name'])} 
                  onChange={(e) => handleCompareClick(pkg, e.target.checked)} 
                /> Compare
              </label>
            </div>

            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: '800', marginBottom: '5px' }}>{pkg['Test Name']}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Lab: {pkg['Lab Name']}</p>
            <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', marginBottom: '15px' }}>🕒 {pkg['Fasting Status']}</p>
            
            <div style={{ flexGrow: 1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: '900', color: '#1e3a8a' }}>₹{pkg['MRP']}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openParams(pkg)} className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Details</button>
                <button onClick={() => openBooking(pkg)} className="confirm-btn" style={{ padding: '8px 12px', fontSize: '12px', width: 'auto' }}>Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bar and Modals code remains exactly same... */}
      {compareList.length > 0 && !showCompareOverlay && (
        <div style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', background: '#1e3a8a', color: 'white', padding: '15px 30px', borderRadius: '50px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', zIndex: 4000 }}>
          <span style={{fontWeight: '700'}}>{compareList.length} Packages Selected</span>
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
          <div className="modal-content-wrapper" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1e3a8a', margin: 0 }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <p style={{ fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>{selectedPkg['Test Name']}</p>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', fontSize: '14px', color: '#475569', maxHeight: '300px', overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
              <strong>Tests Included:</strong><br/>
              {selectedPkg['Parameter'] || "Details updated soon."}
            </div>
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} className="confirm-btn" style={{ marginTop: '20px' }}>Book This Package</button>
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

export default Packages;