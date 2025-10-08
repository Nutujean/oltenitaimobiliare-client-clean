import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

export default function ToateAnunturile() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor:", e);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Toate Anunțurile</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">Nu există anunțuri momentan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((l) => (
            <Link
              key={l._id}
              to={`/anunt/${l._id}`}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={l.images?.[0] || "https://via.placeholder.com/400x250?text=Fără+imagine"}
                alt={l.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-2">{l.title}</h3>
                <p className="text-blue-700 font-semibold">{l.price} €</p>
                <p className="text-sm text-gray-500">{l.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
