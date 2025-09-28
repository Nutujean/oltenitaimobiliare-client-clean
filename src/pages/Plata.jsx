import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Plata() {
  const { id: anuntId } = useParams(); // ia automat id-ul anunțului din URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlata = async (pachet) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/plata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"), // trebuie login
          },
          body: JSON.stringify({ pachet, anuntId }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Eroare la plata");

      // Redirecționează la Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-box">
      <h2>💳 Alege pachetul de promovare</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid">
        <div className="card">
          <h3>Basic</h3>
          <p>✔ Gratuit, 7 zile</p>
          <button disabled className="disabled-btn">Activ</button>
        </div>

        <div className="card">
          <h3>⭐ Gold</h3>
          <p>25 lei / 7 zile<br />+ Reactualizare automată</p>
          <button
            onClick={() => handlePlata("Gold")}
            disabled={loading}
            className="blue-btn"
          >
            {loading ? "Se încarcă..." : "Plătește"}
          </button>
        </div>

        <div className="card">
          <h3>💎 Diamond</h3>
          <p>49 lei / 20 zile<br />+ Promovare pe prima pagină</p>
          <button
            onClick={() => handlePlata("Diamond")}
            disabled={loading}
            className="blue-btn"
          >
            {loading ? "Se încarcă..." : "Plătește"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Plata;
