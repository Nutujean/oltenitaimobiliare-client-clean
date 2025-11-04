import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="w-full my-12">
      <div className="mx-auto w-full lg:w-[1200px] xl:w-[1300px] bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Jucării pentru copii"
            className="w-full h-[220px] md:h-[260px] lg:h-[280px] object-cover"
          />
        </a>
        <div className="p-5 text-center">
          <h3 className="text-blue-700 font-bold text-lg md:text-xl mb-2">
            Partener Recomandat 🎁
          </h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Vizitează <strong>BebeKing.ro</strong> — jucării, haine și produse pentru copii.
          </p>
        </div>
      </div>
    </div>
  );
}
