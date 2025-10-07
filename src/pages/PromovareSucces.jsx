// src/pages/PromovareSucces.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PromovareSucces() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Se confirmă plata...");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const session_id = params.get("session_id");
        if (!session_id) {
          setMessage("Lipsește session_id din URL.");
          return;
        }

        const res = await fetch(
          `https://oltenitaimobiliare-backend.onrender.com/api/stripe/confirm?session_id=${session_id}`
        );

        const data = await res.json();
        if (data.ok) {
          setMessage("✅ Plata confirmată! Anunțul tău a fost promovat cu succes.");
        } else {
          setMessage(`⚠️ ${data.error || "Eroare la confirmarea plății."}`);
        }
      } catch (err) {
        console.error("Eroare confirmare plată:", err);
        setMessage("❌ Eroare la conectarea cu serverul Stripe.");
      }
    };

    confirmPayment();
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-md max-w-md">
        <div className="text-5xl mb-4">💳</div>
        <h1 className="text-xl font-bold text-green-700 mb-2">Rezultatul plății</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => navigate("/anunturile-mele")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          🔙 Înapoi la anunțurile mele
        </button>
      </div>
    </div>
  );
}
