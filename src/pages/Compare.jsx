import React from 'react';

function CompareModal({ compareList, onClose, removeCompareItem }) {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '25px', maxWidth: '1000px', width: '100%', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a365d' }}>Compare Lab Tests</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>Features</th>
              {compareList.map(test => (
                <th key={test.id} style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        {test.logoUrl && <img src={test.logoUrl} alt={test.lab} style={{ height: '35px', maxWidth: '90px', objectFit: 'contain', marginBottom: '10px' }} />}
                        <span style={{ display: 'block', fontSize: '11px', color: '#333', fontWeight: 'bold' }}>{test.lab}</span>
                        <button onClick={() => removeCompareItem(test.id)} style={{ position: 'absolute', top: '-10px', right: '-20px', border: 'none', background: '#ff4d4f', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer' }}>✕</button>
                    </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>Test Name</td>
              {compareList.map(test => <td key={test.id} style={{ textAlign: 'center' }}>{test.name}</td>)}
            </tr>
            <tr>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>Price</td>
              {compareList.map(test => <td key={test.id} style={{ textAlign: 'center', color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>₹{test.price}</td>)}
            </tr>
            <tr>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>Fasting Info</td>
              {compareList.map(test => (
                <td key={test.id} style={{ textAlign: 'center', fontSize: '13px' }}>
                    {test["Fasting/Non Fasting"] || "Non-Fasting"}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>Reporting Time</td>
              {compareList.map(test => <td key={test.id} style={{ textAlign: 'center', fontSize: '13px' }}>Usually 24 Hours</td>)}
            </tr>
            <tr style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '15px', fontWeight: 'bold', verticalAlign: 'top' }}>Included Parameters</td>
              {compareList.map(test => (
                <td key={test.id} style={{ textAlign: 'center', padding: '15px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                    {test.Parameter ? test.Parameter.split(',').map((p, i) => (
                        <span key={i} style={{ background: '#f1f5f9', color: '#1a365d', padding: '4px 8px', borderRadius: '15px', fontSize: '11px', border: '1px solid #e2e8f0' }}>
                        {p.trim()}
                        </span>
                    )) : <span style={{fontSize: '11px', color: '#999'}}>Check with lab</span>}
                    </div>
                </td>
              ))}
            </tr>
            <tr>
              <td></td>
              {compareList.map(test => (
                <td key={test.id} style={{ textAlign: 'center', padding: '25px 15px 15px 15px' }}>
                    <button style={{ width: '100%', padding: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Book Now
                    </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compare;