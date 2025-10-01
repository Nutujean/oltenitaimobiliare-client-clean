import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import API_URL from "../api";

function formatPhoneForWa(raw) {
  if (!raw) return "";
  const digits = ("" + raw).replace(/\D+/g, "");
  if (!digits) return "";
  // dacă începe cu 0 -> înlocuim 0 cu 40 (România)
  if (digits.startsWith("0")) return "40" + digits.slice(1);
  // dacă începe deja cu 40 -> păstrăm
  if (digits.startsWith("40")) return digits;
  // dacă începe cu 0040 -> tăiem 00
  if (digits.startsWith("0040")) return digits.slice(2);
  // dacă începe cu +40 (a fost înlăturat plusul la /D/) -> era 40 deja
  return digits;
}

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        if (isMounted) setListing(data);
      } catch (e) {
        console.error("❌ Eroare:", e);
        setErr(e.message || "Eroare necunoscută");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (err) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">❌ {err}</p>
      </div>
    );
  }

  if (!listing) {
    return <p className="text-center py-10">Se încarcă...</p>;
  }

  const imagesToShow =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : listing.imageUrl
      ? [listing.imageUrl]
      : [];

  const contactPhone = listing.contactPhone || listing.phone || "";
  const waNumber = formatPhoneForWa(contactPhone);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Slider cu săgeți */}
      {imagesToShow.length > 0 && (
        <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={1}>
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

      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-xl text-green-700 font-semibold">{listing.price} €</span>
        {listing.location && (
          <span className="text-gray-600">
            <strong>Locație:</strong> {listing.location}
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-line">{listing.description}</p>

      {/* Card contact */}
      <div className="bg-white border rounded-xl p-4 shadow-sm mb-6">
        <h3 className="font-semibold mb-2">Contact proprietar</h3>
        {contactPhone ? (
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${contactPhone}`}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              📞 Sună
            </a>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              💬 WhatsApp
            </a>
            <span className="text-gray-600 self-center">({contactPhone})</span>
          </div>
        ) : (
          <p className="text-gray-500">Proprietarul nu și-a publicat telefonul.</p>
        )}
      </div>

      <div className="text-sm text-gray-500 flex gap-4">
        <span>Categorie: {listing.category || "Nespecificat"}</span>
        <span>Status: {listing.status || "disponibil"}</span>
      </div>
    </div>
  );
}
