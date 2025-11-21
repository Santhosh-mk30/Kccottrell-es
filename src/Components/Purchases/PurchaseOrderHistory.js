import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const styles = {
  container: { padding: 20, backgroundColor: "#f7f9fc", fontFamily: "'Segoe UI', sans-serif" },
  viewButton: { padding: "6px 12px", background: "#edf2f7", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, color: "#333" },
  status: { padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: "bold", color: "#fff", display: "inline-block", textAlign: "center", textTransform: "capitalize" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 10 },
  th: { border: "1px solid #ddd", padding: 8, fontWeight: "400", textAlign: "center", backgroundColor: "#f8f9fa", fontSize: 13 },
  td: { border: "1px solid #ddd", padding: 8, fontSize: 13 },
  filterContainer: { display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" },
  input: { padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", width: "40%" },
  select: { padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" },
  pagination: { display: "flex", justifyContent: "center", marginTop: 20, gap: 10 },
  pageBtn: { padding: "6px 12px", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer", background: "#fff" },
  activePageBtn: { background: "#3182CE", color: "#fff", border: "1px solid #3182CE" },
};

const statusColor = {
  pending: "#f6ad55",
  approve: "#38a169",
  certify: "#3b82f6",
  reject: "#f56565",
};

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailedData, setDetailedData] = useState(null);

  const itemsPerPage = 20;
  const printRef = useRef();

const [supplierName, setSupplierName] = useState("");

useEffect(() => {
  axios
    .get("https://darkslategrey-shrew-424102.hostingersite.com/api/get_purchase_order.php")
    .then((res) => {
      let data = [];

      if (Array.isArray(res.data)) data = res.data;
      else if (res.data.data && Array.isArray(res.data.data)) data = res.data.data;

      setOrders(data);

      // ✅ Assuming supplier name is inside first record (adjust key name if different)
      if (data.length > 0 && data[0].supplier_name) {
        setSupplierName(data[0].supplier_name);
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching purchase orders:", err);
      setOrders([]);
      setSupplierName("");
      setLoading(false);
    });
}, []);


 const handleView = async (order) => {
  setModalData(order);
  try {
    const res = await axios.get(
      `https://darkslategrey-shrew-424102.hostingersite.com/api/get_purchase_order_details.php?order_no=${order.order_no}`
    );

    // ✅ Handle both array and object responses safely
    if (res.data && Array.isArray(res.data.items)) {
      setDetailedData({ ...order, items: res.data.items });
    } else {
      setDetailedData(res.data || order);
    }
  } catch (error) {
    console.error("Error fetching full order details:", error);
    setDetailedData(order);
  }
};


  
const handlePrint = () => {
  if (!printRef.current) return;

  const printContent = printRef.current.innerHTML;
  const printWindow = window.open("", "_blank", "width=900,height=650");

  // ✅ Company info
  const companyName = "KC Cottrell Engineering Services Private Limited";
  const logoPath = `${window.location.origin}/logologin.png`; // Adjust path if needed

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Purchase Order ${modalData?.order_no}</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            background-color: #fff;
          }

          /* ✅ Header */
          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ddd;
            background: white;
            padding: 10px 20px;
            z-index: 999;
          }

          .print-header img {
            width: 150px;
            height: auto;
            object-fit: contain;
          }

          .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #222;
            text-align: right;
            margin: 0;
          }

          /* ✅ Footer */
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 18px;
            border-top: 1px solid #ddd;
            background: white;
            text-align: center;
            font-size: 12px;
            padding: 10px 20px;
            line-height: 1.4;
            z-index: 999;
          }

          .footer-line1 {
            font-weight: 400;
          }

          .footer-line1 span {
            font-weight: 700;
          }

          .footer-line2 {
            font-size: 11px;
            color: #555;
          }

          /* ✅ Main body area */
          .print-body {
            margin: 190px 20px 90px 20px; /* space for header & footer */
            position: relative;
            z-index: 1;
          }

          /* ✅ Prevent overlap on multi-page print */
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            .print-body {
              margin-top: 120px !important; /* Header height + spacing */
              margin-bottom: 90px !important; /* Footer height + spacing */
            }

            .print-header,
            .print-footer {
              position: fixed;
            }

            /* Prevent breaking inside important blocks */
            table, tr, td, th, div, p {
              page-break-inside: avoid !important;
            }
          }
        </style>
      </head>

      <body>
        <!-- Header -->
        <div class="print-header">
          <img src="${logoPath}" alt="Company Logo" id="print-logo" />
          <div class="company-name">${companyName}</div>
        </div>

        <!-- Footer -->
        <div class="print-footer">
          <div class="footer-line1">
            <span>Registered Office:</span> Super A16 & A17, RR Tower 4, 7th Floor,
            Thiru-vi-ka Industrial Estate, Guindy, Chennai - 600 032
          </div>
          <div class="footer-line2">CIN# U29110TN2019FTC128697</div>
        </div>

        <!-- Main Content -->
        <div class="print-body">
          ${printContent}
        </div>

        <script>
          const logo = document.getElementById('print-logo');
          if (logo.complete) {
            window.print();
            window.close();
          } else {
            logo.onload = () => {
              window.print();
              window.close();
            };
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};



  if (loading) return <div style={styles.container}>Loading...</div>;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_no?.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "" || order.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={styles.container}>
      <h4
  style={{
    marginBottom: 20,
    fontSize: "18px", // 👈 Adjust as needed (e.g., 16px, 20px)
    fontWeight: "400",
    color: "#1a202c",
  }}
>
  Purchase Order History
</h4>


      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by Supplier or Order No"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.input}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="certify">Certified</option>
          <option value="approve">Approved</option>
          <option value="reject">Rejected</option>
        </select>
      </div>

      {/* 📋 Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Order No</th>
            <th style={styles.th}>Supplier Name</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Pending With</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order, index) => (
              <tr key={index}>
                <td style={styles.td}>{order.purchase_date || "-"}</td>
                <td style={styles.td}>{order.order_no || "-"}</td>
                <td style={styles.td}>{order.supplier_name || "-"}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      backgroundColor: statusColor[order.status?.toLowerCase()] || "#718096",
                    }}
                  >
                    {order.status || "Pending"}
                  </span>
                </td>
                <td style={styles.td}>
                  {order.status?.toLowerCase() === "pending"
                    ? "N.Yogarani"
                    : order.status?.toLowerCase() === "certify"
                    ? "R.Singaravelu"
                    : order.status?.toLowerCase() === "approve"
                    ? "Payment Process"
                    : "-"}
                </td>
                <td style={styles.td}>
                  <button style={styles.viewButton} onClick={() => handleView(order)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.td} colSpan="6" align="center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

     
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            style={{
              ...styles.pageBtn,
              ...(currentPage === i + 1 ? styles.activePageBtn : {}),
            }}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 🪟 Modal */}
      {modalData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              width: "80%",
              height: "90%",
              overflowY: "auto",
              padding: 20,
            }}
          >
 <div ref={printRef} style={{ padding: 20 }}>
  <h2
    style={{
      textAlign: "center",
      marginBottom: 10,
      fontSize: 18,
      fontWeight: "bold",
      color: "#1a202c",
      paddingBottom: 6,
      marginTop:10,
    }}
  >
    PURCHASE ORDER
  </h2>

  {detailedData ? (
  <>
    {/* 🔹 MAIN BOX — Supplier, Purchaser & Reference */}
    <div
      style={{
        border: "1px solid #4a5568",
        borderRadius: "8px",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 0 4px rgba(0,0,0,0.15)",
      }}
    >
      {/* 🔹 FIRST ROW — Supplier vs Purchase Order Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid #4a5568",
          position: "relative",
        }}
      >
        {/* Divider Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: "0px",
            backgroundColor: "#4a5568",
          }}
        ></div>

        {/* LEFT — Supplier Details */}
        <div style={{ borderRight: "1px solid #4a5568" }}>
          <div
            style={{
              background: "#e9f3fc",
              borderBottom: "1px solid #4a5568",
              padding: "8px 12px",
              fontWeight: "600",
              fontSize: 15,
              color: "#1a202c",
            }}
          >
            SUPPLIER
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", padding: 12 }}>
            <tbody>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", fontSize: "13px" }}>Supplier Name:</td>
    <td style={{ padding: "8px", fontSize: "13px" }}>{detailedData.supplier_name || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", fontSize: "13px" }}>Address:</td>
    <td style={{ padding: "8px", fontSize: "13px" }}>{detailedData.address || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", fontSize: "13px" }}>Branch:</td>
    <td style={{ padding: "8px", fontSize: "13px" }}>{detailedData.branch_name || "-"}</td>
  </tr>
</tbody>

          </table>
        </div>

        {/* RIGHT — Purchase Order Details */}
        <div>
          <div
            style={{
              background: "#e9f3fc",
              borderBottom: "1px solid #4a5568",
              padding: "8px 12px",
              fontWeight: "600",
              fontSize: 15,
              color: "#1a202c",
            }}
          >
            Purchase Order Details
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", padding: 12 }}>
           <tbody style={{ fontSize: "15px", color: "#333", lineHeight: "1.4" }}>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", width: "40%", color: "#1a202c" }}>
      Order No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.order_no || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      Date:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.purchase_date || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      Goods & Services:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.goods_services || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      Quantity:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.qty || "-"}</td>
  </tr>
</tbody>

          </table>
        </div>
      </div>

      {/* 🔹 SECOND ROW — Supplier & Purchaser Contact Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid #4a5568",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: "0px",
            backgroundColor: "#4a5568",
          }}
        ></div>

        {/* LEFT — Supplier Contact */}
        <div style={{ borderRight: "1px solid #4a5568" }}>
          <div
            style={{
              background: "#e9f3fc",
              borderBottom: "1px solid #4a5568",
              padding: "8px 12px",
              fontWeight: "600",
              fontSize: 15,
              color: "#1a202c",
            }}
          >
            Supplier Details
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", padding: 12 }}>
           <tbody style={{ fontSize: "15px", color: "#333", lineHeight: "1.4" }}>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", width: "40%", color: "#1a202c" }}>
      Contact Person:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.supplier_contactPerson1|| "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      Mobile No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.supplier_mobile1 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      Email:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.supplier_email1 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      GST No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.supplier_gst1 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#1a202c" }}>
      PAN No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.supplier_pan || "-"}</td>
  </tr>
</tbody>

          </table>
        </div>

        {/* RIGHT — Purchaser Details */}
        <div>
          <div
            style={{
              background: "#e9f3fc",
              borderBottom: "1px solid #4a5568",
              padding: "8px 12px",
              fontWeight: "600",
              fontSize: 15,
              color: "#1a202c",
            }}
          >
            Purchaser Details
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", padding: 12 }}>
           <tbody style={{ fontSize: "15px", color: "#333", lineHeight: "1.4" }}>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", width: "40%", color: "#333" }}>
      Contact Person:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.purchaser_contactPerson2 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#333" }}>
      Mobile No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.purchaser_mobile2 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#333" }}>
      Email:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.purchaser_email2 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#333" }}>
      GST No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.purchaser_gst2 || "-"}</td>
  </tr>
  <tr>
    <td style={{ padding: "8px", fontWeight: "bold", color: "#333" }}>
      PAN No:
    </td>
    <td style={{ padding: "8px" }}>{detailedData.purchaser_pan2 || "-"}</td>
  </tr>
</tbody>

          </table>
        </div>
      </div>

      {/* 🔹 Reference Section */}
      <div style={{ borderTop: "1px solid #4a5568" }}>
        <div
          style={{
            background: "#e9f3fc",
            borderBottom: "1px solid #4a5568",
            padding: "8px 12px",
            fontWeight: "600",
            fontSize: 15,
            color: "#1a202c",
          }}
        >
          Reference
        </div>
        <div style={{ padding: "12px", fontSize: 14, lineHeight: 1.6, color: "#333" }}>
          {detailedData.reference || "No reference provided"}
        </div>
      </div>
    </div>

    {/* 🔹 Dear Sir/Mam Section (OUTSIDE TABLE BOX) */}
    <div
      style={{
        padding: "16px 20px",
        marginTop: "10px",
      }}
    >
      <p
        style={{
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: "8px",
        }}
      >
        Dear Sir/Mam,
      </p>
      <div
        style={{
          padding: "10px 14px",
          minHeight: "60px",
          color: "#333",
          lineHeight: 1.6,
        }}
      >
        {detailedData.editableText || "No message provided."}
      </div>
    </div>







     <div
      style={{
        padding: "16px 20px",
        marginTop: "16px",
        
      }}
    >
      <p
        style={{
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: "8px",
        }}
      >
      
      </p>
      <div
        style={{
          padding: "10px 14px",
          minHeight: "60px",
          color: "#333",
          lineHeight: 1.6,
        }}
      >
       
      </div>
    </div>

    
{/* A. Prices & Scope of Supply */}
<div
 style={{
    padding: "8px 10px 0px 10px", // 👈 bottom padding removed
    marginTop: "0px", // 👈 no top margin at all
  }}
>
  <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 no top margin (prevents collapse)
    }}
  >
    A. Prices & Scope of Supply
  </p>
  <div
    style={{
      padding: "10px 14px",
      minHeight: "10px",
      color: "#333",
      lineHeight: 1.6,
      marginBottom: 0, // 👈 ensures no extra gap below
    }}
  >
    {detailedData.priceText || "No message provided."}
  </div>
</div>

{/* B. Technical Specification */}
<div
  style={{
    padding: "8px 10px 0px 10px", // 👈 bottom padding removed
    marginTop: "0px", // 👈 no top margin at all
  }}
>
  <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    B. Technical Specification
  </p>
  <div
    style={{
      padding: "10px 14px",
      minHeight: "10px",
      color: "#333",
      lineHeight: 1.6,
      marginBottom: 0, // 👈 no bottom margin
    }}
  >
    {detailedData.techText || "No message provided."}
  </div>
</div>



<div
  style={{
    padding: "8px 10px 0px 10px", // 👈 bottom padding removed
    marginTop: "0px", // 👈 no top margin at all
  }}
>
  <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 8px 0", // 👈 remove default top margin of <p>
    }}
  >
    C. Special Conditions:
  </p>

   <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    1. Price Base:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.1, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText || "No message provided."}
</div>

 <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    2. Delivery Schedule:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText1 || "No message provided."}
</div>

<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    3. Payment Terms:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText2 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    4. Taxes & Duties:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 0.8, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText3 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    5. Consignee Details:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText4 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    6. Invoice/Billing Address:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText5 || "No message provided."}
</div>

<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    7. Freight & Insurance:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText6 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    8. Guarantee:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText7 || "No message provided."}
</div>
</div>

     <div
      style={{
        padding: "16px 20px",
        marginTop: "16px",
        
      }}
    >
      <p
        style={{
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: "8px",
        }}
      >
      
      </p>
      <div
        style={{
          padding: "10px 14px",
          minHeight: "60px",
          color: "#333",
          lineHeight: 1.6,
        }}
      >
       
      </div>
    </div>


<div
  style={{
    padding: "8px 10px 0px 10px", // 👈 bottom padding removed
    marginTop: "0px", // 👈 no top margin at all
  }}
>
   <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    9. Dispatch Instruction:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.1, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText8 || "No message provided."}
</div>

 <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    10. Dispatch Documents:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText9 || "No message provided."}
</div>

<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    11. Packing,Identification & Markings:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText10 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    12. Responsibility:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.3, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText11 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    13.Technical & Quality:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText12 || "No message provided."}
</div>
<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    14. Rectification:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText13|| "No message provided."}
</div>

<p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 1px 0", // 👈 remove default top margin of <p>
    }}
  >
    15.Cancellation:
  </p>
 <div
  style={{
    padding: "8px 14px",
    minHeight: "10px",
    color: "#333",
    lineHeight: 1.2, // 👈 reduced from 1.6 to 1.3
    whiteSpace: "pre-line", // keeps 1.1, 1.2 in new lines
  }}
>
  {detailedData.descriptionText14 || "No message provided."}
</div>

 {/* --- 16. Jurisdiction --- */}
  <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "0 0 2px 0",
    }}
  >
    16. Jurisdiction:
  </p>
  <div
    style={{
      padding: "6px 14px",
      minHeight: "10px",
      color: "#333",
      lineHeight: 1.3,
      whiteSpace: "pre-line",
    }}
  >
    {detailedData.descriptionText15 || "No message provided."}
  </div>
</div>


<div
      style={{
        padding: "16px 20px",
        marginTop: "36px",
        
      }}
    >
      <p
        style={{
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: "8px",
        }}
      >
      
      </p>
      <div
        style={{
          padding: "10px 14px",
          minHeight: "30px",
          color: "#333",
          lineHeight: 1.6,
        }}
      >
       
      </div>
    </div>
 
 

  {/* --- 17. Sub-Contracting --- */}
  <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "6px 0 2px 0",
    }}
  >
    17. Sub-Contracting:
  </p>
  <div
    style={{
      padding: "6px 14px",
      minHeight: "10px",
      color: "#333",
      lineHeight: 1.3,
      whiteSpace: "pre-line",
    }}
  >
    {detailedData.descriptionText16 || "No message provided."}
  </div>

  {/* --- 18. Acceptance --- */}
  <p
    style={{
      fontWeight: "bold",
      color: "#1a202c",
      margin: "6px 0 2px 0",
    }}
  >
    18. Acceptance:
  </p>
  <div
    style={{
      padding: "6px 14px",
      minHeight: "10px",
      color: "#333",
      lineHeight: 1.3,
      whiteSpace: "pre-line",
    }}
  >
    {detailedData.descriptionText17 || "No message provided."}
  </div>

  {/* --- Signatures Section --- */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: "40px",
    }}
  >
    {/* LEFT SIDE */}
    <div style={{ width: "45%", textAlign: "left" }}>
      <p style={{  marginBottom: "4px" }}>
        For K C Cottrell Engineering & Services Pvt. Ltd.,
      </p>
      <div style={{ marginTop: "60px" }}>
        <p style={{ marginBottom: "2px", fontWeight: "500" }}>
          Authorized Signatory
        </p>
        <p style={{ marginBottom: "2px" }}>Singaravelu R</p>
        <p style={{ marginBottom: "0px" }}>Director</p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div style={{ width: "45%", textAlign: "right" }}>
      <p style={{ marginBottom: "4px" }}>
        Received & Accepted For {supplierName || "____________________"}
      </p>
      <div style={{ marginTop: "60px" }}>
        <p style={{ marginBottom: "2px" }}>(Authorized Signatory)</p>
        <p style={{ marginBottom: "0px" }}>Name & Official Seal</p>
      </div>
    </div>
  </div>

  {/* --- Attachment Section --- */}
  <div
    style={{
      marginTop: "40px",
      paddingLeft: "14px",
      fontWeight: "500",
      color: "#1a202c",
    }}
  >
    <p>
      <strong>Attachment:</strong> 1. Annexure A: Price Break-Up
    </p>
  </div>

 <div
      style={{
        padding: "16px 20px",
        marginTop: "16px",
        
      }}
    >
      <p
        style={{
          fontWeight: "bold",
          color: "#1a202c",
          marginBottom: "8px",
        }}
      >
      
      </p>
      <div
        style={{
          padding: "10px 14px",
          minHeight: "30px",
          color: "#333",
          lineHeight: 1.6,
        }}
      >
       
      </div>
    </div>

<div
  style={{
    padding: "16px 20px",
    marginTop: "16px",
  }}
>
{/* --- Annexure - A : Price Break-Up --- */}
{detailedData?.items && detailedData.items.length > 0 && (
  <div
    style={{
      marginTop: "80px",
      padding: "0 20px",
    }}
  >
    <h3
      style={{
        textAlign: "center",
        textDecoration:"underline",
        padding: "8px",
        borderRadius: "6px",
        fontWeight: "bold",
        color: "#1a202c",
      }}
    >
      Annexure - A : Price Break-Up
    </h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "#f1f5f9",
            borderBottom: "2px solid #4a5568",
            textAlign: "left",
          }}
        >
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>S.No</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>HSN / SAC</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>Per</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>Rate</th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>Quantity</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>Amount</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>GST %</th>
          <th style={{ padding: "8px", border: "1px solid #ccc" }}>GST Amount</th>
        </tr>
      </thead>

      <tbody>
        {detailedData.items.map((item, index) => (
          <tr key={index}>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>{index + 1}</td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.item}</td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.hsnSac}</td>
                       <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              {item.per}
            </td>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                textAlign: "right",
              }}
            >
              {item.rate}
            </td>
             <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              {item.quantity}
            </td>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                textAlign: "right",
              }}
            >
              {item.amount}
            </td>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
            >
              {item.gstPercent}
            </td>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                textAlign: "right",
              }}
            >
              {item.gstAmount}
            </td>
          </tr>
        ))}

        {/* --- Total & Grand Total Rows --- */}
        {(() => {
          const totalAmount = detailedData.items.reduce(
            (sum, item) => sum + parseFloat(item.amount || 0),
            0
          );
          const totalGST = detailedData.items.reduce(
            (sum, item) => sum + parseFloat(item.gstAmount || 0),
            0
          );
          const grandTotal = totalAmount + totalGST;

          return (
            <>
              <tr style={{ fontWeight: "bold", backgroundColor: "#f9fafb" }}>
                <td
                  colSpan="6"
                  style={{ textAlign: "right", padding: "8px", border: "1px solid #ccc" }}
                >
                  Total
                </td>
                <td style={{ textAlign: "right", padding: "8px", border: "1px solid #ccc" }}>
                  {totalAmount.toFixed(2)}
                </td>
                <td style={{ textAlign: "center", padding: "8px", border: "1px solid #ccc" }}>—</td>
                <td style={{ textAlign: "right", padding: "8px", border: "1px solid #ccc" }}>
                  {totalGST.toFixed(2)}
                </td>
              </tr>

              <tr style={{ fontWeight: "bold", backgroundColor: "#e2e8f0" }}>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    border: "1px solid #ccc",
                  }}
                >
                  Grand Total (Amount + GST)
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    border: "1px solid #ccc",
                  }}
                >
                  {grandTotal.toFixed(2)}
                </td>
              </tr>
            </>
          );
        })()}
      </tbody>
    </table>
  </div>
)}

</div>

  </>
) : (
  <p>Loading details...</p>
)}

</div>





            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                onClick={handlePrint}
                style={{
                  ...styles.viewButton,
                  background: "#2b6cb0",
                  color: "#fff",
                }}
              >
                Print
              </button>
              <button
                onClick={() => {
                  setModalData(null);
                  setDetailedData(null);
                }}
                style={{
                  ...styles.viewButton,
                  background: "#e53e3e",
                  color: "#fff",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;









