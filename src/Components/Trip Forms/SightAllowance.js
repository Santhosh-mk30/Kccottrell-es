import React, { useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 

import citiesByState from "./states/Indian_Cities_In_States_JSON.json";
import cityTiers from "./states/cityTiers.json";
import allowances from "./states/allowances.json";
import DatePicker from "react-multi-date-picker";





const SightAllowance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    purpose: '',
    purpose1: '',
    accommodation: '',
    dailyAllowance: '',
    sightAllowance: '',
    transportAmount: '',
    parking: '',
    toll: '',
    communication: '',
    miscellaneous: '',
    others: '',
    modeOfPayment: '',
    ticketBookedBy: "",
    transports: [
    { transportMode: "", ticketBookedBy: "", from: "", to: "", amount: "" }
  ]
  });

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



  const [leaveDates, setLeaveDates] = useState([]); // array of leave dates

    const [expenses, setExpenses] = useState([{ nature: "", value: "" }]);
 const handleChange1 = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, { nature: "", value: "" }]);
  };

  const removeExpense = (index) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };



  const [error, setError] = useState("");



  const getTier = (city) => {
    if (cityTiers.Tier1.includes(city)) return "Tier 1  ('A' Area)";
    if (cityTiers.Tier2.includes(city)) return "Tier 2 ('B' Area)";
    return "Tier 3 ('C' Area)"; 
  };
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

            // ===== Leave days subtract here =====
            const leaveCount = (updated.leaveDates?.length || 0);
            const finalDays = Math.max(diffDays - leaveCount, 0);

            updated.workPlan = `${finalDays} days (including leaves deducted)`;
            updated.days = finalDays;
            updated.nights = finalDays > 0 ? finalDays - 1 : 0;
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




useEffect(() => {
  if (formData.designation && formData.place) {
    const tier = getTier(formData.place);
    const desig = formData.designation;

    if (allowances[desig] && allowances[desig][tier]) {
      setFormData((prev) => ({
        ...prev,
        accommodation: allowances[desig][tier].accommodation,
        sightAllowance: allowances[desig][tier].sight
      }));
    }
  }
}, [formData.designation, formData.place]);


  

  const total = [
    formData.accommodation,
    formData.sightAllowance,
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
    try {
      const response = await fetch(
        "https://darkslategrey-shrew-424102.hostingersite.com/api/save_trip.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.status === "success") {
        alert("Trip request submitted successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to submit: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error while submitting form.");
    }
  };

const addTransport = () => {
  setFormData((prev) => ({
    ...prev,
    transports: [
      ...prev.transports,
      { transportMode: "", ticketBookedBy: "", from: "", to: "", amount: "" }
    ]
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

useEffect(() => {
  if (formData.designation && formData.place && formData.fromDate && formData.toDate) {
    const tier = getTier(formData.place);
    const desig = formData.designation;

    if (allowances[desig] && allowances[desig][tier]) {
      const totalSightInMonth = parseFloat(allowances[desig][tier].sight) || 0;

      const month = formData.month || new Date().getMonth() + 1;
      const year = formData.year || new Date().getFullYear();
      const daysInMonth = new Date(year, month, 0).getDate();

      // Per-day sight allowance
      const perDaySight = totalSightInMonth / daysInMonth;

      // Trip period
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

     
      const validLeaveDays = (formData.leaveDates || []).filter((d) => {
        const ld = new Date(d);
        return ld >= from && ld <= to;
      }).length;

      // Adjusted trip days
      const adjustedTripDays = Math.max(diffDays - validLeaveDays, 0);

      // Sight allowance for trip
      const totalSightForTrip = Math.min(perDaySight * adjustedTripDays, totalSightInMonth);

      setFormData((prev) => ({
        ...prev,
        days: diffDays, // keep actual trip days also updated
        sightAllowance: totalSightForTrip,
        perDaySightAllowance: perDaySight,
        totalSightInMonth: totalSightInMonth,
      }));
    }
  }
},[
  formData.designation,
  formData.place,
  formData.fromDate,
  formData.toDate,
  formData.leaveDates,
  formData.month,
  formData.year,
]);






  useEffect(() => {
  if (formData.designation && formData.place) {
    const tier = getTier(formData.place);
    const desig = formData.designation;

    if (allowances[desig] && allowances[desig][tier]) {
      // Total from JSON
      const totalAccommodationInMonth = parseFloat(
        allowances[desig][tier].sightaccommodation
      ) || 0;

      // Month & Year
      const month = formData.month || new Date().getMonth() + 1;
      const year = formData.year || new Date().getFullYear();

      // Days in that month
      const daysInMonth = new Date(year, month, 0).getDate();

      // Per day calculation
      const perDayAccommodation = totalAccommodationInMonth / daysInMonth;

      // User selected nights
      const nights = formData.nightsacc || 0;

      // Total based on nights
      const totalAccommodation = perDayAccommodation * nights;

      setFormData((prev) => ({
        ...prev,
        perDayAccommodation: perDayAccommodation,     // show per-day
        accommodation: totalAccommodation,            // show total
        totalAccommodationInMonth: totalAccommodationInMonth, // keep reference
      }));
    }
  }
}, [
  formData.designation,
  formData.place,
  formData.month,
  formData.year,
  formData.nightsacc,
]);


useEffect(() => {
  if (formData.fromDate && formData.toDate) {
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

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
        setFormData((prev) => ({
          ...prev,
          workPlan: "",
          days: "",
          nights: "",
          periodDays: "",
        }));
      } else {
        setError("");

        const leaveCount = formData.leaveDates?.length || 0;
        const finalDays = Math.max(diffDays - leaveCount, 0);

        // format helper
        const formatDate = (date) => {
          const d = date.getDate().toString().padStart(2, "0");
          const m = (date.getMonth() + 1).toString().padStart(2, "0");
          const y = date.getFullYear();
          return `${d}-${m}-${y}`;
        };

        setFormData((prev) => ({
          ...prev,
          periodDays: diffDays, // full period
          days: finalDays,      // after leave deducted
          nights: finalDays > 0 ? finalDays - 1 : 0,
          workPlan: `${formatDate(from)} - ${formatDate(to)}`, // 👈 show date range
        }));
      }
    } else {
      setError("To date cannot be before From date!");
      setFormData((prev) => ({
        ...prev,
        workPlan: "",
        days: "",
        nights: "",
        periodDays: "",
      }));
    }
  }
}, [formData.fromDate, formData.toDate, formData.leaveDates]);


// Save button handler
const handleSave = () => {
  // Create a copy of formData for saving
  const dataToSave = { ...formData };

 
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

 
  localStorage.setItem("tripFormData", JSON.stringify(dataToSave));

  alert("Form data saved temporarily!");
};


useEffect(() => {
  const savedData = localStorage.getItem("tripFormData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    setFormData(parsedData);

   
    if (parsedData.expenses) {
      setExpenses(parsedData.expenses);
    }
  }
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
  days:'',
  workPlan: '', 
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
  leaveDates:'',
  transports: [
    { transportMode: "", ticketBookedBy: "", from: "", to: "", amount: "", autoType: "", bikeType: "", taxiType: "", approvalDocument: null }
  ]
};

// Clear button handler
const handleClear = () => {
  setFormData(initialFormData);  // reset form data
  setExpenses([]);                // reset expenses if stored separately
  localStorage.removeItem("tripFormData"); // remove saved temporary data
  alert("Form cleared!");
};


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
                    "linear-gradient(135deg, #ec5becff, #b80090ff)",
                    "linear-gradient(135deg, #fda5f6ff, #f84e70ff)",
                    "linear-gradient(135deg, #f39ae4ff, #ce8600ff))"
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


  <h2 style={styles.heading}>Sight Allowance Request</h2>

 
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
    background: "linear-gradient(135deg,#fca2a5ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #f0b5b7ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#3502acff",
      borderBottom: "2px solid #3502acff",
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


    {/* Department */}
    <div style={styles.field}>
      <label style={styles.label}>Department</label>
      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        style={{
          ...styles.select,
          backgroundColor: "#f1f8ff",
          border: "1px solid #90caf9",
        }}
      >
        <option value="">Select department</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="IT">IT</option>
      </select>
    </div>

     {/* Project Code */}
   <div style={styles.field1}>
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


<div style={styles.field}>
  <label style={styles.label}>Select Leave Dates:</label>
  <DatePicker
    multiple
    value={leaveDates}
    onChange={(dates) => {
      setLeaveDates(dates);
      setFormData((prev) => ({
        ...prev,
        leaveDates: dates,
      }));
    }}
    format="DD-MM-YYYY"
    minDate={formData.fromDate ? new Date(formData.fromDate) : new Date()} 
    maxDate={formData.toDate ? new Date(formData.toDate) : undefined} 
  />
  <p>Total Leave Days: {leaveDates.length}</p>
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
 background: "linear-gradient(135deg,#fca2a5ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
       color: "#3502acff",
      borderBottom: "2px solid #3502acff",
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
      <label style={styles.label}>State</label>
      <select
        name="state"
        value={formData.state || ""}
        onChange={handleChange}
        style={styles.select}
      >
        <option value="">-- Select State --</option>
        {Object.keys(citiesByState).map((state, index) => (
          <option key={index} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>

    {/* City */}
    <div style={styles.field}>
      <label style={styles.label}>City</label>
      <select
        name="place"
        value={formData.place || ""}
        onChange={handleChange}
        style={styles.select}
        disabled={!formData.state}
      >
        <option value="">-- Select City --</option>
        {formData.state &&
          citiesByState[formData.state].map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
      </select>
    </div>

    {/* Tier */}
    <div style={styles.field}>
      <label style={styles.label}>Tier</label>
      <input
        type="text"
        value={formData.place ? getTier(formData.place) : ""}
        readOnly
        style={styles.input1}
      />
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
        <option value="Managing Director/Director/COO/CFO">Managing Director/Director/COO/CFO</option>
        <option value="Assistant VicePresident (AVP)/VicePresident (VP)/SeniorVicePresident (Sr.VP)">
          Assistant VicePresident (AVP)/VicePresident (VP)/SeniorVicePresident (Sr.VP)
        </option>
        <option value="General Manager/Sr.General Manager">General Manager/Sr.General Manager</option>
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
      <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
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

      {/* === Cook / Cleaner Section === */}
<div style={styles.field}>
  <label style={styles.label}>Did you hire Cook / Cleaner?</label>
  <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
    <label>
      <input
        type="radio"
        name="cookCleaner"
        value="Yes"
        checked={formData.cookCleaner === "Yes"}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            cookCleaner: e.target.value,
            cookCleanerAmount: "", // reset when changed
          }))
        }
      />
      Yes
    </label>
    <label>
      <input
        type="radio"
        name="cookCleaner"
        value="No"
        checked={formData.cookCleaner === "No"}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            cookCleaner: e.target.value,
            cookCleanerAmount: "", // reset when changed
          }))
        }
      />
      No
    </label>
  </div>
</div>

{formData.cookCleaner === "Yes" && (
  <div style={styles.field}>
    <label style={styles.label}>Cook / Cleaner Amount (Max 10000)</label>
    <input
      type="text"
      name="cookCleanerAmount"
      value={formData.cookCleanerAmount ?? ""}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, ""); // numbers only
        value = value === "" ? "" : parseFloat(value);

        if (value === "" || value <= 10000) {
          setFormData((prev) => ({
            ...prev,
            cookCleanerAmount: value,
          }));
        }
      }}
      style={styles.input1}
      placeholder="Enter up to 10000"
    />
    <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
      You cannot claim more than 10000
    </p>
  </div>
)}

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
    background: "linear-gradient(135deg,#fca2a5ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
    <h3
      style={{
        marginBottom: "20px",
         color: "#3502acff",
      borderBottom: "2px solid #3502acff",
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
    background: "linear-gradient(135deg,#fca2a5ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
    <h3
      style={{
        marginBottom: "20px",
         color: "#3502acff",
      borderBottom: "2px solid #3502acff",
        paddingBottom: "8px",
        fontSize: "20px",
      }}
    >
      Sight Allowance Details
    </h3>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div style={styles.field}>
        <label style={styles.label}>Sight Allowance</label>
        <input
          type="text"
          name="sightAllowance"
          value={formData.sightAllowance ?? ""}
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
 
</div>



        <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
          For any expenses more than the sight allowance, reimbursement requires
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
    background: "linear-gradient(135deg,#fca2a5ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
      <h3
        style={{
          marginBottom: "20px",
           color: "#3502acff",
      borderBottom: "2px solid #3502acff",
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
          {["Air", "Train", "Bus", "Taxi", "Auto","Bike"].map((mode) => (
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



{/* Taxi Extra Input */}
{item.transportMode === "Bike" && (
  <div style={{ marginTop: "10px" }}>
    <label style={styles.label}>
      Mention Bike Type (Rapido / Uber / Ola / Self / etc...)
    </label>
    <input
      type="text"
      name={`bikeType-${index}`}
      value={item.taxiType || ""}
      onChange={(e) =>
        handleTransportChange(index, "bikeType", e.target.value)
      }
      style={styles.input1}
      placeholder="Enter Bike type"
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
       {/* Four Wheeler per km info */}
    {["Taxi", "Self", "Uber", "Ola","Auto"].includes(item.transportMode) && (
      <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
        Per km charge: ₹10
      </p>
    )}

      {/* two Wheeler per km info */}
    {["Bike", "Self",].includes(item.transportMode) && (
      <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
        Per km charge: ₹7
      </p>
    )}
        
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
    background: "linear-gradient(135deg,#fca2a5ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
      <h3
        style={{
          marginBottom: "20px",
           color: "#3502acff",
      borderBottom: "2px solid #3502acff",
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
            onChange={(e) => handleChange1(index, "nature", e.target.value)}
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
            Total Amount: {total}
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
 field1: {
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
    color: "#1a237e",
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
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "14px",
    marginTop:"10px",
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
      backgroundColor: "#f0b5b7ff",
      borderRadius: "8px",
      fontSize: "18px",
      textAlign: "center",
      fontWeight: "bold",
      color: "#0d47a1",
      border: "1px solid #bbdefb",
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


export default SightAllowance;
















































