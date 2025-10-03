import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import API_URL from "../api";
import { isFav, toggleFav } from "../utils/favorites";
import slugify from "../utils/slugify.js";

function formatPhoneForWa(raw) {
  if (!raw) return "";
  const digits = ("" + raw).replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return "40" + digits.slice(1);
  if (digits.startsWith("40")) return digits;
  if (digits.startsWith("0040")) return digits.slice(2);
  return digits;
}

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const id = (rawId || "").match(/[0-9a-fA-F]{24}$/)?.[0] || rawId;

  const [listing, setListing] = useState(null);
  const [err, setErr] = useState("");
  const [fav, setFav] = useState(isFav(id));
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const fromState = location.state?.from || null;
  const goBack = () => {
    if (fromState) return navigate(fromState);
    try {
      const ref = document.referrer || "";
      const sameOrigin = ref && new URL(ref).origin === window.location.origin;
      if (sameOrigin) return navigate(-1);
    } catch {}
    navigate("/");
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        if (alive) setListing(data);
      } catch (e) {
        console.error("❌ Eroare:", e);
        setErr(e.message || "Eroare necunoscută");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const r = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) return;
        const u = await r.json();
        setMe(u);
      } catch {}
    })();
  }, [token]);

  const onToggleFav = () => {
    toggleFav(id);
    setFav(isFav(id));
  };

  const handleDelete = async () => {
    if (!confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const r = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Eroare la ștergere");
      navigate("/anunturile-mele");
    } catch (e) {
      alert(e.message || "Eroare");
    }
  };

  if (err) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button onClick={goBack} className="mb-4 inline-flex items-center gap-2 text-gray-700 hover:text-blue-600">
          ← Înapoi
        </button>
        <p className="text-red-600">❌ {err}</p>
      </div>
    );
  }

  if (!listing) return <p className="text-center py-10">Se încarcă...</p>;

  const imagesToShow =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : listing.imageUrl
      ? [listing.imageUrl]
      : [];

  const contactPhone = listing.contactPhone || listing.phone || "";
  const waNumber = formatPhoneForWa(contactPhone);

  const isOwner =
    !!me &&
    ((listing.user && String(listing.user) === String(me._id)) ||
      (listing.userEmail &&
        me.email &&
        String(listing.userEmail).toLowerCase() === String(me.email).toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Slider cu săgeți vizibile + buton Înapoi peste slider */}
      <div className="relative">
        {imagesToShow.length > 0 && (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            style={{ "--swiper-navigation-color": "#111", "--swiper-pagination-color": "#111" }}
          >
            {imagesToShow.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img || "https://via.placeholder.com/800x450?text=Fara+imagine"}
                  alt={listing.title}
                  className="w-full h-80 object-cover rounded mb-6"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <button
          onClick={goBack}
          className="absolute top-2 left-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-full shadow"
          aria-label="Înapoi"
        >
          ← Înapoi
        </button>
      </div>

      {/* bară Înapoi + breadcrumb categorie */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={goBack} className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600">
          ← Înapoi
        </button>
        {listing.category && (
          <>
            <span className="text-gray-300">/</span>
            <Link to={`/categorie/${slugify(listing.category)}`} className="text-sm text-gray-600 hover:text-blue-600">
              {listing.category}
            </Link>
          </>
        )}
      </div>

      <div className="flex items-start gap-3 mb-3">
        <h1 className="text-3xl font-bold flex-1">{listing.title}</h1>
        <button
          onClick={onToggleFav}
          className={`rounded-full px-3 py-1 shadow ${fav ? "bg-white text-red-600" : "bg-white/90 text-gray-700"} hover:bg-white`}
          title={fav ? "Șterge din favorite" : "Adaugă la favorite"}
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      {isOwner && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Link to={`/editeaza-anunt/${id}`} state={{ from: fromState || "/" }} className="border px-3 py-2 rounded hover:bg-gray-50">
            ✏️ Editează
          </Link>
          <button onClick={handleDelete} className="border px-3 py-2 rounded text-red-600 hover:bg-red-50">
            🗑️ Șterge
          </button>
          <Link to="/anunturile-mele" className="border px-3 py-2 rounded hover:bg-gray-50">
            📂 Anunțurile mele
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-xl text-green-700 font-semibold">{listing.price} €</span>
        {listing.location && (
          <span className="text-gray-600"><strong>Locație:</strong> {listing.location}</span>
        )}
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-line">{listing.description}</p>

      {/* Card contact */}
      <div className="bg-white border rounded-xl p-4 shadow-sm mb-6">
        <h3 className="font-semibold mb-2">Contact proprietar</h3>
        {contactPhone ? (
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${contactPhone}`} className="inline-f
