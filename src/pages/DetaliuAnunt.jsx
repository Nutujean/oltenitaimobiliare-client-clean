import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Nu s-a putut încărca anunțul.");
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

  if (loading) return <p className="text-center mt-4">Se încarcă...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!listing) return <p className="text-center mt-4">Anunțul nu există.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{listing.title}</h2>

      {listing.images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {listing.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${listing.title} - poza ${index + 1}`}
              className="w-full h-80 object-cover rounded"
            />
          ))}
        </div>
      )}

      <p className="text-lg">{listing.description}</p>
      <p className="text-xl font-bold mt-2">{listing.price} EUR</p>
      <p className="text-gray-600">{listing.category} | {listing.location}</p>
      <p className="mt-2">
        {listing.rezervat ? "✅ Rezervat" : "🟢 Disponibil"}
      </p>

      <div className="mt-6">
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Înapoi la anunțuri
        </Link>
      </div>
    </div>
  );
}
