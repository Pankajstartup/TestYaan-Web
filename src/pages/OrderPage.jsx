import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * =============================================================================
 * PROJECT: TESTYAAN DIAGNOSTICS - SECURE ORDERING SYSTEM
 * COMPONENT: ORDER PAGE v11.0 (WITH COUPON VALIDATION)
 * FEATURES: Real-time Discount Calc, Apps Script Sync, Dynamic Summary
 * =============================================================================
 */

export default function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const today = new Date().toISOString().split("T")[0];

  // ---------------------------------------------------------
  // 1. COMPONENT STATES
  // ---------------------------------------------------------
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState(""); // 'valid', 'invalid', 'checking'
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(Number(params.get('price')) || 0);

  // ---------------------------------------------------------
  // 2. COUPON VALIDATION ENGINE (Syncs with Apps Script doGet)
  // ---------------------------------------------------------
  const applyCoupon = async () => {
    if (!couponCode) return;
    
    setCouponStatus("checking");
    const scriptURL = "https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec";
    
    try {
      // Calling the GET handler we created in the Apps Script
      const response = await fetch(`${scriptURL}?coupon=${couponCode.trim()}`);
      const data = await response.json();
      
      if (data.status === "valid") {
        const originalPrice = Number(params.get('price'));
        const discount = Math.round((originalPrice * 15) / 100);
        
        setDiscountAmount(discount);
        setFinalPrice(originalPrice - discount);
        setCouponStatus("valid");
      } else {
        setCouponStatus("invalid");
        setDiscountAmount(0);
        setFinalPrice(Number(params.get('price')));
      }
    } catch (error) {
      console.error("Coupon Error:", error);
      setCouponStatus("error");
    }
  };

  // ---------------------------------------------------------
  // 3. FINAL SUBMISSION HANDLER
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.target);
    const bookingData = {
      pName: fd.get('pName'),
      pMobile: fd.get('pMobile'),
      pEmail: fd.get('pEmail') || "N/A",
      pAddress: fd.get('pAddress'),
      pPincode: fd.get('pPincode') || "N/A",
      pState: fd.get('pState') || "Delhi-NCR",
      pDate: fd.get('pDate'),
      pTime: "Morning Slot",
      testName: params.get('test') || 'Health Test',
      labName: params.get('lab') || 'Partner Lab',
      originalPrice: params.get('price') || '0',
      discountApplied: discountAmount,
      finalPaidAmount: finalPrice,
      appliedCoupon: couponStatus === "valid" ? couponCode : "NONE"
    };

    try {
      const scriptURL = "https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec";
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Added to handle browser security
        body: JSON.stringify(bookingData),
      });

      // No-cors doesn't return JSON, so we simulate success or use a timeout
      setOrderId("TY-" + Math.floor(Math.random() * 900000 + 100000));
      setShowPopup(true);
      
    } catch (error) {
      console.error("Error!", error);
      alert("System Busy. Please check internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 4. UI RENDERING
  // ---------------------------------------------------------
  return (
    <div className="order-main-wrapper" style={wrapperStyle}>
      <div className="booking-card" style={cardStyle}>
        
        {/* Left Side: Form Section */}
        <div className="form-section" style={{ flex: 1.5, padding: '40px' }}>
          <h2 style={{ color: '#1e3a8a', marginBottom: '25px', fontWeight: '800' }}>Patient Information</h2>
          <form onSubmit={handleSubmit} style={gridFormStyle}>
            <div className="input-box" style={span2}>
              <label style={labelStyle}>Full Name</label>
              <input name="pName" type="text" placeholder="e.g. Rahul Sharma" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Mobile Number</label>
              <input name="pMobile" type="tel" placeholder="10-digit number" pattern="[0-9]{10}" required style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Email (Optional)</label>
              <input name="pEmail" type="email" placeholder="For digital reports" style={inputStyle} />
            </div>

            <div className="input-box">
              <label style={labelStyle}>Preferred Date</label>
              <input name="pDate" type="date" min={today} required style={inputStyle} />
            </div>

            {/* NEW: Coupon Input Field */}
            <div className="input-box">
              <label style={labelStyle}>Discount Coupon</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Code" 
                  style={{ ...inputStyle, marginTop: '5px' }} 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={applyCoupon}
                  style={applyBtnStyle}
                >
                  Apply
                </button>
              </div>
              {couponStatus === "valid" && <small style={{color: 'green', fontWeight: 'bold'}}>✓ 15% Discount Applied!</small>}
              {couponStatus === "invalid" && <small style={{color: 'red'}}>× Invalid Coupon Code</small>}
            </div>

            <div className="input-box" style={span2}>
              <label style={labelStyle}>Home Collection Address</label>
              <textarea name="pAddress" placeholder="Flat No, Street, Landmark, Pincode" required style={{...inputStyle, height: '80px'}}></textarea>
            </div>

            <button type="submit" disabled={loading} style={{...btnStyle, opacity: loading ? 0.7 : 1}}>
              {loading ? "Registering Order..." : `Confirm Booking - ₹${finalPrice}`}
            </button>
          </form>
        </div>

        {/* Right Side: Detailed Summary */}
        <div className="summary-section" style={summarySidebarStyle}>
          <div style={{ position: 'sticky', top: '20px' }}>
            <h3 style={{ color: '#fff', marginBottom: '30px', fontSize: '24px', borderBottom: '2px solid #ffbf00', paddingBottom: '10px' }}>Order Details</h3>
            
            <div style={summaryItemStyle}><span>Selected Test:</span><strong>{params.get('test')}</strong></div>
            <div style={summaryItemStyle}><span>Assigned Lab:</span><strong>{params.get('lab')}</strong></div>
            
            <div style={{ margin: '30px 0', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
              <div style={summaryItemStyle}><span>Original Price:</span><span>₹{params.get('price')}</span></div>
              {discountAmount > 0 && (
                <div style={{ ...summaryItemStyle, color: '#4ade80' }}>
                  <span>Discount (15%):</span><span>- ₹{discountAmount}</span>
                </div>
              )}
              <hr style={{ border: '0.5px solid rgba(255,255,255,0.2)', margin: '15px 0' }} />
              <div style={{ ...summaryItemStyle, fontSize: '22px', color: '#ffbf00' }}>
                <span>Grand Total:</span><strong>₹{finalPrice}</strong>
              </div>
            </div>
            
            <p style={{ fontSize: '12px', opacity: 0.7, lineHeight: '1.5' }}>
              * Prices are inclusive of Home Collection charges and Taxes. Pay on collection or online.
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle} className="animate-pop">
            <div style={{fontSize: '70px', marginBottom: '20px'}}>✅</div>
            <h2 style={{color: '#1e3a8a', fontSize: '28px'}}>Order Placed!</h2>
            <p style={{color: '#64748b'}}>Kindly save your reference number:</p>
            <div style={orderIdBox}>{orderId}</div>
            <p style={{fontSize: '14px', color: '#475569', marginBottom: '25px'}}>Our medical coordinator will call you within 15 mins for slot confirmation.</p>
            <button onClick={() => navigate('/')} style={whatsappBtnStyle}>Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- EXTENDED STYLES ---
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 };
const popupStyle = { background: '#fff', padding: '50px', borderRadius: '30px', textAlign: 'center', maxWidth: '450px', width: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' };
const orderIdBox = { fontSize: '28px', fontWeight: '900', background: '#f8fafc', padding: '15px', borderRadius: '15px', margin: '20px 0', border: '3px dashed #1e3a8a', color: '#1e3a8a', letterSpacing: '2px' };
const whatsappBtnStyle = { width: '100%', padding: '18px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.3s' };
const applyBtnStyle = { marginTop: '5px', padding: '0 20px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const wrapperStyle = { background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' };
const cardStyle = { background: '#fff', width: '100%', maxWidth: '1100px', display: 'flex', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' };
const summarySidebarStyle = { flex: 1, background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', padding: '50px', color: '#fff' };
const gridFormStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontSize: '15px' };
const labelStyle = { fontSize: '12px', fontWeight: '900', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '1px' };
const span2 = { gridColumn: 'span 2' };
const btnStyle = { gridColumn: 'span 2', padding: '20px', background: '#ffbf00', color: '#1e3a8a', border: 'none', borderRadius: '15px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 191, 0, 0.3)', marginTop: '10px' };
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '15px' };