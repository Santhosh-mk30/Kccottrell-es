import React, { useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import internationalallowances from "./states/international allowances.json";
import country from "./states/country.json";




const InternationalTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
     fromDate: '',
     Date: '',
     toDate: '',
     fromDateacc: '',
     Dateacc: '',
     toDateacc: '',
     nightsacc:'',
     department: '',
     projectCode: '',
     state:'',
     place: '',
     companyProvidesAccommodation: "",
     workPlan: '', 
     purpose: '',
     purpose1: '',
     accommodation: '',
     enteredAccommodation:'',
     gstAmount:'',
     accommodation_document:'',
     accom_special_approval_amount:'',
     accom_special_approval_document:'',
     accom_special_approval_purpose:'',
     dailyAllowance: '',
     da_special_approval:'',
     special_approval_amount:'',
     special_approval_purpose:'',
     special_approval_document:'',
     transportAmount: '',
     parking: '',
     toll: '',
     communication: '',
     miscellaneous: '',
     others: '',
     modeOfPayment: '',
     ticketBookedBy: "",
     designation: '',
      transports: [
     {
       ticket_booked_by: "",
       from_place: "",
       to_place: "",
       amount: "",
       approval_document: null,
     },
   ],
   });

  const [selectedCountry, setSelectedCountry] = useState("");
   const [category, setCategory] = useState("");

    const allCountriesWithCategory = [
    ...country.CategoryA.map((c) => ({ name: c, category: "A" })),
    ...country.CategoryB.map((c) => ({ name: c, category: "B" })),
  ];

    const sortedCountries = allCountriesWithCategory.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleChange2= (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);

    const countryObj = allCountriesWithCategory.find(
      (c) => c.name === countryName
    );
    setCategory(countryObj ? countryObj.category : "");
  };


  
     const [expenses, setExpenses] = useState([
    { nature: "", value: "", approvalDocument: null },
  ]);
  
   const handleExpenseChange = (index, field, value) => {
    setExpenses((prev) => {
      const updatedExpenses = [...prev];
      updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
      return updatedExpenses;
    });
  };
  
  
   const addExpense = () => {
    setExpenses((prev) => [
      ...prev,
      { nature: "", value: "", approvalDocument: null },
    ]);
  };
  
  const removeExpense = (index) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };
  
  
const location = useLocation();

const getActiveTab = () => {
    if (location.pathname === "/request") return "domestic";
    if (location.pathname === "/international-trip") return "international";
    if (location.pathname === "/site-allowance") return "site";
    if (location.pathname === "/local-trip") return "local";
    return "";
  };

  const activeTab = getActiveTab();

  const buttons = [
    { key: "domestic", label: "Domestic Trip", path: "/request" },
    { key: "international", label: "International Trip", path: "/international-trip" },
    { key: "site", label: "Site Allowance", path: "/site-allowance" },
    { key: "local", label: "Local Trip", path: "/local-trip" },
  ];



   
 const handleChange1 = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

 

 

  const [error, setError] = useState("");



 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    let updated = { ...prev, [name]: value };

    if (name === "fromDate" || name === "toDate") {
      if (updated.fromDate && updated.toDate) {
        const from = new Date(updated.fromDate);
        const to = new Date(updated.toDate);

        const diffTime = to.getTime() - from.getTime();
        if (diffTime >= 0) {
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          const maxDaysInMonth = new Date(
            from.getFullYear(),
            from.getMonth() + 1,
            0
          ).getDate();

          if (diffDays > maxDaysInMonth) {
            setError(`This month has only ${maxDaysInMonth} days!`);
            updated.workPlan = "";
            updated.days = "";
            updated.nights = "";
          } else {
            setError("");
            updated.workPlan = `${diffDays} days`;
            updated.days = diffDays;
            updated.nights = diffDays - 1 < 0 ? 0 : diffDays - 1;
          }
        } else {
          setError("To date cannot be before From date!");
          updated.workPlan = "";
          updated.days = "";
          updated.nights = "";
        }
      }
    }

    return updated;
  });

     setFormData((prev) => {
    let updated = { ...prev, [name]: value };

    if (name === "fromDateacc" || name === "toDateacc") {
      if (updated.fromDateacc && updated.toDateacc) {
        const from = new Date(updated.fromDateacc);
        const to = new Date(updated.toDateacc);

        const diffTime = to.getTime() - from.getTime();
        if (diffTime >= 0) {
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        
          const maxDaysInMonth = new Date(
            from.getFullYear(),
            from.getMonth() + 1,
            0
          ).getDate();

          if (diffDays > maxDaysInMonth) {
            setError(`This month has only ${maxDaysInMonth} days!`);
            updated.workPlanacc = "";
            updated.nightsacc = "";
          } else {
            setError("");
            updated.workPlanacc = `${diffDays} days`;
            updated.nightsacc = diffDays - 1 < 0 ? 0 : diffDays - 1;
          }
        } else {
          setError("To date cannot be before From date!");
          updated.workPlanacc = "";
          updated.nightsacc = "";
        }
      }
    }

    return updated;

    
   
  });
};




useEffect(() => {
  if (formData.designation && category) {
    const desig = formData.designation;

    if (internationalallowances[desig] && internationalallowances[desig][category]) {
      setFormData((prev) => ({
        ...prev,
        accommodation: internationalallowances[desig][category].accommodation,
        dailyAllowance: internationalallowances[desig][category].daily,
      }));
    }
  }
}, [formData.designation, category]);

  

  const total = [
    formData.accommodation,
    formData.dailyAllowance,
    formData.transportAmount,
    formData.parking,
    formData.toll,
    formData.communication,
    formData.miscellaneous,
    formData.others,
  ]
    .map((val) => parseFloat(val) || 0)
    .reduce((a, b) => a + b, 0);

 
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = new FormData();


    // Add Local Storage values
  const name = localStorage.getItem("employee_name") || "";
  const department = localStorage.getItem("employee_department") || "";
  const designation = localStorage.getItem("employee_designation") || "";
  const employee_id = localStorage.getItem("employee_id") || "";

  payload.append("name", name);
  payload.append("department", department);
  payload.append("designation", designation);
  payload.append("employee_id", employee_id);
  // Trip Details
  payload.append("from_date", formData.fromDate || "");
  payload.append("to_date", formData.toDate || "");
  payload.append("period", formData.workPlan || "");
  payload.append("days", formData.days || 0);
  payload.append("project_code", formData.projectCode || "");
  payload.append("purpose_of_visit", formData.purpose || "");

  // Location
  payload.append("state", formData.state || "");
  payload.append("city", formData.place || "");
  payload.append("company_provides_accommodation", formData.companyProvidesAccommodation || "");
  payload.append("from_date_acc", formData.fromDateacc || "");
  payload.append("to_date_acc", formData.toDateacc || "");
  payload.append("nights_acc", formData.nightsacc || 0);
  payload.append("max_accommodation_amount", formData.accommodation || 0);
  payload.append("entered_accommodation_amount", formData.enteredAccommodation || 0);
  payload.append("gst_amount", formData.gstAmount || 0);

 payload.append("accommodation_document", formData.accommodation_document);

  payload.append("specialApproval", formData.specialApproval || "");
  payload.append("accom_special_approval_amount", formData.accom_special_approval_amount || "");
  payload.append("accom_special_approval_purpose", formData.accom_special_approval_purpose || "");

  payload.append("accom_special_approval_document", formData.accom_special_approval_document);
  payload.append("daily_allowance", formData.dailyAllowance || 0);

 payload.append("da_special_approval", formData.da_special_approval || "");
  payload.append("special_approval_amount", formData.special_approval_amount || "");
  payload.append("special_approval_purpose", formData.special_approval_purpose || "");
    payload.append("special_approval_document", formData.special_approval_document);


  payload.append("transports", JSON.stringify(formData.transports || []));
 
 
  // --- Transports ---
  payload.append("transports", JSON.stringify(formData.transports || []));

  // --- Transport documents (one or multiple) ---
  formData.transports.forEach((t, index) => {
    if (t.approval_document) {
      payload.append(`approval_document${index}`, t.approval_document);
    }
  });


   expenses.forEach((exp, index) => {
    payload.append(`nature${index}`, exp.nature);
    payload.append(`value${index}`, exp.value);
    if (exp.approvalDocument) {
      payload.append(`approvalDocument${index}`, exp.approvalDocument);
    }
  });
  
  try {
    const res = await fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/save_international_trip.php", {
   method: "POST",
      body: payload,
    });

    const data = await res.json();
    console.log("Response:", data);

    if (data.status === "success") {
      alert("Data saved successfully!");
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while submitting the form.");
  }
};




const addTransport = () => {
  setFormData((prev) => ({
    ...prev,
    transports: [
      ...prev.transports,
      {
        transportMode: "",
        autoType: "",
        bikeType: "",
        taxiType: "",
        ticketBookedBy: "",
        from: "",
        to: "",
        amount: "",
        approvalDocument: null,
      },
    ],
  }));
};

const removeTransport = (index) => {
  setFormData((prev) => {
    const newTransports = [...prev.transports];
    newTransports.splice(index, 1);
    return { ...prev, transports: newTransports };
  });
};



const handleTransportChange = (index, field, value) => {
  setFormData((prev) => {
    const newTransports = [...prev.transports];
    newTransports[index][field] = value;
    return { ...prev, transports: newTransports };
  });
};





 // Update total allowance whenever designation, category, days, or nights change
useEffect(() => {
  if (formData.designation && category) {
    const desig = formData.designation;

    // Check if the allowance exists for this designation & category
    if (internationalallowances[desig] && internationalallowances[desig][category]) {
      const baseAccommodation = parseFloat(internationalallowances[desig][category].accommodation) || 0;
      const baseDaily = parseFloat(internationalallowances[desig][category].daily) || 0;

      // Multiply by nights & days
      const totalAccommodation = (formData.nightsacc || 0) * baseAccommodation;
      const totalDaily = (formData.days || 0) * baseDaily;

      setFormData((prev) => ({
        ...prev,
        accommodation: totalAccommodation,
        dailyAllowance: totalDaily,
      }));
    }
  }
}, [formData.designation, category, formData.days, formData.nightsacc]);

useEffect(() => {
  if (formData.fromDate && formData.toDate) {
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    setFormData((prev) => ({
      ...prev,
      days: diffDays,
      workPlan: `${formatDate(from)} - ${formatDate(to)}`,
    }));
  }
}, [formData.fromDate, formData.toDate]);

const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/get_project_codes.php")
    .then(res => res.json())
    .then(data => {
        console.log("API Data:", data);  // <--- check this
        if(data.status === "success") setProjects(data.data);
    })
    .catch(err => console.error("API error:", err));
}, []);

 // Initial form state
const initialFormData = {
  fromDate: '',
  Date: '',
  toDate: '',
  fromDateacc: '',
  Dateacc: '',
  toDateacc: '',
  department: '',
  projectCode: '',
  place: '',
  workPlan: '', 
  days:'',
  purpose: '',
  purpose1: '',
  accommodation: '',
  dailyAllowance: '',
  transportAmount: '',
  parking: '',
  toll: '',
  communication: '',
  miscellaneous: '',
  others: '',
  modeOfPayment: '',
  ticketBookedBy: "",
  companyProvidesAccommodation: '',
  specialApproval: '',
  specialApproval1: '',
  specialApprovalSite: '',
  designation: '',
  nightsacc: '',
  enteredAccommodation: '',
  gstAmount: '',
  approvalDocument: null,
  transports: [
    { transportMode: "", ticketBookedBy: "", from: "", to: "", amount: "", autoType: "", bikeType: "", taxiType: "", approvalDocument: null }
  ]
};

// Clear button handler
const handleClear = () => {
  setFormData(initialFormData);  // reset form data
  setExpenses([]);                // reset expenses if stored separately
  localStorage.removeItem("internationaltripFormData"); // remove saved temporary data
  alert("Form cleared!");
};


// Save button handler
const handleSave = () => {
  // Create a copy of formData for saving
  const dataToSave = { ...formData };

  // Files cannot be stored in localStorage directly. You can save their names or just skip files for temp save.
  if (dataToSave.approvalDocument) {
    dataToSave.approvalDocument = dataToSave.approvalDocument.name;
  }

  // Similarly handle files in transports or expenses if needed
  if (dataToSave.transports) {
    dataToSave.transports = dataToSave.transports.map((t) => ({
      ...t,
      approvalDocument: t.approvalDocument ? t.approvalDocument.name : null,
    }));
  }

  if (expenses.length) {
    dataToSave.expenses = expenses.map((exp) => ({
      ...exp,
      approvalDocument: exp.approvalDocument ? exp.approvalDocument.name : null,
    }));
  }

  // Save to localStorage
  localStorage.setItem("internationaltripFormData", JSON.stringify(dataToSave));

  alert("Form data saved temporarily!");
};

// Load saved data when component mounts
useEffect(() => {
  const savedData = localStorage.getItem("internationaltripFormData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    setFormData(parsedData);

    // If expenses are saved separately in state, load them
    if (parsedData.expenses) {
      setExpenses(parsedData.expenses);
    }
  }
}, []);



  return (
      <div style={styles.container}>
<div style={styles.container}>
  {/* Left Card */}
  <div style={styles.leftCard}>
      <h3 style={styles.leftHeading}>Trip Menu</h3>
      <div style={styles.buttonContainer}>
       {buttons.map((btn) => (
  <motion.button
    key={btn.key}
    onClick={() => navigate(btn.path)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={
      activeTab === btn.key
        ? {
            background: [
             "linear-gradient(135deg, #ff9a85, #f76b59)", 
  "linear-gradient(135deg, #f76b59, #c44536)",   
  "linear-gradient(135deg, #ff9a85, #f76b59)"    
            ],
            color: "#fff"
          }
        : {
            backgroundColor: "#f1f3f6",
            color: "#333"
          }
    }
   
    transition={{
      duration: activeTab === btn.key ? 4 : 0.3, // active gradient loop is slower
      ease: "easeInOut",
      repeat: activeTab === btn.key ? Infinity : 0, // infinite loop only for active
    }}
    style={styles.mainButton}
  >
    {btn.label}
  </motion.button>
))}

      </div>
    </div>
</div>


  <div style={styles.rightCard}>
    <div style={styles.body}>
       <div style={styles.card1}>
      <motion.div
        style={styles.overlay}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          style={styles.heading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
           
           <div style={styles.header}>
 
  <img 
    src="/logo full.png"  
    alt="Company Logo"
    style={{ width: "200px", height: "60px" }}
  />


  <h2 style={styles.heading}>International Trip Request</h2>

 
</div>

         
        </motion.h2>

      
    
        <div>
          <form onSubmit={handleSubmit} style={styles.form}>
 <motion.div
  initial={{ opacity: 0, x: -100 }}       // left la start
  whileInView={{ opacity: 1, x: 0 }}      // screen ku vandha podhu
  viewport={{ once: true, amount: 0.5 }}  // once:true → animation one time; amount: 0.5 → 50% visible
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#b4f8f1ff, #f8fdfdff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#f76b59ff",
      borderBottom: "2px solid #f76b59ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
   Travel Details
  </h3>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
    {/* From */}
    <div style={styles.field}>
      <label style={styles.label}>From</label>
      <input
        type="date"
        name="fromDate"
        value={formData.fromDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        style={styles.input1}
      />
    </div>

    {/* To */}
    <div style={styles.field}>
      <label style={styles.label}>To</label>
      <input
        type="date"
        name="toDate"
        value={formData.toDate}
        min={formData.fromDate}
        max={
          formData.fromDate
            ? new Date(
                new Date(formData.fromDate).setDate(
                  new Date(formData.fromDate).getDate() + 30
                )
              )
                .toISOString()
                .split("T")[0]
            : ""
        }
        onChange={handleChange}
        style={styles.input1}
      />
    </div>

    {/* Period */}
    <div style={styles.field}>
      <label style={styles.label}>Period</label>
      <input
        type="text"
        value={formData.workPlan}
        readOnly
        style={styles.input1}
      />
    </div>

    {/* Days */}
    <div style={styles.field}>
      <label style={styles.label}>Days</label>
      <input
        type="text"
        value={formData.days}
        readOnly
        style={styles.input1}
      />
    </div>


    

    {/* Project Code */}
   <div style={styles.field2}>
      <label style={styles.label1}>Select Project: </label>
      <select
        style={styles.input2}       // <-- apply style here
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">-- Select Project --</option>
        {projects.length > 0 ? (
          projects.map((proj) => (
           <option key={proj.ProjectCodeId} value={proj.ProjectCode} title={`${proj.ProjectCode} - ${proj.ProjectName}`}>
  {proj.ProjectCode} - {proj.ProjectName}
</option>

          ))
        ) : (
          <option value="">No Projects Found</option>
        )}
      </select>
    </div>


        {/* Purpose of Visit */}
        <div style={styles.field}>
          <label style={styles.label}>Purpose of Visit</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Enter purpose"
            style={styles.input}
          />
        </div>

      

          
  </div>

  {error && (
    <div style={{ color: "red", fontWeight: "600", marginTop: "10px" }}>
      {error}
    </div>
  )}
</motion.div>



    
<motion.div
  initial={{ opacity: 0, x: -100 }}       // left la start
  whileInView={{ opacity: 1, x: 0 }}      // screen ku vandha podhu
  viewport={{ once: true, amount: 0.5 }}  // once:true → animation one time; amount: 0.5 → 50% visible
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#b4f8f1ff, #f8fdfdff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#f76b59ff",
      borderBottom: "2px solid #f76b59ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
    Accommodation Details
  </h3>
 
  {/* === First row: State / City / Tier === */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
    {/* State */}
    <div style={styles.field}>
      <label style={styles.label}>Country</label>
      <select
        id="country"
        value={selectedCountry}
        onChange={handleChange2}
        style={{ padding: "8px", margin: "10px 0", borderRadius: "5px" }}
      >
        <option value="">-- Select Country --</option>
        {sortedCountries.map((c, index) => (
          <option key={index} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>


    {/* Tier */}
    <div style={styles.field1}>
      {selectedCountry && (
        <p>
          Countries Category: <strong>(Category{" "} {category})</strong> 
          
        </p>
      )}
    </div>
  </div>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
    <div style={styles.field}>
      <label style={styles.label}>Designation</label>
      <select
        name="designation"
        value={formData.designation || ""}
        onChange={handleChange}
        style={styles.select}
      >
        <option value="">-- Select Designation --</option>
        <option value="MD">Managing Director/Director/COO/CFO</option>
        <option value="Director/HOD">
          Assistant VicePresident (AVP)/VicePresident (VP)/SeniorVicePresident (Sr.VP)
        </option>
        <option value="DGM/GM">General Manager/Sr.General Manager</option>
      </select>
    </div>

    <div style={styles.field}>
      <label style={styles.label}>Is Company Providing Accommodation?</label>
      <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
        <label>
          <input
            type="radio"
            name="companyProvidesAccommodation"
            value="Yes"
            checked={formData.companyProvidesAccommodation === "Yes"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                companyProvidesAccommodation: e.target.value,
              }))
            }
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="companyProvidesAccommodation"
            value="No"
            checked={formData.companyProvidesAccommodation === "No"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                companyProvidesAccommodation: e.target.value,
              }))
            }
          />
          No
        </label>
      </div>
    </div>
  </div>

{formData.companyProvidesAccommodation === "No" && (
  <>
  {/* === Third row: From / To / Nights === */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "20px" }}>
    <div style={styles.field}>
      <label style={styles.label}>From</label>
      <input
        type="date"
        name="fromDateacc"
        value={formData.fromDateacc}
        min={new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        style={styles.input1}
      />
    </div>
    <div style={styles.field}>
      <label style={styles.label}>To</label>
      <input
        type="date"
        name="toDateacc"
        value={formData.toDateacc}
        min={formData.fromDateacc}
        max={
          formData.fromDateacc
            ? new Date(
                new Date(formData.fromDateacc).setDate(
                  new Date(formData.fromDateacc).getDate() + 30
                )
              )
                .toISOString()
                .split("T")[0]
            : ""
        }
        onChange={handleChange}
        style={styles.input1}
      />
    </div>
    <div style={styles.field}>
      <label style={styles.label}>Nights</label>
      <input
        type="text"
        value={formData.nightsacc}
        readOnly
        style={styles.input1}
      />
    </div>
  </div>

  {/* === Fourth row: Allowance / Entered / GST === */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "20px" }}>
    <div style={styles.field}>
      <label style={styles.label}>Maximum Accommodation Allowance</label>
      <input
        type="text"
        value={formData.accommodation ?? ""}
        readOnly
        style={styles.input1}
      />
    </div>
    <div style={styles.field}>
      <label style={styles.label}>Enter Accommodation Amount</label>
      <input
        type="text"
        name="enteredAccommodation"
        value={formData.enteredAccommodation ?? ""}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          value = value === "" ? "" : parseFloat(value);

          if (value === "" || value <= (formData.accommodation)) {
            setFormData((prev) => ({
              ...prev,
              enteredAccommodation: value,
            }));
          }
        }}
        style={styles.input1}
        placeholder={`Enter up to ${formData.accommodation}`}
      />
      <p style={{ fontSize: "12px", color: "black", marginTop: "5px" }}>
        You cannot claim more than {formData.accommodation}
      </p>
    </div>
    <div style={styles.field}>
      <label style={styles.label}>GST Amount</label>
      <input
        type="text"
        name="gstAmount"
        value={formData.gstAmount ?? ""}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          value = value === "" ? "" : parseFloat(value);
          setFormData((prev) => ({
            ...prev,
            gstAmount: value,
          }));
        }}
        style={styles.input1}
        placeholder="Enter GST amount"
      />
    </div>
      <p><b>Base Accommodation:</b> ${internationalallowances[formData.designation]?.[category]?.accommodation ?? 0}</p>
<p><b>Nights:</b> {formData.nightsacc ?? 0}</p>
<p>
  <b>Total Accommodation:</b>{" "}
  ${(internationalallowances[formData.designation]?.[category]?.accommodation ?? 0)} ×{" "}
  {formData.nightsacc ?? 0} = ${formData.accommodation ?? 0}
</p> 

            <div style={styles.field}>
          <label style={styles.label}>Upload Document</label>
          <input
            type="file"
            name="approvalDocument"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                approvalDocument: e.target.files[0],
              }))
            }
            style={styles.input1}
          />
        </div>

         
  </div>

  {/* === Special Approval row === */}
  <div style={{ marginTop: "20px" }}>
    <label style={styles.label}>Do You Need Special Approval</label>
    <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
      <label>
        <input
          type="radio"
          name="specialApproval"
          value="Yes"
          checked={formData.specialApproval === "Yes"}
          onChange={handleChange}
        />
        Yes
      </label>
      <label>
        <input
          type="radio"
          name="specialApproval"
          value="No"
          checked={formData.specialApproval === "No"}
          onChange={handleChange}
        />
        No
      </label>
    </div>

    {formData.specialApproval === "Yes" && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "15px" }}>
        <div style={styles.field}>
          <label style={styles.label}>Amount</label>
          <input
            type="number"
            name="extraAmount"
            value={formData.extraAmount ?? ""}
            onChange={handleChange}
            style={styles.input1}
            placeholder="Enter amount"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Purpose</label>
          <input
            type="text"
            name="approvalPurpose"
            value={formData.approvalPurpose ?? ""}
            onChange={handleChange}
            style={styles.input1}
            placeholder="Enter purpose"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Upload Document</label>
          <input
            type="file"
            name="approvalDocument"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                approvalDocument: e.target.files[0],
              }))
            }
            style={styles.input1}
          />
        </div>

      
      </div>
    )}
  </div>
        </>
)}

</motion.div>


{/* Allowance Section */}
{formData.stillInSite === "Yes" ? (
  // Show Site Allowance
  <motion.div
  initial={{ opacity: 0, x: -100 }}       // left la start
  whileInView={{ opacity: 1, x: 0 }}      // screen ku vandha podhu
  viewport={{ once: true, amount: 0.5 }}  // once:true → animation one time; amount: 0.5 → 50% visible
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#b4f8f1ff, #f8fdfdff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#f76b59ff",
      borderBottom: "2px solid #f76b59ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
      Site Allowance Details
    </h3>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div style={styles.field}>
        <label style={styles.label}>Site Allowance</label>
        <input
          type="text"
          name="siteAllowance"
          value={formData.siteAllowance ?? ""}
          readOnly
          style={styles.input1}
        />
        <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
          For any expenses more than the site allowance, reimbursement requires
          proper justification and special approval from the management.
        </p>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Do You Need Special Approval</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <label>
            <input
              type="radio"
              name="specialApprovalSite"
              value="Yes"
              checked={formData.specialApprovalSite === "Yes"}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="specialApprovalSite"
              value="No"
              checked={formData.specialApprovalSite === "No"}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        {formData.specialApprovalSite === "Yes" && (
         
    <>
      {/* Extra Amount */}
      <div style={styles.field}>
        <label style={styles.label}>Extra Amount</label>
        <input
          type="number"
          name="extraAmount"
          value={formData.extraAmount ?? ""}
          onChange={handleChange}
          style={styles.input1}
          placeholder="Enter extra amount"
        />
      </div>

      {/* Purpose */}
      <div style={styles.field}>
        <label style={styles.label}>Purpose</label>
        <input
          type="text"
          name="approvalPurpose"
          value={formData.approvalPurpose ?? ""}
          onChange={handleChange}
          style={styles.input1}
          placeholder="Enter purpose"
        />
      </div>

      {/* Document Upload */}
      <div style={styles.field}>
        <label style={styles.label}>Upload Document</label>
        <input
          type="file"
          name="approvalDocument"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              approvalDocument: e.target.files[0],
            }))
          }
          style={styles.input1}
        />
      </div>
      
    </>

    

        )}

        
      </div>
    </div>
 </motion.div>
) : (
  // Show Daily Allowance
<motion.div
  initial={{ opacity: 0, x: -100 }}       // left la start
  whileInView={{ opacity: 1, x: 0 }}      // screen ku vandha podhu
  viewport={{ once: true, amount: 0.5 }}  // once:true → animation one time; amount: 0.5 → 50% visible
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#b4f8f1ff, #f8fdfdff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#f76b59ff",
      borderBottom: "2px solid #f76b59ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
      Daily Allowance Details
    </h3>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div style={styles.field}>
        <label style={styles.label}>Daily Allowance</label>
        <input
          type="text"
          name="dailyAllowance"
          value={formData.dailyAllowance ?? ""}
          readOnly
          style={styles.input1}
        />
       <div
  style={{
    display: "flex",
    gap: "40px",
    alignItems: "center",
    whiteSpace: "nowrap", 
    fontSize: "16px",
  }}
>
  <p><b>Base Daily:</b> ${internationalallowances[formData.designation]?.[category]?.daily ?? 0}</p>
<p><b>Days:</b> {formData.days ?? 0}</p>
<p>
  <b>Total Daily Allowance:</b>{" "}
  {(internationalallowances[formData.designation]?.[category]?.daily ?? 0)} ×{" "}
  {formData.days ?? 0} = ${formData.dailyAllowance ?? 0}
</p>


</div>



        <p style={{ fontSize: "12px", color: "black", marginTop: "5px" }}>
          For any expenses more than the daily allowance, reimbursement requires
          proper justification and special approval from the management.
        </p>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Do You Need Special Approval</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <label>
            <input
              type="radio"
              name="specialApproval1"
              value="Yes"
              checked={formData.specialApproval1 === "Yes"}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="specialApproval1"
              value="No"
              checked={formData.specialApproval1 === "No"}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        {formData.specialApproval1 === "Yes" && (
         
    <>
           
      {/* Extra Amount */}
      <div style={styles.field}>
        <label style={styles.label}> Amount</label>
        <input
          type="number"
          name="extraAmount"
          value={formData.extraAmount ?? ""}
          onChange={handleChange}
          style={styles.input1}
          placeholder="Enter amount"
        />
      </div>

      {/* Purpose */}
      <div style={styles.field}>
        <label style={styles.label}>Purpose</label>
        <input
          type="text"
          name="approvalPurpose"
          value={formData.approvalPurpose ?? ""}
          onChange={handleChange}
          style={styles.input1}
          placeholder="Enter purpose"
        />
      </div>

      {/* Document Upload */}
      <div style={styles.field}>
        <label style={styles.label}>Upload Document</label>
        <input
          type="file"
          name="approvalDocument"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              approvalDocument: e.target.files[0],
            }))
          }
          style={styles.input1}
        />
      </div>
            
    </>

        )}
      </div>
         
    </div>
 </motion.div>
)}


{/* Transport Section with Multiple Entries */}
<div>
  {formData.transports?.map((item, index) => (
    <motion.div
  initial={{ opacity: 0, x: -100 }}       // left la start
  whileInView={{ opacity: 1, x: 0 }}      // screen ku vandha podhu
  viewport={{ once: true, amount: 0.5 }}  // once:true → animation one time; amount: 0.5 → 50% visible
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#b4f8f1ff, #f8fdfdff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#f76b59ff",
      borderBottom: "2px solid #f76b59ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
        Transport  Details
      </h3>

      {/* Transport Mode */}
      <div style={styles.field}>
        <label style={styles.label}>Transport Mode</label>
        <div style={styles.radioGroup}>
          {["Air", "Train", "Bus", "Taxi", "Auto", "Bike"].map((mode) => (
            <label key={mode} style={styles.radioLabel}>
              <input
                type="radio"
                name={`transportMode-${index}`}
                value={mode}
                checked={item.transportMode === mode}
                onChange={(e) =>
                  handleTransportChange(index, "transportMode", e.target.value)
                }
                style={styles.radioInput}
              />
              {mode}
            </label>
          ))}
        </div>
      </div>

 
     {/* Auto Extra Input */}
{item.transportMode === "Auto" && (
  <div style={{ marginTop: "10px" }}>
    <label style={styles.label}>
      Mention Auto Type (Rapido / Uber / Ola / Self / etc...)
    </label>
    <input
      type="text"
      name={`autoType-${index}`}
      value={item.autoType || ""}
      onChange={(e) =>
        handleTransportChange(index, "autoType", e.target.value)
      }
      style={styles.input1}
      placeholder="Enter Auto type"
    />
  </div>
)}

{/* Bike Extra Input */}
{item.transportMode === "Bike" && (
  <div style={{ marginTop: "10px" }}>
    <label style={styles.label}>
      Mention Bike Type (Own / Rapido / Self / etc...)
    </label>
    <input
      type="text"
      name={`bikeType-${index}`}
      value={item.bikeType || ""}
      onChange={(e) =>
        handleTransportChange(index, "bikeType", e.target.value)
      }
      style={styles.input1}
      placeholder="Enter Bike type"
    />
  </div>
)}

{/* Taxi Extra Input */}
{item.transportMode === "Taxi" && (
  <div style={{ marginTop: "10px" }}>
    <label style={styles.label}>
      Mention Taxi Type (Uber / Ola / Self / etc...)
    </label>
    <input
      type="text"
      name={`taxiType-${index}`}
      value={item.taxiType || ""}
      onChange={(e) =>
        handleTransportChange(index, "taxiType", e.target.value)
      }
      style={styles.input1}
      placeholder="Enter Taxi type"
    />
  </div>
)}


      {/* Ticket Booked By */}
      <div style={styles.field}>
        <label style={styles.label}>Booked By</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <label>
            <input
              type="radio"
              name={`ticketBookedBy-${index}`}
              value="Self"
              checked={item.ticketBookedBy === "Self"}
              onChange={(e) =>
                handleTransportChange(index, "ticketBookedBy", e.target.value)
              }
            />
            Self
          </label>
          <label>
            <input
              type="radio"
              name={`ticketBookedBy-${index}`}
              value="Company"
              checked={item.ticketBookedBy === "Company"}
              onChange={(e) =>
                handleTransportChange(index, "ticketBookedBy", e.target.value)
              }
            />
            Company
          </label>
        </div>
      </div>

      {/* From / To / Amount */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          placeholder="From"
          value={item.from}
          onChange={(e) => handleTransportChange(index, "from", e.target.value)}
          style={styles.input1}
        />
        <input
          type="text"
          placeholder="To"
          value={item.to}
          onChange={(e) => handleTransportChange(index, "to", e.target.value)}
          style={styles.input1}
        />
        {item.ticketBookedBy === "Self" && (
          <>
          <input
            type="number"
            placeholder="Amount"
            value={item.amount}
            onChange={(e) =>
              handleTransportChange(index, "amount", e.target.value)
            }
            style={styles.input1}
          />    
       
    </>
   )}
 {item.ticketBookedBy === "Self" && (
          <>
      <label style={styles.label}>Upload Document</label>
       
        <input
          type="file"
          name="approvalDocument"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              approvalDocument: e.target.files[0],
            }))
          }
          style={styles.input1}
        />
     
    </>


          

          
          

        )}
        

          
      </div>



        

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => removeTransport(index)}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Remove
      </button>
   </motion.div>
  ))}

  {/* Add Button */}
  <button
    type="button"
    onClick={addTransport}
    style={{
      padding: "8px 15px",
      background: "green",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      marginTop:"10px",
    }}
  >
    + Add Transport
  </button>
</div>

  <motion.div
  initial={{ opacity: 0, x: -100 }}       // left la start
  whileInView={{ opacity: 1, x: 0 }}      // screen ku vandha podhu
  viewport={{ once: true, amount: 0.5 }}  // once:true → animation one time; amount: 0.5 → 50% visible
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#b4f8f1ff, #f8fdfdff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#f76b59ff",
      borderBottom: "2px solid #f76b59ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
        Miscellaneous
      </h3>

      <h4
        style={{
          marginBottom: "15px",
          color: "#0d47a1",
          fontSize: "16px",
        }}
      >
        Nature of Expense
      </h4>

      {expenses.map((exp, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Enter nature"
            value={exp.nature}
            onChange={(e) => handleExpenseChange(index, "nature", e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #90caf9",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <input
            type="number"
            placeholder="Value"
            value={exp.value}
            onChange={(e) => handleChange1(index, "value", e.target.value)}
            style={{
              width: "150px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #90caf9",
              outline: "none",
              fontSize: "14px",
              textAlign: "right",
            }}
          />

           <input
          type="file"
          name="approvalDocument"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              approvalDocument: e.target.files[0],
            }))
          }
          style={styles.input1}
        />
          <button
            type="button"
            onClick={() => removeExpense(index)}
            style={{
              background: "#ef5350",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>
      ))}

<button
  type="button"
  onClick={addExpense}
  style={{
    marginTop: "10px",
    background: "#42a5f5",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  }}
>
  + Add Expense
</button>

   </motion.div>
 
          <div style={styles.totalBox}>
            Total Amount: ${total}
          </div>
<div style={{ display: "flex", gap: "15px", marginTop: "20px", justifyContent: "center" }}>
  {/* Clear Button */}
  <button
    type="button"
    onClick={handleClear}
    style={{
      width: "120px",
      padding: "10px 0",
      background: "#ef5350",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    Clear
  </button>

  {/* Save Button */}
  <button
    type="button"
    onClick={handleSave}
    style={{
      width: "120px",
      padding: "10px 0",
      background: "#42a5f5",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    Save
  </button>

  {/* Submit Button */}
  <motion.button
    type="button"
    style={{
      width: "120px",
      padding: "10px 0",
      background: "#1565c0",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleSubmit}
  >
    Submit
  </motion.button>
</div>

        </form>
        </div>
    


        
      </motion.div>
      </div>
    </div>
  </div>
    </div>
  );
};


  const styles = {
  container: {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  padding: "90px",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
},
  leftCard: {
  position: "fixed",        // 👈 makes it stay fixed
  top: "220px",              // distance from top of page
  left: "150px",             // distance from left
  background: "#fff",
  padding: "20px",
  borderRadius: "70px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  border: "2px solid #000",
  width: "250px",
  height: "auto",           // it adjusts to content
  zIndex: 1000,             // keep it above other content
},

  leftHeading: {
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
 mainButton: {
  position: "relative",
  padding: "12px 20px",
  fontSize: "16px",
  fontWeight: "500",
  border: "none",
  borderRadius: "12px",
  background: "#f1f3f6",  
  color: "#333",
  cursor: "pointer",
  transition: "all 0.3s ease",
},

mainButtonActive: {
  background: "#2c3e50",   
  color: "#fff",           
  fontWeight: "600",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)", 
},


     activeIndicator: {
    position: "absolute",
    bottom: "4px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "40%",
    height: "3px",
    borderRadius: "2px",
    background: "#fff",
  },
mainButtonHover: {
  background: "#e0e3e8",   // hover effect
},
 field2: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px", // fixed width container
  },
  label1: {
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "14px",
  },
  input2: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "transparent",
  },
subMenu: {
  marginLeft: "10px",
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
},

subButton: {
  padding: "10px 12px",
  background: "#e6f0ff",
  border: "1px solid #b3d1ff",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "left",
  fontWeight: "500",
  fontSize: "13px",
  color: "#0d47a1",
  transition: "all 0.2s ease",
},
subButtonHover: {
  background: "#cce0ff",
  borderColor: "#99c2ff",
},

rightCard: {
  width: "100%",
  maxWidth: "1000px",
  background: "#fff",
  borderRadius: "75px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  padding: "30px",
  border: "2px solid #000",
  marginLeft: "auto",
},

  card: {
    width: "100%",
    maxWidth: "1000px",   // size control
    background: "#fff",   // white card
    borderRadius: "30px", // soft rounded corners
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)", // smooth shadow
    padding: "30px",
    border: "2px solid #000", // optional border
    margin: "20px auto", // center horizontally
  },
  body: {
    background: "transparent", 
    padding: "0",
    margin: "0",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "15px",
    borderBottom: "2px solid #eee",
    marginBottom: "25px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f76b59ff",
    textAlign: "center",
    marginBottom: "20px",
    marginRight:"180px",
  },
  subheading: {
    background: "linear-gradient(90deg, #2196f3, #21cbf3)",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "6px",
    margin: "25px 0 15px 0",
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "15px",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  field1: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginTop:"20px",
  },
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "14px",
  },
    transportSection: {
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#fafafa"
    },
    radioGroup: {
      display: "flex",
      gap: "20px",
      marginTop: "10px"
    },
    radioLabel: {
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    radioInput: {
      cursor: "pointer"
    },
    resultBox: {
      marginTop: "15px",
      padding: "10px",
      backgroundColor: "#e9f5ff",
      border: "1px solid #b3daff",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "14px"
    },
    resultText: {
      color: "#0073e6"
    },
     input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "transparent",
  },
  input1: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
    minWidth: "150px",
    background: "transparent",
  },
    inputFocus: {
      borderColor: "#2980b9",
      boxShadow: "0 0 6px rgba(41, 128, 185, 0.25)",
    },
   select: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
  },
    totalBox: {
      marginTop: "25px",
      padding: "14px",
      backgroundColor: "#b4f8f1ff",
      borderRadius: "8px",
      fontSize: "18px",
      textAlign: "center",
      fontWeight: "bold",
      color: "#f76b59ff",
      border: "1px solid #b4f8f1ff",
    },
   button: {
    marginTop: "25px",
    padding: "14px",
    background: "linear-gradient(135deg, #2980b9, #3498db)",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    transition: "all 0.3s ease",
  },
    buttonHover: {
      background: "linear-gradient(135deg, #1f6391, #2980b9)",
    },
    tabButton: (isActive) => ({
      padding: "8px 15px",
      marginLeft: "10px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      background: isActive ? "#2196f3" : "#ddd",
      color: isActive ? "white" : "black",
      fontWeight: "600",
      transition: "0.3s",
    }),
    error: {
      color: "red",
      fontSize: "14px",
      marginTop: "4px",
      fontWeight: "500",
    },
    page: {
    display: "flex",
    justifyContent: "center",  
    alignItems: "center",      
    minHeight: "100vh",       
    background: "#f9f9f9",  
  },
  };


export default InternationalTrip;
















































