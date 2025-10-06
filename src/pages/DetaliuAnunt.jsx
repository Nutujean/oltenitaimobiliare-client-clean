import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const [listing, setListing] = useState(null);
  const [err, setErr] = useState("");
  const [plan, setPlan] = useState("featured7");

  // id real (acceptă /anunt/slug-<id> sau /anunt/<id>)
  const listingId = useMemo(() => {
    if (!id) return "";
    const parts = String(id).split("-");
    return parts[parts.length - 1];
  }, [id]);

  // user & token din localStorage
  const me = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, []);
  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const myId = me?.id || me?._id;

  useEffect(() => {
    const run = async () => {
      try {
        setErr("");
        const r = await fetch(`${API_URL}/listings/${listingId}`);
        if (!r.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await r.json();
        setListing(data);
      } catch (e) {
        setErr(e.message || "Eroare");
      }
    };
    run();
  }, [listingId]);

  const imagesToShow =
    listing?.images?.length ? listing.images : (listing?.imageUrl ? [listing.imageUrl] : []);
  const ownerId = listing?.user?._id || listing?.user;
  const isOwner = myId && ownerId && String(myId) === String(ownerId);
  const contactPhone = listing?.phone || "";

  const featuredActive =
    listing?.featuredUntil && new Date(listing.featuredUntil).getTime() > Date.now();

  const startPromotion = async () => {
    if (!token) {
      nav(`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`);
      return;
    }
    try {
      const r = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: listing._id, plan }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la inițierea plății");
      window.location.href = data.url;
    } catch (e) {
      alert(e.message);
    }
  };

  if (err) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-red-600">{err}</p>
        <button onClick={() => nav(-1)} className="mt-4 text-blue-600 hover:underline">← Înapoi</button>
      </div>
    );
  }

  if (!listing) {
    return <p className="text-center py-10">Se încarcă...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* back */}
      <div className="mb-4">
        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          ← Înapoi
        </button>
      </div>

      {/* slider */}
      {imagesToShow.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          spaceBetween={10}
          slidesPerView={1}
          className="mb-6 rounded overflow-hidden"
        >
          {imagesToShow.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img || "https://via.placeholder.com/800x500?text=Fara+imagine"}
                alt={listing.title}
                className="w-full max-h-[70vh] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* titlu + badge-uri */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {listing.dealType === "inchiriere" ? "De închiriere" : "De vânzare"}
        </span>
        {featuredActive && (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
            Promovat până la {new Date(listing.featuredUntil).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* preț & locație */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        {Number.isFinite(listing.price) && (
          <p className="text-2xl text-green-700 font-semibold">{listing.price} €</p>
        )}
        <p className="text-gray-600">{listing.location}</p>
      </div>

      {/* mini-specs */}
      {(Number.isFinite(listing.rooms) ||
        Number.isFinite(listing.surface) ||
        Number.isFinite(listing.floor)) && (
        <div className="text-sm text-gray-600 mb-4 flex flex-wrap gap-3">
          {Number.isFinite(listing.rooms) && <span>{listing.rooms} camere</span>}
          {Number.isFinite(listing.surface) && <span>• {listing.surface} mp</span>}
          {Number.isFinite(listing.floor) && <span>• Etaj {listing.floor}</span>}
        </div>
      )}

      {/* descriere */}
      <p className="text-gray-800 mb-6 whitespace-pre-line">{listing.description}</p>

      {/* acțiuni contact & share */}
      <div className="flex flex-wrap gap-3 mb-6">
        {contactPhone && (
          <a href={`tel:${contactPhone}`} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Sună: {contactPhone}
          </a>
        )}
        <a
          href={`https://wa.me/${(contactPhone || "").replace(/\D/g, "")}?text=${encodeURIComponent(
            `Bună! Sunt interesat(ă) de anunțul: ${listing.title} - ${window.location.href}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Distribuie pe Facebook
        </a>
        <a
          href={`https://threads.net/intent/post?text=${encodeURIComponent(`${listing.title} ${window.location.href}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center bg-black text-white px-4 py-2 rounded hover:opacity-90"
        >
          Distribuie pe Instagram Threads
        </a>
      </div>

      {/* PROMOVARE – acum este ÎNTOTDEAUNA vizibilă */}
      <div className="border rounded-xl p-4 mb-8 bg-white shadow-sm">
        <h3 className="font-semibold mb-3">Promovează anunțul</h3>

        {featuredActive ? (
          <p className="text-green-700">
            Anunțul este deja promovat până la{" "}
            <strong>{new Date(listing.featuredUntil).toLocaleString()}</strong>.
          </p>
        ) : !me ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-700">Pentru a promova anunțul, autentifică-te în cont.</p>
            <button
              onClick={() => nav(`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Autentifică-te
            </button>
          </div>
        ) : isOwner ? (
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="border rounded px-3 py-2 bg-white"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="featured7">Promovare 7 zile (4.99 €)</option>
              <option value="featured30">Promovare 30 zile (14.99 €)</option>
            </select>
            <button
              onClick={startPromotion}
              className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
            >
              Promovează acum
            </button>
          </div>
        ) : (
          <p className="text-sm text-amber-700">
            Ești autentificat(ă), dar nu cu contul proprietar al acestui anunț. Numai proprietarul poate iniția promovarea.
          </p>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Anunțurile promovate apar primele în listă și sunt marcate cu badge „Promovat”.
        </p>
      </div>

      {/* link editare pentru proprietar */}
      {isOwner && (
        <div className="mb-8">
          <Link
            to={`/editeaza-anunt/${listing._id}`}
            className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
          >
            Editează anunțul
          </Link>
        </div>
      )}
    </div>
  );
}
