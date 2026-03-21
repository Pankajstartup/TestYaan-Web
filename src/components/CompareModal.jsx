import React from 'react';

const CompareModal = ({ compareList, onClose, removeCompareItem }) => {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '20px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', maxWidth: '900px', width: '100%', position: 'relative', overflowY: 'auto', maxHeight: '85vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f5f9', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e3a8a', fontSize: '24px' }}>Compare Lab Tests</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '15px', color: '#64748b' }}>Features</th>
                {compareList.map(test => (
                  <th key={test.id} style={{ padding: '15px', textAlign: 'center', minWidth: '200px' }}>
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => removeCompareItem(test.id)} style={{ position: 'absolute', top: '-10px', right: '0', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}>✕</button>
                      <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '14px' }}>{test.lab}</div>
                      <div style={{ fontSize: '16px', marginTop: '5px' }}>{test.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>Price</td>
                {compareList.map(test => (
                  <td key={test.id} style={{ textAlign: 'center', color: '#1e3a8a', fontSize: '20px', fontWeight: '900' }}>₹{test.price}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>Fasting</td>
                {compareList.map(test => (
                  <td key={test.id} style={{ textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: test["Fasting/Non Fasting"]?.toLowerCase().includes('required') ? '#fee2e2' : '#dcfce7', color: test["Fasting/Non Fasting"]?.toLowerCase().includes('required') ? '#ef4444' : '#16a34a' }}>
                      {test["Fasting/Non Fasting"] || 'Non-Fasting'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '15px', fontWeight: 'bold', verticalAlign: 'top' }}>Parameters</td>
                {compareList.map(test => (
                  <td key={test.id} style={{ padding: '15px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                      {test.Parameter ? test.Parameter.split(',').map((p, i) => (
                        <span key={i} style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #bfdbfe' }}>{p.trim()}</span>
                      )) : <span style={{ color: '#94a3b8', fontSize: '12px' }}>N/A</span>}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td></td>
                {compareList.map(test => (
                  <td key={test.id} style={{ padding: '20px 10px', textAlign: 'center' }}>
                    <button style={{ width: '100%', padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Book Now</button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;