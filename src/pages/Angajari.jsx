// src/pages/Angajari.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

export default function Angajari() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal + form
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "Oltenița",
    phone: localStorage.getItem("userPhone") || "",
    email: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(`${API_URL}/listings?section=angajari&sort=newest`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Nu pot încărca anunțurile de angajare.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Angajări | Oltenița Imobiliare";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Angajări în Oltenița și împrejurimi: locuri de muncă, colaborări și servicii. Publicarea este disponibilă doar contra cost."
    );

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPaidJobCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Trebuie să fii logat ca să publici un job.");

      if (
        !form.title.trim() ||
        !form.description.trim() ||
        !form.location.trim() ||
        !form.phone.trim()
      ) {
        return alert("Completează obligatoriu: Titlu, Descriere, Localitate, Telefon.");
      }

      setSending(true);

      // 1) draft job (section=angajari) — TRIMITEM FormData (multer)
const fd = new FormData();
fd.append("title", form.title.trim());
fd.append("description", form.description.trim());
fd.append("price", "1");
fd.append("category", "Angajări");
fd.append("location", form.location.trim());
fd.append("phone", form.phone.trim());
fd.append("email", (form.email || "").trim());
fd.append("intent", "vand");      // doar ca să treacă enum
fd.append("section", "angajari"); // IMPORTANT

const draftRes = await fetch(`${API_URL}/listings/draft`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: fd,
});

const draftData = await draftRes.json();
if (!draftRes.ok) {
  alert(draftData?.error || "Nu pot salva draftul.");
  return;
}

const listingId = draftData.draftId;

      // 2) Stripe checkout (job30)
      const payRes = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, plan: "job30" }),
      });

      const payData = await payRes.json();
      if (!payRes.ok || !payData?.url) {
        alert(payData?.error || "Nu pot porni plata.");
        return;
      }

      // 3) Redirect Stripe
      window.location.href = payData.url;
    } catch (e) {
      alert("Eroare la inițierea plății.");
    } finally {
      setSending(false);
    }
  };

  const openModal = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Trebuie să fii logat ca să publici un job.");
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-md border p-8">
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Angajări</h1>
              <p className="mt-2 text-gray-600">
                Anunțuri de locuri de muncă și colaborări în Oltenița și localitățile din jur.
                <span className="font-semibold"> Publicarea este doar plătită</span> și anunțul devine automat promovat
                30 zile.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
                >
                  ← Înapoi acasă
                </Link>

                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:opacity-90"
                  onClick={openModal}
                >
                  💼 Publică job (plătit)
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
                  onClick={fetchJobs}
                >
                  ↻ Reîncarcă
                </button>
              </div>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
              💼
            </div>
          </div>

          <div className="mt-8">
            {loading && <div className="text-gray-600">Se încarcă...</div>}
            {err && <div className="text-red-600">{err}</div>}

            {!loading && !err && jobs.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-gray-600">
                Nu există încă anunțuri de angajare.
                <div className="mt-2 text-sm text-gray-500">
                  Publică primul anunț (plătit) și va fi afișat aici.
                </div>
              </div>
            )}

            {!loading && !err && jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((j) => (
                  <div key={j._id} className="relative bg-white rounded-xl border shadow-sm p-5">
                    {j.featuredUntil && new Date(j.featuredUntil).getTime() > Date.now() && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        ⭐ PROMOVAT
                      </span>
                    )}

                    <h3 className="text-lg font-bold text-gray-900">{j.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{j.location}</p>

                    {j.description && (
                      <p className="text-sm text-gray-700 mt-3 line-clamp-4">{j.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {j.createdAt
                          ? `Publicat: ${new Date(j.createdAt).toLocaleDateString("ro-RO")}`
                          : ""}
                      </span>
                      <span>ID: {String(j._id).slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold">Publică job (plătit)</h3>
              <button
                className="px-3 py-1 rounded-lg border"
                onClick={() => setOpen(false)}
                disabled={sending}
              >
                Închide
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Publicarea este contra cost și anunțul devine automat <b>promovat 30 zile</b>.
            </p>

            <div className="mt-4 space-y-3">
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Titlu (ex: Angajăm vânzătoare magazin)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Localitate (ex: Oltenița)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Telefon"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Email (opțional)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <textarea
                className="w-full border rounded-lg px-3 py-2 h-28"
                placeholder="Descriere (program, cerințe, salariu, etc.)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <button
              disabled={sending}
              onClick={startPaidJobCheckout}
              className="mt-5 w-full rounded-xl bg-blue-700 text-white py-2 font-semibold disabled:opacity-60"
            >
              {sending ? "Se inițiază plata..." : "Continuă către plată"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              După plată, anunțul va apărea automat în lista de angajări ca “Promovat”.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
