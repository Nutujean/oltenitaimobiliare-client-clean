import { Link } from "react-router-dom";
import { MapPin, Home, BedDouble, Tag } from "lucide-react";

export default function AnuntCard({ anunt }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col">
      {/* Imagine */}
      <div className="relative">
        <img
          src={anunt.imagini?.[0] || "https://via.placeholder.com/400x250"}
          alt={anunt.titlu}
          className="w-full h-48 object-cover rounded-lg"
        />
        {anunt.pachet && (
          <span
            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
              anunt.pachet === "Gold"
                ? "bg-yellow-400 text-blue-900"
                : anunt.pachet === "Diamond"
                ? "bg-purple-600 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            {anunt.pachet}
          </span>
        )}
      </div>

      {/* Conținut */}
      <div className="flex-1 mt-3 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {anunt.titlu}
        </h3>
        <p className="text-blue-600 font-bold text-xl mb-2">
          {anunt.pret} €
        </p>

        {/* Detalii */}
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <p className="flex items-center gap-1">
            <MapPin size={16} /> {anunt.locatie || "Nespecificat"}
          </p>
          <p className="flex items-center gap-1">
            <Home size={16} /> {anunt.categorie || "N/A"} •{" "}
            {anunt.tranzactie || "N/A"}
          </p>
          {anunt.camere && (
            <p className="flex items-center gap-1">
              <BedDouble size={16} /> {anunt.camere} camere
            </p>
          )}
        </div>

        {/* Buton Detalii */}
        <Link
          to={`/anunt/${anunt._id}`}
          className="mt-auto bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
        >
          Vezi detalii
        </Link>
      </div>
    </div>
  );
}
