import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip,   } from "recharts";

const Approval = () => {
  const [certified, setCertified] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
   const [employee, setEmployee] = useState(null);
  

  useEffect(() => {
    fetch('https://darkslategrey-shrew-424102.hostingersite.com/api/get_certified_requests.php')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Fetched data:', data);
        if (Array.isArray(data)) {
          setCertified(data);
        } else {
          console.warn('⚠️ API did not return an array:', data);
          setCertified([]);
        }
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        alert('API Error: ' + err.message);
      });
  }, []);

  const statusOptions = ['All', 'Certified', 'Approved', 'Rejected'];

  const filteredCertified = certified.filter(item => {
    const status = item.status?.toLowerCase().trim();
    if (selectedStatus === 'All') return ['certified', 'approved', 'rejected'].includes(status);
    return status === selectedStatus.toLowerCase();
  });

  const handleView = (item) => setSelected(item);
  const handleClose = () => setSelected(null);

  const updateStatus = (id, newStatus) => {
    const payload = { id, status: newStatus };

    console.log("📤 Sending to backend:", payload);

    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/update_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Response from backend:", data);
        if (data.status === "success") {
          setCertified(prev =>
            prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
          );
          setSelected(null);
        } else {
          alert("Update failed");
        }
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        alert("Network error occurred");
      });
  };


  
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

  return (
    <div style={{ padding: 30, fontFamily: 'sans-serif' }}>


      
        
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
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Requests</h1>

      {/* Status Filter Buttons */}
      <div style={{ marginBottom: 20 }}>
        {statusOptions.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: '8px 16px',
              marginRight: 10,
              borderRadius: 6,
              border: selectedStatus === status ? '2px solid #333' : '1px solid #ccc',
              backgroundColor: selectedStatus === status ? '#333' : '#f2f2f2',
              color: selectedStatus === status ? '#fff' : '#000',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: 12, background: '#f2f2f2', fontWeight: 'bold' }}>
          <div style={{ flex: 1 }}>From</div>
          <div style={{ flex: 1 }}>To</div>
          <div style={{ flex: 1 }}>Department</div>
          <div style={{ flex: 1 }}>Project</div>
          <div style={{ flex: 1 }}>Place</div>
          <div style={{ flex: 1 }}>Status</div>
          <div style={{ flex: 1 }}>Action</div>
        </div>

        {/* Data Rows */}
        {filteredCertified.length > 0 ? (
          filteredCertified.map((item, i) => (
            <div key={i} style={{ display: 'flex', padding: 12, borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>{item.from_date || '-'}</div>
              <div style={{ flex: 1 }}>{item.to_date || '-'}</div>
              <div style={{ flex: 1 }}>{item.department || '-'}</div>
              <div style={{ flex: 1 }}>{item.project_code || '-'}</div>
              <div style={{ flex: 1 }}>{item.place || '-'}</div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    background:
                      item.status === 'Certified' ? '#2980b9' :
                      item.status === 'Approved' ? '#27ae60' :
                      item.status === 'Rejected' ? '#e74c3c' : '#bdc3c7',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: 10
                  }}
                >
                  {item.status}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <button
                  onClick={() => handleView(item)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: '#333',
                    color: '#fff',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 20, textAlign: 'center' }}>No data available for this status</div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div style={styles.overlay}>
          <div style={styles.card1}>
            <h2 style={styles.title}>Request Details</h2>

            <div style={styles.detailGrid}>
              {Object.entries(selected).map(([key, value], index) => (
                <div key={index} style={styles.row}>
                  <div style={styles.label}>{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div style={styles.value}>{value !== null && value !== "" ? value : '-'}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 20 }}>
              <button
                style={{ ...styles.btn, backgroundColor: '#27ae60' }}
                onClick={() => updateStatus(selected.id, 'Approved')}
              >
                Approve
              </button>
              <button
                style={{ ...styles.btn, backgroundColor: '#e74c3c' }}
                onClick={() => updateStatus(selected.id, 'Rejected')}
              >
                Reject
              </button>
              <button style={styles.closeBtn} onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  card1: {
    background: '#fefefe',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none'
  },
  
  title: {
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    padding: '20px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    color: '#fff'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '20px'
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f7f9fa',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  label: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginBottom: '4px',
    fontWeight: 600
  },
  value: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: 500
  },
  btn: {
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  closeBtn: {
    backgroundColor: '#bdc3c7',
    color: '#2c3e50',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
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

export default Approval;
