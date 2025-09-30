import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error("Eroare:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;

  if (!listing)
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Anunțul nu a fost găsit.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Înapoi
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>{listing.title} - Oltenița Imobiliare</title>
        <meta
          name="description"
          content={`Detalii despre ${listing.title}, preț: ${listing.price} €`}
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {/* Galerie imagini */}
      <div className="mb-6">
        {listing.images && listing.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listing.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Imagine ${idx + 1}`}
                className="w-full h-64 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          <img
            src="https://via.placeholder.com/800x400?text=Fără+imagine"
            alt="Fără imagine"
            className="w-full h-64 object-cover rounded"
          />
        )}
      </div>

      {/* Detalii */}
      <p className="text-lg mb-2">
        <strong>Preț:</strong> {listing.price} €
      </p>
      <p className="text-gray-700 mb-4">{listing.description}</p>

      {listing.phone && (
        <p className="text-gray-800 font-semibold mb-4">
          📞 Telefon: {listing.phone}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Înapoi
        </button>
      </div>
    </div>
  );
}
