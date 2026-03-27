import React, { useState, useEffect } from 'react';

function BookingModal({ isOpen, onClose, testName, price, labName }) {
  const [formData, setFormData] = useState({
    pName: '', pMobile: '', pAge: '', pDob: '', pAddress: '', 
    pState: '', pPincode: '', pDate: '', pTime: '', pEmail: '',
    pPrefix: '', 
    pGender: ''  
  });

  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplied, setIsApplied] = useState(false);

  // Auto-Gender Logic based on Prefix
  const handlePrefixChange = (e) => {
    const prefix = e.target.value;
    let gender = '';
    if (prefix === 'Mr.' || prefix === 'Master') gender = 'Male';
    else if (prefix === 'Mrs.' || prefix === 'Miss' || prefix === 'Baby') gender = 'Female';
    
    setFormData({ ...formData, pPrefix: prefix, pGender: gender });
  };

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

  const applyCoupon = () => {
    if (couponInput.toUpperCase() === 'TEST10') {
      const discount = Math.round(price * 0.10);
      setDiscountAmount(discount);
      setIsApplied(true);
      alert("Success! TEST10 applied.");
    } else {
      setDiscountAmount(0);
      setIsApplied(false);
      alert("Invalid Coupon Code");
    }
  };

  const finalPrice = price - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.pMobile.length !== 10) {
      alert("Please enter 10-digit mobile number.");
      return;
    }

    const bookingId = `TY-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
    
    // Yahan apni wahi SCRIPT_URL rakhein jo aapne pehle banayi thi
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec';

    // --- SABSE ZAROORI: Payload with Action ---
    const finalData = {
      action: "new_booking", // <--- Yeh signal dena zaroori hai
      bookingId: bookingId,
      pName: `${formData.pPrefix} ${formData.pName}`,
      pMobile: formData.pMobile,
      pEmail: formData.pEmail,
      pAge: formData.pAge,
      pGender: formData.pGender || "Not Specified",
      pAddress: formData.pAddress,
      pState: formData.pState,
      pPincode: formData.pPincode,
      pDate: formData.pDate,
      pTime: formData.pTime,
      testName: testName,
      labName: labName,
      price: finalPrice,
      couponUsed: isApplied ? 'TEST10' : 'None'
    };

    try {
      // POST Request to Google Sheets
      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      // WhatsApp Message Logic
      const msg = `*Booking Confirmed! ✅*%0A%0A*ID:* ${bookingId}%0A*Patient:* ${formData.pPrefix} ${formData.pName}%0A*Gender:* ${formData.pGender}%0A*Test:* ${testName}%0A*Lab:* ${labName}%0A*Final Price:* ₹${finalPrice}%0A*Address:* ${formData.pAddress}`;
      
      window.open(`https://wa.me/918130484197?text=${msg}`, '_blank');
      setTimeout(() => {
        window.open(`https://wa.me/91${formData.pMobile}?text=${msg}`, '_blank');
      }, 1000);
      
      alert(`Booking Confirmed! ID: ${bookingId}`);
      onClose();
    } catch (error) {
      alert("Error saving booking. Please try again.");
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{labName}</span>
            <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>
              {isApplied ? (
                <span><del style={{ color: '#94a3b8', marginRight: '5px' }}>₹{price}</del> ₹{finalPrice}</span>
              ) : `₹${price}/-`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Enter Coupon (TEST10)" 
            style={{ ...inputStyle, marginBottom: 0, flex: 1, border: isApplied ? '1px solid #22c55e' : '1px solid #cbd5e1' }}
            onChange={(e) => setCouponInput(e.target.value)}
          />
          <button 
            type="button" 
            onClick={applyCoupon}
            style={{ padding: '0 15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Apply
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={rowStyle}>
            <select required style={{ ...inputStyle, width: '90px' }} onChange={handlePrefixChange}>
              <option value="">Prefix</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Miss">Miss</option>
              <option value="Master">Master</option>
              <option value="Baby">Baby</option>
            </select>
            <input type="text" placeholder="Full Name *" required style={{ ...inputStyle, flex: 1 }}
              onChange={e => setFormData({...formData, pName: e.target.value})} />
          </div>

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

          <textarea placeholder="Full Address *" required style={{...inputStyle, height: '70px', resize: 'none'}}
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

          <button type="submit" style={submitBtnStyle}>
            Confirm Booking {isApplied ? `at ₹${finalPrice}` : ''}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- STYLES (Keep as original) ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '10px' };
const modalStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '24px', width: '100%', maxWidth: '450px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#94a3b8' };
const summaryStyle = { background: '#f1f5f9', padding: '12px 15px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #e2e8f0' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle = { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: '5px' };
const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginLeft: '5px', marginBottom: '2px', display: 'block' };
const rowStyle = { display: 'flex', gap: '10px' };
const submitBtnStyle = { background: '#1e3a8a', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer', marginTop: '10px', fontSize: '16px' };

export default BookingModal;