import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import LabCard from '../components/LabCard';

function LabPage() {
  const params = useParams();
  const currentLabId = params.labName || params.labId || "";
  const [labTests, setLabTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to safely extract price/rate from sheet
  const getPrice = (item) => {
    if (!item) return 'N/A';
    return item['RATE'] || item['price'] || item['rate'] || item['MRP'] || item['Mrp'] || 'N/A';
  };

  useEffect(() => {
    // Spreadsheet CSV Link
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vShYhNLxqm5dPsxN42c-unJ1ByWLnU3DmduiBdPkafMj_3NOH_AZohRJtZLLDvW76jfd_uL0VlvNlVx/pub?output=csv";

    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filtered = results.data.filter(test => {
              const labFieldValue = test['Lab Name'] || test.lab || "";
              if (!labFieldValue) return false;

              const sheetLab = labFieldValue.toLowerCase();
              const urlLab = currentLabId.toLowerCase();

              if (urlLab.includes('lal')) {
                return sheetLab.includes('lal');
              }
              if (urlLab.includes('metropolis')) {
                return sheetLab.includes('metropolis') || sheetLab.includes('metropolish');
              }
              if (urlLab.includes('dang')) {
                return sheetLab.includes('dang');
              }

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
        <div className="test-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center', marginTop: '30px' }}>
          {labTests.length > 0 ? (
            labTests.map((test, index) => (
              <LabCard 
                key={index} 
                name={test['Test Name'] || test.name} 
                price={getPrice(test)} 
                lab={test['Lab Name'] || test.lab} 
                logoUrl={test['Lab Logo'] || test.logoUrl}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p style={{ fontSize: '18px', color: '#777' }}>No tests found for this lab.</p>
              <p style={{ fontSize: '14px' }}>Please check if Lab Name in Sheet contains <b>{currentLabId}</b></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LabPage;