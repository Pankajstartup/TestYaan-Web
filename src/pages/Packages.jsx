import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import BookingModal from '../components/BookingModal';

const colors = {
  primary: '#1e40af',
  secondary: '#3b82f6',
  accent: '#ffbf00',
  bg: '#ffffff'
};

const Packages = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [filterLab, setFilterLab] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [testToBook, setTestToBook] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          // Sirf wo data jo 'Package' category mein hai
          const onlyPackages = res.data.filter(item => item.type === 'Package');
          setAllPackages(onlyPackages);
          setIsLoading(false);
        }
      });
    });
  }, []);

  const handleBooking = (pkg) => {
    setTestToBook(pkg);
    setIsBookingOpen(true);
  };

  const labs = ["All", ...new Set(allPackages.map(p => p.lab))];

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. HERO SECTION (Sync with Home/Tests) */}
      <section style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        padding: '100px 60px 140px', color: 'white', position: 'relative', textAlign: 'center', overflow: 'hidden'
      }}>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '15px' }}>Health Packages</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Complete body checkups and wellness bundles for your family.</p>

        {/* 🌊 Curve Divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '80px' }}>
            <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. LAB FILTERS */}
      <div style={{ padding: '40px 20px 20px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {labs.map(lab => (
          <button key={lab} onClick={() => setFilterLab(lab)} style={{ 
            padding: '10px 25px', borderRadius: '25px', border: '1px solid #e2e8f0', cursor: 'pointer',
            background: filterLab === lab ? colors.primary : 'white', color: filterLab === lab ? 'white' : '#4b5563',
            fontWeight: '600', transition: '0.3s'
          }}>
            {lab}
          </button>
        ))}
      </div>

      {/* 3. PACKAGES GRID */}
      <section style={{ padding: '20px 60px 100px' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading packages...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', maxWidth: '1300px', margin: '0 auto' }}>
            {allPackages.filter(p => filterLab === "All" || p.lab === filterLab).map((pkg, i) => (
              <div key={i} style={{ 
                background: 'white', padding: '35px', borderRadius: '28px', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid #f0f4f8', position: 'relative' 
              }}>
                <div style={{ backgroundColor: '#fffbe6', color: '#b27a00', padding: '5px 15px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
                  {pkg.lab}
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '10px' }}>{pkg.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>⏱ {pkg.Fasting || "12 Hrs Fasting Required"}</p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '30px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: colors.primary }}>₹{pkg.price}</span>
                  <span style={{ fontSize: '15px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{parseInt(pkg.price) + 1500}</span>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={() => setSelectedDetails(pkg)}
                    style={{ flex: 1, padding: '14px', border: `1px solid ${colors.primary}`, background: 'none', color: colors.primary, borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    View Parameters
                  </button>
                  <button 
                    onClick={() => handleBooking(pkg)}
                    style={{ flex: 1, padding: '14px', background: colors.primary, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- PARAMETERS POPUP --- */}
      {selectedDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '30px', maxWidth: '550px', width: '90%', position: 'relative' }}>
            <button onClick={() => setSelectedDetails(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: colors.primary }}>{selectedDetails.name}</h2>
            <p style={{ color: '#666', marginBottom: '25px' }}>Lab: {selectedDetails.lab}</p>
            
            <h4 style={{ marginBottom: '15px' }}>What's Included?</h4>
            <div style={{ maxHeight: '250px', overflowY: 'auto', background: '#f8fafc', padding: '20px', borderRadius: '20px' }}>
               {selectedDetails.Parameters ? selectedDetails.Parameters.split(',').map((p, i) => (
                 <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <span style={{ color: '#22c55e' }}>✔</span> {p.trim()}
                 </div>
               )) : "Complete health checkup parameters."}
            </div>

            <button 
              onClick={() => { handleBooking(selectedDetails); setSelectedDetails(null); }}
              style={{ width: '100%', marginTop: '30px', padding: '16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Book Package Now
            </button>
          </div>
        </div>
      )}

      {isBookingOpen && testToBook && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} testName={testToBook.name} price={testToBook.price} labName={testToBook.lab} />
      )}
    </div>
  );
};

export default Packages;