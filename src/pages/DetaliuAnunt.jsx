import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțului");
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");
      alert("✅ Anunț șters cu succes.");
      navigate("/anunturile-mele");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Se încarcă anunțul...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
        <div className="mt-4">
          <Link to="/" className="text-blue-600 underline">
            Înapoi la acasă
          </Link>
        </div>
      </div>
    );

  if (!listing) return <p className="text-center mt-10">Anunț inexistent.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded border hover:bg-gray-50 text-gray-700"
      >
        ← Înapoi
      </button>

      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {/* 🔹 Galerie imagini cu săgeți */}
      {listing.images?.length > 0 && (
        <div className="relative mb-6">
          <img
            src={listing.images[currentImage]}
            alt={`Imagine ${currentImage + 1}`}
            className="w-full h-80 object-cover rounded-lg shadow"
          />

          {/* 🔹 Săgeți navigare */}
          {listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
              >
                →
              </button>

              {/* 🔹 Indicatori buline jos */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {listing.images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${
                      i === currentImage ? "bg-white" : "bg-gray-400/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 🔹 Detalii anunț */}
      <p className="text-2xl font-semibold text-blue-700 mb-3">
        {listing.price} €
      </p>

      <p className="text-gray-700 mb-2">{listing.description}</p>
      <p className="text-sm text-gray-500">
        <strong>Locație:</strong> {listing.location}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        <strong>Categorie:</strong> {listing.category}
      </p>

      {/* 🔹 Telefon clicabil */}
      {listing.phone && (
        <p className="text-lg font-semibold mb-4">
          📞{" "}
          <a
            href={`tel:${listing.phone}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {listing.phone}
          </a>
        </p>
      )}

      {/* 🔹 Distribuire socială */}
      <div className="flex gap-3 mb-6">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
        >
          Distribuie pe Facebook
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Vezi acest anunț: ${window.location.href}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
        >
          Trimite pe WhatsApp
        </a>
      </div>

      {/* 🔹 Butoane proprietar */}
      {user &&
        listing.user &&
        (String(user._id) === String(listing.user._id) ||
          String(user._id) === String(listing.user)) && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate(`/editeaza-anunt/${listing._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Editează
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Șterge
            </button>
          </div>
        )}
    </div>
  );
}
