import React from 'react';
import { useLocation } from 'react-router-dom';

export default function OrderPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🎉 Booking Request Sent Successfully!");
  };

  return (
    <div className="order-main-wrapper" style={wrapperStyle}>
      <div className="booking-card" style={cardStyle}>
        
        {/* Left Side: Form */}
        <div className="form-section" style={{ flex: 1.5, padding: '40px' }}>
          <h2 style={{ color: '#0056b3', marginBottom: '10px' }}>Patient Details</h2>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Please fill in the details for home sample collection.</p>
          
          <form onSubmit={handleSubmit} style={gridFormStyle}>
            <div className="input-box" style={span2}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Enter patient's full name" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Gender</label>
              <select required style={inputStyle}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="input-box">
              <label style={labelStyle}>Mobile Number</label>
              <input type="tel" placeholder="10-digit number" pattern="[0-9]{10}" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Date of Birth</label>
              <input type="date" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Collection Date</label>
              <input type="date" min={today} required style={inputStyle} />
            </div>

            <div className="input-box" style={span2}>
              <label style={labelStyle}>Full Address</label>
              <textarea placeholder="House No, Landmark, Pincode" required style={{...inputStyle, height: '80px'}}></textarea>
            </div>

            <button type="submit" className="confirm-btn" style={btnStyle}>
              Confirm Booking
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="summary-section" style={summarySidebarStyle}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Order Summary</h3>
          <div style={summaryItemStyle}>
            <span>Test Name</span>
            <strong>{params.get('test') || 'Health Test'}</strong>
          </div>
          <div style={summaryItemStyle}>
            <span>Lab Partner</span>
            <strong>{params.get('lab') || 'Partner Lab'}</strong>
          </div>
          <hr style={{ border: '0.5px solid rgba(255,255,255,0.2)', margin: '20px 0' }} />
          <div style={{ ...summaryItemStyle, fontSize: '20px' }}>
            <span>Total Pay</span>
            <strong>₹{params.get('price') || '0'}</strong>
          </div>
          <div style={badgeStyle}>✓ Home Collection Included</div>
        </div>

      </div>
    </div>
  );
}

// --- STYLES ---
const wrapperStyle = {
  background: '#f0f4f8',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const cardStyle = {
  background: '#fff',
  width: '100%',
  maxWidth: '1000px',
  display: 'flex',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
};

const summarySidebarStyle = {
  flex: 1,
  background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
  padding: '40px',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column'
};

const gridFormStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '15px',
  marginTop: '5px',
  boxSizing: 'border-box'
};

const labelStyle = { fontSize: '13px', fontWeight: 'bold', color: '#555' };
const span2 = { gridColumn: 'span 2' };

const btnStyle = {
  gridColumn: 'span 2',
  padding: '15px',
  background: '#FF8C00',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
  transition: '0.3s'
};

const summaryItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '15px',
  fontSize: '15px'
};

const badgeStyle = {
  marginTop: 'auto',
  background: 'rgba(255,255,255,0.2)',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: '13px'
};