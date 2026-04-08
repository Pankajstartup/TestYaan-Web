import React, { useEffect } from 'react';
// Agar aap SEO wala component use kar rahe hain, toh use yahan import karein
import SEO from '../components/SEO'; 

const PrivacyPolicy = () => {
  // Page load hone par scroll ko upar lane ke liye
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionStyle = {
    marginBottom: '30px',
  };

  const h2Style = {
    fontSize: '1.4rem',
    color: '#1e3a8a', // Aapke main hero banner ka blue color
    fontWeight: '800',
    marginBottom: '15px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '8px'
  };

  const pStyle = {
    color: '#475569',
    lineHeight: '1.8',
    marginBottom: '15px',
    fontSize: '15px'
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. SEO SECTION (AdSense approval ke liye zaroori) */}
      <SEO 
        title="Privacy Policy | TestYaan - Lab Test Booking" 
        description="Read TestYaan's privacy policy to understand how we collect, use, and protect your data during lab test booking in Delhi-NCR." 
        path="/privacy"
      />

      {/* 2. HERO SECTION (Matched with your original design) */}
      <section className="universal-hero" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="city-badge" style={{ display: 'inline-block', backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 15px', borderRadius: '50px', fontSize: '11px', fontWeight: '800', marginBottom: '15px' }}>
            🔒 User Trust & Security
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', color: '#1e3a8a', fontWeight: '800', lineHeight: '1.2' }}>
            Privacy <span style={{ color: '#ffbf00' }}>Policy</span>
          </h1>
          <p style={{ margin: '15px 0 0', fontSize: '1.1rem', opacity: 0.9, color: '#333' }}>
            Effective Date: April 8, 2026
          </p>
        </div>
        {/* Floating background shape for matching style */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
      </section>

      {/* 3. POLICY CONTENT SECTION (Structured like your Package details modal) */}
      <main className="container mx-auto px-4 py-12" style={{ maxWidth: '800px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          <p style={pStyle}>
            At **TestYaan** (accessible from <a href="https://testyaan.online" style={{color: '#3b82f6', textDecoration: 'none'}}>https://testyaan.online</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TestYaan and how we use it.
          </p>

          <div style={sectionStyle}>
            <h2 style={h2Style}>1. Information We Collect</h2>
            <p style={pStyle}>
              We may collect personal information that you provide to us directly when booking a diagnostic test or requesting a health package quote. This includes:
            </p>
            <ul style={{ ...pStyle, listStyleType: 'disc', marginLeft: '25px' }}>
              <li>Your Name, Phone Number, and Email Address.</li>
              <li>Your complete Address for home sample collection services in Delhi-NCR.</li>
              <li>Health-related data or previous reports required for accurate lab test processing.</li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>2. How We Use Your Information</h2>
            <p style={pStyle}>
              We use the collected information primarily to provide our medical diagnostic services. This includes:
            </p>
            <ul style={{ ...pStyle, listStyleType: 'disc', marginLeft: '25px' }}>
              <li>Operate and maintain our online test booking platform.</li>
              <li>Communicate with you regarding bookings, payment confirmations, and test reports.</li>
              <li>Prevent fraudulent transactions and secure our systems.</li>
              <li>Comply with necessary regulatory guidelines.</li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>3. Log Files & Cookies</h2>
            <p style={pStyle}>
              TestYaan follows a standard procedure of using log files and cookies. These files log visitors when they visit websites to analyze trends, administer the site, and gather demographic information. This data is not linked to any information that is personally identifiable.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>4. Google DoubleClick DART Cookie (For AdSense Approval)</h2>
            <p style={pStyle}>
              Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>5. Security</h2>
            <p style={pStyle}>
              The security of your personal and medical information is important to us. We implement appropriate technical and organizational measures to protect your data.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={h2Style}>6. Contact Us</h2>
            <p style={pStyle}>
              If you have any questions about this Privacy Policy, please do not hesitate to contact us at:
            </p>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', fontSize: '14px', color: '#475569', border: '1px solid #e2e8f0', lineHeight: '1.6' }}>
              <strong>TestYaan Diagnostic Services</strong><br/>
              <strong>Email:</strong> helpline.testyaan@gmail.com<br/>
              <strong>Address:</strong> Delhi, India
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;