import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AnunturileMele() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const isLoggedIn = !!localStorage.getItem("token");

  const optimizeImage = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMyListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchMyListings();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Helmet>
          <title>Anunțurile mele - Oltenița Imobiliare</title>
        </Helmet>
        <p className="text-gray-600 text-lg">
          Trebuie să fii logat pentru a vedea <b>Anunțurile Mele</b>.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Mergi la Login
        </button>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setListings((prev) => prev.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Eroare la ștergere:", error);
      }
    }
  };

  const handleToggleReserve = async (id, currentStatus) => {
    const newStatus = currentStatus === "rezervat" ? "disponibil" : "rezervat";
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setListings((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Eroare la actualizare:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>Anunțurile mele - Oltenița Imobiliare</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Anunțurile Mele</h1>
      {listings.length === 0 ? (
        <p>Nu ai adăugat încă niciun anunț.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="relative border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
            >
              {listing.status === "rezervat" && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Rezervat
                </span>
              )}

              <div className="flex space-x-2 overflow-x-auto mb-4">
                {listing.images && listing.images.length > 0 ? (
                  listing.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={optimizeImage(img)}
                      alt={`Imagine ${idx + 1}`}
                      className="w-24 h-20 object-cover rounded"
                    />
                  ))
                ) : (
                  <img
                    src={
                      listing.imageUrl ||
                      "https://via.placeholder.com/100x80?text=Fără+imagine"
                    }
                    alt={listing.title}
                    className="w-24 h-20 object-cover rounded"
                  />
                )}
              </div>

              <h2 className="text-lg font-bold mb-1">{listing.title}</h2>

              {listing.category && (
                <Link
                  to={`/anunturi?categorie=${listing.category}`}
                  className="text-sm text-gray-500 hover:underline block mb-2 capitalize"
                >
                  {listing.category}
                </Link>
              )}

              <p className="text-gray-600 mb-2">Preț: {listing.price} €</p>

              <div className="flex flex-col space-y-2 mt-3">
                <Link
                  to={`/editeaza-anunt/${listing._id}`}
                  className="px-3 py-1 text-center bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Editează
                </Link>

                <button
                  onClick={() => handleDelete(listing._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Șterge
                </button>

                <button
                  onClick={() => handleToggleReserve(listing._id, listing.status)}
                  className={`px-3 py-1 text-white rounded transition ${
                    listing.status === "rezervat"
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {listing.status === "rezervat"
                    ? "Marchează disponibil"
                    : "Rezervat"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
