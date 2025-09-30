import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [favorites, setFavorites] = useState([]);
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

    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/favorites`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setFavorites(data.map((fav) => fav._id));
      } catch (error) {
        console.error("Eroare la favorite:", error);
      }
    };

    fetchListing();
    fetchFavorites();
  }, [id, isLoggedIn]);

  const toggleFavorite = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/favorites/${listingId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Eroare la toggle favorite:", error);
    }
  };

  if (!listing) return <p className="text-center py-8">Se încarcă...</p>;

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.imageUrl || "https://via.placeholder.com/600x400?text=Imagine"];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Buton Înapoi */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition"
      >
        ← Înapoi
      </button>

      {/* Titlu + ❤️ */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        {isLoggedIn && (
          <button
            onClick={() => toggleFavorite(listing._id)}
            className="text-3xl"
          >
            {favorites.includes(listing._id) ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      {/* Categoria */}
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

      {/* Galerie imagini */}
      <div className="relative mb-6">
        {listing.status === "rezervat" && (
          <div className="absolute top-4 -left-10 bg-yellow-500 text-white text-xs font-bold px-12 py-1 transform -rotate-45 shadow-md">
            Rezervat
          </div>
        )}
        <img
          src={images[currentImage]}
          alt={`Imagine ${currentImage + 1}`}
          className="w-full h-80 object-cover rounded-lg"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded hover:bg-opacity-90"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded hover:bg-opacity-90"
            >
              ›
            </button>
          </>
        )}
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

      {/* Contact vânzător */}
      <div className="mb-6">
        <button
          onClick={() => setShowPhone(!showPhone)}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {showPhone ? "Ascunde telefonul" : "Contactează vânzătorul"}
        </button>
        {showPhone && (
          <p className="mt-3 text-lg font-semibold text-gray-800">
            📞 Telefon: {listing.phone || "07xx xxx xxx"}
          </p>
        )}
      </div>

      {/* Acțiuni doar pt user logat */}
      {isLoggedIn && (
        <div className="flex space-x-4 mt-6">
          <Link to={`/editeaza-anunt/${listing._id}`}>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
              Editează
            </button>
          </Link>
          <button
            onClick={async () => {
              if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
                await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                navigate("/");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Șterge
          </button>
          <button
            onClick={async () => {
              await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: "rezervat" }),
              });
              setListing((prev) => ({ ...prev, status: "rezervat" }));
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Marchează ca rezervat
          </button>
        </div>
      )}
    </div>
  );
}
