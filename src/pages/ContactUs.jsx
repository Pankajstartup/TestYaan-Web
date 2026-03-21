import React from 'react';

function ContactUs() {
  return (
    <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <h2 style={{ color: '#0056b3', marginBottom: '20px' }}>Contact Us</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: '2' }}>
        <p>📍 123 Health Street, Diagnostic Plaza, New Delhi</p>
        <p>📞 Phone: +91 98765 43210</p>
        <p>📧 Email: support@testkart.in</p>
        <p>🕒 Hours: Mon - Sun (6 AM - 10 PM)</p>
      </div>
    </div>
  );
}

export default ContactUs;