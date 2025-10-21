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

  useEffect(() => window.scrollTo(0, 0), [id]);

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

  const backendShareUrl = `https://share.oltenitaimobiliare.ro/share/${listing._id}`;
  const publicUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

  // ✅ Funcție actualizată (stil OLX) – Facebook merge și pe iPhone
  const handleShare = (platform) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    switch (platform) {
      case "facebook": {
        const fbShareUrl = `https://share.oltenitaimobiliare.ro/share/${listing._id}`;
        window.location.href = fbShareUrl; // 🔹 deschidere directă – funcționează și pe iPhone
        break;
      }

      case "whatsapp": {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(
          `🏡 ${listing.title} – vezi detalii: ${publicUrl}`
        )}`;
        window.location.href = waUrl;
        break;
      }

      case "tiktok": {
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
      }

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
      <div className="mt-5 text-center sm:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {listing.title}
        </h1>
        <p className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-lg font-semibold mt-1">
          💰 {listing.price} €
        </p>
      </div>

      <p className="text-gray-600 mt-3 text-sm md:text-base">📍 {listing.location}</p>

      {listing.contactName && (
        <p className="mt-2 text-gray-800 font-medium">👤 {listing.contactName}</p>
      )}
      {listing.phone && (
        <p className="mt-1">
          📞{" "}
          <a
            href={`tel:${listing.phone}`}
            className="text-blue-600 font-semibold hover:underline"
          >
            {listing.phone}
          </a>
        </p>
      )}

      <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
        {listing.description}
      </div>

      {/* Distribuie */}
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
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20"
              height="20"
            >
              <path
                fill="#25F4EE"
                d="M41.5 15.5c-4.6 0-8.4-3.8-8.4-8.4V6h-5.2v24.9c0 3-2.5 5.5-5.5 5.5s-5.5-2.5-5.5-5.5 2.5-5.5 5.5-5.5c.4 0 .8.1 1.2.1v-5.4c-.4 0-.8-.1-1.2-.1-6 0-10.9 4.9-10.9 10.9S16.4 41 22.4 41 33.3 36.1 33.3 30.1V19.9c2.2 1.5 4.9 2.4 7.8 2.4v-6.8h.4z"
              />
              <path
                fill="#FE2C55"
                d="M33.1 18.7v-3.3c1.8 1.2 4 1.9 6.3 1.9v-3.7c-1.7 0-3.3-.5-4.6-1.3v10.1c-1.6 0-3.2-.4-4.6-1.2v8.9c0 6-4.9 10.9-10.9 10.9S8.4 36.1 8.4 30.1s4.9-10.9 10.9-10.9c.4 0 .8 0 1.2.1v-5.4c-.4 0-.8 0-.1..."
              />
              <path
                fill="#000000"
                d="M40.2 17.3c-4.6 0-8.4-3.8-8.4-8.4V6h-5.2v24.9c0 3-2.5 5.5-5.5 5.5s-5.5-2.5-5.5-5.5 2.5-5.5 5.5-5.5c.4 0 .8.1 1.2.1v-5.4c-.4 0-.8-.1-1.2-.1-6 0-10.9 4.9-10.9 10.9S15.2 42 21.2 42 32.1 37.1 32.1 31.1V20.9c2.2 1.5 4.9 2.4 7.8 2.4v-6z"
              />
            </svg>
            <span>TikTok</span>
          </button>
        </div>
      </div>
    </div>
  );
}
