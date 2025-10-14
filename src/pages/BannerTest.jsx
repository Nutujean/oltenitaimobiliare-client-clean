// src/pages/BannerTest.jsx
import React from "react";

export default function BannerTest() {
  const bannerImg = "/banner-bebeking.jpg"; // imaginea trebuie să fie în public/

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Test Banner BebeKing.ro</h1>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={bannerImg}
            alt="BebeKing.ro - Jucării pentru copii"
            className="w-full h-auto hover:scale-[1.02] transition-transform duration-300"
          />
        </a>
        <div className="p-4 text-center">
          <h3 className="text-blue-700 font-bold text-sm">
            Partener Recomandat 🎁
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Vizitează <strong>BebeKing.ro</strong> — jucării și produse pentru copii!
          </p>
        </div>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        (Imaginea trebuie să se încarce din <code>/public/banner-bebeking.jpg</code>)
      </p>
    </div>
  );
}
