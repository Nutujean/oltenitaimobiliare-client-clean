// src/components/PromoBanner.jsx
import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="w-full flex justify-center my-10 px-4">
      <div className="w-[1000px] bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Jucării pentru copii"
            className="w-full h-[180px] object-cover" // 🔹 mai mic în înălțime
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
