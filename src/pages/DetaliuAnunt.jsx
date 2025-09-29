import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțului:", error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) return <p className="text-center py-8">Se încarcă...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Buton Înapoi */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        ← Înapoi
      </button>

      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      <img
        src={
          listing.imageUrl ||
          (listing.images && listing.images[0]) ||
          "https://via.placeholder.com/600x400?text=Imagine"
        }
        alt={listing.title}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />

      <p className="text-gray-700 mb-4">{listing.description}</p>
      <p className="text-xl font-semibold mb-6">{listing.price} €</p>

      {/* Butoane acțiuni */}
      <div className="flex space-x-4">
        <Link to={`/editeaza-anunt/${listing._id}`}>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
            Editează
          </button>
        </Link>

        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Șterge
        </button>

        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Rezervat
        </button>
      </div>
    </div>
  );
}
