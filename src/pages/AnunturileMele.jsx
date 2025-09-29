import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("📧 Email trimis la backend:", email);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/listings/user/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Eroare la încărcarea anunțurilor");
        }

        const data = await res.json();
        console.log("📦 Anunțurile utilizatorului:", data);
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchListings();
    }
  }, [email, token]);

  if (loading) {
    return <p className="text-center mt-4">Se încarcă anunțurile...</p>;
  }

  if (!listings.length) {
    return <p className="text-center mt-4">Nu ai anunțuri încă.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Anunțurile Mele</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p>{listing.description}</p>
            <p className="font-bold">{listing.price} EUR</p>
            <p className="text-sm text-gray-600">
              {listing.category} - {listing.location}
            </p>

            {/* ✅ Slider cu poze */}
            {listing.images?.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="mt-3 rounded"
              >
                {listing.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`${listing.title} - poza ${index + 1}`}
                      className="rounded w-full h-64 object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Butoane acțiuni */}
            <div className="flex justify-between mt-4">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                Editează
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Șterge
              </button>
              <button
                className={`${
                  listing.rezervat
                    ? "bg-gray-500"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-3 py-1 rounded`}
              >
                {listing.rezervat ? "Rezervat" : "Marchează rezervat"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
