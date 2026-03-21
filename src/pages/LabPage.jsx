import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import LabCard from '../components/LabCard';

function LabPage() {
  const params = useParams();
  const currentLabId = params.labName || params.labId || "";
  const [labTests, setLabTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Apka Spreadsheet CSV Link
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";

    fetch(sheetUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filtered = results.data.filter(test => {
              if (!test.lab) return false;

              const sheetLab = test.lab.toLowerCase(); // Sheet me jo likha hai
              const urlLab = currentLabId.toLowerCase(); // URL me jo hai (lalpath, metropolis, drdang)

              // 1. Lal PathLabs Logic
              if (urlLab.includes('lal')) {
                return sheetLab.includes('lal');
              }

              // 2. Metropolis Logic (Handle spelling 'metropolish')
              if (urlLab.includes('metropolis')) {
                return sheetLab.includes('metropolis') || sheetLab.includes('metropolish');
              }

              // 3. Dr. Dang Logic
              if (urlLab.includes('dang')) {
                return sheetLab.includes('dang');
              }

              // Default: Agar koi aur lab ho
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
      <Link to="/" style={{ textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>
        ← Back to Home
      </Link>
      
      <h2 style={{ marginTop: '30px', color: '#333', borderBottom: '2px solid #0056b3', paddingBottom: '10px' }}>
        Tests at {currentLabId.toUpperCase()}
      </h2>

      {isLoading ? (
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Searching database...</p>
      ) : (
        <div className="test-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center', marginTop: '30px' }}>
          {labTests.length > 0 ? (
            labTests.map(test => (
              <LabCard 
                key={test.id} 
                name={test.name} 
                price={test.price} 
                lab={test.lab} 
                logoUrl={test.logoUrl}
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