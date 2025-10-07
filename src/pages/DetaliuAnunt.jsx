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
    if (!id) {
      setError("ID invalid.");
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Anunțul nu a fost găsit.");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err.message || "Eroare la încărcarea anunțului.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // 🔙 buton de întoarcere universal
  const goBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <button
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
        <p>Se încarcă detaliile anunțului...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <button
          onClick={goBack}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Eroare</h2>
        <p className="text-gray-700 mb-4">{error}</p>
      </div>
    );

  if (!listing)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <button
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
        <p>Anunțul nu a fost găsit.</p>
      </div>
    );

  // 🔗 Share + telefon
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${listing.title} — ${listing.price} € · ${listing.location}`;
  const encodedText = encodeURIComponent(shareText);
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const whatsappNumber = listing.phone?.replace(/\s+/g, "") || "";
  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/^\+/, "")}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 🔙 Buton Înapoi */}
      <div className="mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
        >
          ← Înapoi la anunțuri
        </button>
      </div>

      {/* 🏠 Titlu + imagine */}
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-6 shadow"
        />
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Stânga: detalii */}
        <div className="flex-1">
          <p className="text-2xl font-semibold text-blue-600 mb-2">
            {listing.price} €
          </p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {listing.description}
          </p>
          <p className="text-gray-600 mt-4">
            <strong>Locație:</strong> {listing.location}
          </p>
          <p className="text-gray-600">
            <strong>Categorie:</strong> {listing.category}
          </p>
        </div>

        {/* Dreapta: contact + share */}
        <aside className="w-full md:w-80 bg-white border rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Contact</h3>

          {listing.phone ? (
            <a
              href={`tel:${listing.phone}`}
              className="block text-lg text-blue-700 font-semibold mb-1 hover:underline"
            >
              {listing.phone}
            </a>
          ) : (
            <p className="text-gray-500 mb-1">Telefon: necunoscut</p>
          )}

          <div className="mt-3 border-t pt-3 flex flex-col gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-block text-center bg-green-500 text-white py-2 rounded-lg font-medium"
            >
              Trimite pe WhatsApp
            </a>

            <a
              href={fbShareUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-block text-center bg-blue-800 text-white py-2 rounded-lg font-medium"
            >
              Distribuie pe Facebook
            </a>

            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(pageUrl);
                  alert("Linkul a fost copiat.");
                } catch {
                  alert("Nu s-a putut copia automat.");
                }
              }}
              className="w-full border border-gray-200 py-2 rounded-lg font-medium"
            >
              Copiază link
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
