import React from "react";
import { Link } from "react-router-dom";

function SuccesPlata() {
  return (
    <div className="container form-box" style={{ textAlign: "center" }}>
      <h2 style={{ color: "green" }}>✅ Plata a fost efectuată cu succes!</h2>
      <p>Anunțul tău a fost promovat conform pachetului ales.</p>

      <Link to="/anunturile-mele">
        <button className="blue-btn" style={{ marginTop: "20px" }}>
          📋 Vezi Anunțurile Mele
        </button>
      </Link>
    </div>
  );
}

export default SuccesPlata;
