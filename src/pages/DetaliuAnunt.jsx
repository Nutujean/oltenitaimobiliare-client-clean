import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Se încarcă...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!listing) return <p className="text-center mt-6">Anunțul nu există.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <div className="relative">
        {listing.images?.length > 0 ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation
            modules={[Navigation]}
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
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">Fără imagini</span>
          </div>
        )}

        {listing.rezervat && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
            <span className="text-white text-3xl font-bold">REZERVAT</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold">{listing.title}</h2>
        <p className="text-blue-600 font-semibold text-xl">{listing.price} EUR</p>
        <p className="text-gray-600">{listing.location}</p>
        <p className="mt-2 text-sm bg-gray-100 inline-block px-2 py-1 rounded">
          {listing.category}
        </p>
        <p className="mt-4">{listing.description}</p>
      </div>
    </div>
  );
}
