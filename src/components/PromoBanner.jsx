import React from "react";
import banner from "../assets/banner-bebeking.jpg"; // ✅ imaginea din assets

export default function PromoBanner({ inline = false }) {
  // 🔹 Varianta pentru mobil (sub anunțuri)
  if (inline) {
    return (
      <div className="lg:hidden my-8 bg-white border border-blue-200 rounded-xl overflow-hidden shadow-md">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Jucării și produse pentru copii"
            className="w-full h-auto"
          />
        </a>
        <div className="p-3 text-center text-sm text-gray-700">
          <h3 className="font-semibold text-blue-700">
            Partener Recomandat 🎁
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Vizitează <strong>BebeKing.ro</strong> — jucării și produse pentru copii.
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Varianta pentru desktop (banner lateral)
  return (
    <div className="hidden lg:block fixed right-6 top-28 w-64 bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200 hover:shadow-xl transition-all duration-300">
      <a
        href="https://bebeking.ro/"
        target="_blank"
        rel="noopener noreferrer"
        title="BebeKing.ro - Magazin pentru copii"
      >
        <img
          src={banner}
          alt="BebeKing.ro - Jucării pentru copii"
          className="w-full h-auto hover:scale-[1.02] transition-transform duration-300"
        />
      </a>
      <div className="p-3 text-center">
        <h3 className="text-blue-700 font-bold text-sm">
          Partener Recomandat 🎁
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Vizitează <strong>BebeKing.ro</strong> pentru jucării și accesorii pentru copii!
        </p>
      </div>
    </div>
  );
}
