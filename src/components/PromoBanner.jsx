import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="w-full flex justify-center my-14 px-2">
      <div className="w-full md:w-[1000px] lg:w-[1200px] bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Sursa ta de jucarii"
            className="w-full h-auto object-cover md:h-[250px] lg:h-[270px]"
          />
        </a>
        <div className="p-6 text-center">
          <h3 className="text-blue-700 font-bold text-xl mb-2">
            Partener Recomandat 🎁
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Vizitează <strong>BebeKing.ro</strong> — jucării, haine și produse pentru copii.
          </p>
        </div>
      </div>
    </div>
  );
}
