// src/components/PromoBanner.jsx
import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="flex justify-center my-12">
      {/* Container cu lățime fixă cât 3 carduri */}
      <div className="w-[960px] bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - jucării și produse pentru copii"
            className="w-full h-[160px] object-cover" // 🔹 puțin mai mic pe înălțime
          />
        </a>
        <div className="p-4 text-center">
          <h3 className="text-blue-700 font-bold text-lg mb-1">
            Partener Recomandat 🎁
          </h3>
          <p className="text-sm text-gray-600">
            Vizitează <strong>BebeKing.ro</strong> — jucării, haine și produse pentru copii.
          </p>
        </div>
      </div>
    </div>
  );
}
