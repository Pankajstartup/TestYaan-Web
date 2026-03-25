import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filterLab, setFilterLab] = useState("All");

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (res) => {
          // Sirf wo data filter karein jo 'Package' category mein hai
          const onlyPackages = res.data.filter(item => item.type === 'Package');
          setPackages(onlyPackages);
        }
      });
    });
  }, []);

  const labs = ["All", ...new Set(packages.map(p => p.lab))];

  return (
    <div style={{ padding: '40px 60px' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>Health Packages</h2>
      
      {/* LAB FILTER */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '30px 0' }}>
        {labs.map(lab => (
          <button onClick={() => setFilterLab(lab)} style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', background: filterLab === lab ? '#1e3a8a' : 'white', color: filterLab === lab ? 'white' : '#333' }}>{lab}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {packages.filter(p => filterLab === "All" || p.lab === filterLab).map((pkg, i) => (
          <div key={i} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#1e3a8a' }}>{pkg.name}</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>Lab: {pkg.lab}</p>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '15px 0' }}>₹{pkg.price}</div>
            <button style={{ width: '100%', padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;