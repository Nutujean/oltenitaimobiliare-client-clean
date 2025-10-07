// src/pages/DetaliuAnunt.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id: slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [listing, setListing] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // URL curent (pentru share)
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Fetch anunț
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_URL}/listings/${slugOrId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;

        setListing(data);

        // user curent din localStorage
        const meRaw = localStorage.getItem("user");
        const me = meRaw ? JSON.parse(meRaw) : null;
        const myId = me?.id || me?._id || null;

        // proprietar anunț
        const ownerId = data.user?._id || data.user || null;
        setIsOwner(Boolean(myId && ownerId && String(myId) === String(ownerId)));

        // telefon
        setContactPhone(data.phone || data.user?.phone || "");
      } catch (e) {
        console.error("❌ Eroare la preluarea anunțului:", e);
        setErr("Eroare la încărcarea anunțului");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slugOrId]);

  // Liste poze
  const images = useMemo(() => {
    const arr = (listing?.images?.length ? listing.images : [listing?.imageUrl]).filter(Boolean);
    // elimină duplicate simple
    return Array.from(new Set(arr));
  }, [listing]);

  // Back helper
  const goBack = () => {
    if (location.state?.from) navigate(-1);
    else navigate("/");
  };

  // Copy link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
      alert("Nu am putut copia linkul.");
    }
  };

  // Stripe checkout (promovare)
  const startCheckout = async (plan = "featured7") => {
    try {
      const r = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing._id, plan }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Eroare la inițierea plății");
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert(e.message || "Eroare la inițierea plății");
    }
  };

  if (loading) return <p className="text-center py-10">Se încarcă…</p>;
  if (err) return <p className="text-center py-10 text-red-600">{err}</p>;
  if (!listing) return <p className="text-center py-10">Anunțul nu a fost găsit.</p>;

  const priceText =
    typeof listing.price === "number"
      ? listing.price.toLocaleString("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " €"
      : `${listing.price} €`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Înapoi */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black"
        >
          ← Înapoi
        </button>

        {/* breadcrumb simplu */}
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:underline">Acasă</Link>
          <span className="mx-1">/</span>
          <span className="capitalize">{listing.category || "Anunț"}</span>
        </div>
      </div>

      {/* Poze cu săgeți */}
      {images.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={12}
          slidesPerView={1}
          className="rounded-lg overflow-hidden"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={listing.title}
                className="w-full h-[420px] object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-[320px] bg-gray-200 rounded-lg grid place-items-center">
          <span className="text-gray-600">Fără imagine</span>
        </div>
      )}

      {/* Titlu + preț + status */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-green-700 font-semibold text-xl">{priceText}</span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 border">
            {listing.status === "inchiriere" ? "De închiriat" : "De vânzare"}
          </span>
          {listing.rezervat && (
            <span className="text-xs px-2 py-1 rounded bg-yellow-100 border border-yellow-300 text-yellow-800">
              Rezervat
            </span>
          )}
        </div>
      </div>

      {/* Locație și detalii tehnice */}
      <div className="mt-2 text-gray-600">
        {listing.location && <p><strong>Locație:</strong> {listing.location}</p>}
        <div className="flex flex-wrap gap-4 mt-1 text-sm">
          {listing.rooms != null && <span>Camere: <strong>{listing.rooms}</strong></span>}
          {listing.surface != null && <span>Suprafață: <strong>{listing.surface} mp</strong></span>}
          {listing.floor != null && <span>Etaj: <strong>{listing.floor}</strong></span>}
        </div>
      </div>

      {/* Descriere */}
      {listing.description && (
        <div className="mt-4 whitespace-pre-line text-gray-800 leading-relaxed">
          {listing.description}
        </div>
      )}

      {/* Acțiuni */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* Telefon (apel direct) */}
        {contactPhone && (
          <a
            href={`tel:${contactPhone}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            📞 Sună vânzătorul
          </a>
        )}

        {/* Share minimal (WhatsApp, Facebook, Copiază link) */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${listing.title} - ${currentUrl}`)}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded border hover:bg-gray-50"
          title="Trimite pe WhatsApp"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded border hover:bg-gray-50"
          title="Distribuie pe Facebook"
        >
          Facebook
        </a>
        <button
          onClick={copyLink}
          className="px-4 py-2 rounded border hover:bg-gray-50"
          title="Copiază link"
        >
          {copied ? "Link copiat ✓" : "Copiază link"}
        </button>

        {/* Acțiuni pentru proprietar */}
        {isOwner && (
          <>
            <button
              onClick={() => navigate(`/editeaza-anunt/${listing._id}`)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Editează anunțul
            </button>

            {/* Promovare Stripe (test) */}
            <button
              onClick={() => startCheckout("featured7")}
              className="px-4 py-2 rounded bg-fuchsia-600 text-white hover:bg-fuchsia-700"
            >
              Promovează 7 zile
            </button>
            <button
              onClick={() => startCheckout("featured30")}
              className="px-4 py-2 rounded bg-fuchsia-700 text-white hover:bg-fuchsia-800"
            >
              Promovează 30 zile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
