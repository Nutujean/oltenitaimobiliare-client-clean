import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Anunturi() {
  const [listings, setListings] = useState([]);

  const optimizeImage = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  const getDateMs = (x) => {
    if (!x) return null;

    const d1 = new Date(x);
    if (!Number.isNaN(d1.getTime())) return d1.getTime();

    const maybe =
      x?.$date ||
      x?.date ||
      x?.value ||
      x?.iso ||
      (typeof x?.toString === "function" ? x.toString() : null);

    const d2 = new Date(maybe);
    if (maybe && !Number.isNaN(d2.getTime())) return d2.getTime();

    return null;
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };
    fetchListings();
  }, []);

  const sortedListings = [...listings].sort((a, b) => {
    const aExpMs = getDateMs(a.expiresAt);
    const bExpMs = getDateMs(b.expiresAt);

    const aExpired =
      String(a.status || "").toLowerCase() === "expirat" ||
      (aExpMs !== null && aExpMs < Date.now());

    const bExpired =
      String(b.status || "").toLowerCase() === "expirat" ||
      (bExpMs !== null && bExpMs < Date.now());

    const aFeatured =
      !aExpired &&
      (a.featured === true ||
        (a.featuredUntil && new Date(a.featuredUntil).getTime() > Date.now()));

    const bFeatured =
      !bExpired &&
      (b.featured === true ||
        (b.featuredUntil && new Date(b.featuredUntil).getTime() > Date.now()));

    const aGroup = aFeatured ? 0 : aExpired ? 2 : 1;
    const bGroup = bFeatured ? 0 : bExpired ? 2 : 1;

    if (aGroup !== bGroup) return aGroup - bGroup;

    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

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

      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedListings.map((listing) => {
            const adUrl = `https://oltenitaimobiliare.ro/anunt/${listing._id}`;

            const expiresAtMs = getDateMs(listing.expiresAt);
            const isExpired =
              String(listing.status || "").toLowerCase() === "expirat" ||
              (expiresAtMs !== null && expiresAtMs < Date.now());

            const isFeatured =
              !isExpired &&
              (listing.featured === true ||
                (listing.featuredUntil &&
                  new Date(listing.featuredUntil).getTime() > Date.now()));

            const isNew =
              listing.createdAt &&
              (Date.now() - new Date(listing.createdAt)) / (1000 * 60 * 60 * 24) <= 5;

            return (
              <div
                key={listing._id}
                className={`relative rounded-lg shadow-md overflow-hidden ${
                  isExpired
                    ? "bg-gray-100 opacity-75"
                    : "bg-white hover:shadow-lg transition"
                }`}
              >
                <img
                  src={
                    listing.images && listing.images.length > 0
                      ? optimizeImage(listing.images[0])
                      : "https://via.placeholder.com/400x250?text=Fără+imagine"
                  }
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />

                {!isExpired && isFeatured && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    ⭐ PROMOVAT
                  </span>
                )}

                {!isExpired && !isFeatured && isNew && (
                  <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                    NOU
                  </span>
                )}

                {isExpired && (
                  <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                    EXPIRAT
                  </span>
                )}

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">
                    {listing.title}
                  </h2>

                  <p className={`font-semibold mb-1 ${isExpired ? "text-gray-500" : "text-blue-600"}`}>
                    Preț: {listing.price} €
                  </p>

                  {listing.location && (
                    <p className="text-sm text-gray-500">{listing.location}</p>
                  )}

                  {listing.createdAt && (
                    <p className="text-xs text-gray-400">
                      🕒 Publicat:{" "}
                      {new Date(listing.createdAt).toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {isExpired ? (
                    <div className="block text-center px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed">
                      Anunț expirat
                    </div>
                  ) : (
                    <Link
                      to={`/anunt/${listing._id}`}
                      className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Vezi detalii
                    </Link>
                  )}

                  <div className="flex justify-between items-center gap-2 mt-3">
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