// src/pages/DetaliuAnunt.jsx
import { useEffect, useState, useRef } from "react";
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

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

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
        setErr(e.message);
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

  // ✅ URL-uri pentru share
  const backendShareUrl = `https://share.oltenitaimobiliare.ro/fb/${listing._id}`;
  const publicUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

  // ✅ Funcție actualizată cu TikTok complet
  const handleShare = (platform) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            backendShareUrl
          )}`,
          "_blank",
          "width=600,height=400"
        );
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `🏡 ${listing.title} – vezi detalii: ${publicUrl}`
          )}`,
          "_blank"
        );
        break;

      case "tiktok":
        if (isMobile) {
          navigator.clipboard.writeText(publicUrl);
          alert("🔗 Linkul anunțului a fost copiat! Deschide aplicația TikTok și inserează-l acolo.");
        } else {
          window.open(
            `https://www.tiktok.com/upload?url=${encodeURIComponent(publicUrl)}`,
            "_blank"
          );
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
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
        <meta property="og:url" content={publicUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Imagine principală */}
      <div
        className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden rounded-xl shadow cursor-pointer"
        onClick={() => images.length > 0 && setIsZoomed(true)}
      >
        {images.length ? (
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
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

      {/* Titlu + preț */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
        <p className="text-xl font-semibold text-blue-700">{listing.price} €</p>
      </div>

      <p className="text-gray-600 mt-1 text-sm md:text-base">
        📍 {listing.location}
      </p>

      <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
        {listing.description}
      </div>

      {/* 🔹 Distribuie anunțul */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Distribuie anunțul
        </h3>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleShare("facebook")}
            className="flex-1 bg-[#1877F2] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#145DBF]"
          >
            📘 Facebook
          </button>

          <button
            onClick={() => handleShare("whatsapp")}
            className="flex-1 bg-[#25D366] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#1DA851]"
          >
            💬 WhatsApp
          </button>

          <button
            onClick={() => handleShare("tiktok")}
            className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            🎵 TikTok
          </button>
        </div>
      </div>
    </div>
  );
}
