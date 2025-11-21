import React, { useEffect,useState } from 'react';



const styles = {
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: 20,
    backgroundColor: '#f7f9fc',
    fontFamily: "'Segoe UI', sans-serif",
    borderRadius: 10,
    boxShadow: '0 0 10px #ccc',
  },
  title: {
    backgroundColor: '#0b41f3',
    color: '#fff',
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  horizontalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '100%',
    boxSizing: 'border-box',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  textarea: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '100%',
    height: 80,
    resize: 'none',
    boxSizing: 'border-box',
  },
  select: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '100%',
    boxSizing: 'border-box',
  },
};

const ServiceRequestForm = () => {
   const [formData, setFormData] = useState({
    name: '',
    date: '',
    project_code: '',
    project_name: '',
    location: '',
    mode: '',
    amount: '',
    purpose: '',
    documents: '',
  });


 

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("employee_name");
    if (storedName) setFormData(prev => ({ ...prev, name: storedName }));
  }, []);

  useEffect(() => {
    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/get_project_codes.php")
      .then(res => res.json())
      .then(data => { if(data.status === "success") setProjects(data.data); })
      .catch(err => console.error("API error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredProjects = projects.filter(proj =>
    `${proj.ProjectCode} - ${proj.ProjectName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (proj) => {
    setFormData(prev => ({ ...prev, project_code: proj.ProjectCode, project_name: proj.ProjectName }));
    setSearch(`${proj.ProjectCode} - ${proj.ProjectName}`);
    setShowOptions(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // prevent page reload

  try {
    const data = new FormData();

    // Append all fields except files
    Object.keys(formData).forEach((key) => {
      if (key !== "documents") data.append(key, formData[key]);
    });

    // Append multiple files
    if (formData.documents && formData.documents.length > 0) {
      Array.from(formData.documents).forEach((file) => {
        data.append("documents[]", file);
      });
    }

    // Send POST request
    const response = await fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/reimbursement_save.php", {
      method: "POST",
      body: data,
    });

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Result from server:", result);

    if (result.status === "success") {
      alert(result.message);
      // Reset form
      setFormData({
        name: '',
        date: '',
        project_code: '',
        project_name: '',
        location: '',
        mode: '',
        amount: '',
        purpose: '',
        documents: '',
      });
      setSearch("");
    } else {
      alert("Submission failed: " + result.message);
    }

  } catch (error) {
    console.error("Fetch error:", error);
    alert("An error occurred while submitting the form. Check console for details.");
  }
};





  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reimbursement Of Expense Form</h2>

      {/* Full Form */}
      <div style={styles.section}>
  <label style={styles.label}>Name</label>
  <input
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter your name"
    style={styles.input}
  />


        <label style={styles.label}>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
        />
<div style={{ position: "relative", flex: "1 1 45%", display: "flex", flexDirection: "column" }}>
        <label style={styles.label}>Project Code</label>
         <input
        type="text"
        style={{ padding: 10, border: "1px solid #ccc",marginTop:10, borderRadius: 4 }}
        placeholder="Search Project..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
      />
      {showOptions && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 150,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 4,
            backgroundColor: "#fff",
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proj) => (
              <li
                key={proj.ProjectCodeId}
                style={{ padding: 8, cursor: "pointer" }}
                onClick={() => handleSelect(proj)}
              >
                {proj.ProjectCode} - {proj.ProjectName}
              </li>
            ))
          ) : (
            <li style={{ padding: 8 }}>No Projects Found</li>
          )}
        </ul>
      )}
</div>
        <label style={styles.label}>Place to Visit</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
          style={styles.input}
        />

        <label style={styles.label}>Mode of Travel</label>
        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select mode</option>
          <option value="car">Car</option>
          <option value="train">Train</option>
          <option value="flight">Flight</option>
        </select>

        <label style={styles.label}>Amount (Rs.)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          style={styles.input}
        />

        <label style={styles.label}>Purpose</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Enter purpose of request"
          style={styles.textarea}
        />

      
<label style={styles.label}>Enclosed Documents</label>
<input
  type="file"
  multiple
  onChange={(e) => {
    setFormData((prev) => ({
      ...prev,
      documents: e.target.files, // store file list
    }));
  }}
  style={styles.input}
/>

      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
  <button
    style={{
      padding: "10px 20px",
      backgroundColor: "#0b41f3",
      color: "#fff",
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      fontWeight: "bold",
    }}
    onClick={handleSubmit}
  >
    Submit
  </button>
</div>

    </div>
  );
};

export default ServiceRequestForm;
