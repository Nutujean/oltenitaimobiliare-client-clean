import React from "react";
import banner from "../assets/banner-bebeking.jpg";

export default function PromoBanner() {
  return (
    <div className="w-full flex justify-center my-8">
      <div className="w-full max-w-[1250px] h-[220px] overflow-hidden rounded-2xl shadow-lg border border-blue-200">
        <a
          href="https://bebeking.ro/"
          target="_blank"
          rel="noopener noreferrer"
          title="BebeKing.ro - Magazin pentru copii"
        >
          <img
            src={banner}
            alt="BebeKing.ro - Jucării pentru copii"
            className="w-full h-full object-cover object-center"
          />
        </a>
      </div>
    </div>
  );
}
