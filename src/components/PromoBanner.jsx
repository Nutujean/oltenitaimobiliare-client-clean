import React from "react";
import banner from "../assets/Banner BebeKing.Ro.jpg";

export default function PromoBanner({ inline = false }) {
  // dacă e inline, îl afișăm ca un card între anunțuri (pentru mobil)
  if (inline) {
    return (
      <div className="lg:hidden my-4 mx-2 bg-white border border-blue-200 rounded-xl overflow-hidden shadow-md">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Jucării pentru copii"
            className="w-full h-auto"
          />
        </a>
        <div className="p-3 text-center text-sm text-gray-700">
          <h3 className="font-semibold text-blue-700">Partener Recomandat 🎁</h3>
          <p className="text-xs text-gray-600 mt-1">
            Vizitează <strong>BebeKing.ro</strong> pentru jucării și accesorii pentru copii.
          </p>
        </div>
      </div>
    );
  }

  // banner lateral pentru desktop
  return (
    <div className="hidden lg:block fixed right-6 top-28 w-64 bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200 hover:shadow-xl transition-all duration-300">
      <a
        href="https://bebeking.ro/"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={banner}
          alt="BebeKing.ro - Jucării pentru copii"
          className="w-full h-auto hover:scale-[1.02] transition-transform duration-300"
        />
      </a>
      <div className="p-3 text-center">
        <h3 className="text-blue-700 font-bold text-sm">Partener Recomandat 🎁</h3>
        <p className="text-xs text-gray-600 mt-1">
          Vizitează <strong>BebeKing.ro</strong> pentru jucării și accesorii pentru copii!
        </p>
      </div>
    </div>
  );
}
