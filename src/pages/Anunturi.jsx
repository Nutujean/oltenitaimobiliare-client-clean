import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Anunturi() {
  const [listings, setListings] = useState([]);

  const optimizeImage = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>Anunțuri imobiliare - Oltenița Imobiliare</title>
        <meta
          name="description"
          content="Toate anunțurile de vânzare și închiriere din Oltenița și împrejurimi."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Toate anunțurile
      </h1>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const adUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

            return (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* 🖼️ Imagine */}
                <img
                  src={
                    listing.images && listing.images.length > 0
                      ? optimizeImage(listing.images[0])
                      : "https://via.placeholder.com/400x250?text=Fără+imagine"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />

                {/* 📋 Detalii */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">
                    {listing.title}
                  </h2>
                  <p className="text-blue-600 font-semibold mb-3">
                    Preț: {listing.price} €
                  </p>

                  {/* 🔹 Buton „Detalii” */}
                  <Link
                    to={`/anunt/${listing._id}`}
                    className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Vezi detalii
                  </Link>

                  {/* 🔹 Distribuire anunț */}
                  <div className="flex justify-between items-center gap-2 mt-3">
                    {/* 📘 Facebook */}
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            `https://share.oltenitaimobiliare.ro/share/${listing._id}`
                          )}`,
                          "_blank",
                          "width=600,height=400"
                        )
                      }
                      className="flex-1 bg-[#1877F2] text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-[#145DBF]"
                    >
                      📘 Facebook
                    </button>

                    {/* 💬 WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `🏡 ${listing.title} – vezi detalii: ${adUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-[#1DA851]"
                    >
                      💬 WhatsApp
                    </a>

                    {/* 🎵 TikTok */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(adUrl);
                        alert(
                          "🔗 Link copiat! Poți să-l pui în TikTok sau oriunde dorești."
                        );
                      }}
                      className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-gray-800"
                    >
                      🎵 TikTok
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">
          Nu există anunțuri momentan.
        </p>
      )}
    </div>
  );
}
