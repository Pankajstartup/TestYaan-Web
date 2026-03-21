import React from 'react';

function Compare({ selectedTests }) {
  if (selectedTests.length === 0) return <p>No tests selected for comparison.</p>;

  return (
    <div style={{ padding: '50px 20px', overflowX: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Compare Lab Tests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #edf2f7' }}>
            <th style={{ padding: '20px', textAlign: 'left' }}>Features</th>
            {selectedTests.map(test => (
              <th key={test.id} style={{ padding: '20px', textAlign: 'center' }}>
                <img src={test.logoUrl} alt={test.lab} style={{ height: '40px', objectFit: 'contain' }} /><br/>
                {test.lab}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '15px', fontWeight: 'bold' }}>Test Name</td>
            {selectedTests.map(test => <td key={test.id} style={{ textAlign: 'center' }}>{test.name}</td>)}
          </tr>
          <tr>
            <td style={{ padding: '15px', fontWeight: 'bold' }}>Price</td>
            {selectedTests.map(test => <td key={test.id} style={{ textAlign: 'center', color: '#0056b3', fontWeight: 'bold' }}>₹{test.price}</td>)}
          </tr>
          <tr>
            <td style={{ padding: '15px', fontWeight: 'bold' }}>Reporting Time</td>
            {selectedTests.map(test => <td key={test.id} style={{ textAlign: 'center' }}>24 Hours</td>)}
          </tr>
          <tr>
            <td style={{ padding: '15px', fontWeight: 'bold' }}>Home Collection</td>
            {selectedTests.map(test => <td key={test.id} style={{ textAlign: 'center', color: 'green' }}>FREE</td>)}
          </tr>
          <tr>
            <td></td>
            {selectedTests.map(test => (
              <td key={test.id} style={{ textAlign: 'center', padding: '20px' }}>
                <button style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Book Now</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}