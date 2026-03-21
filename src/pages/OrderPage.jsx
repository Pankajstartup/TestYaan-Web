import React from 'react';
import { useLocation } from 'react-router-dom';

export default function OrderPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    // WhatsApp Message Logic
    const message = `*New Booking Request*%0A` +
      `Test: ${params.get('test')}%0A` +
      `Lab: ${params.get('lab')}%0A` +
      `Price: ₹${params.get('price')}%0A%0A` +
      `*Patient Details*%0A` +
      `Name: ${data.fullName}%0A` +
      `Mobile: ${data.mobile}%0A` +
      `Address: ${data.address}`;

    window.open(`https://wa.me/919999999999?text=${message}`, '_blank'); // Apna number yahan dalein
  };

  return (
    <div className="order-main-wrapper" style={wrapperStyle}>
      <div className="booking-card" style={cardStyle}>
        <div className="form-section" style={{ flex: 1.5, padding: '40px' }}>
          <h2 style={{ color: '#0056b3' }}>Patient Details</h2>
          <form onSubmit={handleSubmit} style={gridFormStyle}>
            <div style={span2}>
              <label style={labelStyle}>Full Name</label>
              <input name="fullName" type="text" placeholder="Enter patient's full name" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input name="mobile" type="tel" placeholder="10-digit number" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Collection Date</label>
              <input name="collectionDate" type="date" min={today} required style={inputStyle} />
            </div>
            <div style={span2}>
              <label style={labelStyle}>Full Address</label>
              <textarea name="address" placeholder="House No, Landmark, Pincode" required style={{...inputStyle, height: '80px'}}></textarea>
            </div>
            <button type="submit" style={btnStyle}>Confirm via WhatsApp</button>
          </form>
        </div>

        <div className="summary-section" style={summarySidebarStyle}>
          <h3>Order Summary</h3>
          <div style={summaryItemStyle}><span>Test</span><strong>{params.get('test')}</strong></div>
          <div style={summaryItemStyle}><span>Lab</span><strong>{params.get('lab')}</strong></div>
          <div style={{...summaryItemStyle, fontSize: '20px', marginTop: '20px'}}><span>Total</span><strong>₹{params.get('price')}</strong></div>
        </div>
      </div>
    </div>
  );
}

// Styles (Same as you provided)
const wrapperStyle = { background: '#f0f4f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const cardStyle = { background: '#fff', width: '100%', maxWidth: '1000px', display: 'flex', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' };
const summarySidebarStyle = { flex: 1, background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)', padding: '40px', color: '#fff' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px', boxSizing: 'border-box' };
const labelStyle = { fontSize: '13px', fontWeight: 'bold', color: '#555' };
const span2 = { gridColumn: 'span 2' };
const btnStyle = { gridColumn: 'span 2', padding: '15px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };