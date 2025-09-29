import { useEffect, useState } from "react";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email"); // salvat la login/register

  // Preia toate anunțurile și filtrează doar pe cele ale userului logat
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
        const data = await res.json();
        const userListings = data.filter(
          (listing) => listing.userEmail === userEmail
        );
        setListings(userListings);
      } catch (err) {
        console.error("❌ Eroare la preluarea anunțurilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userEmail]);

  // Ștergere anunț
  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest anunț?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Eroare la ștergere!");

      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Nu s-a putut șterge anunțul!");
    }
  };

  // Editare anunț (simplu: prompt pentru titlu nou)
  const handleEdit = async (id) => {
    const newTitle = prompt("Introdu titlul nou:");
    if (!newTitle) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error("Eroare la editare!");

      const updated = await res.json();
      setListings(
        listings.map((l) => (l._id === id ? updated.updated : l))
      );
    } catch (err) {
      console.error(err);
      alert("❌ Nu s-a putut edita anunțul!");
    }
  };

  if (loading) return <p className="text-center mt-6">Se încarcă...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Anunțurile Mele</h2>

      {listings.length === 0 ? (
        <p>Nu ai anunțuri încă.</p>
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <li
              key={listing._id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{listing.title}</h3>
                <p>{listing.price} €</p>
                <p className="text-sm text-gray-500">{listing.location}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(listing._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editează
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Șterge
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
