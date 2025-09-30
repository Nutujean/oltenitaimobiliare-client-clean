import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("❌", err);
      }
    };
    fetchListing();
  }, [id]);

  if (!listing) {
    return <p className="text-center py-10">Se încarcă...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={
          listing.imageUrl && listing.imageUrl !== "undefined"
            ? listing.imageUrl
            : "https://via.placeholder.com/600x400?text=Fără+imagine"
        }
        alt={listing.title}
        className="w-full h-80 object-cover rounded mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      <p className="text-xl text-green-700 font-semibold mb-2">
        <strong>Preț:</strong> {listing.price} €
      </p>

      <p className="text-gray-700 mb-4">{listing.description}</p>

      {listing.location && (
        <p className="text-gray-600 mb-2">
          <strong>Locație:</strong> {listing.location}
        </p>
      )}

      {listing.phone && (
        <p className="text-gray-600 mb-2">
          <strong>Telefon:</strong>{" "}
          <a
            href={`tel:${listing.phone}`}
            className="text-blue-600 hover:underline"
          >
            {listing.phone}
          </a>
        </p>
      )}

      <p className="text-sm text-gray-500 capitalize">
        Categorie: {listing.category || "Nespecificat"}
      </p>
      <p className="text-sm text-gray-500">
        Status: {listing.status || "disponibil"}
      </p>
    </div>
  );
}
