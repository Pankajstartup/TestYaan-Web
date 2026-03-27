import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function OrderPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const today = new Date().toISOString().split("T")[0];

  // States
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.target);
    // Apps Script ke variable names se match karta hua data
    const bookingData = {
      pName: fd.get('pName'),
      pMobile: fd.get('pMobile'),
      pEmail: fd.get('pEmail') || "N/A",
      pAddress: fd.get('pAddress'),
      pPincode: fd.get('pPincode') || "N/A",
      pState: fd.get('pState') || "Delhi-NCR",
      pDate: fd.get('pDate'),
      pTime: "Morning Slot", // Dummy time
      testName: params.get('test') || 'Health Test',
      labName: params.get('lab') || 'Partner Lab',
      price: params.get('price') || '0'
    };

    try {
      const scriptURL = "https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec";
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (result.result === "success") {
        setOrderId(result.orderId);
        setShowPopup(true);
      } else {
        alert("Booking failed, please try again.");
      }
    } catch (error) {
      console.error("Error!", error);
      alert("Network Error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-main-wrapper" style={wrapperStyle}>
      <div className="booking-card" style={cardStyle}>
        
        {/* Left Side: Form */}
        <div className="form-section" style={{ flex: 1.5, padding: '40px' }}>
          <h2 style={{ color: '#0056b3', marginBottom: '10px' }}>Patient Details</h2>
          <form onSubmit={handleSubmit} style={gridFormStyle}>
            <div className="input-box" style={span2}>
              <label style={labelStyle}>Full Name</label>
              <input name="pName" type="text" placeholder="Enter patient's name" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Mobile Number</label>
              <input name="pMobile" type="tel" placeholder="10-digit number" pattern="[0-9]{10}" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Email (For Report)</label>
              <input name="pEmail" type="email" placeholder="Optional" style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Collection Date</label>
              <input name="pDate" type="date" min={today} required style={inputStyle} />
            </div>

            <div className="input-box" style={span2}>
              <label style={labelStyle}>Full Address</label>
              <textarea name="pAddress" placeholder="House No, Landmark, Pincode" required style={{...inputStyle, height: '80px'}}></textarea>
            </div>

            <button type="submit" disabled={loading} style={{...btnStyle, opacity: loading ? 0.7 : 1}}>
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        </div>

        {/* Right Side: Summary */}
        <div className="summary-section" style={summarySidebarStyle}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Order Summary</h3>
          <div style={summaryItemStyle}><span>Test</span><strong>{params.get('test')}</strong></div>
          <div style={summaryItemStyle}><span>Lab</span><strong>{params.get('lab')}</strong></div>
          <hr style={{ border: '0.5px solid rgba(255,255,255,0.2)', margin: '20px 0' }} />
          <div style={{ ...summaryItemStyle, fontSize: '20px' }}><span>Total</span><strong>₹{params.get('price')}</strong></div>
        </div>
      </div>

      {/* SUCCESS POPUP MODAL */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <div style={{fontSize: '50px'}}>✅</div>
            <h2 style={{color: '#1e3a8a'}}>Booking Success!</h2>
            <p>Your Unique Order ID:</p>
            <div style={{fontSize: '24px', fontWeight: 'bold', background: '#f0f4f8', padding: '10px', borderRadius: '10px', margin: '15px 0', border: '2px dashed #0056b3'}}>{orderId}</div>
            <p style={{fontSize: '13px', color: '#666'}}>A confirmation email has been sent. Our team will call you soon.</p>
            <button onClick={() => window.location.href = "/"} style={whatsappBtnStyle}>Go to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 };
const popupStyle = { background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', maxWidth: '400px', width: '90%' };
const whatsappBtnStyle = { width: '100%', padding: '15px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' };

// Aapke purane styles niche waise hi rakhein...
const wrapperStyle = { background: '#f0f4f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const cardStyle = { background: '#fff', width: '100%', maxWidth: '1000px', display: 'flex', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' };
const summarySidebarStyle = { flex: 1, background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)', padding: '40px', color: '#fff' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' };
const labelStyle = { fontSize: '13px', fontWeight: 'bold', color: '#555' };
const span2 = { gridColumn: 'span 2' };
const btnStyle = { gridColumn: 'span 2', padding: '15px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };