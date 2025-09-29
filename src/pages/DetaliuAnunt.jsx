import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/listings/${id}`
        );
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");

        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("❌ Eroare fetch detaliu anunț:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Se încarcă...</p>;
  if (!listing) return <p className="text-center mt-4">Anunțul nu există.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{listing.title}</h2>

      {/* ✅ Slider cu poze */}
      {listing.images?.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="mb-4 rounded"
        >
          {listing.images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`${listing.title} - poza ${index + 1}`}
                className="w-full h-96 object-cover rounded"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <p className="text-lg">{listing.description}</p>
      <p className="text-xl font-bold mt-2">{listing.price} EUR</p>
      <p className="text-gray-600">
        {listing.category} | {listing.location}
      </p>
    </div>
  );
}
