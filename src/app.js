import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Tests from './pages/Tests'; // Naya Page
import LabPage from './pages/LabPage';
import ContactUs from './pages/ContactUs';
import './style.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="main-header">
          <Link to="/" className="logo">Test<span>Yaant</span></Link>
          <nav className="nav-links">
             <Link to="/">Home</Link>
             <Link to="/tests">Tests</Link>
             <Link to="/contact">Contact Us</Link>
          </nav>
          {/* Login/Signup Buttons yahan se hata diye gaye hain */}
        </header>

        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/lab/:labId" element={<LabPage />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
        
        <footer className="main-footer">
          <p>&copy; 2026 TestYaan Diagnostic. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}
export default App;