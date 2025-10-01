import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import API_URL from "../api";

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

  if (error) {
    return <p className="text-center py-10 text-red-600">❌ {error}</p>;
  }
  if (!listing) {
    return <p className="text-center py-10">Se încarcă...</p>;
  }

  const imagesToShow =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.imageUrl || "/no-image.jpg"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 🔹 Slider cu săgeți stânga/dreapta */}
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
      <p className="text-gray-700 mb-4">{listing.description}</p>

      {listing.location && (
        <p className="text-gray-600 mb-2">
          <strong>Locație:</strong> {listing.location}
        </p>
      )}

      {listing.phone && (
        <p className="text-gray-600 mb-2">
          <strong>Telefon:</strong>{" "}
          <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">
            {listing.phone}
          </a>
        </p>
      )}

      <p className="text-sm text-gray-500 capitalize">
      </p>
      <p className="text-sm text-gray-500">Status: {listing.status || "disponibil"}</p>
    </div>
  );
}
