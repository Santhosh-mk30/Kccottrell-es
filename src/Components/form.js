import React, { useState } from "react";

function JobForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    coverLetter: "",
    resume: null,
  });

  // Input change handle panna
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // file choose pannalum handle agum
    });
  };

  // Submit button press panna
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Application submitted successfully!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Job Application Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Phone */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Position */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Applying for Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Resume */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Resume</label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Cover Letter */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
        </div>

        <button type="submit" style={styles.button}>
          Submit Application
        </button>
      </form>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    background: "#fff",
    padding: "20px 30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "100px",
  },
  button: {
    width: "100%",
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default JobForm;
