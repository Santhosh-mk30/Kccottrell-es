import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt,FaPencilAlt} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip,   } from "recharts";
import axios from "axios";


const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("photo", file); // matches PHP
  formData.append("employee_id", employeeId);

  try {
    const res = await axios.post(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/upload_profile.php",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log(res.data);

    if (res.data.success) {
      alert("Profile image updated successfully!");
      // Reload the page
      window.location.reload();
    } else {
      alert("Upload failed: " + res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to upload image");
  }
};




  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employee_id");

  const handleExpand = (heading) => {
    setExpanded(expanded === heading ? null : heading);
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        ...(employeeId === "KCCES19107"
          ? [
            { name: "Vendors", path: "/vendordata" },
            { name: "Purchase Order", path: "/purchaseorder" },
            { name: "Purchase Order History", path: "/purchaseorderhistory" },
             { name: "Advance/Percome Invoice/Redemption", path: "/advance" },
              { name: "Invoice Booking", path: "/paymentadvice" },
              { name: "Invoice Booking History", path: "/certifypurchaseorder" },
              { name: "Reimbursement of Expenses", path: "/certifyreimbursement" },
              { name: "Reimbursement of Expense", path: "/reimbursement" },
            ]
          : []),

        ...(employeeId === "KCCES19014"
          ? [{ name: "Invoice Bills", path: "/certifypurchaseorder" },
          { name: "Reimbursement of Expenses", path: "/certifyreimbursement" },
          { name: "Purchase Orders", path: "/purchaseorderhistory" },]
          
          : []),

        ...(employeeId === "KCCES19002"
          ? [{ name: "Invoice Bills", path: "/verifypurchaseorder" },
            { name: "Reimbursement of Expenses", path: "/verifyreimbursement" }]
          : []),

        ...(employeeId === "KCCES19023"
          ? [
            { name: "Vendors", path: "/vendordata" },
            { name: "Purchase Order", path: "/adminpurchaseorder" }]
          : []),

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



  // Save employee details in localStorage
  useEffect(() => {
    if (employee) {
      if (employee.Designation) localStorage.setItem("employee_designation", employee.Designation);
      if (employee.Name) localStorage.setItem("employee_name", employee.Name);
      if (employee.Department) localStorage.setItem("employee_department", employee.Department);
    }
  }, [employee]);

 
 // Fetch employee data
useEffect(() => {
  const employeeId = localStorage.getItem("employee_id");
  if (!employeeId) return;

  fetch(`https://darkslategrey-shrew-424102.hostingersite.com/api/get_employee_data.php?employee_id=${employeeId.trim()}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // Prepend the uploads URL to the ProfilePicture
        const employeeData = {
          ...data.data,
          ProfilePicture: data.data.ProfilePicture
            ? `https://darkslategrey-shrew-424102.hostingersite.com/api/uploads/${data.data.ProfilePicture}`
            : null, // or a default image URL
        };
        setEmployee(employeeData);
      } else {
        console.error(data.message);
      }
    })
    .catch((err) => console.error(err));
}, []);


  if (!employee) return null;

  const attendanceData = [
  { name: "On Time", value: 1254 },
  { name: "Late Attendance", value: 732 },
  { name: "Casual Leave", value: 658 },
  { name: "Permission", value: 714 },
  { name: "Sick Leave", value: 768 },
];
const COLORS = ["#2ecc71", "#f1c40f", "#3498db", "#e74c3c", "#9b59b6"];



  // ✅ Styles
  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      minHeight: "100vh",
      background: "#DDD0C8",
      flexDirection: isMobile ? "column" : "row", 
      paddingTop: isMobile ? "40px" : "0px",
  paddingBottom: isMobile ? "10px" : "0px",
    },

 
    hamburger: {
      position: "fixed",
      top: 20,
      left: 20,
      fontSize: 28,
      color: "#333",
      padding: "10px 14px",
      borderRadius: 8,
      cursor: "pointer",
      zIndex: 1100,
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      transition: "all 0.3s ease",
    },
    
    topNav: {
      position: "fixed",
      top: 0,
      left:0,
      width: isMobile ? "95%" :"97.8%",
      borderRadius:"10px",
      height: 60,
      background: "#DDD0C8",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 20px",
      zIndex: 1200,
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    },
    navIcon: { color: "#333", marginLeft: 20, fontSize: 24, cursor: "pointer", transition: "transform 0.2s" },

    sideNav: {
      width: 260,
      marginTop: isMobile ? "60px":60,
      backgroundColor: "#DDD0C8",
      boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
      padding: "25px 20px",
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      transition: "all 0.4s ease",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer",
      color: "#DDD0C8",
      background: "#323232",
      borderRadius: 6,
      padding: "4px 10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 1101,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoContainer: { display: "flex", alignItems: "center", gap: 12, marginBottom: 25 },
    logoSection: { width: 180, height: 80, objectFit: "contain" },
    navLinksSection: { display: "flex", flexDirection: "column", gap: 12 },
    menuGroup: { overflow: "hidden" },
    navItemHeading: {
      padding: "12px 16px",
      fontWeight: 600,
      background: "#fdfdfdff",
      color: "#323232",
      borderRadius: 10,
      cursor: "pointer",
      transition: "all 0.3s ease, transform 0.2s",
    },
    navItemHeadingActive: {
      background: "#323232",
      color: "#DDD0C8",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      transform: "scale(1.03)",
    },
    subMenu: {
      paddingLeft: 20,
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      transition: "all 0.3s ease",
    },
    subNavItem: {
      padding: "10px 14px",
      background: "#fdf7eeff",
      borderRadius: 8,
      margin: "4px 0",
      cursor: "pointer",
      color: "#323232",
      transition: "all 0.3s ease, transform 0.2s",
    },
    // ✅ ID Card
    idCard: {
      width: isMobile ? "80%" : "550px",
      height: isMobile? "50%": "180px",
      borderRadius: 20,
      padding: isMobile ? "15px" : "20px",
      margin: "80px 18px",
      background: "linear-gradient(145deg, #FAF7EB, #F0E6D6)",
      boxShadow: hover
        ? "0 12px 25px rgba(224, 74, 74, 0.25)"
        : "0 6px 20px rgba(0,0,0,0.1)",
      transform: hover ? "translateY(-6px) scale(1.02)" : "scale(1)",
      overflow: "hidden",
    },
    
    shimmerBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: 20,
      background:
        "linear-gradient(130deg, rgba(255, 255, 255, 0.3), rgba(250, 247, 247, 0.6), rgba(146, 130, 130, 0.3))",
      backgroundSize: "200% 200%",
      animation: hover ? "shimmerMove 3s linear infinite" : "none",
      zIndex: 0,
    },
    idCardBody: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      gap: isMobile ? "15px" : "25px",
      position: "relative",
      zIndex: 1,
    },
    photoSection: {
      flexShrink: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: isMobile ? "100%" : "130px",
    },
    photo: {
      width: isMobile ? "130px" : "130px",
      height: isMobile ? "130px" : "130px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #e04a4aff",
      boxShadow: hover
        ? "0 10px 22px rgba(224, 74, 74, 0.35)"
        : "0 6px 16px rgba(224, 74, 74, 0.3)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
  pencilWrapper: {
    position: "absolute",
    bottom:isMobile ? 165 : 15,
    left: isMobile ? 165 : 85,
    backgroundColor: "#DDD0C8",
    borderRadius: "50%",
    padding: 6,
    cursor: "pointer",
  },
  pencilLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
    detailsSection: {
      flex: 1,
      textAlign: isMobile ? "center" : "left",
    },
    idRow: {
      marginBottom: 10,
      display: "flex",
      justifyContent: isMobile ? "center" : "flex-start",
      alignItems: "center",
      flexWrap: "wrap",
    },
    idLabel: {
      fontWeight: 600,
      color: "#2c3e50",
      width: isMobile ? "auto" : "160px",
      fontSize: isMobile ? 14 : 15,
      marginRight: isMobile ? 6 : 0,
    },
    idValue: {
      color: "#2c3e50",
      fontSize: isMobile ? 14 : 15,
      fontWeight: 500,
    },
     card: {
      width: isMobile ? "80%" : "520px",
      height: isMobile? "80%": "180px",
      padding: isMobile ? "15px" : "20px",
      margin: isMobile ? "10px 18px" : "80px 18px",
      borderRadius: 20,
      background: "linear-gradient(145deg, #FAF7EB, #F0E6D6)",
      boxShadow: hover
        ? "0 12px 25px rgba(224, 74, 74, 0.25)"
        : "0 6px 20px rgba(0,0,0,0.1)",
      transform: hover ? "translateY(-4px) scale(1.02)" : "scale(1)",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      gap: isMobile ? "15px" : "25px",
      overflow: "hidden",
    },
    shimmerBorder1: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: 20,
      background:
        "linear-gradient(130deg, rgba(255, 255, 255, 0.3), rgba(250, 247, 247, 0.6), rgba(146, 130, 130, 0.3))",
      backgroundSize: "200% 200%",
      animation: hover ? "shimmerMove 3s linear infinite" : "none",
      zIndex: 0,
    },
  legend: {
  flex: 1,
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: isMobile ? "row" : "column",  // row on mobile, column on desktop
  flexWrap: isMobile ? "wrap" : "nowrap",      // wrap items if too many
  gap: isMobile ? "12px 15px" : "6px",         // row + column gap on mobile
  justifyContent: isMobile ? "center" : "flex-start",
  alignItems: isMobile ? "center" : "flex-start",
},

cardTitle: {
  marginBottom: 12,
  fontSize: isMobile ? 16 : 18,
  fontWeight: 600,
  color: "#2c3e50",
  textAlign: isMobile ? "center" : "left",     // center title on mobile
},

dataRow: {
  display: "flex",
  alignItems: "center",
  marginBottom: 8,
  fontSize: isMobile ? 13 : 14,
  color: "#2c3e50",
  width: "100%",          // full width on mobile
  flexWrap: "wrap",       // wrap text if needed
},

pieContainer: {
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: isMobile ? "70%" : 310,               // expand pie on mobile
  height: isMobile ? 180 : 180,
  marginTop: isMobile ? 15 : 0,                // spacing from legend
  position: "relative",
  zIndex: 1,
},

  };

   // Create gradient definitions for Pie slices
    const renderPieWithGradients = () => (
      <PieChart width={isMobile ? 150 : 180} height={isMobile ? 150 : 180}>
        <defs>
          {attendanceData.map((entry, index) => (
            <radialGradient
              key={`grad-${index}`}
              id={`grad-${index}`}
              cx="50%"
              cy="50%"
              r="70%"
            >
              <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
              <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
            </radialGradient>
          ))}
        </defs>
        <Pie
          data={attendanceData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={isMobile ? 35 : 50}
          outerRadius={isMobile ? 70 : 80}
          paddingAngle={1}
          stroke="#fff"
        >
          {attendanceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );

   




  

  return (
    <div style={styles.container}>
     {/* Top Navbar */}
<div
  style={{
    ...styles.topNav,
    justifyContent: isMobile ? "space-between" : "flex-end",
    padding: isMobile ? "0 15px" : "0 20px",
  }}
>
  {isMobile && (
    <div
      style={{ fontSize: 24, color: "#333", cursor: "pointer" }}
      onClick={toggleMenu}
    >
      ☰
    </div>
  )}

  <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
    <FaUserCircle
      style={styles.navIcon}
      onClick={() => navigate("/profile")}
    />
    <FaSignOutAlt
      style={styles.navIcon}
      onClick={() => navigate("/logout")}
    />
  </div>
</div>

      {/* Sidebar */}
      <nav
        style={{
          ...styles.sideNav,
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: isMenuOpen ? 0 : "-300px",
                height: "100%",
                zIndex: 1000,
                transition: "left 0.3s ease-in-out",
              }
            : {}),
        }}
      >
        {isMobile && isMenuOpen && (
          <div style={styles.closeButton} onClick={toggleMenu}>
            x
          </div>
        )}
        <div style={styles.logoContainer}>
          <img src="/logologin.png" alt="Logo" style={styles.logoSection} />
        </div>
        <div style={styles.navLinksSection}>
          {menu.map((item, idx) => (
            <div key={idx} style={styles.menuGroup}>
              <div
                style={{
                  ...styles.navItemHeading,
                  ...(expanded === item.title ? styles.navItemHeadingActive : {}),
                }}
                onClick={() => handleExpand(item.title)}
              >
                {item.title}
                <span
                  style={{
                    float: "right",
                    transition: "transform 0.3s",
                    transform: expanded === item.title ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  ▶
                </span>
              </div>
              <div
                style={{
                  ...styles.subMenu,
                  maxHeight: expanded === item.title ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                {item.subItems.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    style={styles.subNavItem}
                    onClick={() => {
                      navigate(sub.path);
                      if (isMobile) setIsMenuOpen(false);
                    }}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Employee ID Card */}
      <div
        style={styles.idCard}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={styles.shimmerBorder}></div>

        <div style={styles.idCardBody}>
          {/* Photo */}
        
    <div style={styles.photoSection}>
      
     <img
  src={employee?.ProfilePicture || "/PROFILE.jpg"}
  alt="Profile"
  style={styles.photo}
/>

      
      {/* Pencil Icon Overlay */}
      <div style={styles.pencilWrapper}>
        <label htmlFor="profileUpload" style={styles.pencilLabel}>
          <FaPencilAlt color="#333" />
        </label>
        <input
          id="profileUpload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

      </div>
    </div>
 




          {/* Details */}
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
              <span style={styles.idLabel}>Date Joined:</span>
              <span style={styles.idValue}>{employee.Joining_date}</span>
            </div>
          </div>
        </div>
      </div>

    <div
      style={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Shimmer Border */}
      <div style={styles.shimmerBorder1}></div>

      {/* Left: Legend */}
      <div style={styles.legend}>
        <h3 style={styles.cardTitle}>Attendance Overview</h3>
        {attendanceData.map((item, index) => (
          <div key={index} style={styles.dataRow}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: "8px",
                borderRadius: "50%",
              }}
            ></span>
            <span style={{ fontWeight: "600" }}>{item.name}:</span>
            <span style={{ marginLeft: 6 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Right: Pie Chart with gradients */}
      <div style={styles.pieContainer}>{renderPieWithGradients()}</div>

     
    </div>
        

    </div>
    
  );
};

export default Dashboard;



