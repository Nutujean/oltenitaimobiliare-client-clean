import { useEffect, useState } from "react";
import API_URL from "../api";
import ListingCard from "../components/ListingCard";

export default function Garsoniere() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings?category=Garsoniere`);
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Eroare la preluarea anunțurilor:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center py-10">Se încarcă...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Garsoniere de vânzare și închiriere
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500">Momentan nu există garsoniere disponibile.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
