import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="relative w-full h-48 lg:h-44 overflow-hidden rounded-2xl shadow-md border border-blue-200">
      <a
        href="https://bebeking.ro/"
        target="_blank"
        rel="noopener noreferrer"
        title="BebeKing.ro - Magazin pentru copii"
        className="block w-full h-full"
      >
        {/* Imagine */}
        <img
          src={banner}
          alt="BebeKing.ro - Jucării pentru copii"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="px-6 text-white max-w-xl">
            <p className="text-sm uppercase tracking-wide text-blue-200">
              Partener recomandat
            </p>
            <h3 className="text-2xl font-bold mt-1">
              BebeKing.ro
            </h3>
            <p className="text-sm mt-1 hidden sm:block">
              Jucării, haine și accesorii pentru copii
            </p>

            <span className="inline-block mt-3 bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm">
              Vezi oferta
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
