import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="healthians-style">
      {/* Premium Hero Banner */}
      <section className="hero-banner">
        <div className="banner-card">
          <div className="banner-text">
            <span className="location-tag">#1 Trusted in Delhi-NCR</span>
            <h1>SUPER SPECIALITY <br/>HEALTH SCREENING</h1>
            <div className="stats">
              <div className="stat-item"><b>320+</b> Tests Included</div>
              <div className="stat-item">At Just <b>₹1499</b></div>
            </div>
            <button className="main-book-btn">Book Now »</button>
            
            <div className="search-wrapper">
              <input type="text" placeholder="Find your Package / Test / Scans" />
              <button className="orange-search">Search</button>
            </div>

            <div className="usp-row">
              <div className="usp">🏠 Free Collection (60 Mins)</div>
              <div className="usp">📄 Smart Digital Reports</div>
              <div className="usp">👨‍⚕️ Free Doctor Consultation</div>
            </div>
          </div>
          <div className="banner-image">
            {/* Yahan aap ek professional doctor ya businessman ki photo laga sakte hain */}
            <img src="https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg" alt="Health Expert" />
          </div>
        </div>
      </section>

      {/* Sticky Callback Float */}
      <div className="callback-float">
        <span>Worried About Health?</span>
        <button>Call Expert Now</button>
      </div>
    </div>
  );
};

export default Home;