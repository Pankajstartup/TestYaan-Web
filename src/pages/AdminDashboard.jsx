import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
// Logo import kiya gaya hai
import { logoData } from '../LogoData'; 

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ userid: "", password: "" });
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 1. Updated State to include testCode
  const [paymentData, setPaymentData] = useState({ 
    discount: 0, 
    paid: 0,
    pName: "",
    pMobile: "",
    pAddress: "",
    testCode: "" 
  });

  const ADMIN_USER = "admin123"; 
  const ADMIN_PASS = "testyaan@2026";
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrQfBu42xRe4jWIthn9nJOVhYCh-b-qF27YWS4THIl22iAqTekWAEt1y-1ZEvZ5g1UF6droRSgPi-Y/pub?output=csv"; 
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxmz8W4txUjdJ2NcOv5nflZ6IIiUi1d6Y6AodR8VXPZ-8mbn9KPLKzoOeWQ8A_OQV-lA/exec";

  // LOGO BASE64 - Ab ye globally imported logoData use karega
  const logoBase64 = logoData; 

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
      pAddress: patient["Full Address"] || "",
      testCode: patient["Test Code"] || `TY-${patient["Booking ID"]?.toString().slice(-3) || '001'}`
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
      newAddress: paymentData.pAddress,
      testCode: paymentData.testCode // Passing manual test code
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
    const total = parseFloat(patient["Final Amount"] || 0);
    const disc = parseFloat(patient["Discount"] || 0);
    const paid = parseFloat(patient["Paid Amount"] || 0);
    const net = total - disc;
    const pending = net - paid;
    
    const originalOrderID = patient["Booking ID"]; 
    const receiptIndex = bookings.findIndex(b => b["Booking ID"] === originalOrderID);
    const receiptNumber = 1000 + (bookings.length - receiptIndex);
    const displayReceiptNo = `TY-${receiptNumber}/26`;

    doc.setFillColor(30, 58, 138); 
    doc.rect(0, 0, 210, 45, 'F');

    if (logoBase64 && logoBase64.length > 100) {
        try { 
            doc.addImage(logoBase64, 'PNG', 12, 5, 35, 35); 
        } catch(e){ console.error("Logo Error", e); }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TESTYAAN", 50, 20);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Pathology & Diagnostics | NABL Certified Labs", 50, 27);
    doc.text("Ph: +91 8130484197 | Email: Helpline.Testyaan@gmail.com", 50, 33);
    doc.text("Web: www.testyaan.online", 50, 38);

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Receipt No: ${displayReceiptNo}`, 15, 55);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 160, 55);
    
    doc.setDrawColor(230);
    doc.line(15, 60, 195, 60);

    doc.setFont("helvetica", "bold");
    doc.text("PATIENT DETAILS", 15, 70);
    doc.text("COLLECTION INFO", 120, 70);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${patient["Patient Name"]}`, 15, 78);
    doc.text(`Age/Sex: ${patient["Age"] || '30'} / ${patient["Gender"] || 'Male'}`, 15, 84);
    doc.text(`Mobile: ${patient["Mobile Number"]}`, 15, 90);

    doc.text(`Lab: ${patient["Lab Name"]}`, 120, 78);
    doc.text(`Collection Date: ${patient["Collection Date"]}`, 120, 84);
    doc.text(`Order ID: ${originalOrderID}`, 120, 90);

    autoTable(doc, {
      startY: 100,
      head: [['Sl No.', 'Test Description', 'Amount (INR)']],
      body: [
        ['1', patient["Test Name"], total.toFixed(2)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [0,0,0], fontStyle: 'bold' },
      styles: { cellPadding: 5, fontSize: 10 },
      columnStyles: { 2: { halign: 'right' } }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    const rightCol = 195;
    const labelCol = 140;

    doc.setFont("helvetica", "bold");
    doc.text("Gross Total:", labelCol, finalY);
    doc.text(`${total.toFixed(2)}`, rightCol, finalY, { align: 'right' });

    doc.setFont("helvetica", "normal");
    doc.text("Discount:", labelCol, finalY + 8);
    doc.text(`- ${disc.toFixed(2)}`, rightCol, finalY + 8, { align: 'right' });

    doc.setFont("helvetica", "bold");
    doc.text("Net Amount:", labelCol, finalY + 16);
    doc.text(`${net.toFixed(2)}`, rightCol, finalY + 16, { align: 'right' });

    doc.setFont("helvetica", "normal");
    doc.text("Paid Amount:", labelCol, finalY + 24);
    doc.text(`${paid.toFixed(2)}`, rightCol, finalY + 24, { align: 'right' });

    doc.setDrawColor(30, 58, 138);
    doc.line(135, finalY + 28, 195, finalY + 28);

    if(pending > 0) {
        doc.setTextColor(200, 0, 0);
        doc.text("Balance Due:", labelCol, finalY + 35);
        doc.text(`${pending.toFixed(2)}`, rightCol, finalY + 35, { align: 'right' });
    } else {
        doc.setTextColor(0, 128, 0);
        doc.text("Status: FULLY PAID", labelCol, finalY + 35);
    }

    doc.setTextColor(150);
    doc.setFontSize(8);
    doc.text("This is a computer generated invoice. No signature required.", 105, 285, { align: 'center' });
    
    doc.save(`Bill_${patient["Patient Name"]}.pdf`);
  };

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
    <div style={mainContainerStyle}>
      {/* CSS for Responsiveness and Mobile Views */}
      <style>{`
        @media (max-width: 768px) {
          .header-flex { flex-direction: column; text-align: center; gap: 15px; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .filter-panel { flex-direction: column; padding: 15px !important; }
          .filter-item { width: 100% !important; min-width: 100% !important; }
          .hide-mobile { display: none; }
          .modal-box { width: 95% !important; padding: 15px !important; margin: 10px; }
          .table-container { border-radius: 8px !important; }
          .td-cell { padding: 10px 5px !important; font-size: 12px !important; }
          .action-btns { flex-direction: column; gap: 5px; }
        }
      `}</style>

      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <img src={logoData} alt="TestYaan" style={{ height: '50px' }} />
           <div>
              <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '1.5rem' }}>Control Center</h1>
              <p className="hide-mobile" style={{ color: '#64748b', margin: 0 }}>Manage patient bookings and payments</p>
           </div>
        </div>
        <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={statCardStyle}>
          <small style={{color: '#64748b'}}>Total Bookings</small>
          <h2 style={{margin: '5px 0', color: '#1e3a8a'}}>{filteredBookings.length}</h2>
        </div>
        <div style={statCardStyle}>
          <small style={{color: '#64748b'}}>Gross Revenue</small>
          <h2 style={{margin: '5px 0', color: '#16a34a'}}>₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      <div className="filter-panel" style={filterPanelStyle}>
        <div className="filter-item" style={{ flex: 1, minWidth: '250px' }}>
            <label style={labelStyle}>Search Patient</label>
            <input 
              type="text" placeholder="Name or Mobile..." 
              style={{ ...inputStyle, marginBottom: 0 }} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div style={{display: 'flex', gap: '10px', flex: 1}}>
          <div style={{flex: 1}}>
              <label style={labelStyle}>From</label>
              <input type="date" style={{ ...inputStyle, marginBottom: 0 }} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div style={{flex: 1}}>
              <label style={labelStyle}>To</label>
              <input type="date" style={{ ...inputStyle, marginBottom: 0 }} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="table-container" style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1e3a8a', color: 'white' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle} className="hide-mobile">Date</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle} className="hide-mobile">Test Details</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td className="td-cell" style={{ ...tdStyle, fontWeight: 'bold', color: '#1e3a8a' }}>
                    #{b["Booking ID"] ? b["Booking ID"] : `ORD-${i}`}
                </td>
                <td className="td-cell hide-mobile" style={tdStyle}>{b["Collection Date"]}</td>
                <td className="td-cell" style={tdStyle}>
                  <strong style={{ color: '#0f172a' }}>{b["Patient Name"]}</strong><br/>
                  <small style={{ color: '#64748b' }}>{b["Mobile Number"]}</small>
                </td>
                <td className="td-cell hide-mobile" style={tdStyle}>{b["Test Name"]}<br/><small style={{ color: '#1e40af' }}>Code: {b["Test Code"] || 'N/A'}</small></td>
                <td className="td-cell" style={tdStyle}><span style={{ fontWeight: '700' }}>₹{b["Final Amount"]}</span></td>
                <td className="td-cell" style={tdStyle}>
                  <div className="action-btns" style={{display: 'flex'}}>
                    <button onClick={() => openEditModal(b)} style={editBtnStyle}>✎</button>
                    <button onClick={() => downloadBill(b)} style={billBtnStyle}>PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div style={modalOverlayStyle}>
          <div className="modal-box" style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Edit Booking</h3>
                <button onClick={() => setSelectedPatient(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{maxHeight: '70vh', overflowY: 'auto', paddingRight: '5px'}}>
                <label style={labelStyle}>Patient Name:</label>
                <input type="text" style={inputStyle} value={paymentData.pName} onChange={(e) => setPaymentData({...paymentData, pName: e.target.value})} />
                
                <label style={labelStyle}>Manual Test Code:</label>
                <input type="text" style={inputStyle} value={paymentData.testCode} onChange={(e) => setPaymentData({...paymentData, testCode: e.target.value})} />

                <label style={labelStyle}>Discount (₹):</label>
                <input type="number" style={inputStyle} value={paymentData.discount} onChange={(e) => setPaymentData({...paymentData, discount: e.target.value})} />
                
                <label style={labelStyle}>Amount Paid (₹):</label>
                <input type="number" style={inputStyle} value={paymentData.paid} onChange={(e) => setPaymentData({...paymentData, paid: e.target.value})} />
                
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginTop: '10px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Pending:</span>
                    <strong style={{ color: 'red' }}>₹{(parseFloat(selectedPatient["Final Amount"]) - (parseFloat(paymentData.discount) || 0) - (parseFloat(paymentData.paid) || 0)).toFixed(2)}</strong>
                  </div>
                </div>
            </div>
            <button onClick={handleUpdatePayment} style={btnStyle}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles Objects
const mainContainerStyle = { padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh' };
const filterPanelStyle = { display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const tableContainerStyle = { overflowX: 'auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const statCardStyle = { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' };
const labelStyle = { fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' };
const thStyle = { padding: '15px', textAlign: 'left', fontSize: '13px' };
const tdStyle = { padding: '15px', fontSize: '13px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { width: '100%', marginTop: '15px', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const logoutBtnStyle = { background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const editBtnStyle = { background: '#f1f5f9', color: '#1e3a8a', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', marginRight: '5px', cursor: 'pointer' };
const billBtnStyle = { background: '#16a34a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '400px' };
const loginContainerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e2e8f0' };
const loginBoxStyle = { background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '360px' };

export default AdminDashboard;