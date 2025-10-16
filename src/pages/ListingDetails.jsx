// src/pages/ListingDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../api";

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (e) {
        console.error("Eroare la încărcarea anunțului:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading)
    return <p className="text-center py-10">Se încarcă anunțul...</p>;
  if (!listing)
    return <p className="text-center py-10 text-gray-500">Anunțul nu există.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        ← Înapoi la listă
      </Link>

      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-500 mb-4">{listing.location}</p>

      {listing.images?.[0] && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full rounded-xl mb-6 shadow-md"
        />
      )}

      <p className="text-lg text-blue-700 font-semibold mb-4">
        {listing.price} €
      </p>

      {/* 🔵 Distribuire Facebook */}
      <a
        href={`https://www.facebook.com/sharer.php?u=https://oltenitaimobiliare.ro/share/${listing._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg mb-3 transition"
      >
        🔗 Distribuie pe Facebook
      </a>

      {/* 🟢 Distribuire WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `Vezi acest anunț pe Oltenița Imobiliare: https://oltenitaimobiliare.ro/share/${listing._id}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-3 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg mb-6 transition"
      >
        💬 Distribuie pe WhatsApp
      </a>

      <p className="leading-relaxed text-gray-800 whitespace-pre-line">
        {listing.description}
      </p>
    </div>
  );
}
