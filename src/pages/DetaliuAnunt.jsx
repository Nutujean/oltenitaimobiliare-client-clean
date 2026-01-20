// src/pages/DetaliuAnunt.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API_URL from "../api";

// 🔧 helper: normalizare telefon, la fel ca în AnunturileMele
function normalizePhone(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  // 4072... -> 072...
  return digits.replace(/^4/, "");
}

// 🔸 Pachete de promovare – ID-urile TREBUIE să fie ca în backend: featured7/14/30
const PROMO_OPTIONS = [
  { id: "featured7", label: "Promovat 7 zile", priceRON: 30, days: 7 },
  { id: "featured14", label: "Promovat 14 zile", priceRON: 50, days: 14 },
  { id: "featured30", label: "Promovat 30 zile", priceRON: 80, days: 30 },
];

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [isFacebookAppWebView, setIsFacebookAppWebView] = useState(false);

  // 🔸 Stări pentru PROMOVARE
  const [showPromo, setShowPromo] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(PROMO_OPTIONS[0]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [canPromote, setCanPromote] = useState(false);

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

  // 🔸 stabilim dacă utilizatorul logat este proprietarul anunțului (pe bază de telefon + token)
  useEffect(() => {
    if (!listing) {
      setCanPromote(false);
      return;
    }

    try {
      const rawPhone = localStorage.getItem("userPhone");
      const token = localStorage.getItem("token");

      if (
        !token ||
        token === "undefined" ||
        token === "null" ||
        !rawPhone ||
        rawPhone === "undefined" ||
        rawPhone === "null"
      ) {
        setCanPromote(false);
        return;
      }

      const userPhone = normalizePhone(rawPhone);
      const listingPhone = normalizePhone(listing.phone);

      if (userPhone && listingPhone && userPhone === listingPhone) {
        setCanPromote(true);
      } else {
        setCanPromote(false);
      }
    } catch {
      setCanPromote(false);
    }
  }, [listing]);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;
  if (err) return <p className="text-center py-10 text-red-600">{err}</p>;
  if (!listing) return <p className="text-center py-10">Anunțul nu există.</p>;

  const images = Array.isArray(listing.images) ? listing.images : [];
  const prevImage = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

  // ✅ URL-uri share/public
  const backendShareUrl = `https://share.oltenitaimobiliare.ro/fb/${listing._id}`;
  const publicUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

  // ✅ FIX: în codul tău era backendFbDirect nedefinit -> crăpa pagina
  const backendFbDirect = backendShareUrl;

  const handleShare = (platform) => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

    switch (platform) {
      case "facebook": {
        const shareUrl = backendShareUrl;
        const fbSharer = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        window.open(fbSharer, "_blank", isMobile ? undefined : "width=600,height=400");
        break;
      }

      case "whatsapp": {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`🏡 ${listing.title} – vezi detalii: ${publicUrl}`)}`,
          "_blank"
        );
        break;
      }

      case "tiktok": {
        if (isMobile) {
          navigator.clipboard.writeText(publicUrl);
          alert("🔗 Linkul anunțului a fost copiat! Deschide aplicația TikTok și inserează-l acolo.");
        } else {
          window.open(`https://www.tiktok.com/upload?url=${encodeURIComponent(publicUrl)}`, "_blank");
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

  // 🔸 Anunțul este deja promovat?
  const isFeatured = listing.featuredUntil && new Date(listing.featuredUntil) > new Date();

  // 🔸 Pornire flux de plată Stripe pentru promovare
  const startPromotion = async () => {
    if (!selectedPromo) {
      setPromoError("Selectează un pachet de promovare.");
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError("");

      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing._id,
          plan: selectedPromo.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Nu am putut porni plata pentru promovare.");
      }

      window.location.href = data.url;
    } catch (e) {
      setPromoError(e.message || "Eroare la inițierea plății.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
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
              priceValidUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              url: publicUrl,
              datePublished: listing.createdAt || new Date().toISOString().split("T")[0],
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

        {/* ✅ Buton Înapoi (clar, profesionist) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm text-blue-700 hover:bg-gray-50"
          >
            ← Înapoi la anunțuri
          </button>
        </div>

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

        {/* Titlu + preț + badge PROMOVAT */}
        <div className="mt-5 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{listing.title}</h1>
          <p className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-lg font-semibold mt-1">
            💰 {listing.price} €
          </p>

          {isFeatured && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400 bg-yellow-50 text-yellow-800 text-sm font-semibold">
                ⭐ Anunț PROMOVAT
              </span>
              {listing.featuredUntil && (
                <div className="text-xs text-gray-600 mt-1">
                  Activ până la {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tip tranzacție */}
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
            <a href={`tel:${listing.phone}`} className="text-blue-600 font-semibold hover:underline">
              {listing.phone}
            </a>
          </p>
        )}

        <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
          {listing.description}
        </div>

        {/* Promovează anunțul – DOAR pentru proprietar */}
        {canPromote && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Promovează anunțul</h3>
              {isFeatured && listing.featuredUntil && (
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Deja promovat până la {new Date(listing.featuredUntil).toLocaleDateString("ro-RO")}
                </span>
              )}
            </div>

            <button
              onClick={() => setShowPromo((p) => !p)}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-sm transition"
            >
              {showPromo ? "Ascunde opțiunile de promovare" : "Alege un pachet de promovare"}
            </button>

            {showPromo && (
              <>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  {PROMO_OPTIONS.map((opt) => {
                    const isSelected = selectedPromo?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedPromo(opt)}
                        className={`border rounded-xl p-4 text-left text-sm flex flex-col gap-1 transition ${
                          isSelected
                            ? "border-yellow-500 bg-yellow-50 shadow"
                            : "border-gray-200 hover:border-yellow-400 hover:bg-yellow-50/60"
                        }`}
                      >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-gray-700">💳 {opt.priceRON} lei (plată unică)</span>
                        <span className="text-xs text-gray-500">
                          Anunțul tău va fi evidențiat timp de {opt.days} zile.
                        </span>
                      </button>
                    );
                  })}
                </div>

                {promoError && <p className="mt-3 text-sm text-red-600">{promoError}</p>}

                <button
                  onClick={startPromotion}
                  disabled={promoLoading || !selectedPromo}
                  className="mt-5 w-full sm:w-auto bg-black text-white font-semibold px-6 py-2.5 rounded-lg shadow hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {promoLoading
                    ? "Se pregătește plata..."
                    : `Continuă către plată securizată (${selectedPromo.priceRON} lei)`}
                </button>
              </>
            )}
          </div>
        )}

        {/* Distribuie */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Distribuie anunțul</h3>

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
              TikTok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
