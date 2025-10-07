// src/pages/SuccesPlata.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuccesPlata() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-md max-w-md">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Plata confirmată!
        </h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Mulțumim pentru susținere! <br />
          Anunțul tău a fost promovat cu succes și va rămâne evidențiat timp de{" "}
          <b>7 zile</b>.
        </p>

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
