import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const id = (rawId || "").split("-").pop(); // suportă /anunt/slug-titlu-<id>
  const [listing, setListing] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const loc = useLocation();
  const backTo = loc.state?.from || "/";

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Eroare la încărcarea anunțului");
        setListing(data);
      } catch (e) {
        setErr(e.message);
      }
    };
    run();
  }, [id]);

  if (err)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {err}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Înapoi
        </button>
      </div>
    );

  if (!listing) {
    return <p className="text-center py-10">Se încarcă...</p>;
  }

  const imagesToShow =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : listing.imageUrl
      ? [listing.imageUrl]
      : ["https://via.placeholder.com/800x500?text=Fara+imagine"];

  const contactPhone = listing.phone || "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* back */}
      <div className="mb-4">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black"
        >
          ← Înapoi
        </Link>
      </div>

      {/* slider */}
      <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={1}>
        {imagesToShow.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={listing.title}
              className="w-full h-80 object-cover rounded mb-6"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>

      <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
        {listing.location && <span>📍 {listing.location}</span>}
        {listing.category && <span>• {listing.category}</span>}
      </div>

      {Number.isFinite(listing.price) && (
        <p className="text-xl text-green-700 font-semibold mb-4">
          <strong>Preț:</strong> {listing.price} €
        </p>
      )}

      {/* box cu specificații */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Number.isFinite(listing.surface) && (
          <div className="bg-gray-50 rounded p-3">
            <span className="block text-gray-500">Suprafață</span>
            <span className="font-semibold">{listing.surface} mp</span>
          </div>
        )}

        {Number.isFinite(listing.rooms) && (
          <div className="bg-gray-50 rounded p-3">
            <span className="block text-gray-500">Camere</span>
            <span className="font-semibold">{listing.rooms}</span>
          </div>
        )}

        {Number.isFinite(listing.floor) && (
          <div className="bg-gray-50 rounded p-3">
            <span className="block text-gray-500">Etaj</span>
            <span className="font-semibold">
              {listing.floor === 0 ? "Parter" : `Etaj ${listing.floor}`}
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-800 whitespace-pre-line mb-6">{listing.description}</p>

      {/* contact rapid */}
      {contactPhone && (
        <div className="mt-4">
          <a
            href={`tel:${contactPhone}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📞 Sună proprietarul
          </a>
        </div>
      )}
    </div>
  );
}
