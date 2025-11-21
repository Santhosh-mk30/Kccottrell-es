import React, { useState, useEffect } from "react";

/* =============================================================
   3D SILO SHAPE MODEL
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
   SILO CARD
   ============================================================= */
function SiloCard({ autoVolume }) {
  const [inputs, setInputs] = useState({
    totalVolume: "",
    reposeAngle: "",
    valleyAngle: "60",
  });

  const [results, setResults] = useState(null);

  // auto set from FlowCard (rounded volume)
  useEffect(() => {
    if (autoVolume !== null) {
      setInputs((p) => ({ ...p, totalVolume: autoVolume }));
    }
  }, [autoVolume]);

  const calculate = () => {
    const Vt = parseFloat(inputs.totalVolume);
    const D2 = 0.4; // CONSTANT bottom dia
    const alpha = parseFloat(inputs.reposeAngle) * (Math.PI / 180);
    const theta = parseFloat(inputs.valleyAngle) * (Math.PI / 180);

    let D1 = 2; // initial guess for top dia
    let ratio = 0;
    let Hh, hopperVol, reposeHeight, reposeVol, cylVolNeeded, Hc, totalHeight;

    // iterate until ratio matches approx 2
    for (let i = 0; i < 30; i++) {
      Hh = (D1 - D2) / (2 * Math.tan(theta / 2));
      hopperVol =
        (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

      reposeHeight = (D1 / 2) * Math.tan(alpha);
      reposeVol =
        (1 / 3) * Math.PI * (D1 / 2) ** 2 * reposeHeight;

      cylVolNeeded = Vt - (hopperVol + reposeVol);

      Hc = cylVolNeeded / (Math.PI * (D1 / 2) ** 2);
      totalHeight = Hh + Hc + reposeHeight;

      ratio = totalHeight / D1;

      if (ratio > 2) {
        D1 += 0.1;
      } else if (ratio < 2) {
        D1 -= 0.1;
      }

      D1 = Math.max(D1, 0.5); // avoid negative
    }

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
      topDia: D1,
      bottomDia: D2,
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
      <h2>Silo</h2>

      <input
        name="totalVolume"
        value={inputs.totalVolume}
        placeholder="TOTAL VOLUME"
        readOnly
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "1px solid #aaa",
          background: "#f0f0f0",
        }}
      />

      <input
        name="reposeAngle"
        value={inputs.reposeAngle}
        onChange={(e) =>
          setInputs({ ...inputs, reposeAngle: e.target.value })
        }
        placeholder="REPOSE ANGLE"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "1px solid #aaa",
        }}
      />

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right,#1e88e5,#3949ab)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        Calculate
      </button>

      {results && (
        <>
          <Silo3D
            topDia={results.topDia}
            Hh={results.Hh}
            Hc={results.Hc}
          />

          <div
            style={{
              marginTop: "10px",
              padding: "15px",
              background: "#fafafa",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <h3>Silo Results</h3>
            <p>Top Dia: {results.topDia.toFixed(3)} m</p>
            <p>Bottom Dia: {results.bottomDia} m</p>
            <p>Hopper Height: {results.Hh.toFixed(3)} m</p>
            <p>Repose Height: {results.reposeHeight.toFixed(3)} m</p>
            <p>Cylinder Height: {results.Hc.toFixed(3)} m</p>
            <p>Total Height: {results.totalHeight.toFixed(3)} m</p>
            <p>Ratio H/D: {results.ratio.toFixed(3)}</p>

            <p
              style={{
                color:
                  Math.abs(results.ratio - 2) < 0.05
                    ? "green"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {Math.abs(results.ratio - 2) < 0.05
                ? "✅ Ratio OK"
                : "⚠️ Ratio Not OK"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* =============================================================
   FLOW CARD
   ============================================================= */
function FlowCard({ setVolume }) {
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

    // ⬇️ Rounded volume set to SiloCard
    setVolume(Math.round(F6));
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
      <h2>Flow</h2>

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
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right,#ff7043,#d84315)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
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
          <h3>Flow Results</h3>
          <p>Volume = {extra.F6.toFixed(3)} m³</p>
          <p>Rounded → {Math.round(extra.F6)} m³</p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   MAIN PAGE
   ============================================================= */
export default function SiloFlowPage() {
  const [volumeValue, setVolumeValue] = useState(null);

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
        <FlowCard setVolume={setVolumeValue} />
        <SiloCard autoVolume={volumeValue} />
      </div>
    </div>
  );
}
