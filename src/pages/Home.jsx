import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import API_URL from "../api";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");

        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Eroare la fetch listings:", err);
        setListings([]);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Oltenița Imobiliare - Cumpără, vinde sau închiriază</title>
        <meta
          name="description"
          content="Cumpără, vinde sau închiriază apartamente, case, terenuri și alte proprietăți în zona Oltenița."
        />
      </Helmet>

      {/* Hero */}
      <section
        className="h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bine ai venit la Oltenița Imobiliare
          </h1>
          <p className="mb-4">
            Caută, vinde sau închiriază proprietăți în zona ta
          </p>
          <Link
            to="/adauga-anunt"
            className="bg-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-700"
          >
            + Adaugă un anunț
          </Link>
        </div>
      </section>

      {/* Anunțuri recente */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Anunțuri recente</h2>
        {listings.length === 0 ? (
          <p className="text-gray-600">Momentan nu sunt anunțuri disponibile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg shadow bg-white overflow-hidden hover:shadow-lg transition"
              >
                {/* Slider pentru imagini */}
                <Swiper spaceBetween={10} slidesPerView={1}>
                  {(listing.images && listing.images.length > 0
                    ? listing.images
                    : [listing.imageUrl]
                  ).map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={
                          img ||
                          "https://via.placeholder.com/400x250?text=Fără+imagine"
                        }
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold">{listing.title}</h2>
                  <p className="text-gray-600">
                    <strong>Preț:</strong> {listing.price} €
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {listing.category}
                  </p>
                  {listing.location && (
                    <p className="text-sm text-gray-500">
                      📍 {listing.location}
                    </p>
                  )}
                  {listing.phone && (
                    <p className="text-sm text-gray-500">
                      📞{" "}
                      <a
                        href={`tel:${listing.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {listing.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
