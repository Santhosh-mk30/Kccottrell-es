import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

const SpecialConditions = ({ formData, setFormData, styles }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");

  // 🧠 default paragraph text (with placeholders for date/time)
  useEffect(() => {
    const defaultText =
      formData.specialConditionsText ||
      `1. Price Basis:
1.1. Above prices are for Site, Chennai and inclusive of standard packing, Door Delivery services at Chennai Office.
1.2. Price shall be firm and fixed during the entire contract period & till the execution of the complete order without any price escalation.

2. Delivery Schedule:
2.1. Delivery shall be completed on ${formData.deliveryDate || "[Delivery Date]"} @ ${formData.deliveryTime || "[Time]"}.

3. Payment Terms:
3.1. 50% Advance payment and 50% after the delivery.

4. Taxes & Duties:
4.1. All taxes are inclusive in the order price.
4.2. TDS shall be deducted from Suppliers/Contractor bills as applicable.

5. Consignee Details:
5.1. The consignee details will be issued separately after the final inspection.

6. Invoice/Billing Address:
6.1. KC Cottrell Engineering Services Private Limited, Super A16 & A17, RR Tower 4, 7th Floor, Thiru-Vi-Ka Industrial Estate, Guindy, Chennai – 600 032.

7. Freight & Insurance:
7.1. Freight & Insurance shall be in scope of Supplier.

8. Guarantee:
8.1. Supplier shall provide Warranty as per your offer.
8.2. Supplier shall submit the Letter of Commitments along with the supply.

9. Dispatch Instruction:
9.1. Supplier should provide all documents and support to obtain the Road Permit, if required.

10. Dispatch Documents:
10.1. Supplier shall submit 1 (one) original and 4 (four) copies of the following documents along with supplies:
   i) Challan
   ii) Packing List
   iii) Guarantee/Warranty certificate

11. Packing, Identification & Marking:
11.1. All the items should be properly marked before dispatch.
11.2. Cost incurred due to damages if any during transportation due to improper packing shall be borne by Supplier.

12. Responsibility:
12.1. Even if the items are inspected by Purchaser representative at Supplier premises prior to dispatch, the basic responsibility lies with Supplier for quality of items and the pre-dispatch inspection and clearance does not absolve Supplier responsibility.

13. Technical & Quality:
13.1. All technical & quality specification shall be as per standard parameter of item and model no.

14. Rectification:
14.1. Supplier shall depute representative at Purchaser office to rectify item with defect / problem / mismatch found after dispatch of the item and all relevant cost shall be borne by Supplier.

15. Cancellation:
15.1. Timely delivery is the essence of this purchase order. We are at liberty to cancel the order without any price implication on Purchaser, in case Supplier fail to deliver the required items as per the above-mentioned delivery schedule.

16. Jurisdiction:
16.1. Jurisdiction & Arbitration: Disputes, if any, will be subject to Jurisdiction of Gurgaon. The dispute will first be referred to arbitration in accordance with Indian Arbitration and Conciliation Act 1996. This order and its annexure constitute the entire understanding between the Contractor & Employer and terms of these present. It shall super cede all prior correspondence to the extent of inconsistency of repugnance to the provisions of this order and its annexure. Any modification on this order or its annexure and conditions of contract shall be effected only by a written instrument signed by the Authorized Representative.

17. Sub-contracting:
17.1. Not Applicable.

18. Acceptance:
18.1. Duplicate copy of the Purchase Order may please be signed and returned to KCCES on the same day of receipt as token of acceptance of the same. If no communication is received within a days of receipt of Purchase Order, it will be treated that order has been accepted in entirely.`;

    setEditableText(defaultText);
  }, [formData.specialConditionsText, formData.deliveryDate, formData.deliveryTime]);

  // ✅ Save changes
  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ ...formData, specialConditionsText: editableText });
    }
    setIsEditing(!isEditing);
  };

  // ✅ handle date/time input
  const handleDateChange = (e) => {
    setFormData({ ...formData, deliveryDate: e.target.value });
  };
  const handleTimeChange = (e) => {
    setFormData({ ...formData, deliveryTime: e.target.value });
  };

  return (
    <div style={{ ...styles.section, ...styles.technicalQuality, position: "relative" }}>
      {/* ✏️ Edit / Save Button */}
      <button
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
        title={isEditing ? "Save changes" : "Edit section"}
      >
        {isEditing ? <FaCheck /> : <FaPencilAlt />}
      </button>

      <p style={styles.title3}>C. Special Conditions</p>

      {/* 🕒 Date & Time Inputs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <div>
          <label style={{ fontWeight: "bold" }}>Delivery Date:</label>
          <input
            type="date"
            value={formData.deliveryDate || ""}
            onChange={handleDateChange}
            style={{
              marginLeft: "8px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Time:</label>
          <input
            type="time"
            value={formData.deliveryTime || ""}
            onChange={handleTimeChange}
            style={{
              marginLeft: "8px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
      </div>

      {/* 📝 Editable Text */}
      {isEditing ? (
        <textarea
          style={{
            width: "100%",
            minHeight: "400px",
            fontSize: "inherit",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
        />
      ) : (
        <pre style={{ ...styles.paragraph, whiteSpace: "pre-wrap" }}>{editableText}</pre>
      )}
    </div>
  );
};

export default SpecialConditions;
