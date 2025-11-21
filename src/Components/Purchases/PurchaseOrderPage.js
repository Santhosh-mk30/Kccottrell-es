
import React, {useEffect, useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

const PurchaseOrder = () => {
  const [formData, setFormData] = useState({
    vendorCode: "",
    orderNo: "",
    date: "",
    goods: "",
    qty: "",
    contactPerson1: "",
    mobile1: "",
    email1: "",
    contactPerson2: "",
    phone2: "",
    email2: "",
    gst1: "",
    pan1: "",
    gst2: "",
    pan2: "",
    reference: "",
    note: "",
    supplier_name: "",
    in_favour_of: "",
    billing_street: "",
    billing_city: "",
    billing_state: "",
    billing_pincode: "",
    address: "",
    branch_name: "",
    address1:"",

  });
  const [isEditing, setIsEditing] = useState(false);

  
  
  const [editableText, setEditableText] = useState("");

    useEffect(() => {
    const defaultText =
      formData.paragraphText ||
      `With reference to the above and subsequent discussion, we KC Cottrell Engineering
Services Pvt. Ltd. (hereafter referred as "Purchaser") are pleased to issue our
Purchase Order to M/s.${formData.supplier_name || "________"} (hereafter referred as "Supplier"),
for Supply of ${formData.itemName || "________"} as per Annexure- A.`;

    setEditableText(defaultText);
  }, [
    formData.supplier_name,
    formData.itemName,
    formData.paragraphText, // ✅ added missing dependency
  ]);

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ ...formData, paragraphText: editableText });
    }
    setIsEditing(!isEditing);
  };

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingTech, setIsEditingTech] = useState(false);
  const [priceText, setPriceText] = useState("");
  const [techText, setTechText] = useState("");


  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

   const handleChange1 = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Recalculate amount
    const qty = parseFloat(updatedRows[index].quantity) || 0;
    const rate = parseFloat(updatedRows[index].rate) || 0;
    const amount = qty * rate;
    updatedRows[index].amount = amount;

    // Recalculate GST
    const gstPercent = parseFloat(updatedRows[index].gstPercent) || 0;
    updatedRows[index].gstAmount = (amount * gstPercent) / 100;

    setRows(updatedRows);
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

 const [rows, setRows] = useState([{ id: 1, invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '',gstPercent: 0, gstAmount: 0  }]);

  const addRow = () => setRows([...rows, { id: Date.now(), invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
  const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const subtotal = rows.reduce(
  (sum, r) =>
    sum + (parseFloat(r.amount) || 0) + (parseFloat(r.gstAmount) || 0),
  0
);


    const [suppliers, setSuppliers] = useState([]); // <-- suppliers list

const [suppliersData, setSuppliersData] = useState([]); // full API data

 

const [branches, setBranches] = useState([]);
const [selectedBranch, setSelectedBranch] = useState("");





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

 
  // State to manage date and time
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  // Handle date and time change
  const handleDateChange = (e) => setDeliveryDate(e.target.value);
  const handleTimeChange = (e) => setDeliveryTime(e.target.value);

const handleSupplierChange = async (e) => {
  const value = e.target.value;

  setFormData((prev) => {
    const updatedData = { ...prev, supplier_name: value };

    if (!prev.in_favour_of) updatedData.in_favour_of = value;

    const supplierInfo = suppliersData.find(
      (s) => s.company_name === value
    );

    if (supplierInfo) {
      // Fill supplier details
      updatedData.billing_street = supplierInfo.billing_street || "";
      updatedData.billing_city = supplierInfo.billing_city || "";
      updatedData.billing_state = supplierInfo.billing_state || "";
      updatedData.billing_pincode = supplierInfo.billing_pincode || "";
      updatedData.address = `${supplierInfo.billing_street || ""}\n${supplierInfo.billing_city || ""}, ${supplierInfo.billing_state || ""} - ${supplierInfo.billing_pincode || ""}`;
      updatedData.contactPerson1 = supplierInfo.first_name || "";
      updatedData.mobile1 = supplierInfo.phone || "";
      updatedData.email1 = supplierInfo.email || "";
      updatedData.gst1 = supplierInfo.gst_number || "";
      updatedData.pan1 = supplierInfo.pan_number || "";

     fetch(`https://darkslategrey-shrew-424102.hostingersite.com/api/get_vendor_branches.php?vendor_id=${supplierInfo.vendor_id}`)
  .then((res) => res.json())
  .then((data) => {
    console.log("🔥 Vendor branches API response:", data);

    if (data.status === "success" && Array.isArray(data.branches)) {
      setBranches(data.branches);
    } else {
      setBranches([]);
    }
  })
  .catch((err) => {
    console.error("Error fetching branches:", err);
    setBranches([]);
  });


    } else {
      // Clear all if no supplier selected
      updatedData.billing_street = "";
      updatedData.billing_city = "";
      updatedData.billing_state = "";
      updatedData.billing_pincode = "";
      updatedData.address = "";
      updatedData.contactPerson1 = "";
      updatedData.mobile1 = "";
      updatedData.email1 = "";
      updatedData.gst1 = "";
      updatedData.pan1 = "";
      setBranches([]);
    }

    return updatedData;
  });
};


useEffect(() => {
    const defaultPriceText =
      formData.priceText ||
      `Total Purchase Order Value is ₹ ${subtotal.toFixed(2)}/- (Rupees ${numberToWords(
        Math.floor(subtotal)
      )} Only) price break up as per Annexure-A towards Supply of ${
        formData.itemName || "________"
      } at Chennai Office.`;

    setPriceText(defaultPriceText);
  }, [formData.itemName, formData.priceText, subtotal]);

  // ⚙️ Technical Specification paragraph text setup
  useEffect(() => {
    const defaultTechText =
      formData.techText ||
      `The Product should confirm to the applicable standards.`;

    setTechText(defaultTechText);
  }, [formData.techText]);


  const handlePriceEditToggle = (e) => {
    e.preventDefault();
    if (isEditingPrice) {
      setFormData({ ...formData, priceText });
    }
    setIsEditingPrice(!isEditingPrice);
  };

  const handleTechEditToggle = (e) => {
    e.preventDefault();
    if (isEditingTech) {
      setFormData({ ...formData, techText });
    }
    setIsEditingTech(!isEditingTech);
  };

  const [isdesEditing, setIsEditing1] = useState(false);
  const [descriptionText, setDescriptionText] = useState(
    formData.descriptionText ||
      `1.1.Above prices are for Site, Chennai and inclusive of standard packing, Door Delivery services at Chennai Office.

1.2.Price shall be firm and fixed during the entire contract period & till the execution of the complete order without any price escalation, what so ever.`
  );

  const handleEditToggle1 = (e) => {
    e.preventDefault();
    if (isdesEditing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing1(!isdesEditing);
  };

  const [isdes1Editing, setIsEditing2] = useState(false);
  const [descriptionText1, setDescriptionText1] = useState(
    formData.descriptionText ||
      `2.1.Delivery shall be completed on `
  );

  const handleEditToggle2 = (e) => {
    e.preventDefault();
    if (isdes1Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing2(!isdes1Editing);
  };

    const [isdes2Editing, setIsEditing3] = useState(false);
  const [descriptionText2, setDescriptionText2] = useState(
    formData.descriptionText ||
      `3.1.50% Advance payment and 50% after the delivery. `
  );

  const handleEditToggle3 = (e) => {
    e.preventDefault();
    if (isdes2Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing3(!isdes2Editing);
  };

    const [isdes3Editing, setIsEditing4] = useState(false);
  const [descriptionText3, setDescriptionText3] = useState(
    formData.descriptionText ||
      `4.1.All taxes are inclusive in the order price.

4.2.TDS shall be deducted from Suppliers/Contractor bills as applicable.`
  );

  const handleEditToggle4 = (e) => {
    e.preventDefault();
    if (isdes3Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing4(!isdes3Editing);
  };



    const [isdes4Editing, setIsEditing5] = useState(false);
  const [descriptionText4, setDescriptionText4] = useState(
    formData.descriptionText ||
      `5.1.The consignee details will be issued separately after the final inspection.`
  );

  const handleEditToggle5 = (e) => {
    e.preventDefault();
    if (isdes4Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing5(!isdes4Editing);
  };


    const [isdes5Editing, setIsEditing6] = useState(false);
  const [descriptionText5, setDescriptionText5] = useState(
    formData.descriptionText ||
      `6.1.KC Cottrell Engineering Services Private Limited, Super A16 & A17, RR Tower 4, 7th Floor, Thiru-Vi-Ka Industrial Estate, Guindy, Chennai – 600 032.`
  );

  const handleEditToggle6 = (e) => {
    e.preventDefault();
    if (isdes5Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing6(!isdes5Editing);
  };


    const [isdes6Editing, setIsEditing7] = useState(false);
  const [descriptionText6, setDescriptionText6] = useState(
    formData.descriptionText ||
      `7.1.Freight & Insurance shall be in scope of Supplier.`
  );

  const handleEditToggle7 = (e) => {
    e.preventDefault();
    if (isdes6Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing7(!isdes6Editing);
  };


    const [isdes7Editing, setIsEditing8] = useState(false);
  const [descriptionText7, setDescriptionText7] = useState(
    formData.descriptionText ||
      `8.1.Supplier shall provide Warranty as per your offer.

8.2.Supplier shall submit the Letter of Commitments along with the supply.`
  );

  const handleEditToggle8 = (e) => {
    e.preventDefault();
    if (isdes7Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing8(!isdes7Editing);
  };



    const [isdes8Editing, setIsEditing9] = useState(false);
  const [descriptionText8, setDescriptionText8] = useState(
    formData.descriptionText ||
      `9.1.Supplier should provide all documents and support to obtain the Road Permit, if required.`
  );

  const handleEditToggle9 = (e) => {
    e.preventDefault();
    if (isdes8Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing9(!isdes8Editing);
  };

    const [isdes9Editing, setIsEditing10] = useState(false);
  const [descriptionText9, setDescriptionText9] = useState(
    formData.descriptionText ||
      `10.1.Supplier shall submit 1 (one) original and 4 (four) copies of the following documents along with supplies:
        i) Challan
        ii) Packing List
        iii) Guarantee/Warranty certificate`
  );

  const handleEditToggle10 = (e) => {
    e.preventDefault();
    if (isdes9Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing10(!isdes9Editing);
  };

    const [isdes10Editing, setIsEditing11] = useState(false);
  const [descriptionText10, setDescriptionText10] = useState(
    formData.descriptionText ||
      `11.1.All the items should be properly marked before dispatch.

11.2.Cost incurred due to damages if any during transportation due to improper packing shall be borne by Supplier.`
  );

  const handleEditToggle11 = (e) => {
    e.preventDefault();
    if (isdes10Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing11(!isdes11Editing);
  };

    const [isdes11Editing, setIsEditing12] = useState(false);
  const [descriptionText11, setDescriptionText11] = useState(
    formData.descriptionText ||
      `12.1.Even if the items are inspected by Purchaser representative at Supplier premises prior to dispatch,the basic responsibility lies with Supplier for quality of items and the pre-dispatch inspection and clearance does not absolve Supplier responsibility.`
  );

  const handleEditToggle12 = (e) => {
    e.preventDefault();
    if (isdes11Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing12(!isdes11Editing);
  };

    const [isdes12Editing, setIsEditing13] = useState(false);
  const [descriptionText12, setDescriptionText12] = useState(
    formData.descriptionText ||
      `13.1.All technical & quality specification shall be as per standard parameter of item and model no.`
  );

  const handleEditToggle13 = (e) => {
    e.preventDefault();
    if (isdes12Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing13(!isdes12Editing);
  };

    const [isdes13Editing, setIsEditing14] = useState(false);
  const [descriptionText13, setDescriptionText13] = useState(
    formData.descriptionText ||
      `14.1.Supplier shall depute representative at Purchaser office to rectify item with defect / problem / mismatch found after dispatch of the item and all relevant cost shall be borne by Supplier.`
  );

  const handleEditToggle14 = (e) => {
    e.preventDefault();
    if (isdes13Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing14(!isdes13Editing);
  };

    const [isdes14Editing, setIsEditing15] = useState(false);
  const [descriptionText14, setDescriptionText14] = useState(
    formData.descriptionText ||
      ` 15.1.Timely delivery is the essence of this purchase order. We are at liberty to cancel the order without any price implication on Purchaser, in case Supplier fail to deliver the required items as per the above-mentioned delivery schedule.`
  );

  const handleEditToggle15 = (e) => {
    e.preventDefault();
    if (isdes14Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing15(!isdes14Editing);
  };

    const [isdes15Editing, setIsEditing16] = useState(false);
  const [descriptionText15, setDescriptionText15] = useState(
    formData.descriptionText ||
      `16.1.Jurisdiction & Arbitration: Disputes, if any, will be subject to Jurisdiction of Gurgaon. The dispute will first be referred to arbitration in accordance with Indian Arbitration and Conciliation Act 1996.This order and its annexure constitute the entire understanding between the Contractor & Employer and terms of these present. It shall super cede all prior correspondence to the extent of inconsistency of repugnance to the provisions of this order and its annexure. Any modification on this order or its annexure and conditions of contract shall be effected only by a written instrument signed by the Authorized Representative.`
  );

  const handleEditToggle16 = (e) => {
    e.preventDefault();
    if (isdes15Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing16(!isdes15Editing);
  };

    const [isdes16Editing, setIsEditing17] = useState(false);
  const [descriptionText16, setDescriptionText16] = useState(
    formData.descriptionText ||
      `Not Applicable.`
  );

  const handleEditToggle17 = (e) => {
    e.preventDefault();
    if (isdes16Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing17(!isdes16Editing);
  };

    const [isdes17Editing, setIsEditing18] = useState(false);
  const [descriptionText17, setDescriptionText17] = useState(
    formData.descriptionText ||
      `18.1.Duplicate copy of the Purchase Order may please be signed and returned to KCCES on the same day of receipt as token of acceptance of the same. If no communication is received within a days of receipt of Purchase Order, it will be treated that order has been accepted in entirely`
  );

  const handleEditToggle18 = (e) => {
    e.preventDefault();
    if (isdes17Editing) {
      setFormData({ ...formData, descriptionText });
    }
    setIsEditing18(!isdes17Editing);
  };

   const handleSubmit = async () => {
  try {
  const payload = {
  supplier_name: formData.supplier_name || "",
  branch_name: formData.branch_name || "",
  branch_address: formData.address1 || "",
  address: formData.address || "",
  purchase_date: formData.date || "",
  goods_services: formData.goods || "",
  qty: formData.qty || 0,
  supplier_contactPerson1: formData.contactPerson1 || "",
  supplier_mobile1: formData.mobile1 || "",
  supplier_email1: formData.email1 || "",
  supplier_gst1: formData.gst1 || "",
  supplier_pan: formData.pan1 || "",
  purchaser_contactPerson2: formData.contactPerson2 || "",
  purchaser_mobile2: formData.phone2 || "",
  purchaser_email2: formData.email2 || "",
  purchaser_gst2: formData.gst2 || "",
  purchaser_pan2: formData.pan2 || "",
  reference: formData.reference || "",
  editableText: editableText || "",
  priceText: priceText || "",
  techText: techText || "",
  descriptionText: descriptionText || "", 
   descriptionText1: descriptionText1 || "", 
    descriptionText2: descriptionText2 || "",
    descriptionText3: descriptionText3 || "",
    descriptionText4: descriptionText4 || "",
    descriptionText5: descriptionText5 || "",
    descriptionText6: descriptionText6 || "",
    descriptionText7: descriptionText7 || "",
    descriptionText8: descriptionText8 || "",
    descriptionText9: descriptionText9 || "",
    descriptionText10: descriptionText10 || "",
    descriptionText11: descriptionText11 || "",
    descriptionText12: descriptionText12 || "",
    descriptionText13: descriptionText13 || "",
    descriptionText14: descriptionText14 || "",
    descriptionText15: descriptionText15 || "",
    descriptionText16: descriptionText16 || "",
    descriptionText17: descriptionText17 || "",
  items: rows.map(row => ({
    item: row.item || "",
    hsnSac: row.hsnSac || "",
    quantity: Number(row.quantity) || 0,
    rate: Number(row.rate) || 0,
    per: row.per || "",
    amount: Number(row.amount) || 0,
    gstPercent: Number(row.gstPercent) || 0,
    gstAmount: Number(row.gstAmount) || 0
  }))
};



    const res = await fetch(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/save_purchase_order.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const result = await res.json();
    if (result.status === "success") {
      alert("Saved successfully! ID: " + result.id);
    } else {
      alert("Error: " + result.message);
    }

  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong!");
  }
};





  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "30px auto",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      backgroundColor: "#f8f9fa",
      padding: "20px",
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: "20px",
      gap: "10px",
    },
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
  
    input1: {
      margin: "5px",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },

  inputSmall: {
    width: "70px",
    padding: "4px 6px",
    border: "1px solid #ccc",
    borderRadius: 4,
    outline: "none",
    textAlign: "center",
  },
    card: {
      flex: "1",
      minWidth: "300px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      border: "1px solid #eee",
    },
    header: (color1, color2) => ({
      background: `linear-gradient(to right, ${color1}, ${color2})`,
      color: "#fff",
      padding: "8px 15px",
      fontWeight: "bold",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    }),
    body: {
      padding: "15px",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    fieldRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
      gap: "10px",
    },
    label: {
      width: "110px",
      color: "#007bff",
      fontWeight: "bold",
      fontSize: "13px",
      textAlign: "right",
    },
    input: {
      flex: 1,
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px",
      fontSize: "14px",
    },
    textArea: {
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px",
      fontSize: "14px",
      minHeight: "60px",
      resize: "vertical",
    },
    noteBox: {
      background: "#eef5ff",
      borderRadius: "8px",
      padding: "20px",
      lineHeight: "1.8",
      fontSize: "14px",
    },
    button: {
      background: "linear-gradient(to right, #2575fc, #6a11cb)",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "10px 25px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "20px",
      display: "block",
      width: "100%",
    },
      
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    marginTop: "10px", // below gradient
  },
  logo: 
    { width: 280, height: 150, objectFit: "contain" },
  companyName: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    fontWeight: "bold",
  },
bottomLine: {
  height: "5px",
  width: "80%",
  margin: "1px auto 0",
  borderRadius: "3px",
  background: "linear-gradient(to right, transparent, #2575fc, #6a11cb, transparent)",
  marginBottom:"20px",
},

section: {
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "8px",
    },
    title1: {
      fontSize: "18px",
      fontWeight: "bold",
      color:"#1e90ff"
    },
    title2: {
      fontSize: "18px",
      fontWeight: "bold",
       color:"#17a2b8"
    },
    title3: {
      fontSize: "18px",
      fontWeight: "bold",
       color:"#b817abff"
    },
    paragraph: {
      fontSize: "16px",
    },
    pricesScope: {
      backgroundColor: "#cce6ff", // Light blue background
      borderLeft: "5px solid #1e90ff", // Blue left border
    },
    specialConditions: {
      backgroundColor: "#d9f7ff", // Light green background
      borderLeft: "5px solid #17a2b8", // Green left border
    },
    technicalQuality: {
      backgroundColor: "#fed9ffff", // Light cyan background
      borderLeft: "5px solid #b817abff", // Cyan left border
    },
    rejection: {
      backgroundColor: "#fff2e6", // Light orange background
      borderLeft: "5px solid #fd7e14", // Orange left border
    },
    cancellation: {
      backgroundColor: "#f8d7da", // Light red background
      borderLeft: "5px solid #dc3545", // Red left border
    },
    subContracting: {
      backgroundColor: "#f1f1f1", // Light grey background
      borderLeft: "5px solid #6c757d", // Grey left border
    },
    container1: {
      maxWidth: "1200px",
      margin: "30px auto",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      backgroundColor: "#f0f8ff", // Light blue background
      padding: "20px",
      borderRadius: "8px", // Rounded corners
      border: "1px solid #e0e0e0", // Light gray border
    },

        list: {
      listStyleType: "none",
      paddingLeft: "0",
    },
    listItem: {
      fontSize: "14px",
      marginBottom: "10px",
    },
    listItemBold: {
      fontWeight: "bold",
      color: "#4B0082", // Purple for the bold section headings
    },
    descriptionText: {
      color: "#333", // Regular blackish color for descriptions
      marginLeft: "1px", // Indentation for the description
      marginTop: "1px",
    },
    subListItem: {
      fontSize: "14px",
      marginLeft: "40px", // Further indent for sublist items
      color: "#333",
    },


  };
// Helper function to convert number to words
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
    if (num < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
  }

  return inWords(num);
}

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
          <div style={styles.topGradient}></div>

    {/* Logo + Company Name */}
    <div style={styles.cardHeader}>
      <img
        src="/logologin.png" // replace with your logo path
        alt="Logo"
        style={styles.logo}
      />
      <h3 style={styles.companyName}>KC Cottrell Engineering Services Private Limited</h3>
    </div>

  
    <div style={styles.topLine}></div>

    {/* Title */}
    <h2 style={styles.title}>Purchase Order</h2>

    {/* Bottom Gradient Line */}
    <div style={styles.bottomLine}></div>


      {/* Supplier & Purchase Details */}
      <div style={styles.row}>
        {/* Supplier */}
        <div  style={{
    ...styles.card,
    border: "1px solid #00c6ff",
    borderRadius: "10px",
  }}>
          <div style={styles.header("#007bff", "#00c6ff")}>SUPPLIER</div>
          <div style={styles.body}>
            <div style={styles.fieldRow}>
    <label style={styles.label}>Supplier’s Name</label>
    <select
      name="supplier_name"
      style={styles.input}
      value={formData.supplier_name}
      onChange={handleSupplierChange}
    >
      <option value="">Select Supplier</option>
      {suppliers.map((company, idx) => (
        <option key={idx} value={company}>
          {company}
        </option>
      ))}
    </select>
  </div>

<div style={styles.fieldRow}>
  <label style={styles.label}>Branch Name</label>
  <select
    name="branch_name"
    style={styles.input}
    value={selectedBranch}
    onChange={(e) => {
      const branchId = e.target.value;
      setSelectedBranch(branchId);

      if (!branchId) {
        setFormData((prev) => ({
          ...prev,
          branch_id: "",
          branch_name: "",
          branch_type: "",
          gst1: "",
          mobile1: "",
          email1: "",
          address1: "",
        }));
        return;
      }

      const branchInfo = Array.isArray(branches)
        ? branches.find((b) => b.id.toString() === branchId)
        : null;

      console.log("Selected Branch Info:", branchInfo);

      if (branchInfo) {
        setFormData((prev) => ({
          ...prev,
          branch_id: branchInfo.id,
          branch_name: branchInfo.branch_name || "",
          branch_type: branchInfo.branch_type || "",
          gst1: branchInfo.branch_gst || "",
          mobile1: branchInfo.branch_phone || "",
          email1: branchInfo.branch_email || "",
          address1: branchInfo.branch_address || "",
        }));
      }
    }}
  >
    <option value="">Select Branch</option>
    {Array.isArray(branches) &&
      branches.map((branch) => (
        <option key={branch.id} value={branch.id}>
          {branch.branch_name} ({branch.branch_type})
        </option>
      ))}
  </select>
</div>


{/* ✅ Display branch address field */}
<div style={styles.fieldRow}>
  <label style={styles.label}>Branch Address</label>
  <input
    type="text"
    name="address"
    style={styles.input}
    value={formData.address1 || ""}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, address1: e.target.value }))
    }
    placeholder="Branch Address"
  />
</div>




            <div style={styles.fieldRow}>
              <label style={styles.label}>Address:</label>
              
        <textarea
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={4}
        />

            </div>
          </div>
        </div>

        {/* Purchase Details */}
        <div style={{
    ...styles.card,
    border: "1px solid #d657d4",
    borderRadius: "10px",
  }}>
          <div style={styles.header("#9b2bcf", "#d657d4")}>PURCHASE DETAILS</div>
          <div style={styles.body}>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Order No.</label>
              <input
                style={styles.input}
                value={formData.orderNo}
                onChange={(e) => handleChange("orderNo", e.target.value)}
              />
            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                style={styles.input}
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Goods/Services</label>
             <textarea
  style={{
    ...styles.input,
    overflow: "hidden",
    resize: "none",
  }}
  value={formData.goods}
  onChange={(e) => {
    handleChange("goods", e.target.value);

    // Auto-resize height
    e.target.style.height = "auto"; // reset
    e.target.style.height = e.target.scrollHeight + "px"; // set to scroll height
  }}
  rows={1} // start with 1 row
/>

            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Qty.</label>
              <input
                style={styles.input}
                value={formData.qty}
                onChange={(e) => handleChange("qty", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Supplier Details */}
        <div style={styles.row}>
      <div  style={{
    ...styles.card,
    border: "1px solid #00d4a0",
    borderRadius: "10px",
  }}>
        <div style={styles.header("#00997a", "#00d4a0")}>SUPPLIER DETAILS</div>
        <div style={styles.body}>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
                    <div style={styles.fieldRow}>
        <label style={styles.label}>Contact Person</label>
        <input
          style={styles.input}
          value={formData.contactPerson1}
          onChange={(e) => handleChange("contactPerson1", e.target.value)}
        />
      </div>

                    <div style={styles.fieldRow}>
        <label style={styles.label}>Mobile No</label>
        <input
          style={styles.input}
          value={formData.mobile1}
          onChange={(e) => handleChange("mobile1", e.target.value)}
        />
      </div>

             
      <div style={styles.fieldRow}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          value={formData.email1}
          onChange={(e) => handleChange("email1", e.target.value)}
        />
      </div>

              <div style={{ flex: 1 }}>
            
      <div style={styles.fieldRow}>
        <label style={styles.label}>GST No.</label>
        <input
          style={styles.input}
          value={formData.gst1}
          onChange={(e) => handleChange("gst1", e.target.value)}
        />
      </div>

                    <div style={styles.fieldRow}>
        <label style={styles.label}>PAN No.</label>
        <input
          style={styles.input}
          value={formData.pan1}
          onChange={(e) => handleChange("pan1", e.target.value)}
        />
      </div>

            </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Purchaser Details */}
      <div style={{
    ...styles.card,
    border: "1px solid #ffb347",
    borderRadius: "10px",
  }}>
        <div style={styles.header("#ff7e00", "#ffb347")}>PURCHASER DETAILS</div>
        <div style={styles.body}>
         
           <div style={{ flex: 1 }}>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Contact Person</label>
                <input
                  style={styles.input}
                  value={formData.contactPerson2}
                  onChange={(e) => handleChange("contactPerson2", e.target.value)}
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Phone</label>
                <input
                  style={styles.input}
                  value={formData.mobile2}
                  onChange={(e) => handleChange("phone2", e.target.value)}
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  value={formData.email2}
                  onChange={(e) => handleChange("email2", e.target.value)}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.fieldRow}>
                <label style={styles.label}>GST No.</label>
                <input
                  style={styles.input}
                  value={formData.gst2}
                  onChange={(e) => handleChange("gst2", e.target.value)}
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>PAN No.</label>
                <input
                  style={styles.input}
                  value={formData.pan2}
                  onChange={(e) => handleChange("pan2", e.target.value)}
                />
              </div>
            </div>
        </div>
      </div>
</div>
      {/* References */}
      <div style={{
    ...styles.card,
    border: "1px solid #ff4081",
    borderRadius: "10px",
  }}>
        <div style={styles.header("#e91e63", "#ff4081")}>REFERENCES :</div>
        <div style={styles.body}>
          <textarea
            style={styles.textArea}
            value={formData.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
          />
        </div>
      </div>






           {/* Item Table */}
<div style={{ overflowX: "auto", marginBottom: 20 ,marginTop:"20px"}}>
    <h3 style={{ textAlign: "center", marginBottom: 20, fontFamily: "Arial, sans-serif" }}>
    Annexure - A
  </h3>

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
  type="button" 
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


<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
  <h3>Total Payable: ₹ {subtotal.toFixed(2)}</h3>
</div>
</div>



    <div style={{ ...styles.container1, position: "relative" }}>
      {/* Edit / Save Button */}
      <button
      type="button" 
        onClick={handleEditToggle}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isEditing ? "Save changes" : "Edit paragraph"}
      >
        {isEditing ? <FaCheck /> : <FaPencilAlt />}
      </button>

      <p style={styles.title1}>Dear Sir/Mam,</p>

      {isEditing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "120px",
            fontSize: "inherit",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
        />
      ) : (
        <p style={styles.paragraph}>{editableText}</p>
      )}
    </div>


<>
      {/* 🧾 A. Prices & Scope of Supply */}
      <div style={{ ...styles.section, ...styles.pricesScope, position: "relative" }}>
        <button
        type="button" 
          onClick={handlePriceEditToggle}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "16px",
            color: "#555",
          }}
          title={isEditingPrice ? "Save changes" : "Edit paragraph"}
        >
          {isEditingPrice ? <FaCheck /> : <FaPencilAlt />}
        </button>

        <p style={styles.title1}>A. Prices & Scope of Supply:</p>
        {isEditingPrice ? (
          <textarea
            style={{
              width: "100%",
              minHeight: "100px",
              fontSize: "inherit",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
            }}
            value={priceText}
            onChange={(e) => setPriceText(e.target.value)}
          />
        ) : (
          <p style={styles.paragraph}>{priceText}</p>
        )}
      </div>

      {/* ⚙️ B. Technical Specifications */}
      <div style={{ ...styles.section, ...styles.specialConditions, position: "relative" }}>
        <button
          onClick={handleTechEditToggle}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "16px",
            color: "#555",
          }}
          title={isEditingTech ? "Save changes" : "Edit paragraph"}
        >
          {isEditingTech ? <FaCheck /> : <FaPencilAlt />}
        </button>

        <p style={styles.title2}>B. Technical Specifications:</p>
        {isEditingTech ? (
          <textarea
            style={{
              width: "100%",
              minHeight: "100px",
              fontSize: "inherit",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
            }}
            value={techText}
            onChange={(e) => setTechText(e.target.value)}
          />
        ) : (
          <p style={styles.paragraph}>{techText}</p>
        )}
      </div>
    </>

     <div style={{ ...styles.section, ...styles.technicalQuality }}>
  <p style={styles.title3}>C. Special Conditions</p>

      
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>1. Price Basis:</span>
         
    <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle1}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdesEditing ? "Save changes" : "Edit paragraph"}
      >
        {isdesEditing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdesEditing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText}
  onChange={(e) => {
    setDescriptionText(e.target.value);
    setFormData((prev) => ({ ...prev, descriptionText: e.target.value }));
  }}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText}
        </div>
      )}
    </div>

        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>2. Delivery Schedule:</span>
               
    <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle2}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes1Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes1Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes1Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText1}
          onChange={(e) => setDescriptionText1(e.target.value)}
        />
        
      ) : (
        <div style={{ ...styles.descriptionText, }}>
          {descriptionText1}
           <input
                type="date"
                value={deliveryDate}
                onChange={handleDateChange}
                style={styles.input1}
              />
 @ 
              <input
                type="time"
                value={deliveryTime}
                onChange={handleTimeChange}
                style={styles.input1}
              />
.
        </div>
      )}
             
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>3. Payment Terms:</span>

          <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle3}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes2Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes2Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes2Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText2}
          onChange={(e) => setDescriptionText2(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText2}
        </div>
      )}
    </div>

        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>4. Taxes & Duties:</span>

          
          <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle4}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes3Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes3Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes3Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText3}
          onChange={(e) => setDescriptionText3(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText3}
        </div>
      )}
    </div>
        
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>5. Consignee Details:</span>

            <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle5}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes4Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes4Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes4Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText4}
          onChange={(e) => setDescriptionText4(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText4}
        </div>
      )}
    </div>
    
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>6. Invoice/Billing Address:</span>
           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle6}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes5Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes5Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes5Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText5}
          onChange={(e) => setDescriptionText5(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText5}
        </div>
      )}
    </div>
    
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>7. Freight & Insurance:</span>

          <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle7}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes6Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes6Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes6Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText6}
          onChange={(e) => setDescriptionText6(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText6}
        </div>
      )}
    </div>
        
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>8. Guarantee:</span>

          <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle8}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes7Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes7Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes7Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText7}
          onChange={(e) => setDescriptionText7(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText7}
        </div>
      )}
    </div>
       
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>9. Dispatch Instruction:</span>
            <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle9}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes8Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes8Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes8Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText8}
          onChange={(e) => setDescriptionText8(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText8}
        </div>
      )}
    </div>
          
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>10. Dispatch Documents:</span>

           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle10}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes9Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes9Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes9Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText9}
          onChange={(e) => setDescriptionText9(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText9}
        </div>
      )}
    </div>
         
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>11. Packing, Identification & Marking:</span>

           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle11}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes10Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes10Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes10Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText10}
          onChange={(e) => setDescriptionText10(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText10}
        </div>
      )}
    </div>
          
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>12. Responsibility:</span>

           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle12}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes11Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes11Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes11Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText11}
          onChange={(e) => setDescriptionText11(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText11}
        </div>
      )}
    </div>
         
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>13. Technical & Quality:</span>

            <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle13}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes12Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes12Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes12Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText12}
          onChange={(e) => setDescriptionText12(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText12}
        </div>
      )}
    </div>
          
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>14. Rectification:</span>

           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle14}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes13Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes13Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes13Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText13}
          onChange={(e) => setDescriptionText13(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText13}
        </div>
      )}
    </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>15. Cancellation:</span>

          <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle15}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes14Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes14Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes14Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText14}
          onChange={(e) => setDescriptionText14(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText14}
        </div>
      )}
    </div>
        
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>16. Jurisdiction:</span>

           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle16}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes15Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes15Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes15Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText15}
          onChange={(e) => setDescriptionText15(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText15}
        </div>
      )}
    </div>
        
         
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>17. Sub-contracting:</span>

           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle17}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes16Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes16Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes16Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText16}
          onChange={(e) => setDescriptionText16(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText16}
        </div>
      )}
    </div>
          
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>18. Acceptance:</span>

          
           <div style={{ position: "relative", marginBottom: "10px", ...styles.section }}>
      {/* Edit/Save Icon Button */}
      <button
        onClick={handleEditToggle18}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
          color: "#555",
        }}
        title={isdes17Editing ? "Save changes" : "Edit paragraph"}
      >
        {isdes17Editing ? <FaCheck /> : <FaPencilAlt />}
      </button>
      {isdes17Editing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            fontSize: "inherit",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={descriptionText17}
          onChange={(e) => setDescriptionText17(e.target.value)}
        />
      ) : (
        <div style={{ ...styles.descriptionText, whiteSpace: "pre-wrap" }}>
          {descriptionText17}
        </div>
      )}
    </div>
        
        </li>
      </ul>

</div>

      <button type="submit" style={styles.button}>
        Submit Purchase Order
      </button>
    </form>
  );
};
            
export default PurchaseOrder;