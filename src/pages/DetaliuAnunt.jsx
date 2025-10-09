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

  useEffect(() => {
    window.scrollTo(0, 0); // 🔹 când se deschide anunțul, te duce sus
  }, [id]);

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

  const images = listing.images || [];
  const prevImage = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

  const isFeatured =
    listing.featuredUntil && new Date(listing.featuredUntil).getTime() > Date.now();

  const handleShare = (platform) => {
    const url = window.location.href;
    if (platform === "facebook")
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    if (platform === "whatsapp")
      window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pt-20">
      {/* 📸 Galerie imagini */}
      <div
        className="relative w-full h-72 overflow-hidden rounded-xl shadow cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage]}
              alt={listing.title}
              className="w-full h-72 object-cover transition-all duration-500"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
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

      {/* 🔍 Lightbox fullscreen cu navigare */}
      {isZoomed && (
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
              >
                ❮
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300"
              >
                ❯
              </button>
            </>
          )}
        </div>
      )}

      {/* Titlu + buton Înapoi */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          ← Înapoi
        </button>
      </div>

      {/* Preț */}
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

      {listing.location && <p className="text-gray-600 mt-1">📍 {listing.location}</p>}

      {/* Descriere */}
      {listing.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Descriere</h2>
          <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
        </div>
      )}

      {/* Detalii */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
        {listing.surface && <p>Suprafață: {listing.surface} mp</p>}
        {listing.rooms && <p>Camere: {listing.rooms}</p>}
        {listing.floor && <p>Etaj: {listing.floor}</p>}
        {listing.dealType && <p>Tip tranzacție: {listing.dealType}</p>}
        {listing.category && <p>Categorie: {listing.category}</p>}
      </div>

      {/* Contact */}
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

      {/* Distribuire */}
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
        </div>
      </div>
    </div>
  );
}
