import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Anunturi() {
  const [listings, setListings] = useState([]);

  const optimizeImage = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor:", error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>Anunțuri imobiliare - Oltenița Imobiliare</title>
        <meta
          name="description"
          content="Toate anunțurile de vânzare și închiriere din Oltenița și împrejurimi."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Toate anunțurile</h1>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={
                  listing.images && listing.images.length > 0
                    ? optimizeImage(listing.images[0])
                    : "https://via.placeholder.com/400x250?text=Fără+imagine"
                }
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{listing.title}</h2>
                <p className="text-blue-600 font-semibold mb-4">
                  Preț: {listing.price} €
                </p>
                <Link
                  to={`/anunt/${listing._id}`}
                  className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Detalii
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nu există anunțuri momentan.</p>
      )}
    </div>
  );
}
