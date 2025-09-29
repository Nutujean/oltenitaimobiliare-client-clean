import { useEffect, useState } from "react";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/listings/user/${email}`
        );
        if (!res.ok) throw new Error("Nu s-au putut încărca anunțurile mele");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchMyListings();
  }, [email]);

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setListings((prev) => prev.filter((l) => l._id !== id));
  };

  const handleRezervat = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/listings/${id}/rezervat`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const updated = await res.json();
    setListings((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, rezervat: updated.rezervat } : l
      )
    );
  };

  if (loading) return <p className="text-center mt-4">Se încarcă...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!listings.length) return <p className="text-center mt-4">Nu ai anunțuri încă.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Anunțurile Mele</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="border rounded p-4 shadow bg-white">
            <h3 className="font-bold">{listing.title}</h3>
            {listing.images?.length > 0 && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="rounded mt-2 h-40 w-full object-cover"
              />
            )}
            <p>{listing.price} EUR</p>
            <p>{listing.location}</p>
            <p>{listing.rezervat ? "✅ Rezervat" : "Disponibil"}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => alert("Editează va fi implementat")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editează
              </button>
              <button
                onClick={() => handleDelete(listing._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Șterge
              </button>
              <button
                onClick={() => handleRezervat(listing._id)}
                className={`${
                  listing.rezervat ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
                } text-white px-3 py-1 rounded`}
              >
                {listing.rezervat ? "Rezervat" : "Marchează rezervat"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
