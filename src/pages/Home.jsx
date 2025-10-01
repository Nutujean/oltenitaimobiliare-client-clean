import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import SearchBar from "../components/SearchBar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://oltenitaimobiliare-backend.onrender.com/api";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({}); // { q, location, price }
  const [sort, setSort] = useState("latest"); // latest | price_asc | price_desc

  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) return listing.images[0];
    if (listing.imageUrl) return listing.imageUrl;
    return "/no-image.jpg";
  };

  const fetchListings = async (filters = {}, sortKey = "latest") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.location) params.set("location", filters.location);
      if (filters.price) params.set("price", String(filters.price));
      if (sortKey) params.set("sort", sortKey);

      const url =
        params.toString().length > 0
          ? `${API_URL}/listings?${params.toString()}`
          : `${API_URL}/listings`;

      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Eroare la fetch listings:", e);
      setError(e.message || "Eroare necunoscută");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(activeFilters, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(activeFilters), sort]);

  const categories = [
    { name: "Apartamente", slug: "apartamente", image: "/apartamente.jpg" },
    { name: "Case", slug: "case", image: "/case.jpg" },
    { name: "Terenuri", slug: "terenuri", image: "/terenuri.jpg" },
    { name: "Garsoniere", slug: "garsoniere", image: "/garsoniere.jpg" },
    { name: "Garaje", slug: "garaje", image: "/garaje.jpg" },
    { name: "Spațiu comercial", slug: "spatiu-comercial", image: "/spatiu-comercial.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/fundal.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Oltenița Imobiliare</h1>
          <p className="text-lg">Cumpără, vinde sau închiriază apartamente, garsoniere, case, spatiii comerciale, terenuri, garaje  în zona ta</p>
        </div>
      </section>

      {/* 🔎 Bara de căutare compusă */}
      <SearchBar onSearch={(filters) => setActiveFilters(filters)} />

      {/* Eroare vizibilă */}
      {error && (
        <div className="max-w-5xl mx-auto mt-6 px-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Eroare la încărcarea anunțurilor:</strong> {error}
          </div>
        </div>
      )}

      {/* Categorii */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Categorii populare</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/categorie/${cat.slug}`} className="relative group">
              <div
                className="h-40 rounded-xl shadow-md bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition"></div>
                <h3 className="text-white text-xl font-bold z-10">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Anunțuri (filtrate/recente) + Sort */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">
            {Object.keys(activeFilters).length ? "Rezultate căutare" : "Anunțuri recente"}
          </h2>

          {/* 🔽 Select sortare */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
            aria-label="Sortare anunțuri"
          >
            <option value="latest">Cele mai noi</option>
            <option value="price_asc">Preț crescător</option>
            <option value="price_desc">Preț descrescător</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Se încarcă...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">Nu s-au găsit anunțuri.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const imgs =
                listing.images && listing.images.length > 0
                  ? listing.images
                  : [listing.imageUrl || "/no-image.jpg"];
              const hasMultiple = imgs.length > 1;

              return (
                <Link
                  key={listing._id}
                  to={`/anunt/${listing._id}`}
                  className="bg-white shadow-md rounded-xl overflow-hidden block hover:shadow-lg transition"
                >
                  {hasMultiple ? (
                    <Swiper
                      modules={[Navigation, Keyboard]}
                      navigation
                      keyboard
                      spaceBetween={8}
                      slidesPerView={1}
                      loop
                      className="w-full h-48"
                    >
                      {imgs.map((src, i) => (
                        <SwiperSlide key={i}>
                          <img
                            src={src || "/no-image.jpg"}
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src={getImageUrl(listing)}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold line-clamp-1">{listing.title}</h3>
                    <p className="text-gray-600">{listing.price} €</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{listing.location}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
