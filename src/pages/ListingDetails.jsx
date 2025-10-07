import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error("❌ Eroare la fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-600">Se încarcă...</p>;
  if (!listing) return <p className="p-6 text-red-600">Anunțul nu există.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}
      <p className="text-2xl font-semibold text-blue-600">{listing.price} €</p>
      <p className="mt-4 text-gray-700">{listing.description}</p>
      <p className="text-gray-600 mt-2">Locație: {listing.location}</p>
      <p className="text-gray-600">Categorie: {listing.category}</p>
    </div>
  );
}