import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AnunturileMele() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchMyListings();
    }
  }, [isLoggedIn]);

  const handleDelete = async (id) => {
    if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchMyListings();
      } catch (error) {
        console.error("Eroare la ștergere:", error);
      }
    }
  };

  const handleReserve = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "rezervat" }),
      });
      fetchMyListings();
    } catch (error) {
      console.error("Eroare la rezervare:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Anunțurile Mele</h1>
        <Link to="/adauga-anunt">
          <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            + Adaugă anunț nou
          </button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-center py-8">
          Nu ai încă anunțuri.{" "}
          <Link to="/adauga-anunt" className="text-blue-600 underline">
            Adaugă primul tău anunț
          </Link>
        </p>
      ) : (
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
              <p className="text-sm text-gray-500 mb-4">
                Status:{" "}
                <span
                  className={`font-bold ${
                    listing.status === "rezervat"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {listing.status}
                </span>
              </p>

              <div className="mt-auto flex flex-wrap gap-2">
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
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Șterge
                </button>
                <button
                  onClick={() => handleReserve(listing._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Rezervat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
