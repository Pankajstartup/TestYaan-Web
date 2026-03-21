import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; 
import LabCard from '../components/LabCard';
import emailjs from '@emailjs/browser';

const stylishInput = (isDisabled) => ({
  padding: '16px 20px',
  borderRadius: '14px',
  border: '2px solid #f1f5f9',
  outline: 'none',
  backgroundColor: isDisabled ? '#e2e8f0' : '#f8fafc',
  fontSize: '15px',
  color: '#1e293b',
  width: '100%',
  boxSizing: 'border-box',
  cursor: isDisabled ? 'not-allowed' : 'text'
});

function Tests() {
  const [allTests, setAllTests] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState("All"); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]); 
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [formData, setFormData] = useState({ 
    name: '', phone: '', email: '', gender: '', 
    age: '', dob: '', address: '', pincode: '', city: '', date: '', time: '', coupon: '' 
  });
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbxApGB2BZluOJ4nO9PXtMN2cRnibZE0dgcLQajFRQB1dkdpV1kdMild2-22tXEjEyipkdo8_dPcOx/pub?gid=0&single=true&output=csv";
    fetch(sheetUrl).then(res => res.text()).then(csv => {
      Papa.parse(csv, { header: true, skipEmptyLines: true, complete: (res) => { setAllTests(res.data); setIsLoading(false); } });
    });
  }, []);

  const handleAddTest = (test) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      setSelectedTests([...selectedTests, test]);
    }
    setIsBookingOpen(true);
  };

  const removeTest = (id) => {
    const newList = selectedTests.filter(t => t.id !== id);
    setSelectedTests(newList);
    if (newList.length === 0) setIsBookingOpen(false);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) setFormData({ ...formData, phone: val });
  };

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, pincode: pin });
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          setFormData(p => ({ ...p, city: `${data[0].PostOffice[0].District}, ${data[0].PostOffice[0].State}` }));
        }
      } catch (err) { console.error("Pincode error"); }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if(formData.phone.length !== 10) return alert("Mobile 10 digits ka hona chahiye.");

    const testNames = selectedTests.map(t => t.name).join(", ");
    const finalPrice = selectedTests.reduce((s, t) => s + Number(t.price || 0), 0) - discount;

    // --- EMAILJS ERROR PROTECTION ---
    try {
        // Email bhejne ki koshish (Sirf tabhi chalega jab IDs sahi hongi)
        if(formData.email) {
            await emailjs.send(
                'service_xxxxxx', // Apni Service ID yahan dalein
                'template_xxxxxx', // Apni Template ID yahan dalein
                { ...formData, test_names: testNames, total: finalPrice },
                'user_xxxxxx' // Apni Public Key yahan dalein
            );
            console.log("Email Success");
        }
    } catch (error) {
        console.warn("Email service not configured, skipping email...", error);
    }

    // --- WHATSAPP REDIRECT (Hamesha chalega) ---
    const message = `*NEW BOOKING*%0A*Tests:* ${testNames}%0A*Patient:* ${formData.name}%0A*Date:* ${formData.date}%0A*Time:* ${formData.time}%0A*Total:* ₹${finalPrice}`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${message}`, '_blank');
    
    setIsBookingOpen(false);
    setSelectedTests([]);
  };

  const filteredTests = allTests.filter(test => {
    const matchesSearch = test.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLab = selectedLab === "All" || test.lab === selectedLab;
    return matchesSearch && matchesLab;
  });

  const labOptions = [
    { name: "All", logo: "https://cdn-icons-png.flaticon.com/512/3022/3022216.png" },
    ...Array.from(new Set(allTests.map(t => t.lab))).filter(Boolean).map(labName => ({
        name: labName, logo: allTests.find(t => t.lab === labName)?.logoUrl
    }))
  ];

  return (
    <div style={{ padding: '120px 20px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1a365d', fontSize: '32px' }}>Find & Book Lab Tests</h1>
      </div>

      {/* Lab Logo Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {labOptions.map(lab => (
          <div key={lab.name} onClick={() => setSelectedLab(lab.name)} style={{
            cursor: 'pointer', padding: '12px', background: 'white', borderRadius: '18px',
            border: selectedLab === lab.name ? '3px solid #0056b3' : '3px solid white',
            textAlign: 'center', width: '110px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <img src={lab.logo} style={{ width: '100%', height: '45px', objectFit: 'contain' }} />
            <p style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '5px' }}>{lab.name}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 50px auto' }}>
        <input type="text" placeholder={`Search in ${selectedLab}...`} style={{...stylishInput(false), borderRadius: '40px'}} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Tests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '25px', maxWidth: '1400px', margin: '0 auto' }}>
        {filteredTests.map(test => (
          <LabCard key={test.id} {...test} onBookClick={() => handleAddTest(test)} />
        ))}
      </div>

      {/* Multi-Test Booking Drawer */}
      {isBookingOpen && (
        <>
          <div onClick={() => setIsBookingOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2500 }}></div>
          <div style={{ position: 'fixed', top: 0, right: 0, width: '450px', height: '100%', backgroundColor: 'white', zIndex: 3000, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '25px', background: '#1a365d', color: 'white' }}>
                <h3 style={{ margin: 0 }}>Review Order ({selectedTests.length} Tests)</h3>
            </div>

            <div style={{ padding: '15px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {selectedTests.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', borderRadius: '10px', marginBottom: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{t.name} <br/><span style={{ fontSize: '11px', color: '#64748b' }}>{t.lab}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>₹{t.price}</span>
                    <button onClick={() => removeTest(t.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setIsBookingOpen(false)} style={{ width: '100%', padding: '10px', background: 'none', border: '1.5px dashed #1a365d', borderRadius: '10px', color: '#1a365d', fontWeight: 'bold', cursor: 'pointer' }}>+ Add More Tests</button>
            </div>

            <form style={{ padding: '25px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleBookingSubmit}>
              <input type="text" placeholder="Patient Name" required style={stylishInput(false)} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="Mobile Number" value={formData.phone} required style={stylishInput(false)} onChange={handlePhoneChange} />
              <input type="email" placeholder="Email Address" required style={stylishInput(false)} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold' }}>AGE</label>
                  <input type="number" placeholder="Age" value={formData.age} disabled={formData.dob !== ''} style={stylishInput(formData.dob !== '')} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold' }}>OR SELECT DOB</label>
                  <input type="date" value={formData.dob} disabled={formData.age !== ''} style={stylishInput(formData.age !== '')} onChange={(e) => {
                      const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                      setFormData({...formData, dob: e.target.value, age: age.toString()});
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Pincode" required value={formData.pincode} style={stylishInput(false)} onChange={handlePincodeChange} />
                <input type="text" placeholder="City" value={formData.city} readOnly style={stylishInput(true)} />
              </div>

              <textarea placeholder="Address" required style={{...stylishInput(false), height: '60px', resize: 'none'}} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold' }}>DATE</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} required style={stylishInput(false)} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold' }}>TIME</label>
                  <input type="time" required style={stylishInput(false)} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>

              <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Coupon" style={stylishInput(false)} onChange={(e) => setFormData({...formData, coupon: e.target.value})} />
                  <button type="button" onClick={() => formData.coupon === 'SAVE100' ? setDiscount(100) : alert('Invalid')} style={{ padding: '0 15px', background: '#1a365d', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Apply</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: '900', color: '#1a365d' }}>
                  <span>Total:</span> <span>₹{selectedTests.reduce((s, t) => s + Number(t.price || 0), 0) - discount}</span>
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: '#22c55e', color: 'white', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Confirm Booking</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Tests;