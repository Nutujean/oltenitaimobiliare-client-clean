import { useEffect, useState } from "react";
import API_URL from "../api";
import ListingCard from "../components/ListingCard";
import { Helmet } from "react-helmet-async";

export default function SpatiiComerciale() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings?category=Spatii comerciale`);
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
    <>
      <Helmet>
        <title>Spații comerciale de vânzare sau închiriere în Oltenița | Oltenița Imobiliare</title>
        <meta
          name="description"
          content="Vezi spații comerciale de vânzare sau închiriere în Oltenița și împrejurimi. Anunțuri imobiliare actualizate pentru magazine, birouri și alte spații comerciale."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Spații comerciale de vânzare sau închiriere
        </h1>

        {listings.length === 0 ? (
          <p className="text-center text-gray-500">
            Momentan nu există anunțuri.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}