import React from 'react';

const ContactUs = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', color: '#1e3a8a' }}>Contact at TestYaan</h1>
      <p style={{ textAlign: 'center', marginBottom: '50px', color: '#64748b' }}>Contact us for any query.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ padding: '30px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h3>📍 Lab & Office Address</h3>
          <p>Tuglakabad, New Delhi - 110044</p>
        </div>

        <div style={{ padding: '30px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3>📞 Helpline Number</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>+91 8130484197</p>
          <a href="https://wa.me/918130484197" style={{ display: 'inline-block', marginTop: '15px', padding: '12px 30px', background: '#25D366', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
export default ContactUs;