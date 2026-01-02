import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-2xl shadow-md border border-blue-200">
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

        {/* Gradient discret peste imagine (pentru contrast) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

        {/* Panou text (stânga) */}
        <div className="absolute inset-0 flex items-center">
          <div className="ml-3 sm:ml-6 max-w-[65%] sm:max-w-[55%]">
            <div className="bg-black/55 backdrop-blur-sm rounded-2xl px-4 py-3 sm:px-5 sm:py-4 border border-white/10">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-blue-200">
                Partener recomandat
              </p>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-1">
                BebeKing.ro
              </h3>

              <p className="text-[12px] sm:text-sm text-white/90 mt-1 line-clamp-2">
                Jucării, haine și accesorii pentru copii
              </p>

              <span className="inline-flex items-center justify-center mt-2 bg-white/90 text-blue-700 font-semibold px-3 py-1.5 rounded-xl text-xs shadow">
                Vezi oferta
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
