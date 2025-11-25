
import React, { useState, useRef } from "react";



function Silo3D({ results }) {
  if (!results) return null;

  const topDia = results.D1;
  const Hc = results.H_cylinder;
  const Hh = results.Hh;
  const Hr = results.Hr;

  const cylVolume = results.cylVol;
  const hopperVolume = results.hopperVol;
  const totalVolume = results.Vt;
  const emptyVolume = results.emptyVolume;
  const reposeVolume = results.reposeVol;


  const scaleH = 80;
  const scaleW = 120;

  const cylHeight = Hc * scaleH;
  const hopperHeight = Hh * scaleH;
  const cylWidth = topDia * scaleW;

  return (
    <div style={{ textAlign: "center", marginTop: 40, position: "relative" }}>

      {/* TOP LABEL */}
      <div style={{
        fontSize: 16, fontWeight: "bold", marginBottom: 10
      }}>
        Top Diameter = {topDia.toFixed(3)} m
      </div>

      {/* ============= 3D DOME TOP ============= */}
      <div style={{
        width: cylWidth,
        height: 20,
        background: "linear-gradient(140deg, #eef1f5, #c3c9cf)",
        borderRadius: "120px 120px 0 0",
        margin: "0 auto",
        border: "1px solid #888",
        boxShadow: "0 0 14px rgba(0,0,0,0.3) inset"
      }} />

      {/* ============= CYLINDER (BIN) ============= */}
      <div
        style={{
          width: cylWidth,
          height: cylHeight,
          background: "linear-gradient(135deg, #d7dce0, #f9fafb, #c1c7cc)",
          border: "1px solid #777",
          margin: "0 auto",
          position: "relative",
        }}
      >

        {/* BIN Label */}
        <div style={{
          position: "absolute",
          left: "170px",
          top: "60%",
          transform: "translateY(-50%)",
          fontWeight: "bold",
          color: "#333",
          textAlign: "left",
          fontSize: 14,
        }}>
          BIN (Cylinder) <br/>
          Height = {Hc.toFixed(3)} m<br/>
          Volume = {cylVolume.toFixed(3)} m³
        </div>

<div
  style={{
    width: 0,
    height: 0,

 
    borderLeft: (cylWidth / 2) + "px solid transparent",
    borderRight: (cylWidth / 2) + "px solid transparent",


    borderBottom: (cylHeight * 0.40) + "px solid rgba(200,200,200,0.45)",

    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  }}
></div>

 <div style={{
          position: "absolute",
          top: 35,
          left: 5,
          fontSize: 12,
          fontWeight: "bold",
          color: "#222"
        }}>
           Empty Volume  = {emptyVolume.toFixed(3)} m³
        </div>


        <div style={{
          position: "absolute",
          top: 75,
          left: 155,
          fontSize: 12,
          fontWeight: "bold",
          color: "#222"
        }}>
           Repose Height  = {Hr.toFixed(3)} m <br />
           Repose Volume  = {reposeVolume.toFixed(3)} m³
        </div>

      </div>

      {/* FLOW ANIMATION */}
<div
  style={{
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    top: 0,
    width: 0,
    height: 0,
    borderLeft: (cylWidth / 2) + "px solid transparent",
    borderRight: (cylWidth / 2) + "px solid transparent",
    borderBottom: (cylHeight * 0.40) + "px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    pointerEvents: "none",
  }}
>
  {/* FLOW PARTICLES */}
  <div
    style={{
      position: "absolute",
      top: -cylHeight,
      left: -(cylWidth / 2) + 20,
      width: cylWidth,
      height: cylHeight * 2,
      backgroundImage:
        "repeating-linear-gradient(180deg, rgba(180,180,180,0.6) 0px, rgba(180,180,180,0.6) 2px, transparent 3px, transparent 6px)",
      animation: "flowDown 2s linear infinite",
      transform: "skewX(-20deg)",
      opacity: 0.9,
    }}
  ></div>
</div>


      {/* ============= HOPPER (CONE) ============= */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: cylWidth / 2 + "px solid transparent",
          borderRight: cylWidth / 2 + "px solid transparent",
          borderTop: hopperHeight + "px solid #a8b0b8",
          margin: "0 auto",
          position: "relative",
          filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.2))"
        }}
      >
      <div
  style={{
    position: "absolute",
    right: "-85px",         
    top: -170, 
    transform: "translateY(-50%)",
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
    textAlign: "left",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    zIndex: 9999,
    pointerEvents: "none",
  }}
>
  HOPPER <br />
  Height = {Hh.toFixed(3)} m <br />
  Volume = {hopperVolume.toFixed(3)} m³
</div>

       

      </div>

      {/* ============= FEEDER ============= */}
      <div style={{
        width: 32,
        height: 32,
        background: "radial-gradient(circle, #ddd, #999)",
        borderRadius: "50%",
        margin: "8px auto",
        border: "2px solid #555",
        position: "relative"
      }} />

      {/* BOTTOM LABELS */}
      <div style={{ marginTop: 10, fontWeight: "bold", color: "#333" }}>
        Total Volume = {totalVolume.toFixed(3)} m³
      </div>
    </div>
  );
}



/* =============================================================
   REUSABLE INPUT ROW
============================================================= */
function InputRow({
  label,
  value,
  onChange,
  index,
  inputsRef,
  select,
  selectOptions = [],
  onSelectChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "14px",
        width: "70%",
        gap: "10px",
      }}
    >
      {/* LABEL */}
      <label
        style={{
          width: "160px",
          fontWeight: 600,
          fontSize: "15px",
          whiteSpace: "nowrap",
        }}
      >
        {label}:
      </label>

      {/* INPUT */}
      <input
        ref={(el) => (inputsRef.current[index] = el)}
        value={value}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const next = inputsRef.current[index + 1];
            if (next) next.focus();
          }
        }}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #888",
          fontSize: "16px",
        }}
      />

      {/* SELECT BOX (OPTIONAL) */}
      {select && (
        <select
          onChange={onSelectChange}
          style={{
            width: "120px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #888",
            background: "#fff",
            fontSize: "15px",
          }}
        >
          {selectOptions.map((op, i) => (
            <option key={i} value={op}>
              {op}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}



/* =============================================================
   MAIN PAGE
============================================================= */
export default function SiloFlowPage() {
  const [siloInputs, setSiloInputs] = useState({
    totalVolume: "",
    ratio: "",
    valleyAngle: 60,
    reposeAngle: 38,
    bottomDia: 0.4,
    thickness:"",
  });

  const [siloResults, setSiloResults] = useState(null);

  const [flowInputs, setFlowInputs] = useState({
      flow: "",
      flowUnit: "Am³/hr",     // FIX 1: must have default
  
      idc: "",
      idcUnit: "Gm/m³",
  
      temp: "",
      tempUnit: "°C",         // FIX 2: default °C
  
      density: "",
      densityUnit: "Kg/m³",
  
      storage: "",
      storageUnit: "hr",
    });
  
    const [flowResults, setFlowResults] = useState(null);
  
  
    const getKelvin = () => {
      if (flowInputs.tempUnit === "°C") {
        return parseFloat(flowInputs.temp) + 273.15;
      }
      return parseFloat(flowInputs.temp);
    };
  
   
   const handleFlowUnitChange = (newUnit) => {
  const oldUnit = flowInputs.flowUnit;
  let value = parseFloat(flowInputs.flow);

 
  if (newUnit === "Select Unit") {
    setFlowInputs({ ...flowInputs, flowUnit: "Am³/hr" });
    return;
  }


  if (!flowInputs.temp || flowInputs.temp === "") {
    alert("Please enter temperature before changing unit!");

    // KEEP unit safely as Am³/hr
    setFlowInputs({ ...flowInputs, flowUnit: "Am³/hr" });
    return;
  }


  if (newUnit === oldUnit) return;

  // Temp → Kelvin
  let Ta = getKelvin();
  let Tn = 273.15;


  if (!isNaN(value)) {
    if (oldUnit === "Am³/hr" && newUnit === "Nm³/hr") {
      // A → N
      value = value * (Tn*1 / Ta);
    } else if (oldUnit === "Nm³/hr" && newUnit === "Am³/hr") {
      // N → A
      value = value * (Ta / Tn*1);
    }
  }

  setFlowInputs({
    ...flowInputs,
    flow: value.toFixed(3),
    flowUnit: newUnit,
  });
};


  const siloRef = useRef([]);
  const flowRef = useRef([]);

  /* Main Styles */
  const styles = {
    page: {
      padding: "40px",
      fontFamily: "Arial",
    },
    section: {
      marginBottom: "40px",
      paddingBottom: "20px",
      borderBottom: "2px solid #ccc",
      width: "100%",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#2c3e50",
    },
    button: {
      padding: "12px 20px",
      background: "#0072ff",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      marginTop: "10px",
    },
  };

  // /* FLOW Calculation */
  // const calculateFlow = () => {
  //   const flow = parseFloat(flowInputs.flow);
  //   const idc = parseFloat(flowInputs.idc);
  //   const density = parseFloat(flowInputs.density);
  //   const storage = parseFloat(flowInputs.storage);

  //   let F1 = flow / 3600;
  //   let F2 = F1 * idc;
  //   let F3 = F2 / 1000;
  //   let F4 = F3 * 3600;
  //   let F5 = F4 / density;
  //   let F6 = F5 * storage;

  //   setFlowResults({ F1, F2, F3, F4, F5, F6 });
  // };


  const calculateFlow = () => {
  let flow = parseFloat(flowInputs.flow);

  // Unit conversion
  if (flowInputs.flowUnit === "kg/min") {
    flow = flow * 60; 
  } else if (flowInputs.flowUnit === "TPH") {
    flow = flow * 1000; 
  }

  let density = parseFloat(flowInputs.density);

  // Density unit conversion
  if (flowInputs.densityUnit === "g/cm³") {
    density = density * 1000; 
  }

  const idc = parseFloat(flowInputs.idc);
  const storage = parseFloat(flowInputs.storage);

  let F1 = flow / 3600;
  let F2 = F1 * idc;
  let F3 = F2 / 1000;
  let F4 = F3 * 3600;
  let F5 = F4 / density;
  let F6 = F5 * storage;

  setFlowResults({ F1, F2, F3, F4, F5, F6 });
};



const calculateSilo = () => {
  const Vt = parseFloat(siloInputs.totalVolume);   // total volume
  const D2 = parseFloat(siloInputs.bottomDia);     // bottom diameter
  const ratio = parseFloat(siloInputs.ratio);      // L/D ratio

  const alpha = parseFloat(siloInputs.reposeAngle) * Math.PI / 180;
  const theta = parseFloat(siloInputs.valleyAngle) * Math.PI / 180;

  const t = parseFloat(siloInputs.thickness) / 1000;
  const steelDensity = 7850;

  /* ====================================================
        BINARY SEARCH TO FIND D1 (TOP DIAMETER)
     ==================================================== */

  let low = D2 + 0.1;
  let high = 20;
  let D1 = low;

  const heightDiff = (D1_try) => {
    const R1 = D1_try / 2;

    // Hopper height (correct full valley angle)
    const Hh = (D1_try - D2) / (2 * Math.tan(theta));

    // Hopper volume
    const Vh =
      (Math.PI * Hh * (D1_try * D1_try + D1_try * D2 + D2 * D2)) / 12;

    // Repose height
    const Hr = R1 * Math.tan(alpha);

    // Repose volume
    const Vr = (1 / 3) * Math.PI * R1 * R1 * Hr;

    // Vertical height from ratio
    const H_ratio = ratio * D1_try;

    // Vertical height from volume
    const H_volume = (Vt - Vh - Vr) / (Math.PI * R1 * R1);

    // We want:  H_ratio == H_volume
    return H_volume - H_ratio;  
  };

  // BINARY SEARCH
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const diff = heightDiff(mid);

    if (diff > 0) low = mid; 
    else high = mid;

    D1 = mid;
  }

  /* ====================================================
        FINAL CALCULATIONS (NOW D1 IS PERFECT)
     ==================================================== */

  const R1 = D1 / 2;
  const R2 = D2 / 2;

  // Hopper height
  const Hh = (D1 - D2) / 2 * ( Math.tan(theta));

  // Hopper volume
  const Vh =
    (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

  // Repose height
  const Hr = R1 * Math.tan(alpha);

  // Repose volume
  const Vr = (1 / 3) * Math.PI * R1 * R1 * Hr;

  // Vertical height (ratio)
  const H_vertical_ratio = ratio * D1;

  // Vertical height (volume-based)
  const H_vertical_volume = (Vt - Vh - Vr) / (Math.PI * R1 * R1);

  // Cylinder height
  const H_cylinder = H_vertical_ratio - Hr;

  // Cylinder volume
  const Vc = Math.PI * R1 * R1 * H_cylinder;

  // Total
  const Vsum = Vh + Vr + Vc;

  

const emptyVolume = Vt - (Vh + Vr + Vc);

const Totalvolume = Vt + emptyVolume;

const remainVol = Totalvolume - Vh;

const verticalsilo = remainVol / ((Math.PI / 4) * (D1 * D1));


const totalh = verticalsilo + Hh;


  // Total silo height
  const totalHeight = Hh + H_vertical_ratio;

  /* SURFACE AREA */
  const slant = Math.sqrt(Hh * Hh + (R1 - R2) ** 2);
  const Atop = Math.PI * (D1*D1)*0.25;
  const Ahopper = Math.PI * (R1 + R2) * slant;
  const Avertical = Math.PI * D1 * H_vertical_ratio;
  const A_total = Ahopper + Avertical;

  const plateWeight = A_total * t * steelDensity;

   const slant1 = Math.sqrt(Hh * Hh + (R1 - R2) ** 2);
  const Atop1 = Math.PI * (D1*D1)*0.25;
  const Ahopper1 = Math.PI * (R1 + R2) * slant1;
  const Avertical1 = Math.PI * D1 * verticalsilo;
  const A_total1 = Ahopper1 + Avertical1 + Atop1;

  const plateWeight1 = A_total1 * t * 7.85;

  /* SAVE */
  setSiloResults({
  D1,
  Hh,
  Hr,
  Vt,
  H_vertical_ratio,
  H_vertical_volume,
  H_cylinder,
  ratio_actual: H_vertical_ratio / D1,
  hopperVol: Vh,
  reposeVol: Vr,
  cylVol: Vc,
  Vsum,
  emptyVolume,
  totalHeight,
  Totalvolume,
  Atop,
  Ahopper,
  Avertical,
  A_total,
  plateWeight,
  remainVol,
  verticalsilo,
  totalh,
  Atop1,
  Ahopper1,
  Avertical1,
  A_total1,
  plateWeight1,
});
};



  return (
    <div style={styles.page}>
      <style>
        {`  
          .row { display: flex; gap: 15px; align-items: flex-start; }

          @media (min-width: 992px) {
            .left { flex: 0.4; }
            .center { flex: 0.5; }
            .right { flex: 0.5; }
          }

          @media (max-width: 991px) and (min-width: 600px) {
            .row { flex-wrap: wrap; }
            .left, .center, .right { flex: 1; }
            .right { justify-content: center !important; margin-left: 0 !important; }
          }

          @media (max-width: 599px) {
            .row { flex-direction: column; }
            .left, .center, .right {
              flex: 1;
              width: 100%;
              justify-content: center !important;
              margin-left: 0 !important;
            }
          }
        `}
      </style>

      {/* ======================================================
                       FLOW SECTION
      ======================================================= */}
      <div style={styles.section}>
        <h2 style={styles.heading}>Flow Calculation</h2>

        <div className="row">
          {/* LEFT */}
          <div className="left">
           <InputRow
  label="Flow"
  value={flowInputs.flow}
  onChange={(e) =>
    setFlowInputs({ ...flowInputs, flow: e.target.value })
  }
  index={0}
  inputsRef={flowRef}
  select={true}
  selectOptions={[ "Am³/hr", "Nm³/hr"]}
onSelectChange={(e) => handleFlowUnitChange(e.target.value)}
/>


<InputRow
  label="IDC"
  value={flowInputs.idc}
  onChange={(e) => setFlowInputs({ ...flowInputs, idc: e.target.value })}
  index={1}
  inputsRef={flowRef}
   select={true}
  selectOptions={["Gm/m³",]}
/>

<InputRow
  label="Temperature"
  value={flowInputs.temp}
  onChange={(e) => setFlowInputs({ ...flowInputs, temp: e.target.value })}
  index={2}
  inputsRef={flowRef}
   select={true}
  selectOptions={["°C",]}
/>

<InputRow
  label="Density"
  value={flowInputs.density}
  onChange={(e) => setFlowInputs({ ...flowInputs, density: e.target.value })}
  index={3}
  inputsRef={flowRef}
  select={true}
  selectOptions={["Kg/m³",]}
  onSelectChange={(e) => setFlowInputs({ ...flowInputs, densityUnit: e.target.value })}
/>

<InputRow
  label="Storage (hr)"
  value={flowInputs.storage}
  onChange={(e) => setFlowInputs({ ...flowInputs, storage: e.target.value })}
  index={4}
  inputsRef={flowRef}
   select={true}
  selectOptions={["hr",]}
/>

            <button style={styles.button} onClick={calculateFlow}>Calculate Flow</button>
          </div>

 {flowResults && (
  <>
    <style>{`
      @keyframes fadeSlide {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeWord {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    <div className="center" style={{ animation: "fadeSlide 0.6s ease-out" }}>

      {/* Title animation */}
      <h3>
        {"Flow Results".split(" ").map((word, i) => (
          <span
            key={i}
            style={{
              opacity: 0,
              animation: `fadeWord 0.5s ease forwards`,
              animationDelay: `${i * 0.25}s`,
              display: "inline-block",
              marginRight: "6px",
            }}
          >
            {word}
          </span>
        ))}
      </h3>

      <p>Flow/Sec = {flowResults?.F1?.toFixed(3)} {flowInputs.flowUnit === "Am³/hr" ? "Am³/sec" : "Nm³/sec"}</p>
      <p>Gm/Sec = {flowResults?.F2?.toFixed(3)} Gm/sec</p>
      <p>Kg/Sec = {flowResults?.F3?.toFixed(3)} Kg/sec</p>
      <p>Kg/Hr = {flowResults?.F4?.toFixed(3)} Kg/hr</p>
      <p>m³/Hr = {flowResults?.F5?.toFixed(3)} m³/Hr</p>
      <p>Volume = {flowResults?.F6?.toFixed(3)} m³</p>

    </div>
  </>
)}




        </div>
      </div>

      {/* ======================================================
                       SILO SECTION
      ======================================================= */}
      <div style={styles.section}>
        <h2 style={styles.heading}>Silo Calculation</h2>

        <div className="row">
       
<div className="left">

  <InputRow 
    label="Total Volume (m³)" 
    value={siloInputs.totalVolume}
    onChange={(e)=> setSiloInputs({...siloInputs,totalVolume:e.target.value})}
    index={0}
    inputsRef={siloRef}
  />

  <InputRow 
    label="Bottom Diameter (m)" 
    value={siloInputs.bottomDia}
    onChange={(e)=> setSiloInputs({...siloInputs,bottomDia:e.target.value})}
    index={1}
    inputsRef={siloRef}
  />

  <InputRow 
    label="L/D Ratio"
    value={siloInputs.ratio}
    onChange={(e)=> setSiloInputs({...siloInputs,ratio:e.target.value})}
    index={2}
    inputsRef={siloRef}
  />

  <InputRow 
    label="Repose Angle (°)" 
    value={siloInputs.reposeAngle}
    onChange={(e)=> setSiloInputs({...siloInputs,reposeAngle:e.target.value})}
    index={3}
    inputsRef={siloRef}
  />

  <InputRow 
    label="Valley Angle (°)" 
    value={siloInputs.valleyAngle}
    onChange={(e)=> setSiloInputs({...siloInputs,valleyAngle:e.target.value})}
    index={4}
    inputsRef={siloRef}
  />

  <InputRow
    label="Plate Thickness (mm)"
    value={siloInputs.thickness}
    onChange={(e) => setSiloInputs({ ...siloInputs, thickness: e.target.value })}
    index={5}
    inputsRef={siloRef}
  />

  <button style={styles.button} onClick={calculateSilo}>
    Calculate Silo
  </button>

</div>

{siloResults && (
  <>
    <style>{`
      @keyframes fadeWord {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    <div className="center">

      {/* Title with word-by-word animation */}
      <h3>
        {"Silo Dimensions".split(" ").map((w, i) => (
          <span
            key={i}
            style={{
              opacity: 0,
              animation: `fadeWord 0.5s ease forwards`,
              animationDelay: `${i * 0.2}s`,
              display: "inline-block",
              marginRight: "6px"
            }}
          >
            {w}
          </span>
        ))}
      </h3>

      {/* ALL LINES WITH AUTOMATIC DELAY */}
      {[
        `Top Diameter: ${siloResults?.D1?.toFixed(3) ?? "—"} m`,
        `Hopper Height: ${siloResults?.Hh?.toFixed(3) ?? "—"} m`,
        `Vertical Silo Height: ${siloResults?.H_vertical_ratio?.toFixed(3) ?? "—"} m`,
        `Cylinder Height: ${siloResults?.H_cylinder?.toFixed(3) ?? "—"} m`,
        `Repose Height: ${siloResults?.Hr?.toFixed(3) ?? "—"} m`,
        `Total Height: ${siloResults?.totalHeight?.toFixed(3) ?? "—"} m`,
      ].map((text, i) => (
        <p
          key={i}
          style={{
            opacity: 0,
            animation: `fadeWord 0.6s ease forwards`,
            animationDelay: `${1 + i * 0.25}s`
          }}
        >
          {text}
        </p>
      ))}

      {/* SECOND TITLE */}
      <h4
        style={{
          opacity: 0,
          animation: `fadeWord 0.5s ease forwards`,
          animationDelay: `2s`
        }}
      >
        Volumes
      </h4>

      {[
        `Hopper Volume: ${siloResults?.hopperVol?.toFixed(3) ?? "—"} m³`,
        `Repose Volume: ${siloResults?.reposeVol?.toFixed(3) ?? "—"} m³`,
        `Cylinder Volume: ${siloResults?.cylVol?.toFixed(3) ?? "—"} m³`,
        `Empty Volume: ${siloResults?.emptyVolume?.toFixed(3) ?? "—"} m³`,
      ].map((text, i) => (
        <p
          key={i}
          style={{
            opacity: 0,
            animation: `fadeWord 0.6s ease forwards`,
            animationDelay: `${2.2 + i * 0.25}s`
          }}
        >
          {text}
        </p>
      ))}

      {/* THIRD TITLE */}
      <h4
        style={{
          opacity: 0,
          animation: `fadeWord 0.5s ease forwards`,
          animationDelay: `3.4s`
        }}
      >
        Surface Area
      </h4>

      {[
        `Top Area: ${siloResults?.Atop?.toFixed(3) ?? "—"} m²`,
        `Vertical Area: ${siloResults?.Avertical?.toFixed(3) ?? "—"} m²`,
        `Hopper Area: ${siloResults?.Ahopper?.toFixed(3) ?? "—"} m²`,
        `Total Surface Area: ${siloResults?.A_total?.toFixed(3) ?? "—"} m²`,
      ].map((text, i) => (
        <p
          key={i}
          style={{
            opacity: 0,
            animation: `fadeWord 0.6s ease forwards`,
            animationDelay: `${3.6 + i * 0.25}s`
          }}
        >
          {text}
        </p>
      ))}

      {/* FOURTH TITLE */}
      <h4
        style={{
          opacity: 0,
          animation: `fadeWord 0.5s ease forwards`,
          animationDelay: `4.8s`
        }}
      >
        Plate Weight
      </h4>

      <p
        style={{
          opacity: 0,
          animation: `fadeWord 0.6s ease forwards`,
          animationDelay: `5s`
        }}
      >
        Total Plate Weight: {siloResults?.plateWeight?.toFixed(2) ?? "—"} kg
      </p>

       <h3>
        {"Silo Dimensions".split(" ").map((w, i) => (
          <span
            key={i}
            style={{
              opacity: 0,
              animation: `fadeWord 0.5s ease forwards`,
              animationDelay: `${i * 0.2}s`,
              display: "inline-block",
              marginRight: "6px"
            }}
          >
            {w}
          </span>
        ))}
      </h3>

      {/* ALL LINES WITH AUTOMATIC DELAY */}
      {[
        `Vertical Silo Height: ${siloResults?.verticalsilo?.toFixed(3) ?? "—"} m`,
        `Total Height: ${siloResults?.totalh?.toFixed(3) ?? "—"} m`,
      ].map((text, i) => (
        <p
          key={i}
          style={{
            opacity: 0,
            animation: `fadeWord 0.6s ease forwards`,
            animationDelay: `${1 + i * 0.25}s`
          }}
        >
          {text}
        </p>
      ))}

 {/* THIRD TITLE */}
      <h4
        style={{
          opacity: 0,
          animation: `fadeWord 0.5s ease forwards`,
          animationDelay: `3.4s`
        }}
      >
        Surface Area
      </h4>

      {[
        `Top Area: ${siloResults?.Atop1?.toFixed(3) ?? "—"} m²`,
        `Vertical Area: ${siloResults?.Avertical1?.toFixed(3) ?? "—"} m²`,
        `Hopper Area: ${siloResults?.Ahopper1?.toFixed(3) ?? "—"} m²`,
        `Total Surface Area: ${siloResults?.A_total1?.toFixed(3) ?? "—"} m²`,
      ].map((text, i) => (
        <p
          key={i}
          style={{
            opacity: 0,
            animation: `fadeWord 0.6s ease forwards`,
            animationDelay: `${3.6 + i * 0.25}s`
          }}
        >
          {text}
        </p>
      ))}

      {/* FOURTH TITLE */}
      <h4
        style={{
          opacity: 0,
          animation: `fadeWord 0.5s ease forwards`,
          animationDelay: `4.8s`
        }}
      >
        Plate Weight
      </h4>

      <p
        style={{
          opacity: 0,
          animation: `fadeWord 0.6s ease forwards`,
          animationDelay: `5s`
        }}
      >
        Total Plate Weight: {siloResults?.plateWeight1?.toFixed(2) ?? "—"} Tones
      </p>
    </div>
  </>
)}





          {/* RIGHT — 3D SILO */}
          <div className="right">
             <Silo3D results={siloResults} />
          </div>

          
        </div>
      </div>
    </div>
  );
}
