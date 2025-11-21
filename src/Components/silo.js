import React, { useState } from "react";

/* =============================================================
   3D SILO SHAPE MODEL (INLINE CSS)
   ============================================================= */
function Silo3D({ topDia = 2, Hh = 1, Hc = 2 }) {
  const cylHeight = Hc * 40;
  const coneHeight = Hh * 40;
  const cylWidth = topDia * 15;

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      <div
        style={{
          width: cylWidth,
          height: cylHeight,
          background: "linear-gradient(90deg, #bfc7d1, #eef1f4, #bfc7d1)",
          border: "2px solid #999",
          borderRadius: "20px 20px 0 0",
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: cylWidth / 2 + "px solid transparent",
          borderRight: cylWidth / 2 + "px solid transparent",
          borderTop: coneHeight + "px solid #b0b8c4",
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>
    </div>
  );
}

/* =============================================================
   CARD 1  SILO CALCULATOR
   ============================================================= */
function SiloCard() {
  const [inputs, setInputs] = useState({
    totalVolume: "",
    topDia: "",
    bottomDia: "",
    reposeAngle: "",
    valleyAngle: "60",
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const calculate = () => {
    const Vt = parseFloat(inputs.totalVolume);
    const D1 = parseFloat(inputs.topDia);
    const D2 = parseFloat(inputs.bottomDia);
    const alpha = parseFloat(inputs.reposeAngle) * (Math.PI / 180);
    const theta = parseFloat(inputs.valleyAngle) * (Math.PI / 180);

    const Hh = (D1 - D2) / (2 * Math.tan(theta / 2));
    const hopperVol =
      (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

    const reposeHeight = (D1 / 2) * Math.tan(alpha);
    const reposeVol =
      (1 / 3) * Math.PI * (D1 / 2) ** 2 * reposeHeight;

    const cylVolNeeded = Vt - (hopperVol + reposeVol);
    const Hc =
      cylVolNeeded / (Math.PI * (D1 / 2) ** 2);

    const totalHeight = Hh + Hc + reposeHeight;
    const ratio = totalHeight / D1;

    setResults({
      hopperVol,
      reposeVol,
      cylVolNeeded,
      Hh,
      Hc,
      total: Vt,
      reposeHeight,
      totalHeight,
      ratio,
    });
  };

  return (
    <div
      style={{
        width: "380px",
        background: "#fff",
        padding: "20px",
        borderRadius: "18px",
        margin: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        border: "1px solid #ccc",
      }}
    >
      <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Silo</h2>

      {Object.keys(inputs).map((key) => (
        <input
          key={key}
          name={key}
          value={inputs[key]}
          onChange={handleChange}
          placeholder={key.toUpperCase()}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #aaa",
            background: "#f9f9f9",
            fontSize: "15px",
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right, #1e88e5, #3949ab)",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
          fontSize: "16px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        Calculate
      </button>

      <Silo3D
        topDia={parseFloat(inputs.topDia) || 2}
        Hh={results?.Hh || 1}
        Hc={results?.Hc || 2}
      />

      {results && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            background: "#fafafa",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <h3>📌 Silo Results</h3>

          <p>Hopper Height: {results.Hh.toFixed(3)} m</p>
          <p>Hopper Volume: {results.hopperVol.toFixed(3)} m³</p>
          <p>Repose Height: {results.reposeHeight.toFixed(3)} m</p>
          <p>Repose Volume: {results.reposeVol.toFixed(3)} m³</p>
          <p>Cylinder Height: {results.Hc.toFixed(3)} m</p>
          <p>Cylinder Volume: {results.cylVolNeeded.toFixed(3)} m³</p>

          <hr style={{ margin: "12px 0" }} />

          <p><b>Total Height:</b> {results.totalHeight.toFixed(3)} m</p>
          <p><b>Height / TopDia:</b> {results.ratio.toFixed(3)}</p>

          {results.ratio < 1.5 || results.ratio > 2 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
               ⚠️ Ratio Out of Range (1.5 - 2 Required)
            </p>
          ) : (
            <p style={{ color: "green", fontWeight: "bold" }}>✅ Ratio OK</p>
          )}
        </div>
      )}
    </div>
  );
}

/* =============================================================
   CARD 2  FLOW CALCULATOR
   ============================================================= */
function FlowCard() {
  const [inputs, setInputs] = useState({
    flow: "",
    idc: "",
    temp: "",
    density: "",
    storage: "",
  });

  const [extra, setExtra] = useState(null);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const calculate = () => {
    const flow = parseFloat(inputs.flow);
    const idc = parseFloat(inputs.idc);
    const density = parseFloat(inputs.density);
    const storage = parseFloat(inputs.storage);

    let F1 = flow / 3600;
    let F2 = F1 * idc;
    let F3 = F2 / 1000;
    let F4 = F3 * 3600;
    let F5 = F4 / density;
    let F6 = F5 * storage;

    setExtra({ F1, F2, F3, F4, F5, F6 });
  };

  return (
    <div
      style={{
        width: "380px",
        background: "#fff",
        padding: "20px",
        borderRadius: "18px",
        margin: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        border: "1px solid #ccc",
      }}
    >
      <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Flow</h2>

      {Object.keys(inputs).map((key) => (
        <input
          key={key}
          name={key}
          value={inputs[key]}
          onChange={handleChange}
          placeholder={key.toUpperCase()}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #aaa",
            background: "#f9f9f9",
            fontSize: "15px",
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right, #ff7043, #d84315)",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Calculate
      </button>

      {extra && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            background: "#fafafa",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <h3>Flow Outputs</h3>

          <p>Flow per Sec = {extra.F1.toFixed(3)} Am³/Sec</p>
          <p>Flow per Gm = {extra.F2.toFixed(3)} Gm/Sec</p>
          <p>Flow per Kg = {extra.F3.toFixed(3)} Kg/Sec</p>
          <p>Flow Kg/Hr = {extra.F4.toFixed(3)} Kg/Hr</p>
          <p>Flow m³/Hr = {extra.F5.toFixed(3)} m³/Hr</p>
          <p>Volume = {extra.F6.toFixed(3)} m³</p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   FINAL PAGE â€” TWO CARDS TOGETHER
   ============================================================= */
export default function SiloFlowPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "#eef2f7",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <SiloCard />
        <FlowCard />
      </div>
    </div>
  );
}
