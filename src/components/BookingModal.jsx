import React, { useState, useEffect } from 'react';

function BookingModal({ isOpen, onClose, testName, price, labName }) {
  const [formData, setFormData] = useState({
    pName: '', pMobile: '', pAge: '', pDob: '', pAddress: '', 
    pState: '', pPincode: '', pDate: '', pTime: ''
  });

  // 1. DOB se Age calculate karna
  useEffect(() => {
    if (formData.pDob) {
      const birthDate = new Date(formData.pDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      setFormData(prev => ({ ...prev, pAge: age, pDob: formData.pDob }));
    }
  }, [formData.pDob]);

  // 2. Pincode se State (Simple Logic)
  const handlePincode = (e) => {
    const pin = e.target.value;
    setFormData(prev => ({ ...prev, pPincode: pin }));
    if (pin.length === 6) {
      // Yahan aap API bhi laga sakte hain, abhi demo ke liye:
      if (pin.startsWith('11')) setFormData(prev => ({ ...prev, pState: 'Delhi' }));
      else if (pin.startsWith('40')) setFormData(prev => ({ ...prev, pState: 'Maharashtra' }));
      else setFormData(prev => ({ ...prev, pState: 'Uttar Pradesh' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    // Mobile number validation (10 digits)
  if(formData.pMobile.length !== 10) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }
  // 1. Message taiyar karein
  const message = `*New Booking Confirmed!*%0A*Patient:* ${formData.pName}%0A*Test:* ${testName}%0A*Lab:* ${labName}`;
  
  // 2. WhatsApp Tab turant kholein (Browser ise block nahi karega)
  const whatsappURL = `https://wa.me/91${formData.pMobile}?text=${message}`;
  window.open(whatsappURL, '_blank');

  // Google Script URL jo deployment ke baad mila
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxMjx58TS0aOqNOoI1v48Ir4GIub2jp6lww-9A-YWYswBYxlftKPETxtnjl21-plnNS/exec';

  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors', // Google Script ke liye ye zaroori hai
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        testName,
        price,
        labName
      })
    });
    // 2. WhatsApp Message create karte hain
    const message = `*New Booking Confirmed!*%0A%0A` +
                `*Patient:* ${formData.pName}%0A` +
                `*Test:* ${testName}%0A` +
                `*Lab:* ${labName}%0A` +
                `*Date:* ${formData.pDate}%0A` +
                `*Address:* ${formData.pAddress}`;

    // Lab Owner ko WhatsApp bhejane ke liye (91 ke sath number likhein)
    const labWhatsAppURL = `https://wa.me/918130484197?text=${message}`; 
    window.open(labWhatsAppURL, '_blank');
    
    // Patient ko WhatsApp bhejane ke liye
const patientWhatsAppURL = `https://wa.me/91${formData.pMobile}?text=${message}`;
setTimeout(() => {
  window.open(patientWhatsAppURL, '_blank');
}, 1000); // 1 second ka delay taaki dono window khul sakein

    // handleSubmit ke andar fetch ke baad ye likhein:
const whatsappMsg = `Naya Order! %0A*Patient:* ${formData.pName} %0A*Test:* ${testName} %0A*Lab:* ${labName}`;
const labMobile = "91813048417"; // Yahan Lab ka number 91 ke sath likhein

// Ye line WhatsApp tab kholegi jab booking sheet mein save ho jayegi
window.open(`https://wa.me/${labMobile}?text=${whatsappMsg}`, '_blank');
    
    alert(`Booking Confirmed! Details have been sent to your mobile and email.`);
    onClose();
  } catch (error) {
    console.error('Error!', error.message);
    alert("Something went wrong. Please try again.");
  }
};
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-wrapper">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div className="modal-header">
          <h2>Book Your Test</h2>
          <p>{testName} | {labName} | ₹{price}/-</p>
        </div>

        <form id="bookingForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name *" required 
            onChange={e => setFormData({...formData, pName: e.target.value})} />

          <input type="number" placeholder="Mobile (10 Digits) *" required 
            onInput={e => e.target.value = e.target.value.slice(0, 10)}
            onChange={e => setFormData({...formData, pMobile: e.target.value})} />

          <div className="input-row">
            <input type="date" title="DOB" 
              onChange={e => setFormData({...formData, pDob: e.target.value})} />
            <input type="number" placeholder="Age" value={formData.pAge} 
              disabled={formData.pDob !== ''} 
              onChange={e => setFormData({...formData, pAge: e.target.value})} />
          </div>
          <div className="input-group">
            <input 
            type="email" 
            placeholder="Email ID (For Confirmation) *" 
            required 
            onChange={e => setFormData({...formData, pEmail: e.target.value})} 
            />
            </div>

          <textarea placeholder="Full Address *" required 
            onChange={e => setFormData({...formData, pAddress: e.target.value})} />

          <div className="input-row">
            <input type="number" placeholder="Pincode" onChange={handlePincode} />
            <input type="text" placeholder="State" value={formData.pState} readOnly />
          </div>

          <div className="input-row">
            <input type="date" min={new Date().toISOString().split("T")[0]} required 
              onChange={e => setFormData({...formData, pDate: e.target.value})} />
            <input type="time" required 
              onChange={e => setFormData({...formData, pTime: e.target.value})} />
          </div>

          <button type="submit" className="confirm-btn">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;