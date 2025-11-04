// src/components/PromoBanner.jsx
import React from "react";

export default function PromoBanner({ inline = false }) {
  return (
    <div
      className={`w-full ${
        inline ? "my-8 flex justify-center" : "py-6 bg-gray-50"
      }`}
    >
      <div
        className="
          bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 
          transition-transform duration-300 hover:scale-[1.02]
          w-full sm:max-w-[95%] md:max-w-[900px] lg:max-w-[1080px]
        "
      >
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
          className="block"
        >
          <img
            src="/banner-bebeking.jpg"
            alt="BebeKing.ro - Jucării pentru copii"
            className="
              w-full h-auto object-cover 
              md:h-[200px] lg:h-[250px]
            "
          />
        </a>
      </div>
    </div>
  );
}
