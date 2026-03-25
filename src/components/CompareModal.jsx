import React from 'react';

const CompareModal = ({ compareList, onClose, removeCompareItem }) => {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '20px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', maxWidth: '950px', width: '100%', position: 'relative', overflowY: 'auto', maxHeight: '85vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f5f9', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e3a8a', fontSize: '24px', fontWeight: '800' }}>Compare Lab Tests</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '15px', color: '#64748b' }}>Features</th>
                {compareList.map((test, index) => (
                  <th key={index} style={{ padding: '15px', textAlign: 'center', minWidth: '220px' }}>
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => removeCompareItem(test['Test Name'])} style={{ position: 'absolute', top: '-10px', right: '0', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', cursor: 'pointer', zIndex: 10 }}>✕</button>
                      <img src={`/lab-logos/${test['Lab Logo']}`} alt="lab" style={{ height: '30px', marginBottom: '10px' }} onError={(e) => e.target.src = '/lab-logos/default.png'} />
                      <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '14px' }}>{test['Lab Name']}</div>
                      <div style={{ fontSize: '16px', marginTop: '5px', fontWeight: '700' }}>{test['Test Name']}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>Price</td>
                {compareList.map((test, index) => (
                  <td key={index} style={{ textAlign: 'center', color: '#1e3a8a', fontSize: '22px', fontWeight: '900' }}>₹{test['MRP']}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>Fasting Required</td>
                {compareList.map((test, index) => (
                  <td key={index} style={{ textAlign: 'center' }}>
                    <span style={{ 
                      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: test['Fasting Status'] === 'Fasting' ? '#fee2e2' : '#dcfce7', 
                      color: test['Fasting Status'] === 'Fasting' ? '#ef4444' : '#16a34a' 
                    }}>
                      {test['Fasting Status']}
                    </span>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', fontWeight: 'bold', verticalAlign: 'top' }}>Parameters</td>
                {compareList.map((test, index) => (
                  <td key={index} style={{ padding: '15px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                      {test['Parameter'] ? test['Parameter'].split(',').map((p, i) => (
                        <span key={i} style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #bfdbfe' }}>{p.trim()}</span>
                      )) : <span style={{ color: '#94a3b8', fontSize: '12px' }}>Check details</span>}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td></td>
                {compareList.map((test, index) => (
                  <td key={index} style={{ padding: '25px 10px', textAlign: 'center' }}>
                    <button style={{ width: '90%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>Book This Test</button>
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