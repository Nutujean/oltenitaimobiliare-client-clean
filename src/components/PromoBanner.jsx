import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    // Nu punem max-w sau padding aici; lăsăm părintelui să dicteze lățimea
    <div className="relative w-full h-44 lg:h-40 overflow-hidden rounded-2xl shadow-md border border-blue-200">
      <a
        href="https://bebeking.ro/"
        target="_blank"
        rel="noopener noreferrer"
        title="BebeKing.ro - Magazin pentru copii"
        className="block w-full h-full"
      >
        <img
          src={banner}
          alt="BebeKing.ro - Jucării pentru copii"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
      </a>
    </div>
  );
}
