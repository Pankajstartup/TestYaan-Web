import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ background: '#eaeded', marginTop: '60px', paddingBottom: '50px' }}>
      
      {/* 1. FLIPPING BANNER (Bade Tests) */}
      <div className="hero-banner" style={{ width: '100%', height: '400px', background: 'linear-gradient(to bottom, rgba(0,0,0,0), #eaeded), url("https://img.freepik.com/free-photo/doctor-holding-blood-sample-tube_53876-94813.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '50px' }}>
        <div style={{ background: 'white', padding: '20px', width: '300px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3>Special Offer</h3>
          <p>Get 50% Off on 1st Booking</p>
          <Link to="/tests" style={{ color: '#007185', textDecoration: 'none' }}>Book Now</Link>
        </div>
      </div>

      {/* 2. GRID SECTION (Amazon Style Boxes) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '0 20px', marginTop: '-150px' }}>
        
        {/* Popular Tests Box */}
        <div className="amazon-card" style={{ background: 'white', padding: '20px', zIndex: 10 }}>
          <h3 style={{ fontSize: '21px', marginBottom: '15px' }}>Top Rated Tests</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Link to="/tests?q=cbc" style={{ textDecoration: 'none', color: '#333' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/822/822143.png" width="100%" />
              <p style={{ fontSize: '12px' }}>CBC Test</p>
            </Link>
            <Link to="/tests?q=thyroid" style={{ textDecoration: 'none', color: '#333' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2864/2864282.png" width="100%" />
              <p style={{ fontSize: '12px' }}>Thyroid</p>
            </Link>
          </div>
          <Link to="/tests" style={{ color: '#007185', textDecoration: 'none', fontSize: '13px' }}>See all</Link>
        </div>

        {/* Full Body Packages Box */}
        <div className="amazon-card" style={{ background: 'white', padding: '20px', zIndex: 10 }}>
          <h3 style={{ fontSize: '21px', marginBottom: '15px' }}>Health Packages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             {/* Yahan aapke packages aayenge */}
             <div style={{ textAlign: 'center' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/3022/3022216.png" width="80px" />
                <p style={{ fontSize: '12px' }}>Senior Citizen</p>
             </div>
             <div style={{ textAlign: 'center' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/2764/2764491.png" width="80px" />
                <p style={{ fontSize: '12px' }}>Fitness Pack</p>
             </div>
          </div>
          <Link to="/tests" style={{ color: '#007185', textDecoration: 'none', fontSize: '13px', marginTop: '10px', display: 'block' }}>Compare All Packages</Link>
        </div>

        {/* Third Box (Ad or Promo) */}
        <div className="amazon-card" style={{ background: '#febd69', padding: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <h2>Up to 70% Off</h2>
           <p>Partnered with 50+ Certified Labs</p>
           <button style={{ background: '#131921', color: 'white', border: 'none', padding: '10px', borderRadius: '20px' }}>Claim Deal</button>
        </div>

      </div>
    </div>
  );
};
export default Home;