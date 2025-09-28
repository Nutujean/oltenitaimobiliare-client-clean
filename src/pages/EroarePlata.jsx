import React from "react";
import { Link } from "react-router-dom";

function EroarePlata() {
  return (
    <div className="container form-box" style={{ textAlign: "center" }}>
      <h2 style={{ color: "red" }}>❌ Plata a eșuat sau a fost anulată!</h2>
      <p>Te rugăm să încerci din nou sau să verifici metoda de plată.</p>

      <Link to="/anunturile-mele">
        <button className="blue-btn" style={{ marginTop: "20px" }}>
          🔄 Înapoi la Anunțurile Mele
        </button>
      </Link>
    </div>
  );
}

export default EroarePlata;
