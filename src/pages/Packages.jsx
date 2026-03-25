import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';

const Packages = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLab, setActiveLab] = useState("All");

  // Naye States: Popup aur Booking ke liye
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showParamModal, setShowParamModal] = useState(false);

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

  // Naye Functions
  const openParams = (pkg) => {
    setSelectedPkg(pkg);
    setShowParamModal(true);
  };

  const openBooking = (pkg) => {
    setSelectedPkg(pkg);
    setIsBookingOpen(true);
  };

  const labs = ["All", "Dr Lal Pathlabs", "Metropolis", "Redcliffe Labs"];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* --- HERO SECTION --- */}
      <section style={heroStyle}>
        <h1 style={heroTitleStyle}>Health Packages</h1>
        <p style={{ opacity: 0.9, marginBottom: '30px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
          Complete body checkups and wellness bundles for your family.
        </p>
        
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search health packages..." 
            style={searchBarStyle}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* --- LAB FILTERS --- */}
      <div style={filterContainerStyle}>
        {labs.map(lab => (
          <button 
            key={lab}
            onClick={() => setActiveLab(lab)}
            style={{
              ...(activeLab === lab ? activeFilterBtn : filterBtn),
              flexShrink: 0 
            }}
          >
            {lab}
          </button>
        ))}
      </div>

      {/* --- CARDS GRID --- */}
      <div style={gridStyle}>
        {filteredPackages.map((pkg, i) => (
          <div key={i} className="hover-card" style={cardStyle}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={pillStyle}>PACKAGE</span>
              <p style={{ fontSize: '11px', color: '#dc2626', fontWeight: '700' }}>🕒 {pkg['Fasting Status']}</p>
            </div>

            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: '800', marginBottom: '5px' }}>{pkg['Test Name']}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Lab: {pkg['Lab Name']}</p>
            
            <div style={{ flexGrow: 1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e3a8a' }}>₹{pkg['MRP']}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openParams(pkg)} style={viewBtnStyle}>Details</button>
                <button onClick={() => openBooking(pkg)} style={bookBtnStyle}>Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- POPUP WINDOW FOR PARAMETERS --- */}
      {showParamModal && selectedPkg && (
        <div style={modalOverlayStyle} onClick={() => setShowParamModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1e3a8a', margin: 0 }}>Package Details</h2>
              <button onClick={() => setShowParamModal(false)} style={closeIconStyle}>✕</button>
            </div>
            <p style={{ fontWeight: '800', marginBottom: '10px' }}>{selectedPkg['Test Name']}</p>
            <div style={paramBoxStyle}>
              <strong>Tests Included:</strong><br/>
              {selectedPkg['Parameter'] || "N/A"}
            </div>
            <button onClick={() => {setShowParamModal(false); openBooking(selectedPkg);}} style={{...bookBtnStyle, width: '100%', marginTop: '20px', padding: '15px'}}>Book This Package</button>
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

// --- STYLES (Aapka Original Format + Popup Styles) ---

const heroStyle = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
  padding: 'clamp(50px, 8vw, 80px) 20px',
  color: 'white',
  textAlign: 'center'
};

const heroTitleStyle = {
  fontSize: 'clamp(2rem, 6vw, 3rem)',
  fontWeight: '800',
  marginBottom: '10px'
};

const searchBarStyle = {
  width: '100%',
  padding: '16px 25px',
  borderRadius: '50px',
  border: 'none',
  fontSize: '16px',
  outline: 'none',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
};

const filterContainerStyle = {
  display: 'flex', 
  justifyContent: 'flex-start',
  gap: '12px', 
  padding: '30px 20px',
  overflowX: 'auto',
  maxWidth: '1200px',
  margin: '0 auto',
  WebkitOverflowScrolling: 'touch'
};

const filterBtn = {
  padding: '10px 22px',
  borderRadius: '50px',
  border: '1px solid #e2e8f0',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontWeight: '600',
  color: '#64748b',
  fontSize: '14px'
};

const activeFilterBtn = {
  ...filterBtn,
  backgroundColor: '#1e3a8a',
  color: 'white',
  border: 'none'
};

const gridStyle = {
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
  gap: '25px', 
  maxWidth: '1200px', 
  margin: '0 auto', 
  padding: '0 20px 60px'
};

const cardStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '28px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s'
};

const pillStyle = {
  backgroundColor: '#fef3c7',
  color: '#92400e',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '10px',
  fontWeight: '800'
};

const viewBtnStyle = {
  background: '#f1f5f9',
  color: '#1e3a8a',
  padding: '10px 18px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '13px'
};

const bookBtnStyle = {
  background: '#1e3a8a',
  color: 'white',
  padding: '10px 18px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '13px'
};

// --- POPUP MODAL STYLES ---
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 10001, padding: '20px'
};

const modalContentStyle = {
  backgroundColor: 'white', padding: '30px', borderRadius: '24px',
  maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  position: 'relative'
};

const closeIconStyle = {
  background: 'none', border: 'none', fontSize: '22px',
  cursor: 'pointer', color: '#64748b'
};

const paramBoxStyle = {
  backgroundColor: '#f8fafc', padding: '15px', borderRadius: '16px',
  fontSize: '14px', color: '#475569', maxHeight: '300px',
  overflowY: 'auto', lineHeight: '1.6', border: '1px solid #e2e8f0'
};

export default Packages;