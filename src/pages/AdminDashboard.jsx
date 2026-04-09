import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { logoData } from '../LogoData'; 

/**
 * TESTYAAN ADMIN CONTROL CENTER
 * Version: 2.1.0 (Discount Loop Integration)
 * Total Lines: 400+ for Full Functionality
 */

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ userid: "", password: "" });
  const [bookings, setBookings] = useState([]);
  const [registrations, setRegistrations] = useState([]); 
  const [activeTab, setActiveTab] = useState("bookings"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Date Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Payment & Edit States
  const [paymentData, setPaymentData] = useState({ 
    discount: 0, 
    paid: 0,
    pName: "",
    pMobile: "",
    pAddress: "",
    testCode: "" 
  });

  // --- CONFIGURATIONS ---
  const ADMIN_USER = "admin123"; 
  const ADMIN_PASS = "testyaan@2026";
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrQfBu42xRe4jWIthn9nJOVhYCh-b-qF27YWS4THIl22iAqTekWAEt1y-1ZEvZ5g1UF6droRSgPi-Y/pub?output=csv"; 
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec";
  const REG_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJo6qIVI3jKBokkKJ_B_EY-8lFLvTF4GNowt8jAGsuu8-4Hya5ShC6Vi93uSuzXrX46Q/exec";

  const logoBase64 = logoData; 

  // --- LIFECYCLE EFFECTS ---
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminAuth");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, [refreshKey]);

  // --- DATA FETCHING LOGIC ---
  const fetchAllData = () => {
    setLoading(true);
    // Fetch Bookings from CSV
    fetch(SHEET_CSV_URL)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, { 
            header: true, 
            skipEmptyLines: true,
            complete: (res) => {
              setBookings(res.data.reverse());
            }
        });
      })
      .catch(err => console.error("CSV Fetch Error:", err));

    // Fetch Registrations from Web App API
    fetch('https://script.google.com/macros/s/AKfycbxJo6qIVI3jKBokkKJ_B_EY-8lFLvTF4GNowt8jAGsuu8-4Hya5ShC6Vi93uSuzXrX46Q/exec')
      .then(res => res.json())
      .then(data => {
        setRegistrations(data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error("Reg API Error:", err);
        setLoading(false);
      });
  };

  // --- AUTHENTICATION HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginDetails.userid === ADMIN_USER && loginDetails.password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      fetchAllData();
    } else { 
      alert("Invalid Admin Credentials. Please check UserID and Password."); 
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("adminAuth");
      setIsAuthenticated(false);
    }
  };

  // --- MODAL HANDLERS ---
  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setPaymentData({
      discount: patient["Discount"] || 0,
      paid: patient["Paid Amount"] || 0,
      pName: patient["Patient Name"] || "",
      pMobile: patient["Mobile Number"] || "",
      pAddress: patient["Full Address"] || "",
      testCode: patient["Test Code"] || `TY-${patient["Booking ID"]?.toString().slice(-3) || '001'}`
    });
  };

  // --- ACTION HANDLERS ---
  const handleUpdatePayment = async () => {
    if (!window.confirm("Confirm Payment & Details Update?")) return;

    const total = parseFloat(selectedPatient["Final Amount"] || 0);
    const disc = parseFloat(paymentData.discount || 0);
    const paid = parseFloat(paymentData.paid || 0);
    const pendingAmount = total - disc - paid;
    
    const updatePayload = {
      action: "update_payment",
      bookingId: selectedPatient["Booking ID"],
      discount: disc,
      paid: paid,
      pending: pendingAmount,
      newName: paymentData.pName,
      newMobile: paymentData.pMobile,
      newAddress: paymentData.pAddress,
      testCode: paymentData.testCode 
    };

    try {
      setLoading(true);
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(updatePayload)
      });
      alert("Update Success! Sheet will refresh shortly.");
      setSelectedPatient(null);
      setRefreshKey(old => old + 1);
    } catch (error) {
      alert("Network Error: Update Failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadBill = (patient) => {
    const doc = new jsPDF();
    const total = parseFloat(patient["Final Amount"] || 0);
    const disc = parseFloat(patient["Discount"] || 0);
    const paid = parseFloat(patient["Paid Amount"] || 0);
    const net = total - disc;
    const pending = net - paid;
    
    const receiptNumber = 1000 + (bookings.length - bookings.findIndex(b => b["Booking ID"] === patient["Booking ID"]));
    const displayReceiptNo = `TY-${receiptNumber}/2026`;

    // PDF Header Styling
    doc.setFillColor(30, 58, 138); 
    doc.rect(0, 0, 210, 45, 'F');

    if (logoBase64 && logoBase64.length > 100) {
        try { doc.addImage(logoBase64, 'PNG', 12, 5, 35, 35); } catch(e){ console.warn("Logo skipping..."); }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TESTYAAN", 50, 20);
    doc.setFontSize(9);
    doc.text("Advanced Diagnostics & Research Center", 50, 27);
    doc.text("Email: Helpline.Testyaan@gmail.com | Ph: +91 8130484197", 50, 33);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Receipt No: ${displayReceiptNo}`, 15, 55);
    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-GB')}`, 155, 55);
    doc.setDrawColor(200);
    doc.line(15, 60, 195, 60);

    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", 15, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${patient["Patient Name"]}`, 15, 78);
    doc.text(`Contact: ${patient["Mobile Number"]}`, 15, 84);
    doc.text(`Address: ${patient["Full Address"] || 'N/A'}`, 15, 90);

    autoTable(doc, {
      startY: 100,
      head: [['Sl.', 'Service/Test Description', 'Base Amount']],
      body: [['1', patient["Test Name"], total.toFixed(2)]],
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text(`Net Payable: INR ${net.toFixed(2)}`, 140, finalY);
    doc.text(`Paid: INR ${paid.toFixed(2)}`, 140, finalY + 7);
    
    if(pending > 0) {
        doc.setTextColor(200, 0, 0);
        doc.text(`Balance Due: INR ${pending.toFixed(2)}`, 140, finalY + 14);
    }

    doc.save(`TestYaan_Bill_${patient["Patient Name"]}.pdf`);
  };

  // --- FILTERING LOGIC ---
  const filteredBookings = bookings.filter(b => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = b["Patient Name"]?.toLowerCase().includes(searchLow) || b["Mobile Number"]?.includes(searchTerm);
    if (!startDate || !endDate) return matchesSearch;
    const bDate = new Date(b["Collection Date"]);
    return matchesSearch && (bDate >= new Date(startDate) && bDate <= new Date(endDate));
  });

  const filteredRegs = registrations.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone?.includes(searchTerm)
  );

  const totalRevenue = filteredBookings.reduce((acc, b) => acc + parseFloat(b["Final Amount"] || 0), 0);

  // --- RENDER: LOGIN ---
  if (!isAuthenticated) {
    return (
      <div style={loginContainerStyle}>
        <div style={loginBoxStyle}>
          <div style={{textAlign: 'center', marginBottom: '25px'}}>
            <img src={logoData} alt="Logo" style={{height: '50px'}} />
            <h2 style={{ color: '#1e3a8a', marginTop: '10px' }}>Admin Access</h2>
          </div>
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Staff ID</label>
            <input type="text" placeholder="Enter ID" style={inputStyle} onChange={(e) => setLoginDetails({...loginDetails, userid: e.target.value})} />
            <label style={labelStyle}>Security Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} onChange={(e) => setLoginDetails({...loginDetails, password: e.target.value})} />
            <button type="submit" style={btnStyle}>Authenticate</button>
          </form>
          <p style={{fontSize: '11px', textAlign: 'center', color: '#64748b', marginTop: '20px'}}>© 2026 TestYaan Diagnostics. Unauthorized access is prohibited.</p>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div style={mainContainerStyle}>
      <style>{`
        .tab-btn { padding: 12px 25px; border: none; cursor: pointer; font-weight: 800; border-radius: 12px; transition: 0.4s; font-size: 14px; }
        .active-tab { background: #1e3a8a; color: white; box-shadow: 0 5px 15px rgba(30,58,138,0.3); }
        .inactive-tab { background: #fff; color: #64748b; border: 1px solid #e2e8f0; }
        .hover-row:hover { background-color: #f8fafc !important; }
        @media (max-width: 768px) {
          .header-flex { flex-direction: column; gap: 15px; }
          .hide-mobile { display: none; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header Section */}
      <div className="header-flex" style={headerContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <img src={logoData} alt="Logo" style={{ height: '45px' }} />
           <div>
             <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '1.6rem', fontWeight: '900' }}>Control Center</h1>
             <span style={{fontSize: '12px', color: '#16a34a', fontWeight: 'bold'}}>● System Online</span>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => setRefreshKey(k => k + 1)} style={refreshBtnStyle}>{loading ? 'Syncing...' : 'Sync Data'}</button>
           <button onClick={handleLogout} style={logoutBtnStyle}>Logout Session</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button className={`tab-btn ${activeTab === 'bookings' ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab('bookings')}>Patient Bookings</button>
        <button className={`tab-btn ${activeTab === 'registrations' ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab('registrations')}>15% Discount Users</button>
      </div>

      {/* Dynamic Content */}
      {activeTab === 'bookings' && (
        <div className="stats-grid" style={statsGridStyle}>
          <div style={statCardStyle}><small style={statLabelStyle}>TOTAL ORDERS</small><h2 style={statValueStyle}>{filteredBookings.length}</h2></div>
          <div style={statCardStyle}><small style={statLabelStyle}>GROSS REVENUE</small><h2 style={{...statValueStyle, color: '#16a34a'}}>₹{totalRevenue.toLocaleString()}</h2></div>
          <div style={statCardStyle}><small style={statLabelStyle}>AVG. ORDER VALUE</small><h2 style={statValueStyle}>₹{(totalRevenue/(filteredBookings.length || 1)).toFixed(0)}</h2></div>
        </div>
      )}

      {/* Filter Panel */}
      <div className="filter-panel" style={filterPanelStyle}>
        <div style={{flex: 2, minWidth: '250px'}}>
            <label style={labelStyle}>Global Search</label>
            <input type="text" placeholder="Search by name, phone or ID..." style={{...inputStyle, marginBottom: 0}} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        {activeTab === 'bookings' && (
          <div style={{display: 'flex', gap: '10px', flex: 1.5}}>
            <div style={{flex: 1}}><label style={labelStyle}>Start Date</label><input type="date" style={{...inputStyle, marginBottom: 0}} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div style={{flex: 1}}><label style={labelStyle}>End Date</label><input type="date" style={{...inputStyle, marginBottom: 0}} onChange={(e) => setEndDate(e.target.value)} /></div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="table-container" style={tableContainerStyle}>
        {activeTab === 'bookings' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#1e3a8a', color: 'white' }}>
              <tr>
                <th style={thStyle}>BOOKING ID</th>
                <th style={thStyle}>PATIENT INFO</th>
                <th style={thStyle} className="hide-mobile">TEST DESCRIPTION</th>
                <th style={thStyle}>BILLING</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i} className="hover-row" style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                  <td style={{...tdStyle, fontWeight: 'bold', color: '#1e3a8a'}}>#{b["Booking ID"] || 'N/A'}</td>
                  <td style={tdStyle}><strong>{b["Patient Name"]}</strong><br/><small style={{color: '#64748b'}}>{b["Mobile Number"]}</small></td>
                  <td style={tdStyle} className="hide-mobile">{b["Test Name"]}<br/><small style={{color: '#1e3a8a'}}>Lab: {b["Lab Name"]}</small></td>
                  <td style={tdStyle}><strong>₹{b["Final Amount"]}</strong><br/><small style={{color: '#16a34a'}}>Paid: ₹{b["Paid Amount"] || 0}</small></td>
                  <td style={tdStyle}>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <button onClick={() => openEditModal(b)} style={editBtnStyle} title="Edit Details">✎</button>
                        <button onClick={() => downloadBill(b)} style={billBtnStyle} title="Generate PDF">PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#ffbf00', color: '#000' }}>
              <tr>
                <th style={thStyle}>PATIENT NAME</th>
                <th style={thStyle}>PHONE NUMBER</th>
                <th style={thStyle}>COUPON CODE</th>
                <th style={thStyle}>REG. DATE</th>
                <th style={thStyle}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegs.map((r, i) => (
                <tr key={i} className="hover-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}><strong>{r.name}</strong><br/><small>{r.email}</small></td>
                  <td style={tdStyle}>{r.phone}</td>
                  <td style={{...tdStyle, fontWeight: 'bold', color: '#1e3a8a', letterSpacing: '1px'}}>{r.code}</td>
                  <td style={tdStyle}>{new Date(r.timestamp).toLocaleDateString()}</td>
                  <td style={tdStyle}><span style={badgeStyle}>Active 15%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal Overlay */}
      {selectedPatient && (
        <div style={modalOverlayStyle}>
          <div className="modal-box" style={modalContentStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3 style={{margin: 0, color: '#1e3a8a'}}>Modify Record</h3>
                <button onClick={() => setSelectedPatient(null)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'}}>×</button>
            </div>
            <div style={{maxHeight: '65vh', overflowY: 'auto', paddingRight: '10px'}}>
                <label style={labelStyle}>Patient Name</label>
                <input type="text" style={inputStyle} value={paymentData.pName} onChange={(e) => setPaymentData({...paymentData, pName: e.target.value})} />
                
                <label style={labelStyle}>Internal Test Code</label>
                <input type="text" style={inputStyle} value={paymentData.testCode} onChange={(e) => setPaymentData({...paymentData, testCode: e.target.value})} />
                
                <div style={{display: 'flex', gap: '15px'}}>
                    <div style={{flex: 1}}>
                        <label style={labelStyle}>Discount (₹)</label>
                        <input type="number" style={inputStyle} value={paymentData.discount} onChange={(e) => setPaymentData({...paymentData, discount: e.target.value})} />
                    </div>
                    <div style={{flex: 1}}>
                        <label style={labelStyle}>Amount Paid (₹)</label>
                        <input type="number" style={inputStyle} value={paymentData.paid} onChange={(e) => setPaymentData({...paymentData, paid: e.target.value})} />
                    </div>
                </div>

                <div style={summaryBoxStyle}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>Final Payable:</span>
                        <strong>₹{(parseFloat(selectedPatient["Final Amount"]) - (parseFloat(paymentData.discount) || 0)).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
            <button onClick={handleUpdatePayment} style={btnStyle}>Commit Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES OBJECTS (EXPANDED FOR LENGTH & CLARITY) ---
const mainContainerStyle = { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" };
const headerContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' };
const filterPanelStyle = { display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px', backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const tableContainerStyle = { overflowX: 'auto', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' };
const statCardStyle = { background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', textAlign: 'center' };
const statLabelStyle = { fontSize: '11px', fontWeight: '900', color: '#64748b', letterSpacing: '1px' };
const statValueStyle = { margin: '10px 0 0 0', color: '#1e3a8a', fontSize: '1.8rem', fontWeight: '800' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' };
const thStyle = { padding: '18px 20px', textAlign: 'left', fontSize: '12px', letterSpacing: '0.5px' };
const tdStyle = { padding: '18px 20px', fontSize: '13px', color: '#1e293b' };
const inputStyle = { width: '100%', padding: '12px', marginTop: '5px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', transition: '0.3s', outlineColor: '#1e3a8a' };
const btnStyle = { width: '100%', marginTop: '20px', padding: '15px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' };
const logoutBtnStyle = { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' };
const refreshBtnStyle = { background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' };
const editBtnStyle = { background: '#f1f5f9', color: '#1e3a8a', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '10px', cursor: 'pointer' };
const billBtnStyle = { background: '#16a34a', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '25px', width: '95%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const loginContainerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9' };
const loginBoxStyle = { background: 'white', padding: '45px', borderRadius: '30px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const badgeStyle = { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' };
const summaryBoxStyle = { background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '15px', border: '1px dashed #cbd5e1' };

export default AdminDashboard;