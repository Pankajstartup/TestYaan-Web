import React, { useState, useEffect } from 'react';

function BookingModal({ isOpen, onClose, testName, price, labName }) {
  const [formData, setFormData] = useState({
    pName: '', pMobile: '', pAge: '', pDob: '', pAddress: '', 
    pState: '', pPincode: '', pDate: '', pTime: '', pEmail: ''
  });

  // 1. Age Calculation
  useEffect(() => {
    if (formData.pDob) {
      const birthDate = new Date(formData.pDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, pAge: age }));
    }
  }, [formData.pDob]);

  // 2. All India Pincode API
  const handlePincode = async (e) => {
    const pin = e.target.value;
    setFormData(prev => ({ ...prev, pPincode: pin }));

    if (pin.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();
        if (data[0].Status === "Success") {
          setFormData(prev => ({ ...prev, pState: data[0].PostOffice[0].State }));
        } else {
          setFormData(prev => ({ ...prev, pState: 'Invalid Pincode' }));
        }
      } catch (error) {
        console.error("Error fetching pincode", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.pMobile.length !== 10) {
      alert("Please enter 10-digit mobile number.");
      return;
    }

    // 3. Generate Unique Booking ID
    const bookingId = `TY-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;

    const scriptURL = 'https://script.google.com/macros/s/AKfycby-ZaFmJSxFPl-5z6nRc1tkiik0B9W559c5oirnCa8j9KhHNWJX4A1lFlMVCesDlb1jfg/exec';

    // Important: Hum simple URLSearchParams use karenge taaki Google Script ko asani se data mile
    const finalData = {
      ...formData,
      bookingId,
      testName,
      price,
      labName
    };

    try {
      // Data sending to Google Sheets
      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script require no-cors for simple redirects
        headers: { 'Content-Type': 'application/plain' }, // Avoid complex pre-flight
        body: JSON.stringify(finalData)
      });

      // WhatsApp Message
      const msg = `*Booking Confirmed! ✅*%0A%0A*ID:* ${bookingId}%0A*Patient:* ${formData.pName}%0A*Test:* ${testName}%0A*Lab:* ${labName}%0A*Date:* ${formData.pDate}%0A*Address:* ${formData.pAddress}`;
      
      window.open(`https://wa.me/918130484197?text=${msg}`, '_blank');
      setTimeout(() => {
        window.open(`https://wa.me/91${formData.pMobile}?text=${msg}`, '_blank');
      }, 1000);
      
      alert(`Booking Confirmed! ID: ${bookingId}. Details sent.`);
      onClose();
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a' }}>Book Your Test</h2>
          <button onClick={onClose} style={closeBtnStyle}>&times;</button>
        </div>
        
        <div style={summaryStyle}>
          <p style={{ margin: '0 0 5px 0', fontWeight: '800' }}>{testName}</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{labName} | ₹{price}/-</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input type="text" placeholder="Full Name *" required style={inputStyle}
            onChange={e => setFormData({...formData, pName: e.target.value})} />

          <input type="number" placeholder="Mobile (10 Digits) *" required style={inputStyle}
            onInput={e => e.target.value = e.target.value.slice(0, 10)}
            onChange={e => setFormData({...formData, pMobile: e.target.value})} />

          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>DOB</label>
              <input type="date" style={inputStyle} onChange={e => setFormData({...formData, pDob: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Age</label>
              <input type="number" placeholder="Age" value={formData.pAge} style={{...inputStyle, backgroundColor: '#f8fafc'}}
                disabled={formData.pDob !== ''} onChange={e => setFormData({...formData, pAge: e.target.value})} />
            </div>
          </div>

          <input type="email" placeholder="Email ID *" required style={inputStyle}
            onChange={e => setFormData({...formData, pEmail: e.target.value})} />

          <textarea placeholder="Full Address *" required style={{...inputStyle, height: '80px', resize: 'none'}}
            onChange={e => setFormData({...formData, pAddress: e.target.value})} />

          <div style={rowStyle}>
            <input type="number" placeholder="Pincode" style={{...inputStyle, flex: 1}} onChange={handlePincode} />
            <input type="text" placeholder="State" value={formData.pState} readOnly style={{...inputStyle, flex: 1, backgroundColor: '#f1f5f9'}} />
          </div>

          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Appt. Date</label>
              <input type="date" min={new Date().toISOString().split("T")[0]} required style={inputStyle}
                onChange={e => setFormData({...formData, pDate: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Appt. Time</label>
              <input type="time" required style={inputStyle} onChange={e => setFormData({...formData, pTime: e.target.value})} />
            </div>
          </div>

          <button type="submit" style={submitBtnStyle}>Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}

// --- STYLES (Keep as per your requirement) ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '10px' };
const modalStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '24px', width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#94a3b8' };
const summaryStyle = { background: '#f1f5f9', padding: '12px 15px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #e2e8f0' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const inputStyle = { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginLeft: '5px', marginBottom: '2px', display: 'block' };
const rowStyle = { display: 'flex', gap: '10px' };
const submitBtnStyle = { background: '#1e3a8a', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer', marginTop: '10px', fontSize: '16px' };

export default BookingModal;