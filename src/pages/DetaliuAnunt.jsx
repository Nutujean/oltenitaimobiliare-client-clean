import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const API_URL = import.meta.env.VITE_API_URL;

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_URL}/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        setError("Eroare la încărcarea anunțului.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <p className="p-6">Se încarcă anunțul...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!listing) return <p className="p-6">Anunțul nu a fost găsit.</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ⬅ Înapoi
      </button>

      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      <p className="mb-2"><strong>Preț:</strong> {listing.price} €</p>
      <p className="mb-2"><strong>Locație:</strong> {listing.location}</p>
      <p className="mb-2"><strong>Descriere:</strong> {listing.description}</p>

      {listing.images && listing.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {listing.images.map((img, i) => (
            <img key={i} src={img} alt={`Poza ${i + 1}`} className="rounded-lg shadow" />
          ))}
        </div>
      )}
    </div>
  );
}
