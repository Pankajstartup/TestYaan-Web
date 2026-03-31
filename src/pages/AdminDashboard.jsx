import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ userid: "", password: "" });
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // --- NAYE STATES (DATE FILTER) ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [paymentData, setPaymentData] = useState({ 
    discount: 0, 
    paid: 0,
    pName: "",
    pMobile: "",
    pAddress: "" 
  });

  const ADMIN_USER = "admin123"; 
  const ADMIN_PASS = "testyaan@2026";
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrQfBu42xRe4jWIthn9nJOVhYCh-b-qF27YWS4THIl22iAqTekWAEt1y-1ZEvZ5g1UF6droRSgPi-Y/pub?output=csv"; 
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec";

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminAuth");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = () => {
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
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginDetails.userid === ADMIN_USER && loginDetails.password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      fetchData();
    } else { alert("Wrong Credentials"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setPaymentData({
      discount: patient["Discount"] || 0,
      paid: patient["Paid Amount"] || 0,
      pName: patient["Patient Name"] || "",
      pMobile: patient["Mobile Number"] || "",
      pAddress: patient["Full Address"] || ""
    });
  };

  const handleUpdatePayment = async () => {
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
      newAddress: paymentData.pAddress
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(updatePayload)
      });
      alert("Updated successfully!");
      setSelectedPatient(null);
      fetchData(); 
    } catch (error) {
      alert("Update failed!");
    }
  };

  const downloadBill = (patient) => {
    const doc = new jsPDF();
    const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; 

    const total = parseFloat(patient["Final Amount"] || 0);
    const disc = parseFloat(patient["Discount"] || 0);
    const paid = parseFloat(patient["Paid Amount"] || 0);
    const net = total - disc;
    const pending = net - paid;

    doc.setFillColor(30, 58, 138); 
    doc.rect(0, 0, 210, 45, 'F');

    try {
      doc.addImage(logoBase64, 'PNG', 15, 8, 30, 30); 
    } catch (e) { console.error("Logo Error"); }

    doc.setFontSize(22); doc.setTextColor(255, 255, 255);
    doc.text("TESTYAAN DIAGNOSTICS", 52, 22);
    doc.setFontSize(10);
    doc.text("Quality Healthcare at Your Doorstep", 52, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Invoice ID: INV-${patient["Booking ID"]}`, 15, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 55);

    autoTable(doc, {
      startY: 65,
      head: [['Patient Details', 'Booking Details']],
      body: [
        [
          `Name: ${patient["Patient Name"]}\nAge/Sex: ${patient["Age"]}/${patient["Gender"]}\nMobile: ${patient["Mobile Number"]}`, 
          `Test: ${patient["Test Name"]}\nLab: ${patient["Lab Name"]}\nDate: ${patient["Collection Date"]}`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [30, 58, 138] }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Billing Description', 'Amount (INR)']],
      body: [
        ['Total Test Charges', `INR ${total}`],
        ['Discount Applied', `- INR ${disc}`],
        ['Net Payable Amount', `INR ${net}`],
        ['Amount Received', `INR ${paid}`],
        ['Balance Pending', `INR ${pending}`]
      ],
      headStyles: { fillColor: [30, 58, 138] },
      columnStyles: { 1: { halign: 'right' } }
    });

    doc.setFontSize(9); doc.setTextColor(100);
    doc.text("This is a computer-generated invoice. No signature required.", 105, doc.lastAutoTable.finalY + 20, { align: 'center' });
    doc.save(`Bill_${patient["Patient Name"]}.pdf`);
  };

  // --- NAYA FILTER LOGIC (SEARCH + DATE) ---
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b["Patient Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b["Mobile Number"]?.includes(searchTerm);
    
    if (!startDate || !endDate) return matchesSearch;
    
    const bDate = new Date(b["Collection Date"]);
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    
    return matchesSearch && (bDate >= sDate && bDate <= eDate);
  });

  const totalRevenue = filteredBookings.reduce((acc, b) => acc + parseFloat(b["Final Amount"] || 0), 0);

  if (!isAuthenticated) {
    return (
      <div style={loginContainerStyle}>
        <div style={loginBoxStyle}>
          <h2 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="User ID" style={inputStyle} onChange={(e) => setLoginDetails({...loginDetails, userid: e.target.value})} required />
            <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setLoginDetails({...loginDetails, password: e.target.value})} required />
            <button type="submit" style={btnStyle}>Enter Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
           <h1 style={{ color: '#1e3a8a', margin: 0 }}>TestYaan Control Center</h1>
           <p style={{ color: '#64748b' }}>Manage patient bookings and payments</p>
        </div>
        <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={statCardStyle}>
          <small style={{color: '#64748b'}}>Total Bookings</small>
          <h2 style={{margin: '5px 0', color: '#1e3a8a'}}>{filteredBookings.length}</h2>
        </div>
        <div style={statCardStyle}>
          <small style={{color: '#64748b'}}>Gross Revenue</small>
          <h2 style={{margin: '5px 0', color: '#16a34a'}}>₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* --- NAYA FILTER UI --- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
            <label style={labelStyle}>Search Patient</label>
            <input 
              type="text" placeholder="Search Name or Mobile..." 
              style={{ ...inputStyle, marginBottom: 0 }} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div>
            <label style={labelStyle}>From Date</label>
            <input type="date" style={{ ...inputStyle, marginBottom: 0 }} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
            <label style={labelStyle}>To Date</label>
            <input type="date" style={{ ...inputStyle, marginBottom: 0 }} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1e3a8a', color: 'white' }}>
            <tr>
              <th style={thStyle}>Order ID</th> {/* NAYA COLUMN */}
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Patient Info</th>
              <th style={thStyle}>Test Details</th>
              <th style={thStyle}>Payment Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1e3a8a' }}>
                    #{b["Booking ID"] ? b["Booking ID"].toString().slice(-6) : `ORD-${i}`}
                </td>
                <td style={tdStyle}>{b["Collection Date"]}</td>
                <td style={tdStyle}>
                  <strong style={{ color: '#0f172a' }}>{b["Patient Name"]}</strong><br/>
                  <small style={{ color: '#64748b' }}>{b["Mobile Number"]}</small>
                </td>
                <td style={tdStyle}>{b["Test Name"]}<br/><small style={{ color: '#1e40af' }}>{b["Lab Name"]}</small></td>
                <td style={tdStyle}><span style={{ fontWeight: '700' }}>₹{b["Final Amount"]}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(b)} style={editBtnStyle}>Pay / Edit</button>
                  <button onClick={() => downloadBill(b)} style={billBtnStyle}>Bill</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Patient & Payment Edit</h3>
                <button onClick={() => setSelectedPatient(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '10px'}}>
                <label style={labelStyle}>Patient Name:</label>
                <input type="text" style={inputStyle} value={paymentData.pName} onChange={(e) => setPaymentData({...paymentData, pName: e.target.value})} />
                <label style={labelStyle}>Mobile Number:</label>
                <input type="text" style={inputStyle} value={paymentData.pMobile} onChange={(e) => setPaymentData({...paymentData, pMobile: e.target.value})} />
                <label style={labelStyle}>Address:</label>
                <textarea style={{...inputStyle, height: '60px'}} value={paymentData.pAddress} onChange={(e) => setPaymentData({...paymentData, pAddress: e.target.value})} />
                <hr style={{margin: '15px 0', border: '0.5px solid #eee'}} />
                <label style={labelStyle}>Discount (₹):</label>
                <input type="number" style={inputStyle} value={paymentData.discount} onChange={(e) => setPaymentData({...paymentData, discount: e.target.value})} />
                <label style={labelStyle}>Amount Paid (₹):</label>
                <input type="number" style={inputStyle} value={paymentData.paid} onChange={(e) => setPaymentData({...paymentData, paid: e.target.value})} />
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '10px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Pending Balance:</span>
                    <strong style={{ color: 'red' }}>₹{parseFloat(selectedPatient["Final Amount"]) - (parseFloat(paymentData.discount) || 0) - (parseFloat(paymentData.paid) || 0)}</strong>
                  </div>
                </div>
            </div>
            <button onClick={handleUpdatePayment} style={btnStyle}>Save All Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES (AS IT IS) ---
const statCardStyle = { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#64748b' };
const thStyle = { padding: '18px 15px', textAlign: 'left', fontSize: '14px' };
const tdStyle = { padding: '18px 15px', fontSize: '14px' };
const loginContainerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e2e8f0' };
const loginBoxStyle = { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { width: '100%', marginTop: '15px', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const logoutBtnStyle = { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const editBtnStyle = { background: '#f1f5f9', color: '#1e3a8a', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '8px', marginRight: '8px', cursor: 'pointer', fontWeight: '600' };
const billBtnStyle = { background: '#16a34a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle = { background: 'white', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };

export default AdminDashboard;