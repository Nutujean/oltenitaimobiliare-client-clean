import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțurilor mele:", error);
      }
    };

    fetchMyListings();
  }, []);

  if (listings.length === 0) {
    return <p className="text-center py-8">Nu ai încă anunțuri.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anunțurile Mele</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <img
              src={
                listing.imageUrl ||
                (listing.images && listing.images[0]) ||
                "https://via.placeholder.com/400x250?text=Imagine"
              }
              alt={listing.title}
              className="h-40 w-full object-cover rounded mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-600 mb-2">{listing.price} €</p>

            <div className="mt-auto flex space-x-2">
              <Link to={`/anunt/${listing._id}`}>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Detalii
                </button>
              </Link>
              <Link to={`/editeaza-anunt/${listing._id}`}>
                <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Editează
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
