import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const navigate = useNavigate();
  const id = rawId?.split("-").pop?.();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err.message || "Eroare la încărcare");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const goBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  };

  if (loading)
    return <p className="p-6 text-gray-600">Se încarcă detaliile anunțului...</p>;

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={goBack}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          ← Înapoi la anunțuri
        </button>
      </div>
    );

  if (!listing)
    return (
      <div className="p-6 text-center">
        <p>Anunțul nu există.</p>
        <button
          onClick={goBack}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          ← Înapoi la anunțuri
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      {/* 🔵 Buton plutitor (sus stânga) */}
      <button
        onClick={goBack}
        style={{
          position: "fixed",
          top: "90px",
          left: "20px",
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          borderRadius: "50px",
          fontWeight: "bold",
          fontSize: "15px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 9999,
          cursor: "pointer",
        }}
      >
        ← Înapoi
      </button>

      {/* Titlu */}
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {/* Imagine */}
      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-6 shadow"
        />
      )}

      {/* Preț + descriere */}
      <p className="text-2xl font-semibold text-blue-600 mb-2">
        {listing.price} €
      </p>
      <p className="mt-4 text-gray-700">{listing.description}</p>
      <p className="text-gray-600 mt-2">Locație: {listing.location}</p>
      <p className="text-gray-600 mb-6">Categorie: {listing.category}</p>

      {/* Telefon clicabil */}
      {listing.phone && (
        <a
          href={`tel:${listing.phone}`}
          style={{
            display: "inline-block",
            background: "#16a34a",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
            marginBottom: "10px",
          }}
        >
          📞 Sună: {listing.phone}
        </a>
      )}

      {/* Distribuie */}
      <div style={{ marginTop: "30px" }}>
        <p className="text-gray-600 mb-2 font-semibold">Distribuie anunțul:</p>
        <div className="flex gap-3 flex-wrap">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#1877f2",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25d366",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
