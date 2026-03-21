import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, MapPin } from 'lucide-react'; // icons ke liye

const Navbar = ({ cartCount }) => {
  return (
    <nav style={{ background: '#131921', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '20px', color: 'white', position: 'fixed', width: '100%', top: 0, zIndex: 1000 }}>
      {/* Logo */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
        TestYaan<span style={{ color: '#ff9900' }}>.com</span>
      </Link>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
        <MapPin size={18} color="#ccc" />
        <div style={{ marginLeft: '5px' }}>
          <span style={{ color: '#ccc', display: 'block' }}>Deliver to</span>
          <span style={{ fontWeight: 'bold' }}>Delhi-NCR</span>
        </div>
      </div>

      {/* Search Bar (Center) */}
      <div style={{ flex: 1, display: 'flex', height: '40px' }}>
        <input 
          type="text" 
          placeholder="Search for CBC, Thyroid, Full Body Checkup..." 
          style={{ flex: 1, borderRadius: '4px 0 0 4px', border: 'none', padding: '0 15px', outline: 'none' }}
        />
        <button style={{ background: '#ff9900', border: 'none', width: '45px', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
          <Search size={20} />
        </button>
      </div>

      {/* Right Side Icons */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', cursor: 'pointer' }}>
          <span>Hello, Sign in</span>
          <div style={{ fontWeight: 'bold' }}>Account & Lists</div>
        </div>
        
        <Link to="/tests" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
          <ShoppingCart size={30} />
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff9900', color: 'black', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
            {cartCount || 0}
          </span>
          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>Cart</span>
        </Link>
      </div>
    </nav>
  );
};