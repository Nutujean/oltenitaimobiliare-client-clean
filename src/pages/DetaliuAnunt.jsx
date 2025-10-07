import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id: slugOrId } = useParams();
  const [listing, setListing] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const meRaw = localStorage.getItem("user");
    const me = meRaw ? JSON.parse(meRaw) : null;
    const myId = me?.id || me?._id || null;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${slugOrId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setListing(data);

        const ownerId = data.user?._id || data.user || null;
        const ownerPhone = data.user?.phone || data.phone || "";
        setContactPhone(ownerPhone);

        const owner = Boolean(myId && ownerId && String(myId) === String(ownerId));
        setIsOwner(owner);

        console.log("DEBUG:", {
          myId,
          ownerId,
          isOwner: owner,
          hasToken: Boolean(token),
          featuredUntil: data.featuredUntil || null,
        });
      } catch (e) {
        console.error("❌ Eroare anunț:", e);
      }
    })();
  }, [slugOrId]);

  if (!listing) return <p className="p-6 text-center">Se încarcă…</p>;

  const images = (listing.images?.length ? listing.images : [listing.imageUrl]).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Înapoi */}
      <button
        onClick={() => (loc.state?.from ? nav(-1) : nav("/"))}
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black"
      >
        ← Înapoi
      </button>

      {/* Poze */}
      <Swiper spaceBetween={10} slidesPerView={1}>
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img src={src} alt={listing.title} className="w-full h-80 object-cover rounded" />
          </SwiperSlide>
        ))}
      </Swiper>

      <h1 className="text-2xl font-bold mt-4">{listing.title}</h1>
      <p className="text-green-700 font-semibold text-lg">{listing.price} €</p>
      <p className="text-gray-600">{listing.location}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {contactPhone && (
          <a href={`tel:${contactPhone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 text-white">
            Sună vânzătorul
          </a>
        )}

        {!isOwner && (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${listing.title} - ${window.location.href}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded border"
          >
            Trimite pe WhatsApp
          </a>
        )}

        {isOwner && (
          <>
            <button
              onClick={() => nav(`/editeaza-anunt/${listing._id}`)}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Editează anunțul
            </button>
            {/* Dacă ai buton de „Promovează”, îl poți afișa aici pentru owner */}
          </>
        )}
      </div>
    </div>
  );
}
