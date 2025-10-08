import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function DetaliuAnunt() {
  const navigate = useNavigate();
  const { id: rawId } = useParams();
  const id = rawId?.split("-").pop(); // ✅ extrage doar ObjectId-ul real

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Eroare la încărcarea anunțului.");
        setListing(data);
        setSelectedImg(data.images?.[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 🗑️ ștergere anunț
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Sigur vrei să ștergi acest anunț?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Nu ești autentificat.");

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Eroare la ștergerea anunțului.");

      alert("✅ Anunț șters cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // 🔗 distribuire pe WhatsApp / Facebook
  const shareWhatsApp = () => {
    const text = `Vezi acest anunț pe Oltenița Imobiliare: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">
        Se încarcă anunțul...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Eroare</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Înapoi la anunțuri
        </Link>
      </div>
    );

  if (!listing)
    return (
      <div className="p-10 text-center text-gray-600">
        Anunțul nu a fost găsit.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Titlu + promovare */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        {listing.featuredUntil && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
            🌟 Anunț promovat
          </span>
        )}
      </div>

      {/* Galerie principală */}
      {selectedImg && (
        <img
          src={selectedImg}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-4 shadow"
        />
      )}

      {/* Miniaturi */}
      {listing.images?.length > 1 && (
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {listing.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Imagine ${idx + 1}`}
              className={`h-20 w-28 object-cover rounded cursor-pointer border ${
                selectedImg === img
                  ? "border-blue-600 shadow"
                  : "border-gray-200 hover:opacity-80"
              }`}
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>
      )}

      {/* Detalii */}
      <p className="text-2xl text-blue-700 font-semibold mb-2">
        {listing.price} €
      </p>
      <p className="text-gray-700 mb-4">{listing.description}</p>
      <p className="text-gray-600 mb-1">
        <strong>Locație:</strong> {listing.location}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Categorie:</strong> {listing.category}
      </p>

      {/* Telefon clicabil */}
      {listing.phone && (
        <p className="text-lg mt-4">
          📞{" "}
          <a
            href={`tel:${listing.phone}`}
            className="text-blue-600 hover:underline"
          >
            {listing.phone}
          </a>
        </p>
      )}

      {/* Butoane distribuire */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={shareWhatsApp}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          📲 Distribuie pe WhatsApp
        </button>
        <button
          onClick={shareFacebook}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📘 Distribuie pe Facebook
        </button>
      </div>

      {/* Butoane acțiune */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          to={`/editeaza-anunt/${id}`}
          className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100"
        >
          ✏️ Editează
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded border bg-red-100 hover:bg-red-200 text-red-800 disabled:opacity-50"
        >
          🗑️ {deleting ? "Se șterge..." : "Șterge"}
        </button>

        <Link
          to={`/promoveaza/${id}`}
          className="px-4 py-2 rounded border bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
        >
          💎 Promovează
        </Link>

        <Link
          to="/anunturile-mele"
          className="px-4 py-2 rounded border bg-blue-100 hover:bg-blue-200 text-blue-800"
        >
          ← Înapoi la anunțurile mele
        </Link>
      </div>
    </div>
  );
}
