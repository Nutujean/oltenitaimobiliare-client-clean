import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden my-10">
      <a
        href="https://bebeking.ro/"
        target="_blank"
        rel="noopener noreferrer"
        title="BebeKing.ro - Magazin pentru copii"
      >
        <img
          src={banner}
          alt="BebeKing.ro - Jucării pentru copii"
          className="w-full h-[230px] object-cover object-center md:h-[250px] lg:h-[260px]"
        />
      </a>
      <div className="p-6 text-center">
        <h3 className="text-blue-700 font-bold text-xl mb-2">
          Partener Recomandat 🎁
        </h3>
        <p className="text-base text-gray-600">
          Vizitează <strong>BebeKing.ro</strong> — jucării, haine și produse pentru copii.
        </p>
      </div>
    </div>
  );
}
