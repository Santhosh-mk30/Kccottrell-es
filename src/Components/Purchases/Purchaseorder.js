import React, {useEffect,useState } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";


export default function PurchaseOrderPage() {
  const [formData, setFormData] = useState({
    erp_no: "",
    bill_date: "",
    project_code: "",
    itemDescription: "",
    supplier_name: "",
    po_number: "",
    bill_no: "",
    poYesNo: "",
    mode_of_transaction: "",
    payment_type: "",
    sanction_amount: "",
    in_favour_of: "",
    ddPlace: ""
  });

  
// Inside your component
const navigate = useNavigate();

  const [rows, setRows] = useState([{ id: 1, invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '',gstPercent: 0, gstAmount: 0  }]);
  const [gstPercent] = useState(0);
  const [reimbursement, setReimbursement] = useState('');
 const [tdsOptionId, setTdsOptionId] = useState(""); // store selected TDS id
  const [deductionType, setDeductionType] = useState('advance');
  const [adjustment, setAdjustment] = useState(0);
    const [suppliers, setSuppliers] = useState([]); // <-- suppliers list

const [suppliersData, setSuppliersData] = useState([]); // full API data


 const [projects, setProjects] = useState([]);


  useEffect(() => {
    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/get_project_codes.php")
    .then(res => res.json())
    .then(data => {
        console.log("API Data:", data);  // <--- check this
        if(data.status === "success") setProjects(data.data);
    })
    .catch(err => console.error("API error:", err));
}, []);

  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const filteredProjects = projects.filter((proj) =>
    `${proj.ProjectCode} - ${proj.ProjectName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelect = (proj) => {
    setFormData({
      ...formData,
      project_code: proj.ProjectCode,
      project_name: proj.ProjectName,
    });
    setSearch(`${proj.ProjectCode} - ${proj.ProjectName}`);
    setShowOptions(false);
  };


const [tdsRate, setTdsRate] = useState(0);          // numeric rate


const tdsOptions = [
  { id: 1, name: 'Commission or Brokerage [2%]', rate: 2 },
  { id: 2, name: 'Commission or Brokerage (Reduced) [3.75%]', rate: 3.75 },
  { id: 3, name: 'Dividend [10%]', rate: 10 },
  { id: 4, name: 'Dividend (Reduced) [7.5%]', rate: 7.5 },
  { id: 5, name: 'Other Interest than securities [10%]', rate: 10 },
  { id: 6, name: 'Other Interest than securities (Reduced) [7.5%]', rate: 7.5 },
  { id: 7, name: 'Payment of contractors for Others [2%]', rate: 2 },
  { id: 8, name: 'Payment of contractors for Others (Reduced) [1.5%]', rate: 1.5 },
  { id: 9, name: 'Payment of contractors HUF/Indiv [1%]', rate: 1 },
  { id: 10, name: 'Payment of contractors HUF/Indiv (Reduced) [0.75%]', rate: 0.75 },
  { id: 11, name: 'Professional Fees [10%]', rate: 10 },
  { id: 12, name: 'Professional Fees (Reduced) [7.5%]', rate: 7.5 },
  { id: 13, name: 'Rent on land or furniture etc [10%]', rate: 10 },
  { id: 14, name: 'Rent on land or furniture etc (Reduced) [7.5%]', rate: 7.5 },
  { id: 15, name: 'Technical Fees (2%) [2%]', rate: 2 },
];


 

  // Fetch suppliers once
  useEffect(() => {
    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/vendors_data.php")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const uniqueCompanies = Array.from(new Set(data.data.map(v => v.company_name)));
          setSuppliers(uniqueCompanies);
          setSuppliersData(data.data);
        }
      })
      .catch(err => console.error('Error fetching suppliers:', err));
  }, []);

const handleSupplierChange = (e) => {
  const value = e.target.value;

  setFormData(prev => {
    const updatedData = { ...prev, supplier_name: value };

    // Auto-fill "In Favour Of" only if it's empty
    if (!prev.in_favour_of) {
      updatedData.in_favour_of = value;
    }
 // Auto-fill billing details if supplier exists
    const supplierInfo = suppliersData.find(s => s.company_name === value);
    if (supplierInfo) {
      updatedData.billing_street = supplierInfo.billing_street || "";
      updatedData.billing_city = supplierInfo.billing_city || "";
      updatedData.billing_state = supplierInfo.billing_state || "";
      updatedData.billing_pincode = supplierInfo.billing_pincode || "";
    } else {
      // Clear billing fields if no supplier selected
      updatedData.billing_street = "";
      updatedData.billing_city = "";
      updatedData.billing_state = "";
      updatedData.billing_pincode = "";
    }
    return updatedData;
  });

  // Exit early if no value or suppliers data is empty
  if (!value || suppliersData.length === 0) return;

  // Find selected supplier in suppliersData
  const supplier = suppliersData.find(v => v.company_name === value);
  const supplierTdsName = supplier?.tds || "";

  // Find TDS option by name to get its ID and rate
  const tdsOption = tdsOptions.find(opt => opt.name.trim() === supplierTdsName.trim());

  setTdsOptionId(tdsOption?.id || "");  // store the TDS ID
  setTdsRate(tdsOption?.rate || 0);     // store the TDS rate
};


 


 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => {
    const newData = { ...prev, [name]: value };

    if (name === "payment_type") {
      if (value === "Full") {
        newData.sanction_amount = total; 
      } else {
        newData.sanction_amount = prev.sanction_amount || ""; 
      }
    }

    return newData;
  });
};


  




 const handleChange1 = (index, field, value) => {
  setRows(prevRows => {
    const newRows = [...prevRows];
    newRows[index][field] = value;

    // Update amount and gstAmount if amount changes
    if (field === "amount") {
      const gstPercent = newRows[index].gstPercent || 0;
      newRows[index].gstAmount = (parseFloat(value) || 0) * gstPercent / 100;
    }

    return newRows;
  });
};

const handleGstChange = (index, value) => {
  setRows(prevRows => {
    const newRows = [...prevRows];
    newRows[index].gstPercent = value;
    const amount = parseFloat(newRows[index].amount) || 0;
    newRows[index].gstAmount = (amount * value) / 100;
    return newRows;
  });
};


  const addRow = () => setRows([...rows, { id: Date.now(), invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
  const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const subtotal = rows.reduce(
  (sum, r) =>
    sum + (parseFloat(r.amount) || 0) + (parseFloat(r.gstAmount) || 0),
  0
);



  const gstAmount = (subtotal * gstPercent) / 100;
  const selectedTdsOption = tdsOptions.find(opt => parseInt(tdsOptionId) === opt.id);
  const tdsAmount = selectedTdsOption ? ((subtotal + gstAmount + (parseFloat(reimbursement) || 0)) * selectedTdsOption.rate) / 100 : 0;
  const total = subtotal + gstAmount + (parseFloat(reimbursement) || 0) - tdsAmount - (parseFloat(adjustment) || 0);

 



const handleSubmit = async () => {
  try {
    // Ensure numeric values
    const reimbursementValue = parseFloat(reimbursement) || 0;
    const adjustmentValue = parseFloat(adjustment) || 0;
    const gstValue = parseFloat(gstPercent) || 0;
    const sanctionAmountValue = parseFloat(formData.sanction_amount) || 0;

  // Subtotal (without GST)




// Ensure tdsOptionId is numeric and get selected TDS
const selectedTdsOption = tdsOptions.find(opt => opt.id === parseInt(tdsOptionId));

// TDS amount (calculated on subtotal+gst+reimbursement)


    // Build payload
   const payload = {
  admin_no: formData.erp_no || '',
  bill_no: formData.bill_no || '',
  bill_date: formData.bill_date || '',
  project_code: formData.project_code || '',
  po_number: formData.po_number || '',
  supplier_name: formData.supplier_name || '',
  gst_percent: gstValue,                  // percentage
  gst_amount: parseFloat(gstAmount.toFixed(2)),  // GST in ₹
  reimbursement: reimbursementValue,
  tds_name: selectedTdsOption ? selectedTdsOption.name : '',
  tds_rate: parseFloat(tdsAmount),     // TDS in ₹
  deduction_type: deductionType,
  adjustment: adjustmentValue,
  total_amount: total,
  mode_of_transaction: formData.mode_of_transaction || '',
  payment_type: formData.payment_type || '',
  sanction_amount: sanctionAmountValue,
  in_favour_of: formData.in_favour_of || '',
  
  // **Billing details from selected supplier**
  billing_street: formData.billing_street || '',
  billing_city: formData.billing_city || '',
  billing_state: formData.billing_state || '',
  billing_pincode: formData.billing_pincode || '',

  items: rows.map(r => ({
    item: r.item || '',
    hsnSac: r.hsnSac || '',
    quantity: parseFloat(r.quantity) || 0,
    rate: parseFloat(r.rate) || 0,
    per: r.per || '',
    basicValue: parseFloat(r.amount) || 0,  
    gst_percent: parseFloat(r.gstPercent) || 0,               
    gst_amount: parseFloat(r.gstAmount) || 0,   
  }))
};


    console.log("Payload to send:", payload);

    // Send to backend
    const response = await axios.post(
      'https://darkslategrey-shrew-424102.hostingersite.com/api/purchase_orders.php',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Backend response:", response.data);


    if (response.data.success) {
      alert(`Purchase Order submitted successfully! ID: ${response.data.order_id}`);

       navigate("/dashboard"); 

    } else {
      alert(`Failed to submit: ${response.data.error}`);
    }

  } catch (error) {
    console.error("Submission error:", error);
    alert('Failed to submit. Check console for details.');
  }
};






  return (
    <div style={{ padding: 20, fontFamily: 'Arial', maxWidth: 1000, margin: 'auto' }}>
      <h2>New Bill</h2>

        <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr", // two columns: left & right
        marginBottom: 20,
        alignItems: "center",
      }}
    >
      {/* ERP No on left */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", width:'180px'}}>
       
      </div>

      {/* Bill Date on right */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
        <label style={{ fontWeight: "bold", marginBottom: 5 }}>Invoice Date</label>
        <input
          type="date"
          name="bill_date"
           style={styles.input}
          value={formData.bill_date}
          onChange={handleChange}
        />
      </div>
    </div>



     {/* Project & Supplier Info */}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
 {/* Project / Contract Code */}

    <div style={{ position: "relative", flex: "1 1 45%", display: "flex", flexDirection: "column" }}>
      <label style={styles.label}>Project / Contract Code</label>
      <input
        type="text"
        style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
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



 {/* Invoice No */}
<div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
  <label style={styles.label}>Invoice No</label>
  <input
    type="text"
    name="bill_no"  
    style={styles.input}
    value={formData.bill_no}
    onChange={handleChange}
  />
</div>


  {/* Supplier’s Name */}
  <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
    <label style={styles.label}>Supplier’s Name</label>
    <select
      name="supplier_name"
      style={styles.input}
      value={formData.supplier_name}
      onChange={handleSupplierChange}
    >
      <option value="">Select Supplier</option>
      {suppliers.map((company, idx) => (
        <option key={idx} value={company}>{company}</option>
      ))}
    </select>
  </div>

  {/* Our P.O. No./Date (Yes/No) */}
  <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
    <label style={styles.label}>Our P.O. No./Date</label>
    <select
      name="poYesNo"
      style={styles.input}
      value={formData.poYesNo}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  {/* Enter P.O. No./Date - Only when Yes */}
  {formData.poYesNo === 'Yes' && (
    <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
      <label style={styles.label}>Enter P.O. No./Date</label>
      <input
        type="text"
        name="po_number"
        style={styles.input}
        value={formData.po_number}
        onChange={handleChange}
      />
    </div>
  )}
</div>


     {/* Item Table */}
<div style={{ overflowX: "auto", marginBottom: 20 }}>
   <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: 800,
      border: "1px solid #ddd",
      borderRadius: 8,
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <thead
      style={{
        backgroundColor: "#007BFF",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      <tr>
        <th style={styles.th}>Item.No</th>
        <th style={styles.th}>Item</th>
        <th style={styles.th}>HSN/SAC</th>
        <th style={styles.th}>Quantity</th>
        <th style={styles.th}>Rate</th>
        <th style={styles.th}>Per</th>
        <th style={styles.th}>Amount</th>
        <th style={styles.th}>GST</th>
        <th style={styles.th}>Action</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr
          key={i}
          style={{
            backgroundColor: i % 2 === 0 ? "#f9fbff" : "#ffffff",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e6f2ff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              i % 2 === 0 ? "#f9fbff" : "#ffffff")
          }
        >
          <td style={styles.td}>{i + 1}</td>

          {/* Item */}
          <td style={styles.td}>
            <input
              style={styles.inputWide}
              value={row.item}
              onChange={(e) => handleChange1(i, "item", e.target.value)}
            />
          </td>

          {/* HSN/SAC */}
          <td style={styles.td}>
            <input
              style={styles.inputSmall}
              value={row.hsnSac}
              onChange={(e) => handleChange1(i, "hsnSac", e.target.value)}
            />
          </td>

          {/* Quantity */}
          <td style={styles.td}>
            <input
              type="number"
              style={styles.inputSmall}
              value={row.quantity}
              onChange={(e) => handleChange1(i, "quantity", e.target.value)}
            />
          </td>

          {/* Rate */}
          <td style={styles.td}>
            <input
              type="number"
              style={styles.inputSmall}
              value={row.rate}
              onChange={(e) => handleChange1(i, "rate", e.target.value)}
            />
          </td>

          {/* Per */}
          <td style={styles.td}>
            <input
              style={styles.inputSmall}
              value={row.per}
              onChange={(e) => handleChange1(i, "per", e.target.value)}
            />
          </td>

          {/* Amount */}
          <td style={styles.td}>
            <input
              type="number"
              style={{
                ...styles.inputSmall,
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "none",
              }}
              value={row.amount === 0 ? "" : row.amount}
              onChange={(e) => handleChange1(i, "amount", e.target.value)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </td>

          {/* GST */}
          <td style={styles.td}>
            <select
              value={row.gstPercent || 0}
              onChange={(e) => handleGstChange(i, parseFloat(e.target.value))}
              style={{
                flex: "1 1 150px",
                padding: 6,
                border: "1px solid #ccc",
                borderRadius: 4,
                outline: "none",
                width:"70px"
              }}
            >
              <option value={0}>Select GST</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
            <span
              style={{
                minWidth: 80,
                textAlign: "right",
                flexShrink: 0,
                display: "inline-block",
                marginLeft: 8,
              }}
            >
              ₹{(row.gstAmount || 0).toFixed(2)}
            </span>
          </td>

          {/* Delete */}
          <td style={styles.td}>
            <button
              onClick={() => deleteRow(i)}
              style={{
                color: "red",
                cursor: "pointer",
                border: "none",
                background: "none",
                fontSize: 18,
              }}
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>



  <button
    onClick={addRow}
    style={{
      marginTop: 12,
      padding: "10px 18px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Add Row
  </button>
</div>


      

<div
  style={{
    flex: '0 0 400px', // fixed width on large screens
    width: '100%',      // full width on small screens
    maxWidth: 400,
    marginLeft: 'auto', // push to right on large screens
    border: '1px solid #ddd',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  }}
>
  {/* Sub Total */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap' }}>
    <strong>Sub Total</strong>
    <span>₹{subtotal.toFixed(2)}</span>
  </div>

 

{/* Reimbursement Section */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // always 3 per row
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <label style={{ minWidth: 100 }}>Reimbursement</label>
  <input
    type="number"
    value={reimbursement}
    onChange={(e) =>
      setReimbursement(e.target.value === "" ? "" : parseFloat(e.target.value))
    }
    style={{
      padding: 6,
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      width: "100%", // take full grid column space
    }}
  />
  <span style={{ textAlign: "right" }}>
    ₹{reimbursement ? reimbursement.toFixed(2) : "0.00"}
  </span>
</div>
{/* TDS */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
  }}
>
  {/* Left group: Label + Rate */}
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <label style={{ minWidth: 100 }}>TDS (%)</label>
    <input type="number" value={tdsRate} readOnly style={{ width: 40,marginLeft:'12px', padding: 6,
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
     }} />
  </div>

  {/* Right: Amount */}
  <span style={{ marginLeft: "auto", fontWeight: "bold" }}>
    - ₹{tdsAmount.toFixed(2)}
  </span>
</div>

{/* Deduction / Adjustment */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // always 3 columns
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <select
    value={deductionType}
    onChange={(e) => setDeductionType(e.target.value)}
    style={{
      padding: 6,
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      width: "100%",
    }}
  >
    <option value="advance">Advance</option>
    <option value="less">Less</option>
    <option value="discount">Discount</option>
    <option value="other">Other Deduction</option>
  </select>

  <input
    type="number"
    value={adjustment}
    onChange={(e) =>
      setAdjustment(e.target.value === "" ? "" : parseFloat(e.target.value))
    }
    style={{
      padding: 6,
      border: "1px dashed #aaa",
      borderRadius: 4,
      outline: "none",
      width: "100%",
    }}
  />

  <span style={{ textAlign: "right", fontWeight: "bold" }}>
    - ₹{adjustment ? adjustment.toFixed(2) : "0.00"}
  </span>
</div>


  {/* Total */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: 18,
      borderTop: '1px solid #ccc',
      paddingTop: 10,
    }}
  >
    <span>Total</span>
    <span>₹{total.toFixed(2)}</span>
  </div>
</div>


     {/* Payment Info */}
<div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    marginTop: 10,
  }}
>
  {[
    { label: "Mode of Transaction", name: "mode_of_transaction", type: "select", options: ["Select","Cash", "Online", "Check"] },
    { label: "Payment Type", name: "payment_type", type: "select", options: ["Select", "Full", "Partial", "Advance"] },
    { label: "Sanction Amount", name: "sanction_amount", type: "number" },
  ].map(({ label, name, type, options }) => (
    <div key={name} style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
      <label style={styles.label}>{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          style={styles.input}
          value={formData[name]}
          onChange={handleChange}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          style={styles.input}
          value={formData[name]}
          onChange={handleChange}
          readOnly={formData.payment_type === "Full"} // <-- auto-readonly for Full
        />
      )}
    </div>
  ))}
</div>



      {/* In Favour Of */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
          <label style={styles.label}>In Favour Of</label>
          <input type="text" name="in_favour_of" style={styles.input} value={formData.in_favour_of} onChange={handleChange} />
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
          Submit
        </button>
      </div>
    </div>
  );
}

const styles = {
  label: { fontWeight: 'bold', marginBottom: 6 },
  input: { padding: 8, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' },
  inputstyle: { width: '90%', padding: 6, border: '1px solid #ccc', borderRadius: 4, outline: 'none' },
   th: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  td: {
    padding: "6px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontSize: "13px",
  },
  inputWide: {
    width: "90%",
    padding: "5px 8px",
    border: "1px solid #ccc",
    borderRadius: 4,
    outline: "none",
  },
  inputSmall: {
    width: "70px",
    padding: "4px 6px",
    border: "1px solid #ccc",
    borderRadius: 4,
    outline: "none",
    textAlign: "center",
  },
};
