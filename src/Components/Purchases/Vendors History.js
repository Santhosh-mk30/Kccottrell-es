import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";



const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("verify");
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [activeVendorTab, setActiveVendorTab] = useState("Overview"); 
const [newDocType, setNewDocType] = useState("");
const [newDocFile, setNewDocFile] = useState(null);
const [editField, setEditField] = useState("");
    const [tempValues, setTempValues] = useState({});
     const navigate = useNavigate();

  const handleChange = (field, value) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

const handleSave = async (field) => {
  try {
    let payload = {
      vendor_id: selectedVendor.id,
      field,
    };

    if (field === "address") {
      payload.values = {
        billing_street: tempValues.billing_street ?? selectedVendor.billing_street,
        billing_city: tempValues.billing_city ?? selectedVendor.billing_city,
        billing_state: tempValues.billing_state ?? selectedVendor.billing_state,
        billing_pincode: tempValues.billing_pincode ?? selectedVendor.billing_pincode,
      };
    } else {
      payload.value = tempValues[field] ?? selectedVendor[field];
    }

    const res = await axios.post(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/update_vendor_field.php",
      payload
    );

    if (res.data.status === "success") {
      alert(res.data.message);
      setEditField("");
      window.location.reload();
    } else {
      alert(res.data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
};


    const handleDeleteDoc = async (docType, e) => {
      e.stopPropagation();
      if (!window.confirm("Are you sure you want to delete this document?")) return;

      try {
        const formData = new FormData();
        formData.append("vendor_id", selectedVendor.vendor_id);
        formData.append("document_type", docType);

        const res = await fetch(
          "https://darkslategrey-shrew-424102.hostingersite.com/api/delete_vendor_doc.php",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.status === "success") {
          alert("Document deleted successfully!");
          setSelectedVendor((prev) => ({
            ...prev,
            [`${docType}_file`]: null,
          }));
        } else {
          alert("Failed to delete document!");
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Something went wrong!");
      }
    };

    
   
const handleUploadNewDoc = async () => {
  if (!newDocType || !newDocFile) {
    alert("Please select document type and file.");
    return;
  }

  const formData = new FormData();
  formData.append("vendor_id", selectedVendor.id);
  formData.append("doc_type", newDocType);
  formData.append("file", newDocFile);

  try {
    const res = await axios.post(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/update_vendor_document.php",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status === "success") {
      alert("Document uploaded successfully!");
      window.location.reload();
      // Optionally refresh vendor data here
    } else {
      alert("Upload failed!");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
};



 useEffect(() => {
  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        "https://darkslategrey-shrew-424102.hostingersite.com/api/get_vendors.php"
      );
      setVendors(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchVendors();
}, []);

 const [verifiedDocs, setVerifiedDocs] = useState({
  pan: false,
  gst: false,
  registration: false,
  cancelled: false,
});
const handleVerify = async (key, e) => {
  e.stopPropagation();

  const columnMap = {
    pan: "pan_file_status",
    gst: "gst_file_status",
    registration: "registration_file_status",
    cancelled: "cancelled_check_file_status",
  };

  const columnName = columnMap[key];
  if (!columnName) return;

  try {
    await axios.post(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/update_vendor_status.php",
      {
        vendor_id: selectedVendor.vendor_id,
        column: columnName,
        status: "Verified",
      }
    );

    setVerifiedDocs(prev => ({ ...prev, [key]: true }));

    // Update vendors list locally if needed
    const updatedVendors = vendors.map(v =>
      v.vendor_id === selectedVendor.vendor_id
        ? { ...v, [columnName]: "Verified" }
        : v
    );
    setVendors(updatedVendors);

    alert(`${key.toUpperCase()} document verified successfully!`);
  } catch (err) {
    console.error("Error verifying document:", err);
    alert("Failed to verify document.");
  }
};


// Initialize verifiedDocs based on DB values
useEffect(() => {
  if (!selectedVendor) return;

  setVerifiedDocs({
    pan: selectedVendor.pan_file_status === "Verified", // true if Verified, false if Pending
    gst: selectedVendor.gst_file_status === "Verified",
    registration: selectedVendor.registration_file_status === "Verified",
    cancelled: selectedVendor.cancelled_check_file_status === "Verified",
  });
}, [selectedVendor]);

const handleVerifyVendor = async () => {
  try {
    await axios.post(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/update_vendor_status.php",
      {
        vendor_id: selectedVendor.vendor_id,
        column: "status", 
        status: "Verified",
      }
    );

    const updatedVendors = vendors.map(v =>
      v.vendor_id === selectedVendor.vendor_id
        ? { ...v, status: "Verified" }
        : v
    );
    setVendors(updatedVendors);
    window.location.reload();
   

    alert(`${selectedVendor.company_name} has been verified!`);
  } catch (err) {
    console.error("Error verifying vendor:", err);
    alert("Failed to verify vendor.");
  }
};


  const filtered = vendors.filter(
    (v) =>
      v.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.contact_person?.toLowerCase().includes(search.toLowerCase()) ||
      v.vendor_id?.toLowerCase().includes(search.toLowerCase())
  );

  const dataToShow = filtered.filter((v) =>
    activeTab === "verify"
      ? v.status !== "Verified"
      : v.status === "Verified"
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Vendors</h2>
          <p style={styles.subtitle}>Manage vendor verification & details</p>

        </div>
       <button
        style={styles.addBtn}
        onClick={() => navigate("/vendors")}
      >
        + Add Vendor
      </button>
      </div>
     


 

 


      {/* Search */}
      <div style={styles.filterRow}>
        <input
          type="text"
          placeholder="Search by name,Vendor ID"
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("verify")}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === "verify" ? "#E9F3FF" : "#fff",
            borderColor: activeTab === "verify" ? "#007bff" : "#ccc",
          }}
        >
          Verify Vendors
          <span style={styles.badgeOrange}>
            {vendors.filter((v) => v.status !== "Verified").length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("verified")}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === "verified" ? "#E9F3FF" : "#fff",
            borderColor: activeTab === "verified" ? "#007bff" : "#ccc",
          }}
        >
          Verified Vendors
          <span style={styles.badgeGreen}>
            {vendors.filter((v) => v.status === "Verified").length}
          </span>
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <span style={styles.th}>Vendor ID</span>
            <span style={styles.th}>Company</span>
            <span style={styles.th}>Contact</span>
            <span style={styles.th}>Email</span>
            <span style={styles.th}>Location</span>
            <span style={styles.th}>Status</span>
            <span style={styles.th}>Actions</span>
          </div>

          {dataToShow.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "#777" }}>
              No vendors found
            </div>
          ) : (
            dataToShow.map((v) => (
              <div key={v.vendor_id} style={styles.tableRow}>
                <span style={styles.td}>{v.vendor_id}</span>
                <span style={styles.td}>
                  <div style={styles.avatar}>
                    {v.company_name?.substring(0, 2).toUpperCase()}
                  </div>{" "}
                  {v.company_name}
                </span>
                <span style={styles.td}>
                  {v.contact_person}
                  <br />
                  <span style={styles.phone}>{v.phone}</span>
                </span>
                <span style={styles.td}>{v.email}</span>
                <span style={styles.td}>
                  {v.billing_city}, {v.billing_state}
                </span>
                <span style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor:
                        v.status === "Verified" ? "#E8F8E8" : "#FCE8E8",
                      color:
                        v.status === "Verified" ? "#2E7D32" : "#C62828",
                    }}
                  >
                    {v.status}
                  </span>
                </span>
                <span style={styles.td}>
                 
                  <button
                    style={styles.viewBtn}
                    onClick={() => setSelectedVendor(v)}
                  >
                    View
                  </button>

                </span>
              </div>
            ))
          )}
        </div>
        
      )}
      

 {/* Off-Canvas Vendor Details */}
{selectedVendor && (
  <div
    style={styles.overlay}
    onClick={(e) => {
      if (e.target === e.currentTarget) setSelectedVendor(null); // close when clicking outside
    }}
  >
    <div style={styles.offCanvas}>
      <button
        style={styles.closeBtn}
        onClick={() => setSelectedVendor(null)}
      >
        ×
      </button>

      <h2 style={{ marginBottom: 20 }}>Vendor Details</h2>

      {/* Header Section */}
      <div style={styles.vendorHeader}>
        <div style={styles.vendorAvatar}>
          {selectedVendor.company_name?.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{selectedVendor.company_name}</h3>
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            ID: {selectedVendor.vendor_id}
          </p>
         {selectedVendor.status === "Verified" ? (
  <span style={styles.badgeStyle1}>
    <MdVerified size={14} /> Verified
  </span>
) : (
  <span style={styles.pendingBadge}>
    {selectedVendor.status || "Pending Verification"}
  </span>
)}

        </div>
      </div>



{/* Contact Info */}
<div style={styles.contactInfo}>
  
      
     {/* Phone */}
<p>
  <strong>Phone:</strong>{" "}
  {editField === "phone" ? (
    <>
      <input
        style={{
          padding: "6px 10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          outline: "none",
          fontSize: "14px",
        }}
        value={tempValues.phone ?? selectedVendor.phone ?? ""}
        onChange={(e) => handleChange("phone", e.target.value)}
      />
      <button
        onClick={() => handleSave("phone")}
        style={{
          marginLeft: 8,
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Save
      </button>
      <button
        onClick={() => setEditField("")}
        style={{
          marginLeft: 6,
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#e0e0e0",
          color: "#333",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      {selectedVendor.phone || "N/A"}
      <button
        onClick={() => setEditField("phone")}
        style={{
          marginLeft: 8,
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        Edit
      </button>
    </>
  )}
</p>

{/* Email */}
<p>
  <strong>Email:</strong>{" "}
  {editField === "email" ? (
    <>
      <input
        style={{
          padding: "6px 10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          outline: "none",
          fontSize: "14px",
        }}
        value={tempValues.email ?? selectedVendor.email ?? ""}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <button
        onClick={() => handleSave("email")}
        style={{
          marginLeft: 8,
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Save
      </button>
      <button
        onClick={() => setEditField("")}
        style={{
          marginLeft: 6,
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#e0e0e0",
          color: "#333",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      {selectedVendor.email || "N/A"}
      <button
        onClick={() => setEditField("email")}
        style={{
          marginLeft: 8,
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        Edit
      </button>
    </>
  )}
</p>

{/* Address */}
<p>
  <strong>Location:</strong>{" "}
  <span>
    {selectedVendor.billing_city || "N/A"}, {selectedVendor.billing_state || "N/A"}
  </span>
</p>

</div>

      <div style={styles.tabsRow}>
  {["Overview", "Documents", "Transactions", "Notes"].map((tab) => (
    <div
      key={tab}
      style={{
        ...styles.tab,
        ...(activeVendorTab === tab ? styles.activeTab : {}),
      }}
      onClick={() => setActiveVendorTab(tab)}
    >
      {tab}
    </div>
  ))}
</div>


  


{/* Tab Content */}
<div style={styles.overviewSection}>
  {activeVendorTab === "Overview" && (
    <>
     <div style={styles.container1}>
      {/* Contact Person */}
      <p>
        <span style={styles.label}>Contact Person:</span>
        {editField === "first_name" ? (
          <>
            <input
              style={styles.input}
              value={tempValues.first_name ?? selectedVendor.first_name ?? ""}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="First Name"
            />
            <input
              style={styles.input}
              value={tempValues.last_name ?? selectedVendor.last_name ?? ""}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Last Name"
            />
            <button
              style={{ ...styles.button, ...styles.saveBtn }}
              onClick={() => handleSave("first_name")}
            >
              Save
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={() => setEditField("")}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {selectedVendor.first_name || "N/A"} {selectedVendor.last_name || ""}
            <button
              style={{ ...styles.button, ...styles.editBtn }}
              onClick={() => setEditField("first_name")}
            >
              Edit
            </button>
          </>
        )}
      </p>

      {/* Address */}
      <p>
        <span style={styles.label}>Address:</span>
        {editField === "address" ? (
          <>
            <input
              style={styles.input}
              placeholder="Street"
              value={tempValues.billing_street ?? selectedVendor.billing_street ?? ""}
              onChange={(e) => handleChange("billing_street", e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="City"
              value={tempValues.billing_city ?? selectedVendor.billing_city ?? ""}
              onChange={(e) => handleChange("billing_city", e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="State"
              value={tempValues.billing_state ?? selectedVendor.billing_state ?? ""}
              onChange={(e) => handleChange("billing_state", e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Pincode"
              value={tempValues.billing_pincode ?? selectedVendor.billing_pincode ?? ""}
              onChange={(e) => handleChange("billing_pincode", e.target.value)}
            />
            <button
              style={{ ...styles.button, ...styles.saveBtn }}
              onClick={() => handleSave("address")}
            >
              Save
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={() => setEditField("")}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {[selectedVendor.billing_street, selectedVendor.billing_city, selectedVendor.billing_state, selectedVendor.billing_pincode]
              .filter(Boolean)
              .join(", ") || "N/A"}
            <button
              style={{ ...styles.button, ...styles.editBtn }}
              onClick={() => setEditField("address")}
            >
              Edit
            </button>
          </>
        )}
      </p>

      {/* PAN Number */}
      <p>
        <span style={styles.label}>PAN Number:</span>
        {editField === "pan_number" ? (
          <>
            <input
              style={styles.input}
              value={tempValues.pan_number ?? selectedVendor.pan_number ?? ""}
              onChange={(e) => handleChange("pan_number", e.target.value)}
            />
            <button
              style={{ ...styles.button, ...styles.saveBtn }}
              onClick={() => handleSave("pan_number")}
            >
              Save
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={() => setEditField("")}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {selectedVendor.pan_number || "N/A"}
            <button
              style={{ ...styles.button, ...styles.editBtn }}
              onClick={() => setEditField("pan_number")}
            >
              Edit
            </button>
          </>
        )}
      </p>

      {/* GST Number */}
      <p>
        <span style={styles.label}>GST Number:</span>
        {editField === "gst_number" ? (
          <>
            <input
              style={styles.input}
              value={tempValues.gst_number ?? selectedVendor.gst_number ?? ""}
              onChange={(e) => handleChange("gst_number", e.target.value)}
            />
            <button
              style={{ ...styles.button, ...styles.saveBtn }}
              onClick={() => handleSave("gst_number")}
            >
              Save
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={() => setEditField("")}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {selectedVendor.gst_number || "N/A"}
            <button
              style={{ ...styles.button, ...styles.editBtn }}
              onClick={() => setEditField("gst_number")}
            >
              Edit
            </button>
          </>
        )}
      </p>

      {/* MSME */}
      <p>
        <span style={styles.label}>Is MSME:</span>
        {editField === "is_msme" ? (
          <>
            <input
              style={styles.input}
              value={tempValues.is_msme ?? selectedVendor.is_msme ?? ""}
              onChange={(e) => handleChange("is_msme", e.target.value)}
            />
            <button
              style={{ ...styles.button, ...styles.saveBtn }}
              onClick={() => handleSave("is_msme")}
            >
              Save
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelBtn }}
              onClick={() => setEditField("")}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {selectedVendor.is_msme || "N/A"}
            <button
              style={{ ...styles.button, ...styles.editBtn }}
              onClick={() => setEditField("is_msme")}
            >
              Edit
            </button>
          </>
        )}
      </p>

      {/* Registration */}
     <p>
  <span style={styles.label}>Registration:</span>
  {editField === "registration_type" ? (
    <>
      <select
        style={styles.input}
        value={tempValues.registration_type ?? selectedVendor.registration_type ?? ""}
        onChange={(e) => handleChange("registration_type", e.target.value)}
      >
        <option style={styles.option} value="">
          Select Type
        </option>
        <option style={styles.option} value="Micro">
          Micro
        </option>
        <option style={styles.option} value="Small">
          Small
        </option>
        <option style={styles.option} value="Medium">
          Medium
        </option>
      </select>

      <input
        style={styles.input}
        placeholder="Number"
        value={tempValues.registration_number ?? selectedVendor.registration_number ?? ""}
        onChange={(e) => handleChange("registration_number", e.target.value)}
      />

      <button
        style={{ ...styles.button, ...styles.saveBtn }}
        onClick={() => handleSave("registration_type")}
      >
        Save
      </button>
      <button
        style={{ ...styles.button, ...styles.cancelBtn }}
        onClick={() => setEditField("")}
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      {selectedVendor.registration_type || "N/A"} - {selectedVendor.registration_number || ""}
      <button
        style={{ ...styles.button, ...styles.editBtn }}
        onClick={() => setEditField("registration_type")}
      >
        Edit
      </button>
    </>
  )}
</p>


      {/* TDS */}
      <p>
  <span style={styles.label}>TDS:</span>
  {editField === "tds" ? (
    <>
      <select
        style={styles.input}
        value={tempValues.tds ?? selectedVendor.tds ?? ""}
        onChange={(e) => handleChange("tds", e.target.value)}
      >
        <option style={styles.option} value="">
          Select a TDS
        </option>
        <option style={styles.option}>Commission or Brokerage [2%]</option>
        <option style={styles.option}>Commission or Brokerage (Reduced) [3.75%]</option>
        <option style={styles.option}>Dividend [10%]</option>
        <option style={styles.option}>Dividend (Reduced) [7.5%]</option>
        <option style={styles.option}>Other Interest than securities [10%]</option>
        <option style={styles.option}>Other Interest than securities (Reduced) [7.5%]</option>
        <option style={styles.option}>Payment of contractors for Others [2%]</option>
        <option style={styles.option}>Payment of contractors for Others (Reduced) [1.5%]</option>
        <option style={styles.option}>Payment of contractors HUF/Indiv [1%]</option>
        <option style={styles.option}>Payment of contractors HUF/Indiv (Reduced) [0.75%]</option>
        <option style={styles.option}>Professional Fees [10%]</option>
        <option style={styles.option}>Professional Fees (Reduced) [7.5%]</option>
        <option style={styles.option}>Rent on land or furniture etc [10%]</option>
        <option style={styles.option}>Rent on land or furniture etc (Reduced) [7.5%]</option>
        <option style={styles.option}>Technical Fees (2%)</option>
      </select>

      <button
        style={{ ...styles.button, ...styles.saveBtn }}
        onClick={() => handleSave("tds")}
      >
        Save
      </button>
      <button
        style={{ ...styles.button, ...styles.cancelBtn1 }}
        onClick={() => setEditField("")}
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      {selectedVendor.tds || "N/A"}
      <button
        style={{ ...styles.button, ...styles.editBtn }}
        onClick={() => setEditField("tds")}
      >
        Edit
      </button>
    </>
  )}
</p>

    </div>

    </>
  )}


 {activeVendorTab === "Documents" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

   

    {selectedVendor.pan_file && (
      <div
        style={styles.docBtn}
        onClick={() =>
          window.open(
            `https://darkslategrey-shrew-424102.hostingersite.com/api/uploads/${selectedVendor.pan_file}`,
            "_blank"
          )
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AiOutlineFileText size={20} color="#555" />
          <div>
            <div style={{ fontWeight: 500 }}>PAN Card</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {selectedVendor.pan_number}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {verifiedDocs.pan ? (
            <span style={styles.badgeStyle}>
              <MdVerified size={14} />
              Verified
            </span>
          ) : (
            <>
              <button
                onClick={(e) => handleVerify("pan", e)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Verify
              </button>

              {/* 🔴 DELETE BUTTON (Only if not verified) */}
              <button
                onClick={(e) => handleDeleteDoc("pan", e)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    )}

    {selectedVendor.gst_file && (
      <div
        style={styles.docBtn}
        onClick={() =>
          window.open(
            `https://darkslategrey-shrew-424102.hostingersite.com/api/uploads/${selectedVendor.gst_file}`,
            "_blank"
          )
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AiOutlineFileText size={20} color="#555" />
          <div>
            <div style={{ fontWeight: 500 }}>GST Document</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {selectedVendor.gst_number}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {verifiedDocs.gst ? (
            <span style={styles.badgeStyle}>
              <MdVerified size={14} />
              Verified
            </span>
          ) : (
            <>
              <button
                onClick={(e) => handleVerify("gst", e)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px ",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Verify
              </button>

              {/* 🔴 DELETE BUTTON */}
              <button
                onClick={(e) => handleDeleteDoc("gst", e)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    )}

    {selectedVendor.registration_file && (
      <div
        style={styles.docBtn}
        onClick={() =>
          window.open(
            `https://darkslategrey-shrew-424102.hostingersite.com/api/uploads/${selectedVendor.registration_file}`,
            "_blank"
          )
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AiOutlineFileText size={20} color="#555" />
          <div>
            <div style={{ fontWeight: 500 }}>Registration Document</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {selectedVendor.registration_registration_number}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {verifiedDocs.registration ? (
            <span style={styles.badgeStyle}>
              <MdVerified size={14} />
              Verified
            </span>
          ) : (
            <>
              <button
                onClick={(e) => handleVerify("registration", e)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Verify
              </button>

              {/* 🔴 DELETE BUTTON */}
              <button
                onClick={(e) => handleDeleteDoc("registration", e)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    )}

    {selectedVendor.cancelled_check_file && (
      <div
        style={styles.docBtn}
        onClick={() =>
          window.open(
            `https://darkslategrey-shrew-424102.hostingersite.com/api/uploads/${selectedVendor.cancelled_check_file}`,
            "_blank"
          )
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AiOutlineFileText size={20} color="#555" />
          <div>
            <div style={{ fontWeight: 500 }}>Cancelled Check</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {selectedVendor.cancelled_check_file}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {verifiedDocs.cancelled ? (
            <span style={styles.badgeStyle}>
              <MdVerified size={14} />
              Verified
            </span>
          ) : (
            <>
              <button
                onClick={(e) => handleVerify("cancelled", e)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Verify
              </button>

              {/* 🔴 DELETE BUTTON */}
              <button
                onClick={(e) => handleDeleteDoc("cancelled", e)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: 4,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    )}

    {!selectedVendor.pan_file &&
      !selectedVendor.gst_file &&
      !selectedVendor.registration_file &&
      !selectedVendor.cancelled_check_file && (
        <p style={{ color: "#777", fontSize: 14 }}>No documents uploaded</p>
      )}

    {/* ----------------- New Document Upload Section ----------------- */}
    <div
      style={{
        ...styles.docBtn,
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "10px",
      }}
    >
      <label style={{ fontWeight: 500, marginBottom: 5 }}>
        Upload Document:
      </label>
      <select
        value={newDocType}
        onChange={(e) => setNewDocType(e.target.value)}
        style={{
          padding: "5px 10px",
          borderRadius: 4,
          border: "1px solid #ccc",
          marginBottom: 10,
          width: "100%",
          maxWidth: 250,
        }}
      >
        <option value="">Select Document Type</option>
        {!selectedVendor.pan_file && <option value="pan">PAN Card</option>}
        {!selectedVendor.gst_file && (
          <option value="gst">GST Document</option>
        )}
        {!selectedVendor.registration_file && (
          <option value="registration">Registration Document</option>
        )}
        {!selectedVendor.cancelled_check_file && (
          <option value="cancelled">Cancelled Check</option>
        )}
      </select>

      <input
        type="file"
        onChange={(e) => setNewDocFile(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />

      <button
        onClick={handleUploadNewDoc}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "5px 15px",
          fontSize: 13,
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  </div>
)}




  {/* You can add similar blocks for "Transactions" and "Notes" later */}
</div>

      {/* Buttons */}
      {/* Modal Footer */}
<div style={styles.modalFooter}>
  

  {/* Show Verify Vendor button only if:
        1. Active tab is "verify"
        2. Vendor status is not Verified */}
  {activeTab === "verify" && selectedVendor.status !== "Verified" && (
    <button style={styles.verifyBtn} onClick={handleVerifyVendor}>
      Verify Vendor
    </button>
  )}

  
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
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f9f9fb",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { margin: 0, fontSize: 22, color: "#333" },
  subtitle: { margin: "4px 0 0", color: "#777", fontSize: 14 },
  addBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  filterRow: { margin: "20px 0" },
  search: {
    width: "10%",
    padding: "10px",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  tabs: { display: "flex", gap: 10, marginBottom: 20 },
  tabBtn: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "500",
  },
  badgeOrange: {
    backgroundColor: "#ffebcc",
    color: "#ff9800",
    borderRadius: 12,
    padding: "2px 8px",
    marginLeft: 8,
  },
  badgeGreen: {
    backgroundColor: "#e8f5e9",
    color: "#4caf50",
    borderRadius: 12,
    padding: "2px 8px",
    marginLeft: 8,
  },
  badgeStyle:{
     backgroundColor: "#28a745",
                color: "#fff",
                padding: "3px 8px",
                fontSize: 12,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop:"10px",
  },
   badgeStyle1:{
     backgroundColor: "#28a745",
                color: "#fff",
                padding: "3px 8px",
                fontSize: 12,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop:"10px",
                width:"60px"
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 2fr 2fr 2fr 2fr 1.5fr",
    fontWeight: "600",
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
    color: "#555",
    background: "#f8f8f8",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 2fr 2fr 2fr 2fr 1.5fr",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
  },
  th: { textAlign: "left" },
  td: { textAlign: "left", fontSize: 14 },
  avatar: {
    display: "inline-block",
    width: 32,
    height: 32,
    lineHeight: "32px",
    borderRadius: "50%",
    background: "#E0E7FF",
    color: "#3B4CCA",
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 8,
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12,
    marginRight: 4,
  },
  phone: { color: "#777", fontSize: 12 },
  viewBtn: {
    backgroundColor: "#f1f1f1",
    color: "#333",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
  },
  modalWide: {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  zIndex: 1000,
  overflowY: "auto",
  maxHeight: "90vh",
},
vendorHeader: {
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 16,
},
vendorAvatar: {
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: "#3B4CCA",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  fontWeight: "bold",
},
pendingBadge: {
  marginTop: 6,
  display: "inline-block",
  fontSize: 12,
  padding: "4px 10px",
  backgroundColor: "#fff3cd",
  color: "#856404",
  borderRadius: 6,
},
contactInfo: {
    marginLeft:"10px",
  fontSize: 16,
  marginBottom: 20,
},
tabsRow: {
  display: "flex",
  gap: 12,
  borderBottom: "1px solid #eee",
  marginBottom: 16,
},
tab: {
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: 18,
  color: "#666",
},
activeTab: {
  backgroundColor: "#fff",
  borderBottom: "2px solid #007bff",
  fontWeight: "bold",
  color: "#000",
},
overviewSection: {
  fontSize: 15,
  marginBottom: 20,
},
docGreen: {
  padding: "4px 10px",
  backgroundColor: "#E8F5E9",
  color: "#2E7D32",
  borderRadius: 6,
  fontSize: 13,
},
docRed: {
  padding: "4px 10px",
  backgroundColor: "#FFEBEE",
  color: "#C62828",
  borderRadius: 6,
  fontSize: 12,
},
modalFooter: {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
},
cancelBtn: {
  padding: "10px 16px",
  backgroundColor: "#f8f8f8",
  border: "1px solid #ccc",
  borderRadius: 6,
  cursor: "pointer",
},
verifyBtn: {
  padding: "10px 16px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
},
overlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "flex-end", // panel slides from right
},

offCanvas: {
  position: "relative",
  width: "800px",
  height: "100%",
  backgroundColor: "#fff",
  padding: 24,
  boxShadow: "-2px 0 12px rgba(0,0,0,0.2)",
  overflowY: "auto",
  transform: "translateX(0%)",
  transition: "transform 0.5s ease-in-out",
  animation: "slideIn 0.3s forwards",
},

closeBtn: {
  position: "absolute",
  top: 10,
  right: 10,
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
},

// Add keyframes for sliding
"@keyframes slideIn": {
  from: { transform: "translateX(100%)" },
  to: { transform: "translateX(0%)" },
},

 docBtn: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    gap: "10px",
    position: "relative", // NEW
  },

    container1: {
      padding: 20,
      lineHeight: "1.8",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    },
    label: {
      fontWeight: "bold",
      marginRight: 8,
    },
    input: {
      padding: "6px 10px",
      border: "1px solid #ccc",
      borderRadius: 6,
      outline: "none",
      fontSize: 14,
      marginTop: 4,
      marginRight: 6,
    },
    button: {
      padding: "6px 12px",
      border: "none",
      borderRadius: 6,
      fontSize: 13,
      cursor: "pointer",
      marginLeft: 5,
      transition: "0.2s",
    },
    saveBtn: {
      backgroundColor: "#007bff",
      color: "white",
    },
    cancelBtn1: {
      backgroundColor: "#e0e0e0",
    },
    editBtn: {
      backgroundColor: "#f5f5f5",
    },


};

export default VendorPage;
