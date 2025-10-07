import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error("❌ Eroare la fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const goBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <button
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
        <p className="text-gray-600">Se încarcă...</p>
      </div>
    );

  if (!listing)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <button
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
        <p className="text-red-600">Anunțul nu există.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 🔙 Buton Înapoi */}
      <div className="mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-2xl font-semibold text-blue-600">{listing.price} €</p>
      <p className="mt-4 text-gray-700">{listing.description}</p>
      <p className="text-gray-600 mt-2">Locație: {listing.location}</p>
      <p className="text-gray-600">Categorie: {listing.category}</p>
    </div>
  );
}
