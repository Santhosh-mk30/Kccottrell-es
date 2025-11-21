
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip,   } from "recharts";


const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [employee, setEmployee] = useState(null);

  const navigate = useNavigate();
const employeeId = localStorage.getItem("employee_id");

  const [expanded, setExpanded] = useState(null);

  const handleExpand = (heading) => {
    setExpanded(expanded === heading ? null : heading);
  };

  const menu = [
    {
      title: "Dashboard",
      subItems: [
        { name: "Home", path: "/dashboard" },
        { name: "Analytics", path: "/analytics" },
        { name: "Reports", path: "/reports" },
      ],
    },
    {
       title: "Purchases",
  subItems: [
    // 🔹 Only show Vendors & Payment Advice for KCCES19107
    ...(employeeId === "KCCES19107"
      ? [
          { name: "Vendors", path: "/vendors" },
          { name: "Payment Advice", path: "/paymentadvice" },
          { name: "Purchase Order", path: "/certifypurchaseorder" }
        ]
      : []),

    // 🔹 Only show Certify for KCCES19014
    ...(employeeId === "KCCES19014"
      ? [{ name: "Certify Purchase Order", path: "/certifypurchaseorder" }]
      : []),

    // 🔹 Only show Verify for KCCES19002
    ...(employeeId === "KCCES19002"
      ? [{ name: "Verify Purchase Order", path: "/verifypurchaseorder" }]
      : []),

    // 🔹 Only show Purchase Order for KCCES19023
    ...(employeeId === "KCCES19023"
      ? [{ name: "Purchase Order", path: "/adminpurchaseorder" }]
      : []),

    // 🔹 Default everyone gets Purchase Order (except above handled cases)
    ...(employeeId !== "KCCES19023" &&
    employeeId !== "KCCES19002" &&
    employeeId !== "KCCES19014" &&
    employeeId !== "KCCES19107"
      ? [{ name: "Purchase Order", path: "/adminpurchaseorder" }]
      : []),
  ],
},
    {
      title: "Requests",
      subItems: [
        { name: "New Request", path: "/request" },
        { name: "Request History", path: "/requesthistory" },
      ],
    },
    {
      title: "Profile",
      subItems: [
        { name: "View Profile", path: "/profile" },
        { name: "Logout", path: "/logout" },
      ],
    },
  ];
  
useEffect(() => {
  if (employee) {
    if (employee.Designation) {
      localStorage.setItem("employee_designation", employee.Designation);
    }
    if (employee.Name) {
      localStorage.setItem("employee_name", employee.Name);
    }
    if (employee.Department) {
      localStorage.setItem("employee_department", employee.Department);
    }
  }
}, [employee]);



  const attendanceData = [
  { name: "On Time", value: 1254 },
  { name: "Late Attendance", value: 732 },
  { name: "Casual Leave", value: 658 },
  { name: "Permission", value: 714 },
  { name: "Sick Leave", value: 768 },
];
const COLORS = ["#2ecc71", "#f1c40f", "#3498db", "#e74c3c", "#9b59b6"];



  // useEffect(() => {
  //   fetch(
  //     "https://darkslategrey-shrew-424102.hostingersite.com/api/get_request.php"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setRequests(data);
  //       setFilteredRequests(data);
  //     })
  //     .catch((err) => console.error("Fetch error:", err));
  // }, []);


useEffect(() => {
  const employee_id = localStorage.getItem("employee_id");
  if (!employee_id) return;

  fetch(`https://darkslategrey-shrew-424102.hostingersite.com/api/get_domestic_trip_data.php?employee_id=${employee_id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setRequests(data.data);            // Save all trips
        setFilteredRequests(data.data);    // Initialize filtered trips
      }
    })
    .catch((err) => console.error(err));
}, []);

  useEffect(() => {
    const employeeId = localStorage.getItem("employee_id");
    if (!employeeId) return;

    fetch(`https://darkslategrey-shrew-424102.hostingersite.com/api/get_employee_data.php?employee_id=${employeeId.trim()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmployee(data.data); // API returns employee details
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!employee) return null; // show nothing if data not loaded

   const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    if (value === "All") setFilteredRequests(requests);
    else setFilteredRequests(requests.filter((item) => item.status === value));
  };

  const handleView = (item) => setSelected(item);
  
   const handleClose = () => {
    setSelected(null);
  };

  

  return (
    <div style={styles.container}>
     <nav style={styles.sideNav}>
      {/* Logo */}
      <img src="/logologin.png" alt="Logo" style={styles.logoSection} />

      {/* Menu */}
      <div style={styles.navLinksSection}>
        {menu.map((item, idx) => (
          <div key={idx}>
            <div
              style={styles.navItemHeading}
              onClick={() => handleExpand(item.title)}
            >
              {item.title}
            </div>
            {expanded === item.title && (
              <div style={styles.subMenu}>
                {item.subItems.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    style={styles.subNavItem}
                    onClick={() => navigate(sub.path)}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  

 
 <div style={{ padding: "50px" }}>

<div style={styles.topRow}>


  
 {/*   Employee ID Card    */}   


<div style={styles.idCard}>
  <div style={styles.idCardBody}>
    
    {/* Left side – Photo */}
    <div style={styles.photoSection}>
      <img 
        src={"/PROFILE.jpg"} 
        alt="Employee" 
        style={styles.photo} 
      />
    </div>

    {/* Right side – Details */}
   
<div style={styles.detailsSection}>
  <div style={styles.idRow}>
    <span style={styles.idLabel}>Name:</span>
    <span style={styles.idValue}>{employee.Name}</span>
  </div>
  <div style={styles.idRow}>
    <span style={styles.idLabel}>Designation:</span>
    <span style={styles.idValue}>{employee.Designation}</span>
  </div>
  <div style={styles.idRow}>
    <span style={styles.idLabel}>Intercom:</span>
    <span style={styles.idValue}>{employee.intercom}</span>
  </div>
  <div style={styles.idRow}>
    <span style={styles.idLabel}>Email:</span>
    <span style={styles.idValue}>{employee.Email}</span>
  </div>
  <div style={styles.idRow}>
    <span style={styles.idLabel}>Reporting Person:</span>
    <span style={styles.idValue}>{employee.reporting_person}</span>
  </div>
  <div style={styles.idRow}>
    <span style={styles.idLabel}>Date of Joined:</span>
    <span style={styles.idValue}>{employee.Joining_date}</span>
  </div>
</div>


  </div>
</div>

{/*   Attendance Overview    */}   

<div style={styles.attendanceCardHorizontal}>
  {/* Left side: Data + Legend */}
  <div style={styles.attendanceData}>
    <h3 style={styles.cardTitle}>Attendance Overview</h3>
    {attendanceData.map((item, index) => (
      <div key={index} style={styles.dataRow}>
        {/* Small color box */}
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            backgroundColor: COLORS[index % COLORS.length],
            marginRight: "8px",
            borderRadius: "10px",
          }}
        ></span>
        <span style={{ fontWeight: "600" }}>{item.name}:</span>
        <span style={{ marginLeft: 6 }}>{item.value}</span>
      </div>
    ))}
  </div>

  {/* Right side: Pie Chart */}
  <div style={styles.attendancePie}>
    <PieChart width={180} height={180}>
      <Pie
        data={attendanceData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        paddingAngle={1}
        stroke="#fff"
      >
        {attendanceData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
</div>


</div>


<div
  style={{
    display: "flex",
    gap: "20px",         // space between the two cards
    width: "85%",
    margin: "20px ",
    alignItems: "flex-start", // top-aligned
    justifyContent: "center", // center horizontally
  }}
>
  {/* Attendance Card */}
  <div style={{ flex: 1, minWidth: "300px" }}>
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header1}>
        <span style={styles.headerTitle}>Attendance</span>
        <h3 style={styles.headerTime}>11 Mar 2025</h3>
      </div>

      {/* Circular Chart */}
      <div style={styles.circleWrapper}>
        <div style={styles.circleOuter}>
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="54" stroke="#e6e6e6" strokeWidth="5" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="#2ecc71"
              strokeWidth="5"
              fill="none"
              strokeDasharray="339"
              strokeDashoffset="100"
              strokeLinecap="round"
            />
          </svg>
          <div style={styles.circleText}>
            <span style={{ fontSize: "13px", color: "#777" }}>Total Hours</span>
            <h4 style={{ margin: 0 }}>5:45:32</h4>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={styles.infoRow}>
        <span style={styles.infoBadge}>Production : 3.45 hrs</span>
      </div>
      <div style={styles.infoRow}>
        <img
          src="/fingerprint.png"
          alt="Fingerprint"
          style={{ width: "18px", height: "18px", marginRight: "6px", verticalAlign: "middle" }}
        />
        <span style={{ color: "#e74c3c" }}>Punch In at 09.30 AM</span>
      </div>

      {/* Punch Button */}
      <button style={styles.punchBtn}>Punch Out</button>
    </div>
  </div>

  {/* Trip Requests Table */}
  <div style={{ flex: 2, minWidth: "500px" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "340px",   // keeps scrollable area
    overflowY: "scroll",  // allow scrolling
    scrollbarWidth: "none", // for Firefox
    msOverflowStyle: "none", // for IE and Edge
    backgroundColor: "#FAF7EB",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
        borderRadius: "14px",
        padding: "15px",
        gap: "8px",
        marginTop:"20px",
      }}
    >
      {/* Filter */}
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: 500, fontSize: 14 }}>Status Filter:</label>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{
            padding: "5px 10px",
            borderRadius: "8px",
            border: "1px solid #e04a4aff",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="All">All</option>
          <option value="Certified">Certified</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button onClick={() => navigate("/request")} style={styles.addBtn}>
          + Trip Request
        </button>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          padding: "10px 15px",
          borderRadius: "12px",
          background: "linear-gradient(90deg, #e04a4aff 0%, #fc8282ff 100%)",
          color: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ flex: 1 }}>Project Code</div>
        <div style={{ flex: 2 }}>Project Name</div>
        <div style={{ flex: 1 }}>Status</div>
        <div style={{ flex: 1 }}>Action</div>
      </div>

      {/* Table Rows */}
      {filteredRequests.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            background: i % 2 === 0 ? "#fff" : "#fff7f3",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>{item.project_code}</div>
          <div style={{ flex: 2 }}>{item.project_name}</div>
          <div style={{ flex: 1 }}>
            <span
              style={{
                background:
                  item.status === "Certified"
                    ? "#2980b9"
                    : item.status === "Approved"
                    ? "#27ae60"
                    : item.status === "Rejected"
                    ? "#e74c3c"
                    : "#bdc3c7",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {item.status}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <button
              onClick={() => handleView(item)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#e04a4aff",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


 
 <div style={styles.timelineCard}>
  {/* Header with stats */}
  <div style={styles.header2}>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#ccc" }}></span>
      <span>Total Working hours</span>
      <h3>12h 36m</h3>
    </div>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#2ecc71" }}></span>
      <span>Productive Hours</span>
      <h3>08h 36m</h3>
    </div>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#f1c40f" }}></span>
      <span>Break hours</span>
      <h3>22m 15s</h3>
    </div>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#3498db" }}></span>
      <span>Overtime</span>
      <h3>02h 15m</h3>
    </div>
  </div>

  {/* Timeline Bar */}
  <div style={styles.timelineBar}>
    {/* Example Blocks */}
    <div style={{ ...styles.block, background: "#2ecc71", width: "20%" }}></div>
    <div style={{ ...styles.block, background: "#f1c40f", width: "5%" }}></div>
    <div style={{ ...styles.block, background: "#2ecc71", width: "25%" }}></div>
    <div style={{ ...styles.block, background: "#f1c40f", width: "10%" }}></div>
    <div style={{ ...styles.block, background: "#2ecc71", width: "20%" }}></div>
    <div style={{ ...styles.block, background: "#3498db", width: "5%" }}></div>
    <div style={{ ...styles.block, background: "#3498db", width: "5%" }}></div>
  </div>

  {/* Time Scale */}
  <div style={styles.timeScale}>
    {["06:00","07:00","08:00","09:00","10:00","11:00","12:00","01:00","02:00","03:00","04.00","05:00","06:00","07:00","08:00","09:00","10:00"].map((t) => (
      <span key={t}>{t}</span>
    ))}
  </div>
</div>
</div>



    


 {selected && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalCard}>
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>Trip Request Summary</h2>
      </div>

      <div style={styles.formContainer}>

        {/* Header Info */}
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Name</label>
            <input type="text" value={selected.name} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Employee Id</label>
            <input type="text" value={selected.employee_id} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Department</label>
            <input type="text" value={selected.department} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Project Code</label>
            <input type="text" value={selected.project_code} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>From</label>
            <input type="text" value={selected.from_date} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>To</label>
            <input type="text" value={selected.to_date} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Days</label>
            <input type="text" value={selected.days || ""} disabled style={styles.formInput} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nights</label>
            <input type="text" value={selected.nights || ""} disabled style={styles.formInput} />
          </div>
        </div>

        {/* Purpose Section */}
        <h4 style={styles.subTitle}>Purpose</h4>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.th}>Period</th>
              <th style={styles.th}>Place</th>
              <th style={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>{selected.days} DAYS</td>
              <td style={styles.td}>{selected.city || selected.state || "N/A"}</td>
              <td style={styles.td}>{selected.purpose_of_visit || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* Advance Required */}
        <h4 style={styles.subTitle}>Details</h4>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Calculation Details</th>
              <th style={styles.th}>Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Accommodation</td>
              <td style={styles.td}></td>
              <td style={styles.td}>{selected.entered_accommodation_amount || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Daily Allowance</td>
              <td style={styles.td}></td>
              <td style={styles.td}>{selected.daily_allowance || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Transportation</td>
              <td style={styles.td}></td>
              <td style={styles.td}>
                {selected.transport?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)}
              </td>
            </tr>
            <tr>
              <td style={styles.td}>Miscellaneous</td>
              <td style={styles.td}></td>
              <td style={styles.td}>
                {selected.expenses?.reduce((sum, e) => sum + parseFloat(e.value || 0), 0)}
              </td>
            </tr>
            <tr>
              <td style={styles.td} colSpan="2"><b>Total Advance Required</b></td>
              <td style={styles.td}>
                <b>
                  {(
                    parseFloat(selected.entered_accommodation_amount || 0) +
                    parseFloat(selected.daily_allowance || 0) +
                    (selected.transport?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0) +
                    (selected.expenses?.reduce((sum, e) => sum + parseFloat(e.value || 0), 0) || 0)
                  ).toFixed(2)}
                </b>
              </td>
            </tr>
          </tbody>
        </table>

       
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonGroup}>
     
        <button onClick={handleClose} style={styles.cancelBtn}>Close</button>
      </div>

      
    </div>
  </div>
)}

    </div>
  );
}

const styles = {
  container: {
    padding: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #e04a4aff, #dba9a9ff)", // subtle gradient
    backdropFilter: "blur(50px)",
    WebkitBackdropFilter: "blur(50px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
    borderRadius: "14px",
    display: "grid",
    gridTemplateColumns: "200px 1fr", // default 2-column
    minHeight: "100vh",
  },

 sideNav: {
    width: "220px",
     backgroundColor: "#FAF7EB",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.3)",
    display: "flex",
    flexDirection: "column",
    padding: "30px 20px",
    color: "#2c3e50"
  },

  logoSection: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "40px",
    color: "#3498db",
    userSelect: "none",
  },

  navLinksSection: {},
  navItemHeading: {
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    borderBottom: "1px solid #374151",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navItem: {
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    padding: "10px 12px",
    borderRadius: "10px",
    color: "#34495e",
    transition: "background-color 0.3s ease, color 0.3s ease",
    userSelect: "none",

    // hover effect using inline styles:
    // You can add logic in React for hover state or use CSS
  },
 arrow: {
    display: "inline-block",
    transition: "transform 0.2s",
  },
  subMenu: {
    paddingLeft: "15px",
    backgroundColor: "#FAF7EB",
  },
  subNavItem: {
    padding: "8px 10px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background 0.2s",
  },

  headerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
 
  
  filterWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  dropdown: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 8px",
  },
  header: {
    background: "#2980b9",
    color: "#fff",
    fontWeight: 600,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: "8px",
  },
  viewBtn: {
    padding: "4px 10px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },
  addBtn: {
    padding: "10px 16px",
    background: "linear-gradient(to right, #434343, #000000)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  /* Modal styles same as before */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxWidth: 800,
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    margin: 0,
  },
  detailGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  gridRow: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ccc",
    padding: "5px 0",
  },
  gridLabel: { fontWeight: "bold", width: "40%" },
  gridValue: { width: "60%" },
  buttonGroup: {
    marginTop: 20,
    textAlign: "right",
  },
  cancelBtn: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
 idCard: {
    width: "500px",
    borderRadius: "16px",
    padding: "20px",
    margin: "20px",
     backgroundColor: "#FAF7EB",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  },
  idCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },
  idCardTitle: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
    borderBottom: "1px solid #eee",
    paddingBottom: "12px",
    letterSpacing: "0.5px",
  },
  idCardBody: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  photoSection: {
    flexShrink: 0,
    marginRight: "20px",
  },
  photo: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    marginTop:"30px",
    border: "3px solid #e04a4aff",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease",
  },
  photoHover: {
    transform: "scale(1.05)",
  },
  detailsSection: {
    flex: 1,
    minWidth: "240px",
  },
    idRow: {
    marginBottom: "12px",  // Reduced gap between rows
    display: "flex",
    alignItems: "center",
  },
  idLabel: {
    fontWeight: "600",
    color: "black",
    width: "160px",  // Set a fixed width for the label
    fontSize: "15px",
    display: "inline-block",
  },
  idValue: {
    color: "black",
    fontSize: "15px",
    fontWeight: "500",
    wordBreak: "break-word",
    flex: 1,
    marginLeft: "0",  // No margin here for no gap
  },
  topRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start", // align top
    marginTop: "50px",
  },
    attendanceCardHorizontal: {
    display: "flex",
     backgroundColor: "#FAF7EB",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    gap: "150px",
    marginTop:"20px",
    height:"200px",
    color: "black",
  },
  attendanceData: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 10,
  },
  dataRow: {
    fontSize: 14,
    color: "black",
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  attendancePie: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
   card: {
    borderRadius: "8px",
    padding: "20px",
    width: "350px",
    marginBottom:"90px",
    margin: "20px",
     backgroundColor: "#FAF7EB",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    textAlign: "center",
  },
  header1: {
    marginBottom: "15px"
  },
  headerTitle: {
    fontSize: "14px",
    color: "black"
  },
  headerTime: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "5px",
    color: "black   "
  },
  circleWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0"
  },
  circleOuter: {
    position: "relative",
    width: "120px",
    height: "120px"
  },
  circleText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center"
  },
  infoRow: {
    margin: "10px 0"
  },
  infoBadge: {
    background: "#333",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600"
  },
  punchBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    background: "#e04a4aff",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
 timelineCard: {
    borderRadius: "8px",
     backgroundColor: "#FAF7EB",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    padding: "20px",
    maxWidth: "1200px",
    margin: "20px",
    width:"1200px",
  },
  header2: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  stat: {
    textAlign: "center",
    flex: 1
  },
  dot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "6px"
  },
  timelineBar: {
    display: "flex",
    height: "20px",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "8px"
  },
  block: {
    height: "100%"
  },
  timeScale: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#777"
  },
   formContainer: { padding: '20px' },
sectionTitle: { fontSize: '20px', marginBottom: '15px', textAlign: 'center' },
subTitle: { fontSize: '16px', margin: '15px 0 10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' },
formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
formGroup: { display: 'flex', flexDirection: 'column' },
formLabel: { fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' },
formInput: { padding: '8px', border: '1px solid #ccc', borderRadius: '6px', background: '#f9f9f9' },
tableStyle: { width: '100%', borderCollapse: 'collapse', marginBottom: '15px' },
th: { border: '1px solid #ccc', padding: '8px', background: '#f2f2f2', textAlign: 'center' },
td: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' },
signatureRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', fontSize: '14px' },


};

export default Dashboard;

