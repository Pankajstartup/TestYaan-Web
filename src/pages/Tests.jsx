import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import CompareModal from '../components/CompareModal';

export default function Tests() {
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, complete: (res) => { setAllTests(res.data); setFilteredTests(res.data); } });
    });
  }, []);

  const handleBooking = (test) => {
    navigate(`/order?test=${test.name}&lab=${test.lab}&price=${test.price}`);
  };

  const toggleCompare = (test) => {
    if (compareList.find(t => t.name === test.name)) {
      setCompareList(compareList.filter(t => t.name !== test.name));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, test]);
    } else {
      alert("Max 3 tests!");
    }
  };

  return (
    <div style={{ padding: '100px 20px', background: '#f8fafc' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>All Lab Tests</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '40px auto' }}>
        {filteredTests.map((test, i) => (
          <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {test.logoUrl ? <img src={test.logoUrl} style={{ height: '25px' }} /> : <span>{test.lab}</span>}
              <input type="checkbox" onChange={() => toggleCompare(test)} checked={compareList.some(t => t.name === test.name)} />
            </div>
            <h4>{test.name}</h4>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>₹{test.price}</div>
            <button onClick={() => handleBooking(test)} style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Book Now</button>
          </div>
        ))}
      </div>

      {compareList.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1e3a8a', color: 'white', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer', zIndex: 1000 }} onClick={() => setIsCompareOpen(true)}>
          Compare {compareList.length} Tests
        </div>
      )}

      {isCompareOpen && <CompareModal compareList={compareList} onClose={() => setIsCompareOpen(false)} removeCompareItem={(id) => setCompareList(compareList.filter(t => t.id !== id))} />}
    </div>
  );
}