import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
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

  // Lista de imagini: slider dacă sunt mai multe
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

      {/* Galerie imagini */}
      <div className="relative mb-6">
        {listing.status === "rezervat" && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Rezervat
          </span>
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

      {/* Distribuire anunț */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Distribuie anunțul:</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Facebook
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            Telegram
          </a>
          <a
            href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* Acțiuni - doar pentru user logat */}
      {isLoggedIn && (
        <div className="flex space-x-4 mt-6">
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
