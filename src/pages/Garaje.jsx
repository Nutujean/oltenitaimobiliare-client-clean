// src/pages/Garaje.jsx
import { useEffect } from "react";
import ListingsGrid from "../components/ListingsGrid";

export default function Garaje() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Apartamente de vânzare în Oltenița
      </h1>
      <p className="text-gray-600 mb-8">
        Găsește garaje de vânzare și închiriere în Oltenița, în strazi moderne sau zone liniștite.
        Publică și tu anunțul tău gratuit și ajungi direct la cumpărători locali.
      </p>
      <ListingsGrid filter={{ category: "garaje" }} />
    </div>
  );
}
