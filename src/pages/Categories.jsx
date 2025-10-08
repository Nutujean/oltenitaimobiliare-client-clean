import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../api";
import slugify from "../utils/slugify.js";

const SLUG_TO_CATEGORY = {
  apartamente: "Apartamente",
  case: "Case",
  terenuri: "Terenuri",
  garsoniere: "Garsoniere",
  garaje: "Garaje",
  "spatiu-comercial": "Spațiu comercial",
};

const LOCATII = [
  "Oltenita", "Chirnogi", "Ulmeni", "Mitreni", "Clatesti", "Spantov", "Cascioarele",
  "Soldanu", "Negoiesti", "Valea Rosie", "Radovanu", "Chiselet", "Manastirea", "Budesti",
];

export default function Categories() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const categoryName = SLUG_TO_CATEGORY[slug] || "";

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const sp = new URLSearchParams();
        if (categoryName) sp.set("category", categoryName);
        if (q) sp.set("q", q);
        if (city) sp.set("location", city);
        if (sort) sp.set("sort", sort);

        const res = await fetch(`${API_URL}/listings?${sp.toString()}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Eroare la încărcare:", e);
      }
    };

    fetchItems();
  }, [slug, q, city, sort]);

  const getImage = (l) =>
    Array.isArray(l.images) && l.images.length > 0
      ? l.images[0]
      : "https://via.placeholder.com/400x250?text=Fara+imagine";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="border px-3 py-1 rounded hover:bg-gray-50"
        >
          ← Înapoi
        </button>
        <h1 className="text-2xl font-bold">{categoryName}</h1>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-600">Nu există anunțuri în această categorie.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((l) => {
            const isFeatured =
              l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now();

            return (
              <Link
                key={l._id}
                to={`/anunt/${slugify(l.title)}-${l._id}`}
                className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={getImage(l)}
                  alt={l.title}
                  className="w-full h-52 object-cover"
                />

                {/* Badge PROMOVAT vizibil public */}
                {isFeatured && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                    PROMOVAT
                  </span>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{l.title}</h3>
                  <p className="text-blue-700 font-semibold">{l.price} €</p>
                  <p className="text-sm text-gray-500">{l.location}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
