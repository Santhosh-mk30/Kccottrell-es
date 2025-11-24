import React, { useState, useRef } from "react";

/* =============================================================
   3D SILO SHAPE MODEL
============================================================= */
function Silo3D({ topDia = 2, Hh = 1, Hc = 2 }) {
  const cylHeight = Hc * 85;
  const coneHeight = Hh * 85;
  const cylWidth = topDia * 38;

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <div
        style={{
          width: cylWidth,
          height: cylHeight,
          background:
            "linear-gradient(135deg, #cdd3d8 0%, #f5f7fa 40%, #b0b8c0 100%)",
          border: "1px solid #888",
          borderRadius: "22px 22px 0 0",
          boxShadow: "0 0 18px rgba(0,0,0,0.25) inset",
        }}
      ></div>

      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: cylWidth / 2 + "px solid transparent",
          borderRight: cylWidth / 2 + "px solid transparent",
          borderTop: coneHeight + "px solid #a8b0b8",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
        }}
      ></div>
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


/* ============================================================
   SILO CALCULATION — WITH EMPTY VOLUME
============================================================ */
const calculateSilo = () => {
  const Vt = parseFloat(siloInputs.totalVolume);
  const D2 = parseFloat(siloInputs.bottomDia);
  const ratio = parseFloat(siloInputs.ratio);

  const alpha = parseFloat(siloInputs.reposeAngle) * Math.PI / 180;
  const theta = parseFloat(siloInputs.valleyAngle) * Math.PI / 180;

  const t = parseFloat(siloInputs.thickness) / 1000;
  const steelDensity = 7850;

  /* =============================
      FIND D1 BY BINARY SEARCH
  ============================== */
  let low = D2 + 0.1;
  let high = 25;
  let D1 = low;

  const totalVolumeForD1 = (D1_try) => {
    const R1 = D1_try / 2;
    // const R2 = D2 / 2;

    /* HOPPER HEIGHT */
    const Hh = (D1_try - D2) / (2 * Math.tan(theta / 2));

    /* REPOSE HEIGHT */
    const Hr = R1 * Math.tan(alpha);

    /* CYLINDER HEIGHT */
    const Hc = ratio * D1_try - Hr;

    /* EMPTY HEIGHT */
    const Hempty = Hc - Hr;

    /* VOLUMES */
    const Vh =
      (Math.PI * Hh * (D1_try * D1_try + D1_try * D2 + D2 * D2)) / 12;

    const Vr = (1 / 3) * Math.PI * R1 * R1 * Hr;

    const Vc = Math.PI * R1 * R1 * Hc;

    const Vempty = Math.PI * R1 * R1 * Hempty;

    /* TOTAL by your requirement */
    return Vh + Vr + Vc + Vempty;
  };

  /* RUN BINARY SEARCH */
  for (let i = 0; i < 40; i++) {
    let mid = (low + high) / 2;
    let Vcalc = totalVolumeForD1(mid);

    if (Vcalc > Vt) high = mid;
    else low = mid;

    D1 = mid;
  }

  /* FINAL CALCULATIONS */
  const R1 = D1 / 2;
  const R2 = D2 / 2;

  const Hh = (D1 - D2) / (2 * Math.tan(theta / 2));
  const Hr = R1 * Math.tan(alpha);
  const Hc = ratio * D1 - Hr;
  const Hempty = Hc - Hr;

  /* VOLUMES */
  const Vh =
    (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

  const Vr = (1 / 3) * Math.PI * R1 * R1 * Hr;
  const Vc = Math.PI * R1 * R1 * Hc;
  const Vempty = Math.PI * R1 * R1 * Hempty;

  const totalHeight = Hh + Hc + Hr ;

  /* SURFACE AREA */
  const slant = Math.sqrt(Hh * Hh + (R1 - R2) ** 2);
  const Ahopper = Math.PI * (R1 + R2) * slant;
  const Avertical = Math.PI * D1 * (Hc + Hr);
  const A_total = Ahopper + Avertical;

  const plateWeight = A_total * t * steelDensity;

  /* SAVE RESULTS */
  setSiloResults({
    D1,
    Hh,
    Hc,
    Hr,
    Hempty,
    totalHeight,
    hopperVol: Vh,
    cylVol: Vc,
    reposeVol: Vr,
    Vempty,
    Vsum: Vh + Vc + Vr + Vempty,
    Avertical,
    Ahopper,
    A_total,
    plateWeight,
  });
};





  return (
    <div style={styles.page}>

      {/* RESPONSIVE CSS */}
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

          {/* RIGHT */}
          {flowResults && (
  <div className="center">
    <h3>Flow Results</h3>

    <p>
      Flow/Sec = {flowResults.F1.toFixed(3)}{" "}
      {flowInputs.flowUnit === "Am³/hr" ? "Am³/sec" : "Nm³/sec"}
    </p>

    <p>Gm/Sec = {flowResults.F2.toFixed(3)} Gm/sec</p>
    <p>Kg/Sec = {flowResults.F3.toFixed(3)} Kg/sec</p>
    <p>Kg/Hr = {flowResults.F4.toFixed(3)} Kg/hr</p>

    <p>
      m³/Hr = {flowResults.F5.toFixed(3)} m³/Hr
    </p>

    <p>
      Volume = {flowResults.F6.toFixed(3)} m³
    </p>
  </div>
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

{/* CENTER — RESULTS */}
{siloResults && (
  <div className="center">
    <h3>Silo Dimensions</h3>

    <p>Top Diameter: {siloResults?.D1 ? siloResults.D1.toFixed(3) : "—"} m</p>
    <p>Hopper Height: {siloResults?.Hh ? siloResults.Hh.toFixed(3) : "—"} m</p>
    <p>Cylinder Height: {siloResults?.Hc ? siloResults.Hc.toFixed(3) : "—"} m</p>
    <p>Repose Height: {siloResults?.Hr ? siloResults.Hr.toFixed(3) : "—"} m</p>
    <p>Total Height: {siloResults?.totalHeight ? siloResults.totalHeight.toFixed(3) : "—"} m</p>

    <h4>Volumes</h4>
    <p>Hopper Volume: {siloResults?.hopperVol ? siloResults.hopperVol.toFixed(3) : "—"} m³</p>
    <p>Repose Volume: {siloResults?.reposeVol ? siloResults.reposeVol.toFixed(3) : "—"} m³</p>
    <p>Cylinder Volume: {siloResults?.cylVol ? siloResults.cylVol.toFixed(3) : "—"} m³</p>

    <h4>Surface Area</h4>
    <p>Top Area: {siloResults?.A_top ? siloResults.A_top.toFixed(3) : "—"} m²</p>
    <p>Vertical Area: {siloResults?.A_vertical ? siloResults.A_vertical.toFixed(3) : "—"} m²</p>
    <p>Hopper Area: {siloResults?.A_bottom ? siloResults.A_bottom.toFixed(3) : "—"} m²</p>
    <p>Total Surface Area: {siloResults?.A_total ? siloResults.A_total.toFixed(3) : "—"} m²</p>

    <h4>Plate Weight</h4>
    <p>Total Plate Weight: {siloResults?.plateWeight ? siloResults.plateWeight.toFixed(2) : "—"} kg</p>
  </div>
)}




          {/* RIGHT — 3D SILO */}
          <div className="right">
            <Silo3D
              topDia={parseFloat(siloInputs.topDia) || 2}
              Hh={siloResults?.Hh || 1}
              Hc={siloResults?.Hc || 2}
            />
          </div>

          
        </div>
      </div>
    </div>
  );
}
