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
  // acceptă /anunt/<slug>-<id> SAU /anunt/<id>
  const id = (rawId || "").match(/[0-9a-fA-F]{24}$/)?.[0] || rawId;

  const [listing, setListing] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [err, setErr] = useState("");
  const [fav, setFav] = useState(isFav(id));
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // “Înapoi” spre listă/căutare; fallback Acasă
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

  // Share (Web Share API + fallback copy link)
  const shareListing = async () => {
    const shareUrl = window.location.href;
    const title = listing?.title || "Anunț imobiliar";
    const text = `${title} – ${listing?.price ? `${listing.price} €` : ""}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        /* anulare - ignorăm */
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copiat în clipboard ✅");
      } catch {
        alert("Nu am putut copia linkul. Îl poți selecta din bara de adrese.");
      }
    } else {
      alert("Distribuirea nu e disponibilă. Copiază linkul din bara de adrese.");
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        if (!alive) return;
        setListing(data);

        // după ce avem anunțul, căutăm similare
        const qs = new URLSearchParams();
        if (data.category) qs.set("category", data.category);
        if (data.location) qs.set("location", data.location);
        const r2 = await fetch(`${API_URL}/listings?${qs.toString()}`);
        if (r2.ok) {
          const all = await r2.json();
          const filtered = Array.isArray(all)
            ? all.filter((x) => String(x._id) !== String(data._id)).slice(0, 6)
            : [];
          setSimilar(filtered);
        } else {
          setSimilar([]);
        }
      } catch (e) {
        console.error("❌ Eroare:", e);
        setErr(e.message || "Eroare necunoscută");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // user curent (pt. acțiuni proprietar)
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

  const getImage = (l) =>
    Array.isArray(l.images) && l.images.length > 0
      ? l.images[0]
      : l.imageUrl || "https://via.placeholder.com/400x250?text=Fara+imagine";

  const contactPhone = listing.contactPhone || listing.phone || "";
  const waNumber = formatPhoneForWa(contactPhone);

  const isOwner =
    !!me &&
    ((listing.user && String(listing.user) === String(me._id)) ||
      (listing.userEmail &&
        me.email &&
        String(listing.userEmail).toLowerCase() === String(me.email).toLowerCase()));

  return (
    // padding bottom pe mobil ca să nu acopere bara sticky conținutul
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Slider + buton Înapoi peste slider; forțăm culoarea săgeților */}
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
        <div className="flex items-center gap-2">
          <button
            onClick={shareListing}
            className="rounded-full px-3 py-1 shadow bg-white/90 text-gray-700 hover:bg-white"
            title="Distribuie"
          >
            🔗
          </button>
          <button
            onClick={onToggleFav}
            className={`rounded-full px-3 py-1 shadow ${fav ? "bg-white text-red-600" : "bg-white/90 text-gray-700"} hover:bg-white`}
            title={fav ? "Șterge din favorite" : "Adaugă la favorite"}
          >
            {fav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      {isOwner && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            to={`/editeaza-anunt/${id}`}
            state={{ from: fromState || "/" }}
            className="border px-3 py-2 rounded hover:bg-gray-50"
          >
            ✏️ Editează
          </Link>
          <button
            onClick={handleDelete}
            className="border px-3 py-2 rounded text-red-600 hover:bg-red-50"
          >
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
            <a href={`tel:${contactPhone}`} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              📞 Sună
            </a>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
              💬 WhatsApp
            </a>
            <button onClick={shareListing} className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
              🔗 Distribuie
            </button>
            <span className="text-gray-600 self-center">({contactPhone})</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={shareListing} className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
              🔗 Distribuie
            </button>
            <p className="text-gray-500">Proprietarul nu și-a publicat telefonul.</p>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500 flex gap-4 mb-10">
        <span>Categorie: {listing.category || "Nespecificat"}</span>
        <span>Status: {listing.status || "disponibil"}</span>
      </div>

      {/* 🔹 Anunțuri similare */}
      {similar.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Anunțuri similare</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similar.map((l) => (
              <Link
                key={l._id}
                to={`/anunt/${slugify(l.title)}-${l._id}`}
                state={{ from: location.pathname + location.search }}
                className="bg-white shadow-md rounded-xl overflow-hidden block hover:shadow-lg transition"
              >
                <img src={getImage(l)} alt={l.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-base font-bold line-clamp-2">{l.title}</h3>
                  <p className="text-gray-600">{l.price} €</p>
                  <p className="text-sm text-gray-500">{l.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🔻 Bara de acțiuni sticky (mobil) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow z-40">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2">
          <button onClick={goBack} className="flex-1 border px-3 py-2 rounded-lg text-gray-700">
            ← Înapoi
          </button>
          {contactPhone && (
            <>
              <a href={`tel:${contactPhone}`} className="flex-1 text-center bg-green-600 text-white px-3 py-2 rounded-lg">
                📞 Sună
              </a>
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-emerald-600 text-white px-3 py-2 rounded-lg">
                💬 WhatsApp
              </a>
            </>
          )}
          <button onClick={shareListing} className="border px-3 py-2 rounded-lg text-gray-700">
            🔗
          </button>
          <button
            onClick={onToggleFav}
            className={`border px-3 py-2 rounded-lg ${fav ? "text-red-600" : "text-gray-700"}`}
            title={fav ? "Șterge din favorite" : "Adaugă la favorite"}
          >
            {fav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}
