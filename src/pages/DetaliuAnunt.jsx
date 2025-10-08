import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțului");
        setListing(data);
      } catch (e) {
        console.error("Eroare la preluarea anunțului:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;
  if (!listing) return <p className="text-center py-10">Anunțul nu există.</p>;

  const shareUrl = window.location.href;

  const handleShare = (platform) => {
    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${listing.title} - ${shareUrl}`
        )}`,
        "_blank"
      );
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copiat în clipboard!");
    }
  };

  const isFeatured =
    listing.featuredUntil && new Date(listing.featuredUntil).getTime() > Date.now();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 🔙 Buton Înapoi */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
      >
        ← Înapoi
      </button>

      {/* 📸 Imagine principală */}
      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-96 object-cover rounded-xl shadow"
        />
      )}

      {/* 🔹 Titlu + preț */}
      <div className="mt-6 flex justify-between items-start flex-wrap gap-2">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-2xl font-semibold text-blue-700">{listing.price} €</p>
      </div>

      {/* 🔹 Detalii */}
      <p className="text-gray-600 mt-2">{listing.location}</p>

      {isFeatured && (
        <div className="inline-block mt-2 bg-green-600 text-white text-sm px-3 py-1 rounded">
          ⭐ Promovat până la{" "}
          {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
        </div>
      )}

      {/* 🔹 Descriere */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Descriere</h2>
        <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
      </div>

      {/* 🔹 Detalii suplimentare */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
        {listing.surface && <p>Suprafață: {listing.surface} mp</p>}
        {listing.rooms && <p>Camere: {listing.rooms}</p>}
        {listing.floor && <p>Etaj: {listing.floor}</p>}
        {listing.dealType && <p>Tip tranzacție: {listing.dealType}</p>}
        {listing.category && <p>Categorie: {listing.category}</p>}
      </div>

      {/* 🔹 Datele utilizatorului */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-3">Date de contact</h2>
        {listing.user ? (
          <div className="bg-gray-50 border rounded-xl p-4">
            <p>
              <strong>Nume:</strong> {listing.user.name}
            </p>
            <p>
              <strong>Email:</strong> {listing.user.email}
            </p>
            {listing.phone && (
              <p>
                <strong>Telefon:</strong> {listing.phone}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Utilizator neidentificat.</p>
        )}
      </div>

      {/* 🔹 Distribuire */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Distribuie anunțul</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleShare("facebook")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Facebook
          </button>
          <button
            onClick={() => handleShare("whatsapp")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            WhatsApp
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Copiază linkul
          </button>
        </div>
      </div>
    </div>
  );
}
