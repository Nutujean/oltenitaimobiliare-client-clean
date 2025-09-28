import React from "react";
import { Link } from "react-router-dom";

export default function CardAnunt({ anunt }) {
  const imaginePrincipala =
    anunt.imagini && anunt.imagini.length > 0
      ? `http://localhost:5000${anunt.imagini[0]}`
      : "https://via.placeholder.com/400x250?text=Fara+imagine";

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition bg-white flex flex-col">
      <img
        src={imaginePrincipala}
        alt={anunt.titlu}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-bold text-lg mb-2">{anunt.titlu}</h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{anunt.descriere}</p>
        <p className="text-blue-600 font-semibold text-lg mb-4">{anunt.pret} €</p>
        <p className="text-gray-500 text-sm mb-2">{anunt.categorie}</p>
        <Link
          to={`/anunt/${anunt._id}`}
          className="mt-auto bg-blue-600 text-white px-4 py-2 rounded text-center"
        >
          Detalii
        </Link>
      </div>
    </div>
  );
}
