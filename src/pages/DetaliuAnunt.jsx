// src/pages/DetaliuAnunt.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const id = rawId?.split("-").pop();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    (async () => {
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
    })();
  }, [id]);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;
  if (err) return <p className="text-center py-10 text-red-600">{err}</p>;
  if (!listing) return <p className="text-center py-10">Anunțul nu există.</p>;

  const images = Array.isArray(listing.images) ? listing.images : [];

  const prevImage = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

  const isFeatured =
    listing.featuredUntil && new Date(listing.featuredUntil).getTime() > Date.now();

  const shareUrl = (typeof window !== "undefined" && window.location.href) || "";
  const handleShare = (platform) => {
    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copiat în clipboard!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
      {/* 📸 Galerie: poze întregi (object-contain) pe aspect 16:9 */}
      <div
        className="relative w-full aspect-[16/9] max-h-[70vh] bg-gray-100 overflow-hidden rounded-xl shadow cursor-pointer flex items-center justify-center"
        onClick={() => images.length > 0 && setIsZoomed(true)}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage]}
              alt={listing.title}
              className="w-full h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                  aria-label="Imagine anterioară"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                  aria-label="Imagine următoare"
                >
                  ❯
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Fără imagine
          </div>
        )}
      </div>

      {/* 🔍 Lightbox fullscreen cu navigare */}
      {isZoomed && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={images[currentImage]}
            alt={listing.title}
            className="max-w-[95vw] max-h-[90vh] object-contain"
          />
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 text-white text-3xl font-bold"
            aria-label="Închide"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300"
                aria-label="Anterioară"
              >
                ❮
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300"
                aria-label="Următoarea"
              >
                ❯
              </button>
            </>
          )}
        </div>
      )}

      {/* 🔹 Titlu + Înapoi */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{listing.title}</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          ← Înapoi
        </button>
      </div>

      {/* 🔹 Preț + Promovat (tipografie mai discretă) */}
      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xl md:text-2xl font-semibold text-blue-700">
          <span className="font-bold text-gray-800">Preț:</span> {listing.price} €
        </p>

        {isFeatured && (
          <span className="bg-green-600 text-white text-xs md:text-sm px-3 py-1 rounded shadow">
            ⭐ Promovat până la{" "}
            {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
          </span>
        )}
      </div>

      {/* 🔹 Locație */}
      {listing.location && (
        <p className="text-gray-600 mt-1 text-sm md:text-base">📍 {listing.location}</p>
      )}

      {/* 🔹 Descriere (spațiere redusă, text mai compact) */}
      {listing.description && (
        <div className="mt-5">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Descriere</h2>
          <p className="text-gray-700 whitespace-pre-line text-sm md:text-base leading-relaxed">
            {listing.description}
          </p>
        </div>
      )}

      {/* 🔹 Detalii (compact) */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700 text-sm md:text-base">
        {listing.surface && <p>Suprafață: {listing.surface} mp</p>}
        {listing.rooms && <p>Camere: {listing.rooms}</p>}
        {listing.floor && <p>Etaj: {listing.floor}</p>}
        {listing.dealType && <p>Tip tranzacție: {listing.dealType}</p>}
        {listing.category && <p>Categorie: {listing.category}</p>}
      </div>

      {/* 🔹 Contact (fără email, telefon clicabil) */}
      <div className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Date de contact</h2>
        {listing.user || listing.phone ? (
          <div className="bg-white border rounded-xl shadow p-4 md:p-5 space-y-2 text-sm md:text-base">
            {listing.user?.name && (
              <p>
                <strong>Nume:</strong> {listing.user.name}
              </p>
            )}
            {listing.phone && (
              <p>
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

      {/* 🔹 Distribuie */}
      <div className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Distribuie anunțul</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleShare("facebook")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
          >
            Facebook
          </button>
          <button
            onClick={() => handleShare("whatsapp")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base"
          >
            WhatsApp
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm md:text-base"
          >
            Copiază linkul
          </button>
        </div>
      </div>
    </div>
  );
}
