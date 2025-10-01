import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import API_URL from "../api";

function normalizeForWhatsApp(raw) {
  if (!raw) return "";
  let digits = String(raw).replace(/\D+/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "40" + digits.slice(1); // 07xx -> 407xx
  return digits;
}

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const url = `${API_URL}/listings/${id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Eroare la încărcarea anunțului (status ${res.status})`);
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("❌ Eroare DetaliuAnunt:", err);
        setError(err.message);
      }
    };
    fetchListing();
  }, [id]);

  const contactPhone = useMemo(() => {
    if (!listing) return "";
    return listing.contactPhone || listing.phone || (listing.owner && listing.owner.phone) || "";
  }, [listing]);

  const waNumber = useMemo(() => normalizeForWhatsApp(contactPhone), [contactPhone]);

  if (error) return <p className="text-center py-10 text-red-600">❌ {error}</p>;
  if (!listing) return <p className="text-center py-10">Se încarcă...</p>;

  const imagesToShow =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.imageUrl || "/no-image.jpg"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Col stânga: imagini + descriere */}
      <div className="lg:col-span-2">
        <Swiper
          modules={[Navigation, Keyboard]}
          navigation
          keyboard
          spaceBetween={10}
          slidesPerView={1}
          loop={imagesToShow.length > 1}
          className="mb-6"
        >
          {imagesToShow.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img || "/no-image.jpg"}
                alt={listing.title}
                className="w-full h-80 object-cover rounded"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
        <p className="text-xl text-green-700 font-semibold mb-2">
          <strong>Preț:</strong> {listing.price} €
        </p>
        <p className="text-gray-700 mb-4 whitespace-pre-line">{listing.description}</p>

        {listing.location && (
          <p className="text-gray-600 mb-2">
            <strong>Locație:</strong> {listing.location}
          </p>
        )}

        <p className="text-sm text-gray-500 capitalize">
          Categorie: {listing.category || "Nespecificat"}
        </p>
        <p className="text-sm text-gray-500">Status: {listing.status || "disponibil"}</p>
      </div>

      {/* Col dreapta: card contact */}
      <aside className="lg:col-span-1">
        <div className="bg-white shadow rounded-xl p-5 sticky top-6">
          <h3 className="text-lg font-bold mb-3">Contact proprietar</h3>

          {listing.owner?.name && (
            <p className="text-gray-700 mb-2">
              <strong>Nume:</strong> {listing.owner.name}
            </p>
          )}

          {contactPhone ? (
            <>
              <p className="text-gray-700 mb-4">
                <strong>Telefon:</strong>{" "}
                <a href={`tel:${contactPhone}`} className="text-blue-600 hover:underline">
                  {contactPhone}
                </a>
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${contactPhone}`}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                >
                  📞 Sună
                </a>

                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold hover:bg-green-700 transition"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Telefon indisponibil pentru acest anunț.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
