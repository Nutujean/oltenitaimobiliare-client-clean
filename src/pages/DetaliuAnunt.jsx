import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const id = rawId?.split("-").pop();

  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțului");
        setListing(data);
      } catch (e) {
        setErr(e.message || "Eroare la încărcarea anunțului");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;
  if (err) return <p className="text-center py-10 text-red-600">{err}</p>;
  if (!listing) return <p className="text-center py-10">Anunțul nu există.</p>;

  const images = Array.isArray(listing.images) ? listing.images : [];
  const hasImages = images.length > 0;

  const prevImage = () =>
    setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () =>
    setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

  const isFeatured =
    listing.featuredUntil &&
    new Date(listing.featuredUntil).getTime() > Date.now();

  const shareUrl = (typeof window !== "undefined" && window.location.href) || "";
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 📸 Galerie imagini */}
      <div className="relative w-full h-96 overflow-hidden rounded-xl shadow">
        {hasImages ? (
          <>
            <img
              src={images[currentImage]}
              alt={listing.title}
              className="w-full h-96 object-cover transition-all duration-500"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                >
                  ❮
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                >
                  ❯
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
            Fără imagine
          </div>
        )}
      </div>

      {/* 🔹 Titlu + Buton Înapoi */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-3xl font-bold">{listing.title}</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          ← Înapoi
        </button>
      </div>

      {/* 🔹 Preț + Promovat */}
      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-2xl font-semibold text-blue-700">
          <span className="font-bold text-gray-800">Preț:</span> {listing.price} €
        </p>

        {isFeatured && (
          <span className="bg-green-600 text-white text-sm px-3 py-1 rounded shadow">
            ⭐ Promovat până la{" "}
            {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
          </span>
        )}
      </div>

      {/* 🔹 Locație */}
      {listing.location && (
        <p className="text-gray-600 mt-1">📍 {listing.location}</p>
      )}

      {/* 🔹 Descriere */}
      {listing.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Descriere</h2>
          <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
        </div>
      )}

      {/* 🔹 Detalii suplimentare */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
        {listing.surface && <p>Suprafață: {listing.surface} mp</p>}
        {listing.rooms && <p>Camere: {listing.rooms}</p>}
        {listing.floor && <p>Etaj: {listing.floor}</p>}
        {listing.dealType && <p>Tip tranzacție: {listing.dealType}</p>}
        {listing.category && <p>Categorie: {listing.category}</p>}
      </div>

      {/* 🔹 Date de contact */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Date de contact</h2>
        {listing.user || listing.phone ? (
          <div className="bg-white border rounded-xl shadow-md p-5 space-y-2">
            {listing.user?.name && (
              <p className="text-lg">
                <strong>Nume:</strong> {listing.user.name}
              </p>
            )}
            {listing.phone && (
              <p className="text-lg">
                <strong>Telefon:</strong>{" "}
                <a
                  href={`tel:${listing.phone}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {listing.phone}
                </a>
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Datele de contact nu sunt disponibile.</p>
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
