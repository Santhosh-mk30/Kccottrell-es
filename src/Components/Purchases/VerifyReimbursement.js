import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UilFileAlt,
  UilClock,
  UilCheckCircle,
  UilTimesCircle,
  UilCheck,
  UilTimes,
  UilMapMarker,
  UilUser,
  UilCalendarAlt,
  UilRupeeSign,
} from "@iconscout/react-unicons";
import { FaUserCircle, FaSignOutAlt} from "react-icons/fa";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

import rightAnimation from "./json/Human Resources Approval Animation.json"; // Update path to your JSON



const ReimbursementRequests = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [modalData, setModalData] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
   



const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

const navigate = useNavigate();

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "https://darkslategrey-shrew-424102.hostingersite.com/api/get_reimbursement_requests.php"
        );
        if (res.data && Array.isArray(res.data.data)) {
          setRequests(res.data.data);
        } else if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, actionType, reason = "") => {
  try {
    const res = await axios.post(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/update_reimbursement.php",
      { request_id: id, action: actionType, reason }
    );

    if (res.data.success) {
      alert(`${actionType} successful!`);
      setModalData(null);
      window.location.reload();
    } else {
      alert(`Failed: ${res.data.error}`);
    }
  } catch (error) {
    console.error(error);
    alert("Error updating status");
  }
};

  
  const filteredRequests = requests.filter((req) => {
  const status = req.status?.toLowerCase();
  if (activeTab === "pending") {
    // Show both 'pending' and 'certified' as pending
    return  status === "certified";
  }
  return status === activeTab;
});



  return (
    <div style={styles.container}>
    
  {/* Top Navbar */}
<div
  style={{
    ...styles.topNav,
    justifyContent: "space-between", // logo left, icons right
    padding: isMobile ? "0 15px" : "0 25px",
    width: isMobile ? "95%" : "97.8%",
  }}
>

  <div
    style={styles.logoContainer}
    onClick={() => navigate("/dashboard")} // 👈 navigate to Home page
  >
    <img src="/logologin.png" alt="Logo" style={styles.logoSection} />
  </div>

  

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
<div style={styles.statsGrid}>
  <div style={{ ...styles.statCard, ...styles.animatedCard, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
    <UilFileAlt color="#fff" size="32" />
    <h3 style={{ ...styles.statValue, color: '#fff' }}>{requests.length}</h3>
    <p style={{ ...styles.statLabel, color: '#fff' }}>Total Requests</p>
  </div>
  <div style={{ ...styles.statCard, ...styles.animatedCard, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
    <UilClock color="#fff" size="32" />
    <h3 style={{ ...styles.statValue, color: '#fff' }}>
      {requests.filter((r) => r.status?.toLowerCase() === "pending").length}
    </h3>
    <p style={{ ...styles.statLabel, color: '#fff' }}>Pending</p>
  </div>
  <div style={{ ...styles.statCard, ...styles.animatedCard, background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
    <UilCheckCircle color="#fff" size="32" />
    <h3 style={{ ...styles.statValue, color: '#fff' }}>
      {requests.filter((r) => r.status?.toLowerCase() === "certified").length}
    </h3>
    <p style={{ ...styles.statLabel, color: '#fff' }}>Certified</p>
  </div>
  <div style={{ ...styles.statCard, ...styles.animatedCard, background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
    <UilTimesCircle color="#fff" size="32" />
    <h3 style={{ ...styles.statValue, color: '#fff' }}>
      {requests.filter((r) => r.status?.toLowerCase() === "reject").length}
    </h3>
    <p style={{ ...styles.statLabel, color: '#fff' }}>Rejected</p>
  </div>
</div>

<style>
{`
@keyframes pulseGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`}
</style>



      <div style={styles.tabs}>
  {["certified", "verified", "rejected"].map((tab) => {
    const isActive = activeTab.toLowerCase() === tab.toLowerCase();
    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          ...styles.tabButton,
          ...(isActive ? styles.tabButtonActive : {}),
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.target.style.backgroundColor = "#e5e7eb";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.target.style.backgroundColor = "white";
        }}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)} (
        {requests.filter((r) => r.status?.toLowerCase() === tab.toLowerCase()).length})
      </button>
    );
  })}
</div>

      

<div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
  {/* Left Column: Request List */}
  <div
    style={{
      flex: "1 1 600px", // min width 600px, grows
      minWidth: 300,     // responsive min width
      maxWidth: "60%",
      overflowY: "auto",
    }}
  >
    <div style={styles.requestList}>
      {filteredRequests.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          No {activeTab} requests found.
        </p>
      ) : (
        filteredRequests.map((req, index) => (
          <div key={index} style={styles.requestCard}>
            {/* Left Column inside Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={styles.infoRow}>
                <UilUser size="20" color="#374151" />
                <span style={{ fontSize: "16px", color: "#555" }}>{req.name}</span>
              </div>
              <div style={styles.infoRow}>
                <UilMapMarker size="20" color="#374151" />
                <span style={{ fontSize: "16px", color: "#555" }}>{req.location}</span>
              </div>
              <p style={styles.reqDesc}>{req.purpose}</p>
            </div>

            {/* Center Column inside Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              
              <div style={styles.infoRow}>
                <UilCalendarAlt size="20" color="#374151" />
                <span style={{ fontSize: "16px", color: "#555" }}>{req.date}</span>

              </div>
              <div style={styles.infoRow}>
                <UilRupeeSign size="20" color="#374151" />
                <span style={{ fontSize: "16px", color: "#555" }}>{req.amount}</span>
              </div>
            </div>

          {/* Right Column inside Card (Buttons) */}
<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
  <button style={styles.viewButton} onClick={() => setModalData(req)}>
    View
  </button>

  {req.status?.toLowerCase() !== "certified" && (
    <>
      <button
        style={styles.CertifyButton}
        onClick={() => handleAction(req.id, "verified")}
      >
        <UilCheck size="18" /> verify
      </button>

      <button
        style={styles.rejectButton}
        onClick={() => setShowRejectModal(true)}
      >
        <UilTimes size="18" /> Reject
      </button>
    </>
  )}
</div>

      {/* Modal */}
      {showRejectModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              width: "90%",
              maxWidth: 400,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Reason for Rejection</h3>
            <textarea
              style={{
                width: "100%",
                minHeight: 80,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                marginBottom: 12,
                fontSize: 14,
              }}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{
                  padding: "8px 16px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={async () => {
                  if (!rejectReason.trim()) {
                    alert("Rejection reason is required!");
                    return;
                  }
                  await handleAction(req.id, "Rejected", rejectReason);
                  setRejectReason("");
                  setShowRejectModal(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


        ))
      )}
    </div>
  </div>


        {/* Right: Fixed Lottie */}
        <div style={styles.lottieColumn}>
          <Lottie
            animationData={rightAnimation}
            loop={true}
            style={{ width: "100%", maxHeight: "80vh" }}
          />
        </div>
      </div>




      {/* Modal */}
{/* Modal */}
{modalData && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      {/* Close Button */}
      <button style={styles.closeButton} onClick={() => setModalData(null)}>
        ✕
      </button>

      {/* Title */}
      <h2 style={styles.modalTitle}>Request Details</h2>

      {/* Modal Body */}
      <div style={styles.body}>
        <div style={styles.row}>
          <span style={styles.label}>Employee:</span>
          <span style={styles.value}>{modalData.name}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Project:</span>
          <span style={styles.value}>
            {modalData.project_code} - {modalData.project_name}
          </span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Date:</span>
          <span style={styles.value}>{modalData.date}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Place to Visit:</span>
          <span style={styles.value}>{modalData.location}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Mode of Travel:</span>
          <span style={styles.value}>{modalData.mode}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Amount:</span>
          <span style={styles.amount}>₹{modalData.amount}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Purpose:</span>
          <span style={styles.value}>{modalData.purpose}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Status:</span>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor:
                modalData.status === "Approved"
                  ? "#22c55e20"
                  : modalData.status === "Rejected"
                  ? "#ef444420"
                  : "#f59e0b20",
              color:
                modalData.status === "Approved"
                  ? "#16a34a"
                  : modalData.status === "Rejected"
                  ? "#b91c1c"
                  : "#b45309",
            }}
          >
            {modalData.status}
          </span>
        </div>

{/* Enclosed Documents */}
{modalData.documents &&
  (() => {
    let docsArray = [];
    try {
      docsArray = JSON.parse(modalData.documents); // parse string to array
    } catch (err) {
      console.error("Failed to parse documents:", err);
    }

    const baseUrl = "https://darkslategrey-shrew-424102.hostingersite.com/api/uploads/";

    return docsArray.length > 0 ? (
      <div style={styles.row}>
        <span style={styles.label}>Enclosed Documents:</span>
        <span style={styles.docContainer}>
          {docsArray.map((doc, index) => {
            // Determine file type for icon
            const fileExtension = doc.split(".").pop().toLowerCase();
            let icon = "📄"; // default
            if (fileExtension === "pdf");
            else if (["jpg", "jpeg", "png"].includes(fileExtension));
            else if (["doc", "docx"].includes(fileExtension));

            // Full URL for document
            const docUrl = `${baseUrl}${doc}`;

            return (
              <a
                key={index}
                href={docUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.docLink}
                title={`Open ${doc.split("/").pop()}`}
              >
                {icon} Document {index + 1}
              </a>
            );
          })}
        </span>
      </div>
    ) : null;
  })()}



      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button style={styles.ghostBtn} onClick={() => setModalData(null)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};


const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#7df0e0ff",
    minHeight: "100vh",
    
  },
topNav: {
    position: "fixed",
    top: 0,
    left: 0,
    height: 60,
    background: "rgba(255, 255, 255, 0.1)", // transparent background
    backdropFilter: "blur(10px)", // glassy blur effect
    display: "flex",
    alignItems: "center",
    zIndex: 1200,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    borderRadius: "10px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor:"pointer",
  },
  logoSection: {
    height: 60,
    width: "auto",
    objectFit: "contain",
  },
  navIcon: {
    color: "#333",
    fontSize: 24,
    cursor: "pointer",
    transition: "transform 0.2s",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", // smaller cards
    gap: "102px",
    marginBottom: "25px",
    width: "100%",
    marginTop:"60px"
  },
  statCard: {
    background: "linear-gradient(135deg, #3b82f6, #60a5fa)", // gradient
    borderRadius: 8,
    padding: "12px 18px", // smaller padding
    textAlign: "center",
    boxShadow: "0 1px 5px rgba(0,0,0,0.08)", // subtle shadow
    color: "#fff",
    fontWeight: 500,
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  statCardHover: {
    transform: "translateY(-2px)", // subtle hover effect
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  statValue: {
    fontSize: 20, // smaller
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12, // smaller
    marginTop: 2,
    textTransform: "uppercase",
    opacity: 0.85,
  },
  animatedCard: {
  backgroundSize: '200% 200%',
  animation: 'pulseGradient 4s ease infinite',
  color: '#fff',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
},
 tabs: {
  display: "flex",
  flexWrap: "wrap", // allow wrapping on small screens
  justifyContent: "center",
  borderRadius: 12,
  marginBottom: 20,
  overflowX: "auto",
  padding: "5px 10px",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "20px",
  scrollbarWidth: "none", // hide scrollbar for Firefox
  msOverflowStyle: "none", // hide scrollbar for IE & Edge
},
tabButton: {
  flex: "1 0 120px",
  padding: "12px 0",
  fontSize: 15,
  background: "white",
  border: "none",
  cursor: "pointer",
  textAlign: "center",
  borderRadius: 8,
  margin: "0 5px",
  fontWeight: 500,
  color: "#374151",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
},
tabButtonActive: {
  background: "#ffffff",
  color: "#1d4ed8", // blue active text
  fontWeight: 600,
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderBottom: "3px solid #1d4ed8",
},

  requestList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    width: "100%",
  },
  requestCard: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: "18px 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    borderLeft: "6px solid #3b82f6", // colored border (can change per status)
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },

  lottieColumn: {
    flex: "1 1 300px",
    position: "sticky",
    top: 20,
    alignSelf: "flex-start",
  },

    requestCardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  reqDesc: {
    color: "#4b5563",
    fontSize: 16,
    margin: "6px 0",
  },
//   statusBadge: {
//     padding: "3px 8px",
//     borderRadius: 12,
//     fontSize: 11,
//     color: "#fff",
//     fontWeight: 600,
//     textTransform: "capitalize",
//     display: "inline-block",
//     marginLeft: 4,
//   },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#374151",
    fontSize: 13,
    marginBottom: 2,
  },
  viewButton: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
  CertifyButton: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
  rejectButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
  },

  modalContent: {
    width: "100%",
    maxWidth: 600,
    background: "linear-gradient(180deg, #ffffff, #f9fafb)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    position: "relative",
    padding: "24px 20px",
    animation: "fadeIn 0.3s ease-out",
    display: "flex",
    flexDirection: "column",
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 14,
    fontSize: 22,
    color: "#4b5563",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },

  body: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  label: {
    color: "#6b7280",
    fontWeight: 600,
    fontSize: 14,
    minWidth: "40%",
  },

  value: {
    color: "#111827",
    fontWeight: 600,
    textAlign: "right",
    flex: 1,
  },

  amount: {
    color: "#065f46",
    fontWeight: 700,
    fontSize: 16,
    textAlign: "right",
  },

  statusBadge: {
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: 999,
    textAlign: "center",
    minWidth: 100,
  },

 docContainer: {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
},

docLink: {
  display: "inline-block",
  backgroundColor: "#e0f2fe",
  color: "#0369a1",
  padding: "6px 10px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 13,
  transition: "background 0.2s, transform 0.2s",
  cursor: "pointer",
},
docLinkHover: {
  backgroundColor: "#bae6fd",
  transform: "translateY(-2px)",
},

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  ghostBtn: {
    background: "transparent",
    border: "1px solid #d1d5db",
    color: "#374151",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  "@media (max-width: 480px)": {
    modalContent: {
      padding: "18px 14px",
      borderRadius: 12,
    },
    modalTitle: {
      fontSize: 18,
    },
    row: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    label: {
      marginBottom: 4,
    },
    value: {
      textAlign: "left",
    },
  },



};

export default ReimbursementRequests;
