import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  container: { padding: 20, backgroundColor: "#f7f9fc", fontFamily: "'Segoe UI', sans-serif" },
 

  viewButton: { padding: "6px 12px", background: "#edf2f7", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, color: "#2d3748" },
  status: { padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: "bold", color: "#fff", display: "inline-block", textAlign: "center", textTransform: "capitalize" },
   modal: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000, overflowY: "auto",
  },
  invoiceA4: {
    background: "#fff",
    width: "210mm", minHeight: "297mm",   // A4 size
    padding: "20mm", boxSizing: "border-box",
    borderRadius: 6, position: "relative",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: 14, lineHeight: 1.5,
    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
  },
  closeModal: {
    position: "absolute", top: 10, right: 15, cursor: "pointer",
    fontSize: 20, fontWeight: "bold", color: "#555",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  infoBlock: {
    display: "flex", justifyContent: "space-between",
    padding: "10px 0", marginBottom: 10,
  },
  table: {
    width: "100%", borderCollapse: "collapse", marginTop: 10,
  },
  th: {
    border: "1px solid #ddd", padding: 8,
    fontWeight: "600", textAlign: "center",
    backgroundColor: "#f8f9fa", fontSize: 13,
  },
  td: {
    border: "1px solid #ddd", padding: 8,
    fontSize: 13,
  },
  totalTable: {
    width: "45%", borderCollapse: "collapse",
  },
  totalLabel: {
    border: "1px solid #ddd", padding: 8,
    textAlign: "left", fontWeight: 500,
  },
  totalValue: {
    border: "1px solid #ddd", padding: 8,
    textAlign: "right", fontWeight: 500,
  },
  certifyBtn: { padding: "10px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  verifyBtn: { padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  rejectBtn: { padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },

  itemTable: { width: "100%", borderCollapse: "collapse", marginTop: 10, marginBottom: 10 },
 
};

const statusColor = {
  pending: "#f6ad55",
  Approve: "#38a169",
  Certify: "blue",
  Reject:"#f56565",
};
const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);


  useEffect(() => {
    axios
      .get("https://darkslategrey-shrew-424102.hostingersite.com/api/verify_purchase_orders.php")
      .then((res) => {
        if (Array.isArray(res.data)) setOrders(res.data);
        else if (res.data.data && Array.isArray(res.data.data)) setOrders(res.data.data);
        else setOrders([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  
  const handleAction = async (id, actionType) => {
  try {
    const response = await axios.post("https://darkslategrey-shrew-424102.hostingersite.com/api/update_purchase.php", {
      purchase_id: id,
      action: actionType, // "certify" or "reject"
    });

   
    if (response.data.success) {
      alert(`${actionType.toUpperCase()} successful!`);
      setModalData(null); // close modal
      window.location.reload(); // refresh page to show updated status
    } else {
      alert(`Failed: ${response.data.error}`);
    }
  } catch (error) {
    console.error(error);
    alert("Error updating status");
  }
};


  if (loading) return <div style={styles.container}>Loading...</div>;



  return (
    <div style={styles.container}>
      <h2>Purchase Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Bill Date</th>
            <th style={styles.th}>Supplier Name</th>
            <th style={styles.th}>Invoice Number</th>
            <th style={styles.th}>Admin No</th>
            <th style={styles.th}>Bill No</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td style={styles.td}>{order.bill_date}</td>
              <td style={styles.td}>{order.supplier_name}</td>
              <td style={styles.td}>{order.invoice_number}</td>
              <td style={styles.td}>{order.admin_no}</td>
              <td style={styles.td}>{order.bill_no}</td>
              <td style={styles.td}>
               <span
  style={{
    ...styles.status,
    backgroundColor: statusColor[order.status?.toLowerCase()] || "#718096", // fallback color
  }}
>
  {order.status}
</span>

              </td>
              <td style={styles.td}>
                <button style={styles.viewButton} onClick={() => setModalData(order)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

 {modalData && (
  <div style={styles.modal} onClick={() => setModalData(null)}>
    <div style={styles.invoiceA4} onClick={(e) => e.stopPropagation()}>
      <span style={styles.closeModal} onClick={() => setModalData(null)}>×</span>

   {/* ---------- HEADER WITH LOGO ---------- */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 10,
    marginTop:30,
  }}
>
  {/* Logo - Left */}
  <div>
    <img src="/logologin.png" alt="Logo" style={{ width: 180 }} />
  </div>

  {/* Company Info - Right */}
  <div style={{ textAlign: "right" }}>
    <h3 style={{ margin: 0, fontSize: 18 }}>
      KC Cottrell Engineering Services Private Limited
    </h3>
    <p style={{ margin: "3px 0", fontSize: 13 }}>
      A16&A17 R R tower IV, 7th Floor, Thiru Vi Ka Industrial Estate,
    </p>
     <p style={{ margin: "3px 0", fontSize: 13 }}>
      Guindy, Chennai-600032, GSTIN/UIN; 33AAHCK5828Q1ZX
    </p>
    <p style={{ margin: "3px 0", fontSize: 13 }}>Phone: +91 XXXXX XXXXX</p>
  </div>
</div>

      <hr style={{ margin: "15px 0", border: "1px solid #ccc" }} />

      {/* ---------- TITLE ---------- */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, margin: 0, letterSpacing: 1 }}>
          {modalData.type === "purchase_order" ? "PURCHASE ORDER" : "PURCHASE INVOICE"}
        </h1>
      </div>
 {/* ---------- INFO BLOCK ---------- */}
      <div style={styles.infoBlock}>
        <div>
          <p><strong>Supplier:</strong> {modalData.supplier_name}</p>
          <p><strong>ERP No:</strong> {modalData.admin_no}</p>
          <p><strong>Invoice No:</strong> {modalData.bill_no}</p>
        </div>
        <div>
          <p><strong>Bill Date:</strong> {modalData.bill_date}</p>
          <p><strong>Mode:</strong> {modalData.mode_of_transaction}</p>
          <p><strong>Payment Type:</strong> {modalData.payment_type}</p>
        </div>
      </div>

      {/* ---------- ITEMS TABLE ---------- */}
      {Array.isArray(modalData.items) && modalData.items.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>HSN/SAC</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>Per</th>
              <th style={styles.th}>{modalData.items[0]?.amount ? "Amount" : "Basic Value"}</th>
              <th style={styles.th}>GST %</th>
            </tr>
          </thead>
          <tbody>
            {modalData.items.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td style={styles.td}>{item.item || "-"}</td>
                <td style={styles.td}>{item.hsnSac || "-"}</td>
                <td style={{ ...styles.td, textAlign: "center" }}>{item.quantity || "-"}</td>
                <td style={{ ...styles.td, textAlign: "right" }}>{item.rate || "-"}</td>
                <td style={{ ...styles.td, textAlign: "center" }}>{item.per || "-"}</td>
                <td style={{ ...styles.td, textAlign: "right" }}>{item.amount ?? item.basicValue ?? "-"}</td>
                <td style={{ ...styles.td, textAlign: "center" }}>{item.gst_amount || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------- TOTALS ---------- */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <table style={styles.totalTable}>
          <tbody>
            <tr><td style={styles.totalLabel}>Reimbursement</td><td style={styles.totalValue}>₹{modalData.reimbursement}</td></tr>
            <tr><td style={styles.totalLabel}>TDS Rate</td><td style={styles.totalValue}>{modalData.tds_rate}</td></tr>
            <tr><td style={styles.totalLabel}>Adjustment</td><td style={styles.totalValue}>-₹{modalData.adjustment}</td></tr>
            <tr style={{ background: "#f3f4f6", fontWeight: "bold" }}>
              <td style={styles.totalLabel}>Total Amount</td>
              <td style={styles.totalValue}>₹{modalData.total_amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- EXTRA INFO ---------- */}
      <div style={{ marginTop: 20 }}>
        <p><strong>Sanction Amount:</strong> ₹{modalData.sanction_amount}</p>
        <p><strong>In Favour Of:</strong> {modalData.in_favour_of}</p>
      </div>

      {/* ---------- SIGNATURES ---------- */}
      <div style={{ marginTop: 50, display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "center" }}>
          <p>________________________</p>
          <p style={{ marginTop: -10 }}>Certified By</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p>________________________</p>
          <p style={{ marginTop: -10 }}>Verified By</p>
        </div>
      </div>

 

      {/* ---------- ACTION BUTTONS ---------- */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 30 }}>
        {localStorage.getItem("employee_id") === "KCCES19014" && (
          <button style={styles.certifyBtn} onClick={() => handleAction(modalData.id, "certify")}>Certify</button>
        )}
        {localStorage.getItem("employee_id") === "KCCES19002" && (
          <button style={styles.verifyBtn} onClick={() => handleAction(modalData.id, "verify")}>Verify</button>
        )}
        {(localStorage.getItem("employee_id") === "KCCES19014" ||
          localStorage.getItem("employee_id") === "KCCES19002") && (
          <button style={styles.rejectBtn} onClick={() => handleAction(modalData.id, "reject")}>Reject</button>
        )}
      </div>
    </div>
  </div>
)}




    </div>
  );
};

export default PurchaseOrderList;
