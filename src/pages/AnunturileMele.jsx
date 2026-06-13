// src/pages/AnunturileMele.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

function normText(v) {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatLastViewed(dateValue) {
  if (!dateValue) return "Nu există încă";

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "Nu există încă";

  const now = new Date();
  const diffMs = now - d;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return "acum";
  if (diffMinutes < 60) return `acum ${diffMinutes} min`;
  if (diffHours < 24) return `acum ${diffHours} ore`;

  return d.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getInterestBadge(level) {
  if (level === "ridicat") {
    return {
      text: "🔥 Interes ridicat",
      className: "bg-orange-50 border-orange-200 text-orange-800",
      hint: "Promovarea îl poate menține în fața utilizatorilor.",
    };
  }

  if (level === "bun") {
    return {
      text: "🟢 Interes bun",
      className: "bg-green-50 border-green-200 text-green-800",
      hint: "Anunțul generează activitate constantă.",
    };
  }

  return {
    text: "💡 Interes scăzut",
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    hint: "Promovează anunțul pentru mai multă vizibilitate.",
  };
}

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getId = (listing) => String(listing?._id || listing?.id || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userPhoneRaw = localStorage.getItem("userPhone");

    if (!token || !userPhoneRaw || userPhoneRaw === "undefined" || userPhoneRaw === "null") {
      setMessage("Trebuie să fii autentificat pentru a vedea anunțurile tale.");
      navigate("/login");
      return;
    }

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        setMessage("⏳ Se încarcă anunțurile tale...");

        const res = await fetch(API_URL + "/listings/mine-stats", {
          headers: { Authorization: "Bearer " + token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la încărcarea anunțurilor.");

        const arr = Array.isArray(data) ? data : [];
        setListings(arr);
        setMessage(arr.length === 0 ? "Momentan nu ai niciun anunț." : "");
      } catch (err) {
        setMessage(err.message || "A apărut o eroare la încărcarea anunțurilor.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [navigate]);

  const isJobListing = (listing) => {
    const cat = normText(listing?.category);
    const type = normText(listing?.type);
    const section = normText(listing?.section);
    const kind = normText(listing?.kind);

    return (
      section.includes("angaj") ||
      cat.includes("angaj") ||
      type.includes("angaj") ||
      kind.includes("angaj") ||
      cat.includes("job") ||
      type.includes("job") ||
      section.includes("job") ||
      kind.includes("job")
    );
  };

  const getDetailsPath = (listing) => {
    const id = getId(listing);
    if (!id) return "/";
    return isJobListing(listing)
      ? "/angajari?edit=" + encodeURIComponent(id)
      : "/anunt/" + id;
  };

  const getEditPath = (listing) => {
    const id = getId(listing);
    if (!id) return "/";
    return isJobListing(listing)
      ? "/angajari?edit=" + encodeURIComponent(id)
      : "/editeaza-anunt/" + id;
  };

  const handlePayOrPromote = (listing) => {
    const id = getId(listing);
    if (!id) return;

    if (isJobListing(listing)) {
      navigate("/angajari?edit=" + encodeURIComponent(id));
      return;
    }

    navigate("/anunt/" + id);
  };

  const handleReactivateFree = async (listing) => {
    const id = getId(listing);
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API_URL + "/listings/" + id + "/reactivate", {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la reactivare.");

      setListings((prev) =>
        prev.map((l) => (getId(l) === id ? data.listing : l))
      );

      setMessage("✅ Anunțul a fost reactivat gratuit pentru 14 zile.");
    } catch (err) {
      setMessage(err.message || "Eroare la reactivare.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest anunț?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API_URL + "/listings/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergerea anunțului.");

      setListings((prev) => prev.filter((l) => getId(l) !== id));
      setMessage("✅ Anunțul a fost șters cu succes.");
    } catch (err) {
      setMessage(err.message || "A apărut o eroare la ștergerea anunțului.");
    }
  };

  const { drafts, published } = useMemo(() => {
    const d = [];
    const p = [];

    for (const l of listings) {
      if (l?.visibility === "draft") d.push(l);
      else p.push(l);
    }

    return { drafts: d, published: p };
  }, [listings]);

  const Card = ({ listing, isDraft }) => {
    const id = getId(listing);
    const views = Number(listing?.views || 0);
    const weeklyViews = Number(listing?.weeklyViews || 0);
    const interest = getInterestBadge(listing?.interestLevel);

    const isExpired =
      String(listing.status || "").toLowerCase() === "expirat" ||
      (listing.expiresAt && new Date(listing.expiresAt) < new Date());

    const expiredMoreThan30Days =
      listing.expiresAt &&
      new Date() - new Date(listing.expiresAt) > 30 * 24 * 60 * 60 * 1000;

    const daysUntilExpire =
      typeof listing?.daysUntilExpire === "number" ? listing.daysUntilExpire : null;

    const expiryText = isDraft
      ? "Draft nepublicat"
      : isExpired
      ? "Expirat"
      : daysUntilExpire !== null
      ? daysUntilExpire <= 0
        ? "Expiră azi"
        : `Expiră în ${daysUntilExpire} zile`
      : "Valabil";

    const buttonLabel = isDraft
      ? "Plătește și publică"
      : isExpired && expiredMoreThan30Days
      ? "Reactivează gratuit"
      : isExpired
      ? "Promovează și activează"
      : "Promovează";

    const buttonClass =
      isDraft || (isExpired && expiredMoreThan30Days)
        ? "bg-green-600 hover:bg-green-700"
        : "bg-yellow-500 hover:bg-yellow-600";

    return (
      <div className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-blue-700 mb-1">{listing.title}</h2>

            <div className="flex gap-2 flex-wrap justify-end">
              {isDraft && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-semibold">
                  DRAFT
                </span>
              )}

              {!isDraft && isExpired && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 font-semibold">
                  EXPIRAT
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {listing.location} • {listing.category}
          </p>

          <p className="font-bold text-green-700 mb-2">
            {listing.price ? String(listing.price) + " €" : "Preț la cerere"}
          </p>

          {!isDraft && (
            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 space-y-1">
              <p>👁️ {views.toLocaleString("ro-RO")} vizualizări totale</p>
              <p>📈 +{weeklyViews.toLocaleString("ro-RO")} în ultimele 7 zile</p>
              <p>🕒 Ultima vizualizare: {formatLastViewed(listing.lastViewedAt)}</p>
              <p>⏳ {expiryText}</p>
              <div className={`mt-2 rounded-lg border px-3 py-2 ${interest.className}`}>
                <p className="font-semibold">{interest.text}</p>
                <p className="mt-1">{interest.hint}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-700 line-clamp-3">{listing.description}</p>

          {!isDraft && isExpired && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm">
              {expiredMoreThan30Days
                ? "Acest anunț poate fi reactivat gratuit pentru 14 zile."
                : "Acest anunț poate fi activat doar prin promovare până la 30 zile de la expirare."}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={getDetailsPath(listing)}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Vezi detalii
          </Link>

          <Link
            to={getEditPath(listing)}
            className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Editează
          </Link>

          <button
            type="button"
            onClick={() =>
              !isDraft && isExpired && expiredMoreThan30Days
                ? handleReactivateFree(listing)
                : handlePayOrPromote(listing)
            }
            className={"text-sm px-3 py-2 rounded-lg text-white " + buttonClass}
          >
            {buttonLabel}
          </button>

          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="text-sm px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Șterge
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Anunțurile mele</h1>
        <p>{message || "Se încarcă..."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Anunțurile mele</h1>
        <button
          onClick={() => navigate("/adauga-anunt")}
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

      {drafts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Drafturi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((l) => (
              <Card key={getId(l)} listing={l} isDraft />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold mb-3">Anunțuri publicate</h2>

        {published.length === 0 ? (
          <p className="text-gray-600">Momentan nu ai anunțuri publicate.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {published.map((l) => (
              <Card key={getId(l)} listing={l} isDraft={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
