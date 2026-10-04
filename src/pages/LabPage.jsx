import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';

function LabPage() {
  const params = useParams();
  const currentLabId = params.labName || params.labId || "";
  const [labTests, setLabTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to extract rate/price/mrp dynamically
  const getPrice = (item) => {
    if (!item) return 'N/A';
    for (let key in item) {
      const cleanKey = key.trim().toUpperCase();
      if (cleanKey === 'RATE' || cleanKey === 'PRICE' || cleanKey === 'MRP') {
        if (item[key] && item[key].trim() !== '') {
          return item[key].trim();
        }
      }
    }
    return 'N/A';
  };

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";

    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header => header.trim(), // Headers se extra spaces hatayega
          complete: (results) => {
            const filtered = results.data.filter(test => {
              const labFieldValue = test['Lab Name'] || test['lab'] || test['Lab'] || "";
              if (!labFieldValue) return false;

              const sheetLab = labFieldValue.toLowerCase();
              const urlLab = currentLabId.toLowerCase();

              if (urlLab.includes('lal')) return sheetLab.includes('lal');
              if (urlLab.includes('metropolis')) return sheetLab.includes('metropolis') || sheetLab.includes('metropolish');
              if (urlLab.includes('dang')) return sheetLab.includes('dang');

              return sheetLab.includes(urlLab);
            });
            
            setLabTests(filtered);
            setIsLoading(false);
          }
        });
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setIsLoading(false);
      });
  }, [currentLabId]);

  return (
    <div className="lab-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#E31E25', fontWeight: 'bold' }}>
        ← Back to Home
      </Link>
      
      <h2 style={{ marginTop: '30px', color: '#333', borderBottom: '2px solid #E31E25', paddingBottom: '10px' }}>
        Tests at {currentLabId.toUpperCase()}
      </h2>

      {isLoading ? (
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Searching database...</p>
      ) : (
        <div className="test-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '30px' }}>
          {labTests.length > 0 ? (
            labTests.map((test, index) => {
              const testName = test['Test Name'] || test['name'] || test['Test'];
              const labName = test['Lab Name'] || test['lab'] || currentLabId;
              const logoUrl = test['Lab Logo'] || test['logoUrl'];
              const price = getPrice(test);

              return (
                <div key={index} className="card" style={cardContainerStyle}>
                  {/* Logo Section */}
                  <div className="lab-logo-wrapper" style={logoWrapperStyle}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={labName} style={logoImageStyle} />
                    ) : (
                      <span style={textLogoStyle}>{labName}</span>
                    )}
                  </div>

                  <div style={{ padding: '10px 0' }}>
                    <h3 style={titleStyle}>{testName}</h3>
                    <p style={{ fontSize: '12px', color: '#888', margin: '5px 0' }}>By {labName}</p>
                    <div className="price-tag" style={priceStyle}>₹{price}</div>
                  </div>

                  <a 
                    href={`https://wa.me/918130484197?text=Hi,%20I%20want%20to%20book%20${encodeURIComponent(testName)}%20from%20${encodeURIComponent(labName)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <button style={buttonStyle}>
                      Book Now
                    </button>
                  </a>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '18px', color: '#777' }}>No tests found for this lab.</p>
              <p style={{ fontSize: '14px' }}>Please check if Lab Name in Sheet contains <b>{currentLabId}</b></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const cardContainerStyle = {
  background: '#fff',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid #edf2f7',
  transition: 'transform 0.3s ease'
};

const logoWrapperStyle = {
  width: '100%',
  height: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  padding: '10px',
  boxSizing: 'border-box',
  marginBottom: '15px',
  overflow: 'hidden'
};

const logoImageStyle = {
  maxHeight: '80%',
  maxWidth: '90%',
  objectFit: 'contain',
  display: 'block'
};

const textLogoStyle = { fontWeight: 'bold', color: '#0056b3', fontSize: '16px' };
const titleStyle = { fontSize: '16px', fontWeight: '700', color: '#1a365d', margin: '0', height: '40px', overflow: 'hidden' };
const priceStyle = { fontSize: '22px', fontWeight: '800', color: '#E31E25', margin: '10px 0' };

const buttonStyle = { 
  display: 'block', 
  width: '100%',
  background: '#E31E25', 
  color: '#fff', 
  border: 'none',
  padding: '12px', 
  borderRadius: '10px', 
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background 0.3s'
};

export default LabPage;