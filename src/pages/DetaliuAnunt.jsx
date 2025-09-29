import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțului:", error);
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        navigate("/");
      } catch (error) {
        console.error("Eroare la ștergere:", error);
      }
    }
  };

  const handleReserve = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "rezervat" }),
      });
      setListing((prev) => ({ ...prev, status: "rezervat" }));
      alert("Anunțul a fost marcat ca rezervat ✅");
    } catch (error) {
      console.error("Eroare la actualizare:", error);
    }
  };

  if (!listing) return <p className="text-center py-8">Se încarcă...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Buton Înapoi */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        ← Înapoi
      </button>

      {/* Titlu */}
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>

      {/* Categoria cu link */}
      {listing.category && (
        <p className="text-gray-500 mb-4">
          Categoria:{" "}
          <Link
            to={`/anunturi?categorie=${listing.category}`}
            className="font-semibold capitalize text-blue-600 hover:underline"
          >
            {listing.category}
          </Link>
        </p>
      )}

      {/* Imagine + badge Rezervat */}
      <div className="relative mb-6">
        {listing.status === "rezervat" && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Rezervat
          </span>
        )}
        <img
          src={
            listing.imageUrl ||
            (listing.images && listing.images[0]) ||
            "https://via.placeholder.com/600x400?text=Imagine"
          }
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg"
        />
      </div>

      {/* Detalii */}
      <p className="text-gray-700 mb-4">{listing.description}</p>
      <p className="text-xl font-semibold mb-2">{listing.price} €</p>
      {listing.status && (
        <p className="mb-6">
          Status:{" "}
          <span
            className={`font-bold ${
              listing.status === "rezervat" ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {listing.status}
          </span>
        </p>
      )}

      {/* Acțiuni - vizibile doar pentru user logat */}
      {isLoggedIn && (
        <div className="flex space-x-4">
          <Link to={`/editeaza-anunt/${listing._id}`}>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
              Editează
            </button>
          </Link>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Șterge
          </button>

          <button
            onClick={handleReserve}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Rezervat
          </button>
        </div>
      )}
    </div>
  );
}
