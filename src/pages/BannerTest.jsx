// src/components/PromoBanner.jsx
import React from "react";

export default function PromoBanner() {
  return (
    <div className="col-span-3 w-full max-w-[900px] mx-auto bg-white border-2 border-yellow-400 rounded-2xl shadow-lg text-center p-6 md:p-8 mt-6">
      {/* 🏷️ Etichetă aurie */}
      <div className="inline-block bg-yellow-400 text-black font-semibold text-xs px-3 py-1 rounded-full mb-3 shadow animate-pulse">
        🎖️ Partener oficial
      </div>

      {/* 🔹 Conținut principal */}
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
        Vizitează <span className="text-blue-700">BebeKing.ro</span>
      </h3>
      <p className="text-gray-600 text-sm md:text-base mb-4">
        Magazin recomandat — jucării, haine și produse de calitate pentru copii.
      </p>

      {/* 🔗 Buton */}
      <a
        href="https://bebeking.ro"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
      >
        Descoperă ofertele 🎁
      </a>
    </div>
  );
}
