// src/pages/DetaliuAnunt.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

  const shareUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(
    listing.title || "Vezi acest anunț imobiliar din Oltenița"
  );

  const handleShare = (platform) => {
    if (platform === "facebook") {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        alert(
          "Pe iPhone, aplicația Facebook poate bloca distribuirea. Apasă 'Copiază linkul' și deschide în Safari."
        );
        return;
      } else {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
      }
    } else if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`,
        "_blank"
      );
    } else if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copiat în clipboard!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
      {/* 🧠 SEO + Open Graph */}
      <Helmet>
        <title>{listing.title} - Oltenița Imobiliare</title>
        <meta property="og:title" content={listing.title} />
        <meta
          property="og:description"
          content={
            listing.description?.substring(0, 150) ||
            "Vezi detalii despre acest anunț imobiliar din Oltenița."
          }
        />
        <meta
          property="og:image"
          content={
            listing.images?.[0] ||
            listing.imageUrl ||
            "https://oltenitaimobiliare.ro/preview.jpg"
          }
        />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* 📸 Galerie imagini */}
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
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Fără imagine
          </div>
        )}
      </div>

      {/* 🔍 Zoom fullscreen cu săgeți SVG vizibile */}
      {isZoomed && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={images[currentImage]}
            alt={listing.title}
            className="max-w-[95vw] max-h-[90vh] object-contain select-none"
          />

          {/* ✕ Închide */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 right-5 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Închide imaginea"
          >
            ✕
          </button>

          {/* ⬅️ Stânga */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Imagine anterioară"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* ➡️ Dreapta */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Imagine următoare"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* 🔹 Titlu + Înapoi */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
          {listing.title}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          ← Înapoi
        </button>
      </div>

      {/* 🔹 Preț + Promovat */}
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
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          📍 {listing.location}
        </p>
      )}

      {/* 🔹 Descriere */}
      {listing.description && (
        <div className="mt-5">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Descriere</h2>
          <p className="text-gray-700 whitespace-pre-line text-sm md:text-base leading-relaxed">
            {listing.description}
          </p>
        </div>
      )}

      {/* 🔹 Detalii */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700 text-sm md:text-base">
        {listing.surface && <p>Suprafață: {listing.surface} mp</p>}
        {listing.rooms && <p>Camere: {listing.rooms}</p>}
        {listing.floor && <p>Etaj: {listing.floor}</p>}
        {listing.dealType && <p>Tip tranzacție: {listing.dealType}</p>}
        {listing.category && <p>Categorie: {listing.category}</p>}
      </div>

      {/* 🔹 Contact */}
      <div className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Date de contact</h2>
        {listing.user || listing.phone ? (
          <div className="bg-white border rounded-xl shadow p-4 md:p-5 space-y-2 text-sm md:text-base">
            {listing.user?.name && <p><strong>Nume:</strong> {listing.user.name}</p>}
            {listing.phone && (
              <p>
                <strong>Telefon:</strong>{" "}
                <a href={`tel:${listing.phone}`} className="text-blue-600 font-semibold hover:underline">
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
            onClick={() =>
              window.open(
                `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
                "_blank"
              )
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm md:text-base"
          >
            Messenger
          </button>
          <button
            onClick={() =>
              window.open(
                `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
                  listing.title
                )}`,
                "_blank"
              )
            }
            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 text-sm md:text-base"
          >
            Telegram
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm md:text-base"
          >
            Copiază linkul
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          *Pe iPhone, aplicația Facebook are restricții pentru linkuri externe.
          Dacă apare eroare, apasă „Copiază linkul” și deschide anunțul direct în Safari.
        </p>
      </div>
    </div>
  );
}
