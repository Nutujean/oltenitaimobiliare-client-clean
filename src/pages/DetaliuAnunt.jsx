import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://oltenitaimobiliare-backend.onrender.com/api";

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const id = rawId?.split("-").pop(); // extrage doar ObjectId-ul real

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Anunțul nu a fost găsit.");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Se încarcă detaliile anunțului...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Eroare</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Înapoi la pagina principală
        </Link>
      </div>
    );

  if (!listing)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Anunțul nu a fost găsit.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Titlu + badge promovare */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        {listing.featuredUntil && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
            🌟 Anunț promovat
          </span>
        )}
      </div>

      {/* Galerie imagini */}
      {listing.images?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {listing.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Imagine ${idx + 1}`}
              className="rounded-xl shadow-md w-full h-64 object-cover"
            />
          ))}
        </div>
      )}

      {/* Detalii anunț */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <p><strong>Preț:</strong> {listing.price} €</p>
        <p><strong>Tip:</strong> {listing.category}</p>
        <p><strong>Localitate:</strong> {listing.location}</p>
        <p className="mt-4 text-gray-800 whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {/* Info proprietar */}
      {listing.user && (
        <div className="bg-gray-50 rounded-xl p-4 border">
          <h3 className="font-semibold mb-2">Detalii proprietar:</h3>
          <p>{listing.user.name}</p>
          <p className="text-gray-600">{listing.user.email}</p>
        </div>
      )}

      {/* Buton înapoi */}
      <div className="mt-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Înapoi la anunțuri
        </Link>
      </div>
    </div>
  );
}
