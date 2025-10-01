import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../api";

// mapăm slug-urile din URL la denumirile exact cum sunt în DB
const SLUG_TO_CATEGORY: Record<string, string> = {
  "apartamente": "Apartamente",
  "case": "Case",
  "terenuri": "Terenuri",
  "garsoniere": "Garsoniere",
  "garaje": "Garaje",
  "spatiu-comercial": "Spațiu comercial",
};

export default function Categories() {
  const { categorie: slug } = useParams();
  const categoryName = useMemo(
    () => SLUG_TO_CATEGORY[slug?.toLowerCase() || ""] || (slug || ""),
    [slug]
  );

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");

    const url = `${API_URL}/listings?category=${encodeURIComponent(categoryName)}`;
    console.log("[CATEGORIES] fetch:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch((e) => setErr(e.message || "Eroare necunoscută"))
      .finally(() => setLoading(false));
  }, [categoryName]);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;
  if (err) return <p className="text-center py-10 text-red-600">Eroare: {err}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

        {listings.length === 0 ? (
          <div className="bg-white border rounded-xl p-6 text-gray-600">
            Nu există anunțuri pentru această categorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((l) => (
              <Link
                key={l._id}
                to={`/anunt/${l._id}`}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={l.images?.[0] || l.imageUrl || "/no-image.jpg"}
                  alt={l.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{l.title}</h3>
                  <p className="text-blue-600 font-bold mt-1">{l.price} €</p>
                  <p className="text-sm text-gray-500 mt-1">{l.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
