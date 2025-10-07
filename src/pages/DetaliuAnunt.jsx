// src/pages/DetaliuAnunt.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function DetaliuAnunt() {
  const { id: rawId } = useParams();
  const id = rawId?.split("-").pop?.(); // acceptează slug-uri de tip title-id
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Se încarcă detaliile anunțului...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Eroare</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Înapoi la pagina principală
        </Link>
      </div>
    );

  if (!listing)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Anunțul nu a fost găsit.</p>
      </div>
    );

  // helper share message
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${listing.title} — ${listing.price} € · ${listing.location}\nVezi anunțul: ${pageUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    pageUrl
  )}&quote=${encodeURIComponent(listing.title)}`;
  // pentru WhatsApp: wa.me requires number in international format OR use text only
  const whatsappNumber = listing.phone ? listing.phone.replace(/\s+/g, "") : "";
  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/^\+/, "")}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`; // fallback: doar mesaj

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: shareText,
          url: pageUrl,
        });
      } catch (e) {
        // user cancelled or error
        console.info("Share cancelled or failed", e);
      }
    } else {
      // fallback: copiem linkul în clipboard
      try {
        await navigator.clipboard.writeText(pageUrl);
        alert("Link copiat în clipboard. Poți lipi și partaja manual.");
      } catch {
        alert("Partajare indisponibilă. Copiază manual URL-ul.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <p className="text-2xl font-semibold text-blue-600 mb-2">
            {listing.price} €
          </p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{listing.description}</p>
          <p className="text-gray-600 mt-4">Locație: {listing.location}</p>
          <p className="text-gray-600">Categorie: {listing.category}</p>
        </div>

        {/* CARD CONTACT + SHARE */}
        <aside className="w-full md:w-80 bg-white border rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Contact</h3>

          {/* Telefon clicabil */}
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

          {/* optional: nume (doar dacă vrei să afișezi numele, dar nu emailul) */}
          {listing.user?.name && (
            <p className="text-gray-700 text-sm mb-3">Proprietar: {listing.user.name}</p>
          )}

          {/* Share buttons */}
          <div className="mt-3 border-t pt-3 flex flex-col gap-2">
            <button
              onClick={handleNativeShare}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
            >
              Distribuie (telefon)
            </button>

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

            {/* Copiere link */}
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(pageUrl);
                  alert("Linkul anunțului a fost copiat în clipboard.");
                } catch {
                  alert("Nu s-a putut copia automat. Copiază manual URL-ul.");
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
