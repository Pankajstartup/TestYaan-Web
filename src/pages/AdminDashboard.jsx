import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ userid: "", password: "" });
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentData, setPaymentData] = useState({ discount: 0, paid: 0 });

  // --- CONFIGURATION ---
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
              console.log("Data Received:", res.data); // Testing ke liye
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

  // --- UPDATE DATA IN GOOGLE SHEET ---
  const handleUpdatePayment = async () => {
    // Sheet header 'Final Amount' use kar rahe hain
    const total = parseFloat(selectedPatient["Final Amount"] || 0);
    const disc = parseFloat(paymentData.discount || 0);
    const paid = parseFloat(paymentData.paid || 0);
    const pendingAmount = total - disc - paid;
    
    const updatePayload = {
      action: "update_payment",
      bookingId: selectedPatient["Booking ID"],
      discount: disc,
      paid: paid,
      pending: pendingAmount
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(updatePayload)
      });
      alert("Sheet updated successfully!");
      setSelectedPatient(null);
      fetchData(); 
    } catch (error) {
      alert("Update failed! Check internet or Script URL.");
    }
  };

  // --- GENERATE PROFESSIONAL PDF BILL ---
  const downloadBill = (patient) => {
    const doc = new jsPDF();
    const total = parseFloat(patient["Final Amount"] || 0);
    const disc = parseFloat(paymentData.discount || 0);
    const paid = parseFloat(paymentData.paid || 0);
    const net = total - disc;
    const pending = net - paid;

    doc.setFillColor(30, 58, 138); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(24); doc.setTextColor(255, 255, 255);
    doc.text("TESTYAAN DIAGNOSTICS", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Quality Healthcare at Your Doorstep", 105, 28, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Invoice ID: INV-${patient["Booking ID"]}`, 15, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 50);

    doc.autoTable({
      startY: 60,
      head: [['Patient Details', 'Booking Details']],
      body: [
        [`Name: ${patient["Patient Name"]}\nAge/Sex: ${patient["Age"]}/${patient["Gender"]}\nMobile: ${patient["Mobile Number"]}`, 
         `Test: ${patient["Test Name"]}\nLab: ${patient["Lab Name"]}\nSlot: ${patient["Collection Date"]} | ${patient["Collection Time"]}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [30, 58, 138] }
    });

    doc.autoTable({
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

    doc.setFontSize(10); doc.setTextColor(100);
    doc.text("Thank you for choosing TestYaan. This is a computer-generated invoice.", 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

    doc.save(`Bill_${patient["Patient Name"]}.pdf`);
  };

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

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" placeholder="Search Patient Name or Mobile..." 
          style={{ padding: '15px', width: '100%', maxWidth: '450px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1e3a8a', color: 'white' }}>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Patient Info</th>
              <th style={thStyle}>Test Details</th>
              <th style={thStyle}>Payment Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter(b => 
                b["Patient Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                b["Mobile Number"]?.includes(searchTerm)
              )
              .map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>{b["Collection Date"]}</td>
                <td style={tdStyle}>
                  <strong style={{ color: '#0f172a' }}>{b["Patient Name"]}</strong><br/>
                  <small style={{ color: '#64748b' }}>{b["Mobile Number"]}</small>
                </td>
                <td style={tdStyle}>{b["Test Name"]}<br/><small style={{ color: '#1e40af' }}>{b["Lab Name"]}</small></td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: '700' }}>₹{b["Final Amount"]}</span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => setSelectedPatient(b)} style={editBtnStyle}>Pay / Edit</button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Payment Update</h3>
                <button onClick={() => setSelectedPatient(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <p>Patient: <b>{selectedPatient["Patient Name"]}</b></p>
            <p>Total Charge: <b>₹{selectedPatient["Final Amount"]}</b></p>
            
            <label style={{ fontSize: '14px' }}>Discount (₹):</label>
            <input type="number" style={inputStyle} placeholder="Enter discount amount" onChange={(e) => setPaymentData({...paymentData, discount: e.target.value})} />
            
            <label style={{ fontSize: '14px' }}>Amount Paid (₹):</label>
            <input type="number" style={inputStyle} placeholder="Enter collected amount" onChange={(e) => setPaymentData({...paymentData, paid: e.target.value})} />
            
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '15px', border: '1px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Balance Pending:</span>
                <strong style={{ color: 'red' }}>₹{parseFloat(selectedPatient["Final Amount"]) - (parseFloat(paymentData.discount) || 0) - (parseFloat(paymentData.paid) || 0)}</strong>
              </div>
            </div>

            <button onClick={handleUpdatePayment} style={btnStyle}>Save to Google Sheet</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const thStyle = { padding: '18px 15px', textAlign: 'left', fontSize: '14px' };
const tdStyle = { padding: '18px 15px', fontSize: '14px' };
const loginContainerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e2e8f0' };
const loginBoxStyle = { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' };
const inputStyle = { width: '100%', padding: '12px', marginTop: '8px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { width: '100%', marginTop: '10px', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' };
const logoutBtnStyle = { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const editBtnStyle = { background: '#f1f5f9', color: '#1e3a8a', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '8px', marginRight: '8px', cursor: 'pointer', fontWeight: '600' };
const billBtnStyle = { background: '#16a34a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };

export default AdminDashboard;