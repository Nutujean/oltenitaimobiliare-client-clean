import { useEffect, useState } from "react";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        console.log("📦 Anunțuri primite din backend:", data);

        // aici poți filtra după userEmail dacă vezi că se salvează corect
        // const myListings = data.filter((listing) => listing.userEmail === userEmail);
        // setListings(myListings);

        // pentru test → afișăm toate
        setListings(data);
      } catch (err) {
        console.error("❌ Eroare la preluarea anunțurilor:", err);
      }
    };

    fetchListings();
  }, [userEmail]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Anunțurile Mele</h2>
      {listings.length === 0 ? (
        <p>Nu ai anunțuri încă.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing._id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{listing.title}</h3>
              <p>{listing.description}</p>
              <p className="text-blue-600 font-bold">{listing.price} €</p>
              <p className="text-gray-500">{listing.location}</p>
              {listing.images?.length > 0 && (
                <img src={listing.images[0]} alt={listing.title} className="mt-2 rounded" />
              )}
              <p className="text-sm text-gray-400">Creat de: {listing.userEmail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
