import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VendorDetail = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    axios
      .get(`https://darkslategrey-shrew-424102.hostingersite.com/api/get_vendor_from_id.php?vendor_id=${vendorId}`)
      .then((res) => setVendor(res.data.data))
      .catch((err) => console.error(err));
  }, [vendorId]);

  if (!vendor) return <p>Loading...</p>;

  const skipFields = ["id", "pan_file", "gst_file", "registration_file", "cancelled_check_file"];
  const fileFields = {
    pan_file: "PAN File",
    gst_file: "GST File",
    registration_file: "Registration File",
    cancelled_check_file: "Cancelled Check File",
  };

  // Example summary amounts (replace with actual vendor fields)
  const outstandingPayable = vendor.outstanding_payable || 0;
  const pendingAmount = vendor.pending_amount || 0;

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>{vendor.company_name} Details</h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Left side - Details */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
            }}
          >
            {Object.keys(vendor).map((key) => {
              if (skipFields.includes(key)) return null;

              let value = vendor[key];

              if (fileFields[key] && value) {
                value = (
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    {fileFields[key]}
                  </a>
                );
              }

              if (typeof value === "object" && value !== null) {
                value = JSON.stringify(value);
              }

              return (
                <div
                  key={key}
                  style={{
                    padding: 15,
                    background: "#f4f6f8",
                    borderRadius: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {key.replace("_", " ").toUpperCase()}
                  </div>
                  <div>{value || "-"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Summary cards */}
        <div style={{ flex: 1, minWidth: 250, display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              padding: 20,
              background: "#fff1f0",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Outstanding Payable</div>
            <div style={{ fontSize: 24, color: "#d32f2f" }}>₹ {outstandingPayable}</div>
          </div>

          <div
            style={{
              padding: 20,
              background: "#e8f5e9",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Pending Amount</div>
            <div style={{ fontSize: 24, color: "#388e3c" }}>₹ {pendingAmount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
