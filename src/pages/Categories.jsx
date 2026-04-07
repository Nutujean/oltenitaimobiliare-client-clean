import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Categories() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryNames = {
    apartamente: "Apartamente",
    case: "Case",
    terenuri: "Terenuri",
    garsoniere: "Garsoniere",
    garaje: "Garaje",
    "spatiu-comercial": "Spațiu comercial",
  };

  const displayName = categoryNames[slug] || "Anunțuri";

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
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();

        const filtered = Array.isArray(data)
          ? data.filter(
              (item) =>
                item.category?.toLowerCase().replace(/\s+/g, "-") === slug
            )
          : [];

        setListings(filtered);
      } catch (e) {
        console.error("Eroare la preluarea anunțurilor pe categorie:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-800">{displayName}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg border shadow-sm transition"
        >
          ← Înapoi
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Se încarcă anunțurile...</p>
      ) : sortedListings.length === 0 ? (
        <p className="text-gray-600 text-center">
          Nu există anunțuri în această categorie momentan.
        </p>
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

            const cardClass = `relative rounded-xl shadow-md overflow-hidden ${
              isExpired
                ? "bg-gray-100 opacity-75 cursor-not-allowed"
                : "bg-white hover:shadow-lg transition"
            }`;

            const cardContent = (
              <>
                {l.images?.length > 0 ? (
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">
                    Fără imagine
                  </div>
                )}

                {isFeatured && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                    PROMOVAT
                  </span>
                )}

                {isExpired && (
                  <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded shadow">
                    EXPIRAT
                  </span>
                )}

                <div className="p-4">
                  <h3 className="font-bold text-lg line-clamp-2">{l.title}</h3>
                  <p className={isExpired ? "text-gray-500 font-semibold" : "text-blue-700 font-semibold"}>
                    {l.price} €
                  </p>
                  <p className="text-sm text-gray-500">{l.location}</p>

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