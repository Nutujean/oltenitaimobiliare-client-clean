// src/pages/AnunturileMele.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

// 🔧 helper: normalizare telefon exact ca în backend
function normalizePhone(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  return digits.replace(/^4/, "");
}

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userPhoneRaw = localStorage.getItem("userPhone");

    if (!token || !userPhoneRaw || userPhoneRaw === "undefined" || userPhoneRaw === "null") {
      setMessage("Trebuie să fii autentificat pentru a vedea anunțurile tale.");
      navigate("/login");
      return;
    }

    // (îl păstrez, chiar dacă nu-l folosești acum)
    normalizePhone(userPhoneRaw);

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        setMessage("⏳ Se încarcă anunțurile tale...");

        const res = await fetch(`${API_URL}/listings/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțurilor.");

        const arr = Array.isArray(data) ? data : [];
        setListings(arr);

        if (arr.length === 0) setMessage("Momentan nu ai niciun anunț.");
        else setMessage("");
      } catch (err) {
        console.error("Eroare la încărcarea anunțurilor mele:", err);
        setMessage(err.message || "A apărut o eroare la încărcarea anunțurilor.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [navigate]);

  const handleAdaugaAnunt = () => navigate("/adauga-anunt");

  // 🗑️ Ștergere anunț
  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest anunț?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Trebuie să fii autentificat pentru a șterge un anunț.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergerea anunțului.");

      setListings((prev) => prev.filter((l) => l._id !== id));
      setMessage("✅ Anunțul a fost șters cu succes.");
    } catch (err) {
      console.error("Eroare la ștergere anunț:", err);
      setMessage(err.message || "A apărut o eroare la ștergerea anunțului.");
    }
  };

  // ⭐ Plătește/Publică (pentru draft) / Promovează (pentru public)
  const handlePayOrPromote = (id) => {
    // păstrăm flow-ul tău existent: detaliu anunț
    navigate(`/anunt/${id}`);
  };

  const { drafts, published } = useMemo(() => {
    const d = [];
    const p = [];
    for (const l of listings) {
      if (l?.visibility === "draft") d.push(l);
      else p.push(l); // include și anunțurile vechi fără visibility
    }
    return { drafts: d, published: p };
  }, [listings]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Anunțurile mele</h1>
        <p>{message || "Se încarcă..."}</p>
      </div>
    );
  }

  const Card = ({ listing, isDraft }) => (
    <div className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-blue-700 mb-1">{listing.title}</h2>

          {isDraft && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
              DRAFT (nepublicat)
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-2">
          {listing.location} • {listing.category}
        </p>

        <p className="font-bold text-green-700 mb-2">
          {listing.price ? `${listing.price} €` : "Preț la cerere"}
        </p>

        <p className="text-sm text-gray-700 line-clamp-3">{listing.description}</p>

        {isDraft && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm">
            Acest anunț este salvat ca <b>Draft</b> și nu apare pe prima pagină.
            Apasă <b>„Plătește și publică”</b> ca să îl faci public.
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/anunt/${listing._id || listing.id}`}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Vezi detalii
        </Link>

        <Link
  to={`/editeaza-anunt/${String(listing._id || listing.id || "")}`}
  className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
>
  Editează
</Link>

        <button
          type="button"
          onClick={() => handlePayOrPromote(listing._id || listing.id)}
          className={`text-sm px-3 py-2 rounded-lg text-white ${
            isDraft ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {isDraft ? "Plătește și publică" : "Promovează"}
        </button>

        <button
          type="button"
          onClick={() => handleDelete(listing._id || listing.id)}
          className="text-sm px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Șterge
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <button
          onClick={handleAdaugaAnunt}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Adaugă un anunț nou
        </button>
      </div>

      {message && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 whitespace-pre-line">
          {message}
        </div>
      )}

      {/* DRAFTURI */}
      {drafts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Drafturi (nepublicate)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((l) => (
              <Card key={l._id} listing={l} isDraft />
            ))}
          </div>
        </div>
      )}

      {/* PUBLICATE */}
      <div>
        <h2 className="text-lg font-bold mb-3">Anunțuri publicate</h2>

        {published.length === 0 ? (
          <p className="text-gray-600">Momentan nu ai anunțuri publicate.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {published.map((l) => (
              <Card key={l._id} listing={l} isDraft={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
