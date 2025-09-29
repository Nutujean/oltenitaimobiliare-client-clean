import { useEffect, useState } from "react";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });

  const userEmail = localStorage.getItem("email");

  const fetchListings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
      const data = await res.json();

      console.log("📦 Toate anunțurile:", data);
      console.log("📧 User logat:", userEmail);

      // filtrăm doar cele ale userului logat
      const myListings = data.filter(
        (listing) => listing.userEmail === userEmail
      );

      setListings(myListings);
    } catch (err) {
      console.error("❌ Eroare la preluarea anunțurilor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [userEmail]);

  const handleDelete = async (id) => {
    if (!confirm("Ești sigur că vrei să ștergi acest anunț?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setListings(listings.filter((l) => l._id !== id));
      }
    } catch (err) {
      console.error("❌ Eroare la ștergere:", err);
    }
  };

  const handleRezervat = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/listings/${id}/rezervat`,
        {
          method: "PATCH",
        }
      );
      if (res.ok) {
        fetchListings();
      }
    } catch (err) {
      console.error("❌ Eroare la schimbarea statusului:", err);
    }
  };

  const startEdit = (listing) => {
    setEditingId(listing._id);
    setFormData({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingId(null);
        fetchListings();
      }
    } catch (err) {
      console.error("❌ Eroare la actualizare:", err);
    }
  };

  if (loading) {
    return <p className="p-6">Se încarcă anunțurile tale...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Anunțurile Mele</h2>
      {listings.length === 0 ? (
        <p>Nu ai anunțuri încă.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing._id} className="border rounded p-4 shadow">
              {editingId === listing._id ? (
                // Formular editare
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Salvează
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Anulează
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{listing.title}</h3>
                  <p>{listing.description}</p>
                  <p className="text-blue-600 font-bold">{listing.price} €</p>
                  <p className="text-gray-500">{listing.location}</p>

                  {listing.images?.length > 0 && (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="mt-2 rounded"
                    />
                  )}

                  <p className="text-sm text-gray-400 mt-2">
                    Status:{" "}
                    {listing.rezervat ? (
                      <span className="text-red-500 font-bold">Rezervat</span>
                    ) : (
                      <span className="text-green-600 font-bold">Disponibil</span>
                    )}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleRezervat(listing._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      {listing.rezervat
                        ? "Marchează Disponibil"
                        : "Marchează Rezervat"}
                    </button>
                    <button
                      onClick={() => startEdit(listing)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editează
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Șterge
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
