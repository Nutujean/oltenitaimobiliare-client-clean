// src/pages/DetaliuAnunt.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [isFacebookAppWebView, setIsFacebookAppWebView] = useState(false);

  useEffect(() => window.scrollTo(0, 0), [id]);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera || "";
    const isFacebookApp = /FBAN|FBAV|FBIOS|FB_IAB/.test(ua);
    setIsFacebookAppWebView(Boolean(isFacebookApp));
  }, []);

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
  const backendFbDirect = `https://share.oltenitaimobiliare.ro/fb/${listing._id}`;
  const publicUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

  const handleShare = (platform) => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    const isFacebookApp = /FBAN|FBAV|FBIOS|FB_IAB/.test(ua);

    switch (platform) {
      case "facebook": {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          backendShareUrl
        )}`;
        if (isFacebookApp) return;
        if (isMobile) {
          window.open(fbShareUrl, "_blank");
        } else {
          window.open(fbShareUrl, "_blank", "width=600,height=400");
        }
        break;
      }
      case "whatsapp": {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `🏡 ${listing.title} – vezi detalii: ${publicUrl}`
          )}`,
          "_blank"
        );
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

  const openInSafari = () => {
    window.open(backendFbDirect, "_blank");
  };

  return (
    <div className="relative">
      {/* 🔶 Banner pentru utilizatorii iPhone în aplicația Facebook */}
      {isFacebookAppWebView && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 text-yellow-900 p-3 flex items-center justify-between gap-3">
          <div className="text-sm leading-snug">
            ⚠️ Distribuirea pe Facebook nu funcționează din aplicația Facebook pe iPhone.
            <br />
            👉 Apasă <strong>„Deschide în Safari”</strong> pentru a partaja corect acest anunț.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openInSafari}
              className="bg-black text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Deschide în Safari
            </button>
            <button
              onClick={() => setIsFacebookAppWebView(false)}
              className="text-sm px-2 py-1 rounded-md hover:underline"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-5xl mx-auto px-4 pt-24 pb-10 ${isFacebookAppWebView ? "pt-28" : ""}`}>
        <Helmet>
          <title>{listing.title} - Oltenița Imobiliare</title>
          <meta
            name="description"
            content={`${listing.title} – ${listing.location}. ${listing.description?.substring(0, 150)}...`}
          />
          <meta
            name="keywords"
            content={`Oltenița, imobiliare, ${listing.location}, apartamente, case, terenuri`}
          />
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

          {/* 🏠 Schema.org SEO JSON-LD */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Offer",
              name: listing.title,
              description: listing.description?.substring(0, 160),
              price: listing.price,
              priceCurrency: "EUR",
              priceValidUntil: new Date(
                Date.now() + 180 * 24 * 60 * 60 * 1000
              ).toISOString().split("T")[0], // 6 luni valabilitate
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              url: publicUrl,
              datePublished:
                listing.createdAt ||
                new Date().toISOString().split("T")[0], // data publicării
              itemOffered: {
                "@type": "Product",
                name: listing.title,
                image: listing.images?.[0],
                description: listing.description?.substring(0, 160),
                brand: "Oltenița Imobiliare",
             },
             seller: {
               "@type": "Person",
               name: listing.contactName || "Proprietar",
               telephone: listing.phone || "",
            },
          })}
        </script>
        </Helmet>

        {/* Imagine principală */}
        <div
          className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden rounded-xl shadow cursor-pointer"
          onClick={() => images.length > 0 && setIsZoomed(true)}
       >
          {/* 🔙 Buton Înapoi (SVG, fără lucide-react) */}
          <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 bg-gray-100/90 hover:bg-gray-200 text-gray-700 p-2 md:p-2.5 rounded-full shadow-md transition active:scale-95 z-10"
          aria-label="Înapoi"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

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

        {/* Zoom */}
        {isZoomed && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setIsZoomed(false)}
          >
            <img
              src={images[currentImage]}
              alt={listing.title}
              className="max-w-[90%] max-h-[80%] object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 text-white text-3xl px-3 py-2 rounded-full"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 text-white text-3xl px-3 py-2 rounded-full"
                >
                  ❯
                </button>
              </>
            )}
          </div>
        )}

        {/* Titlu + preț */}
        <div className="mt-5 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {listing.title}
          </h1>
          <p className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-lg font-semibold mt-1">
            💰 {listing.price} €
          </p>
        </div>
        {/* 🔹 Tip tranzacție */}
{listing.intent && (
  <div
    className={`inline-block text-white text-sm font-semibold px-3 py-1 rounded-full mb-2 ${
      listing.intent === "vand"
        ? "bg-green-600"
        : listing.intent === "cumpar"
        ? "bg-blue-600"
        : listing.intent === "inchiriez"
        ? "bg-yellow-500 text-gray-900"
        : "bg-purple-600"
    }`}
  >
    {listing.intent === "vand"
      ? "🏠 Vând"
      : listing.intent === "cumpar"
      ? "🛒 Cumpăr"
      : listing.intent === "inchiriez"
      ? "🔑 Închiriez"
      : "♻️ Schimb"}
  </div>
)}
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
              className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M168 32a48 48 0 0 0 48 48v32a80 80 0 0 1-80-80zM64 120a56 56 0 0 1 55.6-56H120V32h32v128a56 56 0 1 1-88-40zm56 56a24 24 0 0 0 24-24v-32a56 56 0 0 1-32 103.2A56 56 0 0 1 64 168h32a24 24 0 0 0 24 24z" />
              </svg>
              TikTok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
