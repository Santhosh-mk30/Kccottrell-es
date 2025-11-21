import React, { useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 





const LocalTravel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromDate: '',
    Date: '',
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



 // Initial form state
const initialFormData = {
  fromDate: '',
  Date: '',
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
             "linear-gradient(135deg, #85beffff, #5998f7ff)", 
  "linear-gradient(135deg, #59b0f7ff, #365cc4ff)",   
  "linear-gradient(135deg, #85a6ffff, #595cf7ff)"    
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


  <h2 style={styles.heading}>Local Tavel Request</h2>

 
</div>

         
        </motion.h2>

      
    
        <div>
          <form onSubmit={handleSubmit} style={styles.form}>
 

{/* Transport Section with Multiple Entries */}
<div>
  {formData.transports?.map((item, index) => (
   <div
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#9ef588ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#5963f7ff",
      borderBottom: "2px solid #5963f7ff",
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
          {["Train","Bus", "Taxi", "Auto", "Bike"].map((mode) => (
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
{item.transportMode === "Taxi" && (
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
    {/* Per km info */}
{["Taxi", "Self", "Uber", "Ola", "Auto"].includes(item.transportMode) && (
  <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
    Four Wheeler per km charge: ₹10
  </p>
)}

{["Bike", "Self"].includes(item.transportMode) && (
  <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
    Two Wheeler per km charge: ₹7
  </p>
)}
  </div>
)}

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
    {/* Per km info */}
{["Taxi", "Self", "Uber", "Ola", "Auto"].includes(item.transportMode) && (
  <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
    Four Wheeler per km charge: ₹10
  </p>
)}

{["Bike", "Self"].includes(item.transportMode) && (
  <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
    Two Wheeler per km charge: ₹7
  </p>
)}
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
    {/* Per km info */}
{["Taxi", "Self", "Uber", "Ola", "Auto"].includes(item.transportMode) && (
  <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
    Four Wheeler per km charge: ₹10
  </p>
)}

{["Bike", "Self"].includes(item.transportMode) && (
  <p style={{ marginTop: "5px", color: "#555", fontSize: "14px" }}>
    Two Wheeler per km charge: ₹7
  </p>
)}
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

        {/* Date Input */}
  <input
    type="date"
    value={item.date || ""}
    onChange={(e) => handleTransportChange(index, "date", e.target.value)}
    style={styles.input1}
  />
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
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
    {/* Amount Input */}
    <input
      type="number"
      placeholder="Amount"
      value={item.amount}
      onChange={(e) => handleTransportChange(index, "amount", e.target.value)}
      style={styles.input1}
    />

   
  </div>
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
          style={styles.input}
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
   </div>
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

  <div
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#9ef588ff, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #b4f8f1ff",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
     color: "#5963f7ff",
      borderBottom: "2px solid #5963f7ff",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
        Miscellaneous
      </h3>

      <h4
        style={{
          marginBottom: "15px",
          fontSize: "14px",
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
    color: "#3340f7ff",
    textAlign: "center",
    marginBottom: "20px",
    marginRight:"200px",
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


export default LocalTravel;
















































