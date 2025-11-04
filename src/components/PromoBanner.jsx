import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="w-full flex justify-center my-12 px-4">
      {/* Banner lat cât 3 carduri de anunțuri */}
      <div className="w-[1050px] max-w-full bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Jucării pentru copii"
            className="w-full h-[160px] object-cover"
          />
        </a>
        <div className="p-3 text-center">
          <h3 className="text-blue-700 font-bold text-lg">
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
