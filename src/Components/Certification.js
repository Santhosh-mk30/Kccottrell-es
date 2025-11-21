import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip,   } from "recharts";

const Certifications = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch('https://darkslategrey-shrew-424102.hostingersite.com/api/get_request.php')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setFilteredRequests(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);


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
    if (value === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(item => item.status === value));
    }
  };

  const handleView = (item) => {
    setSelected(item);
  };

  const handleClose = () => {
    setSelected(null);
  };

  const updateStatus = (id, newStatus) => {
    const payload = { id, status: newStatus };

    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/update_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const updated = requests.map(req =>
            String(req.id) === String(id) ? { ...req, status: newStatus } : req
          );
          setRequests(updated);

          const filtered = filterStatus === 'All'
            ? updated
            : updated.filter(item => item.status === filterStatus);
          setFilteredRequests(filtered);

          setSelected(null);
        } else {
          alert("Update failed");
        }
      })
      .catch(() => {
        alert("Network error occurred");
      });
  };

  return (
    <div style={styles.container}>

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

<div style={styles.topRow}>


  {/*   Attendance    */}   



<div style={styles.card}>
  {/* Header */}
  <div style={styles.header1}>
    <span style={styles.headerTitle}>Attendance</span>
    <h3 style={styles.headerTime}>11 Mar 2025</h3>
  </div>

  {/* Circular Chart Section */}
  <div style={styles.circleWrapper}>
    <div style={styles.circleOuter}>
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#e6e6e6"
          strokeWidth="5"
          fill="none"
        />
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

  {/* Info Rows */}
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
      
      <h1 style={styles.heading}>Trip Request</h1>

      <div style={styles.filterWrapper}>
        <label>Status Filter:</label>
        <select value={filterStatus} onChange={handleFilterChange} style={styles.dropdown}>
          <option value="All">All</option>
          <option value="Certified">Certified</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div style={styles.table}>
        <div style={{ ...styles.row, ...styles.header }}>
          <div style={styles.cell}>From</div>
          <div style={styles.cell}>To</div>
          <div style={styles.cell}>Department</div>
          <div style={styles.cell}>Project</div>
          <div style={styles.cell}>Place</div>
          <div style={styles.cell}>Status</div>
          <div style={styles.cell}>Action</div>
        </div>

        {filteredRequests.map((item, i) => (
          <div key={i} style={styles.row}>
            <div style={styles.cell}>{item.from_date}</div>
            <div style={styles.cell}>{item.to_date}</div>
            <div style={styles.cell}>{item.department}</div>
            <div style={styles.cell}>{item.project_code}</div>
            <div style={styles.cell}>{item.place}</div>
            <div style={styles.cell}>
              <span
                style={{
                  background:
                    item.status === 'Certified' ? '#2980b9' :
                      item.status === 'Approved' ? '#27ae60' :
                        item.status === 'Rejected' ? '#e74c3c' :
                          '#bdc3c7',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: 10,
                  fontSize: 13
                }}
              >
                {item.status}
              </span>
            </div>
            <div style={styles.cell}>
              <button onClick={() => handleView(item)} style={styles.viewBtn}>View</button>
            </div>
          </div>
        ))}
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
        <td style={styles.td}>{selected.place}</td>
        <td style={styles.td}>{selected.purpose || "N/A"}</td>
      </tr>
    </tbody>
  </table>

  {/* Advance Required */}
  <h4 style={styles.subTitle}>Advance Required</h4>
  <table style={styles.tableStyle}>
    <thead>
      <tr>
        <th style={styles.th}>Items</th>
        <th style={styles.th}>Calculation Details</th>
        <th style={styles.th}>Budget</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style={styles.td}>Accommodation</td><td style={styles.td}></td><td style={styles.td}>10000</td></tr>
      <tr><td style={styles.td}>Daily Allowance</td><td style={styles.td}></td><td style={styles.td}></td></tr>
      <tr><td style={styles.td}>Transportation</td><td style={styles.td}></td><td style={styles.td}></td></tr>
      <tr><td style={styles.td}>Miscellaneous</td><td style={styles.td}></td><td style={styles.td}></td></tr>
      <tr>
        <td style={styles.td} colSpan="2"><b>Total Advance Required</b></td>
        <td style={styles.td}><b>10000</b></td>
      </tr>
    </tbody>
  </table>

  {/* Signatures */}
  <h4 style={styles.subTitle}>Signatures</h4>
  <div style={styles.signatureRow}>
    <div>Claimed by: ___________</div>
    <div>Certified by: ___________</div>
    <div>Sanctioned by: ___________</div>
    <div>Receiver’s Signature: ___________</div>
  </div>

</div>



            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.actionBtn, backgroundColor: '#27ae60' }}
                onClick={() => updateStatus(selected.id, "Certified")}
              >
                Certify
              </button>
              <button
                style={{ ...styles.actionBtn, backgroundColor: '#e74c3c' }}
                onClick={() => updateStatus(selected.id, "Rejected")}
              >
                Reject
              </button>
              <button onClick={handleClose} style={styles.cancelBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 30, fontFamily: 'sans-serif' },
  heading: { fontSize: 28, marginBottom: 20 },
  filterWrapper: { marginBottom: 20 },
  dropdown: { padding: 8, fontSize: 14, marginLeft: 10, borderRadius: 6 },
  table: { border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' },
  row: { display: 'flex', padding: 12, borderBottom: '1px solid #eee', alignItems: 'center' },
  header: { background: '#f2f2f2', fontWeight: 'bold' },
  cell: { flex: 1, fontSize: 14 },
  viewBtn: { padding: '5px 10px', border: 'none', background: '#333', color: 'white', borderRadius: 4, cursor: 'pointer' },
 modalOverlay: {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
  padding: '20px'
},
modalCard: {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)',
  width: '100%',
  maxWidth: '1600px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
},
modalHeader: {
  background: 'linear-gradient(to right, #1d976c, #93f9b9)',
  padding: '24px',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  color: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 10
},
modalTitle: {
  margin: 0,
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center'
},
detailGrid: {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  padding: '24px',
  overflowY: 'auto',
  flex: 1
},
gridRow: {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f9fafa',
  borderRadius: '10px',
  padding: '16px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
},
gridLabel: {
  fontSize: '13px',
  color: '#7f8c8d',
  marginBottom: '6px',
  fontWeight: 600,
  letterSpacing: '0.5px'
},
gridValue: {
  fontSize: '15px',
  color: '#2c3e50',
  fontWeight: 500
},
buttonGroup: {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '20px',
  borderTop: '1px solid #eee',
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#fff'
},
  actionBtn: {
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
    margin: '0 8px'
  },
  cancelBtn: {
    backgroundColor: '#bdc3c7',
    color: '#2c3e50',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
    margin: '0 8px'
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
 idCard: {
    width: "500px",
    border: "1px solid #f36f21",
    borderRadius: "16px",
    padding: "20px",
    margin: "20px",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
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
    border: "3px solid #3498db",
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
    color: "#555",
    width: "160px",  // Set a fixed width for the label
    fontSize: "15px",
    display: "inline-block",
  },
  idValue: {
    color: "#2c3e50",
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
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "150px",
    marginTop:"20px",
    height:"200px",
    border: "1px solid #f36f21",
  },
  attendanceData: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 10,
  },
  dataRow: {
    fontSize: 14,
    color: "#2c3e50",
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
  },
  attendancePie: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
   card: {
    border: "1px solid #f36f21",
    borderRadius: "8px",
    padding: "20px",
    width: "350px",
    margin: "20px",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  header1: {
    marginBottom: "15px"
  },
  headerTitle: {
    fontSize: "14px",
    color: "#666"
  },
  headerTime: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "5px",
    color: "#2c3e50"
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
    background: "#f36f21",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
 timelineCard: {
    border: "1px solid #f36f21",
    borderRadius: "8px",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    padding: "20px",
    maxWidth: "1200px",
    margin: "20px 0px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    width:"1200px", 
    fontFamily: "'Segoe UI', Tahoma, sans-serif"
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
  }


};

export default Certifications;


