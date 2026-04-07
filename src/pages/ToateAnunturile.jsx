import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

export default function ToateAnunturile() {
  const [listings, setListings] = useState([]);

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
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor:", e);
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
      <h1 className="text-3xl font-bold mb-6 text-center">Toate Anunțurile</h1>

      {sortedListings.length === 0 ? (
        <p className="text-gray-600 text-center">Nu există anunțuri momentan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedListings.map((l) => {
            const expiresAtMs = getDateMs(l.expiresAt);
            const isExpired =
              String(l.status || "").toLowerCase() === "expirat" ||
              (expiresAtMs !== null && expiresAtMs < Date.now());

            const isFeatured =
              !isExpired &&
              (l.featured === true ||
                (l.featuredUntil &&
                  new Date(l.featuredUntil).getTime() > Date.now()));

            const isNew =
              l.createdAt &&
              (Date.now() - new Date(l.createdAt)) / (1000 * 60 * 60 * 24) <= 5;

            const cardClass = `relative rounded-xl overflow-hidden shadow-md ${
              isExpired
                ? "bg-gray-100 opacity-75 cursor-not-allowed"
                : "bg-white hover:shadow-lg transition"
            }`;

            const cardContent = (
              <>
                <img
                  src={l.images?.[0] || "https://via.placeholder.com/400x250?text=Fără+imagine"}
                  alt={l.title}
                  className="w-full h-56 object-cover"
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

                <div className="p-4">
                  <h3 className="font-bold text-lg line-clamp-2">{l.title}</h3>
                  <p className={isExpired ? "text-gray-500 font-semibold" : "text-blue-700 font-semibold"}>
                    {l.price} €
                  </p>
                  <p className="text-sm text-gray-500">{l.location}</p>

                  {l.createdAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      🕒 Publicat:{" "}
                      {new Date(l.createdAt).toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {isExpired && (
                    <p className="text-xs text-gray-600 mt-2 font-medium">
                      Acest anunț este expirat.
                    </p>
                  )}
                </div>
              </>
            );

            return isExpired ? (
              <div key={l._id} className={cardClass}>
                {cardContent}
              </div>
            ) : (
              <Link key={l._id} to={`/anunt/${l._id}`} className={cardClass}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}