// src/pages/Angajari.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../api";
import angajariImg from "../assets/angajari.png";

// helper: normalize phone (doar cifre, fără 4 la început)
function normalizePhone(v) {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.replace(/^4/, "");
}

export default function Angajari() {
  const location = useLocation();
  const navigate = useNavigate();

  const editIdFromUrl = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("edit") || "";
  }, [location.search]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal + form
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [isDraftJob, setIsDraftJob] = useState(false);
  const [notice, setNotice] = useState(""); // mesaje în modal

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "Oltenița",
    phone: localStorage.getItem("userPhone") || "",
    email: "",
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "Oltenița",
      phone: localStorage.getItem("userPhone") || "",
      email: "",
    });
  };

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

  // ✅ helper: verifică dacă e job
  const isJobFromListing = (l) => {
    const s = String(l?.section || "").toLowerCase();
    const c = String(l?.category || "").toLowerCase();
    return s.includes("angaj") || c.includes("angaj");
  };

  // ✅ helper: ia listing din payload indiferent de format
  const pickListingFromPayload = (payload) => {
    if (!payload) return null;
    return (
      payload.listing ||
      payload.draft ||
      payload.data?.listing ||
      payload.data?.draft ||
      payload
    );
  };

  // ✅ încărcare pentru edit: încearcă public + draft
  const fetchForEdit = async (id, token) => {
    const tries = [
      `${API_URL}/listings/${id}`,
      `${API_URL}/listings/draft/${id}`,
    ];

    let lastErr = null;

    for (const url of tries) {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await res.json().catch(() => null);
        const l = pickListingFromPayload(payload);

        if (!res.ok || !l) {
          lastErr = payload?.error || `Nu pot încărca (${res.status}).`;
          continue;
        }
        return l;
      } catch (e) {
        lastErr = "Eroare de rețea la încărcare.";
      }
    }

    throw new Error(lastErr || "Nu pot încărca anunțul pentru editare.");
  };

  // ✅ SALVARE robustă: JSON + fallback FormData
  const saveListingEdits = async (id, token, obj) => {
    const jsonTries = [
      { url: `${API_URL}/listings/${id}`, method: "PUT" },
      { url: `${API_URL}/listings/draft/${id}`, method: "PUT" },
    ];

    let lastErr = null;

    // 1) JSON
    for (const t of jsonTries) {
      try {
        const res = await fetch(t.url, {
          method: t.method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        });

        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          lastErr = payload?.error || `Nu pot salva (${res.status}).`;
          continue;
        }
        return true;
      } catch (e) {
        lastErr = "Eroare de rețea la salvare (JSON).";
      }
    }

    // 2) FormData fallback
    const fd = new FormData();
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });

    const fdTries = [
      { url: `${API_URL}/listings/${id}`, method: "PUT" },
      { url: `${API_URL}/listings/draft/${id}`, method: "PUT" },
    ];

    for (const t of fdTries) {
      try {
        const res = await fetch(t.url, {
          method: t.method,
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          lastErr = payload?.error || `Nu pot salva (${res.status}).`;
          continue;
        }
        return true;
      } catch (e) {
        lastErr = "Eroare de rețea la salvare (FormData).";
      }
    }

    throw new Error(lastErr || "Nu pot salva modificările.");
  };

  // ✅ deschidem modal în edit (folosit și din URL și din butonul de pe card)
  const openEditJob = async (id, fromUrl = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Trebuie să fii logat ca să editezi un job.");
      navigate("/login");
      return;
    }

    try {
      setSending(true);
      setErr("");
      setNotice("");

      const l = await fetchForEdit(id, token);

      if (!isJobFromListing(l)) {
        alert("Acest anunț nu este de tip angajări.");
        if (fromUrl) navigate("/angajari", { replace: true });
        return;
      }

      const realId = String(l._id || l.id || id);

      setEditing(true);
      setEditingId(realId);
      setIsDraftJob(String(l?.visibility || "").toLowerCase() === "draft");

      setForm({
        title: l?.title || "",
        description: l?.description || "",
        location: l?.location || "Oltenița",
        phone: l?.phone || localStorage.getItem("userPhone") || "",
        email: l?.email || "",
      });

      setOpen(true);
    } catch (e) {
      alert(e?.message || "Eroare la încărcarea anunțului.");
      if (fromUrl) navigate("/angajari", { replace: true });
    } finally {
      setSending(false);
    }
  };

  // ✅ dacă avem ?edit=..., intrăm automat în edit
  useEffect(() => {
    if (!editIdFromUrl) return;
    openEditJob(editIdFromUrl, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIdFromUrl]);

  // ✅ creare draft + checkout (job nou)
  const startPaidJobCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Trebuie să fii logat ca să publici un job.");

      if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.phone.trim()) {
        return alert("Completează obligatoriu: Titlu, Descriere, Localitate, Telefon.");
      }

      setSending(true);

      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("price", "1");
      fd.append("category", "Angajări");
      fd.append("location", form.location.trim());
      fd.append("phone", form.phone.trim());
      fd.append("email", (form.email || "").trim());
      fd.append("intent", "vand");
      fd.append("section", "angajari");

      const draftRes = await fetch(`${API_URL}/listings/draft`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const draftData = await draftRes.json().catch(() => null);
      if (!draftRes.ok) {
        alert(draftData?.error || "Nu pot salva draftul.");
        return;
      }

      const listingId =
        draftData?.draftId ||
        draftData?.listingId ||
        draftData?.id ||
        draftData?._id ||
        draftData?.listing?._id;

      if (!listingId) {
        alert("Nu am primit ID-ul draftului.");
        return;
      }

      const payRes = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, plan: "job30" }),
      });

      const payData = await payRes.json().catch(() => null);
      if (!payRes.ok || !payData?.url) {
        alert(payData?.error || "Nu pot porni plata.");
        return;
      }

      window.location.href = payData.url;
    } catch (e) {
      alert("Eroare la inițierea plății.");
    } finally {
      setSending(false);
    }
  };

  // ✅ salvare edit (NU te duce la plată!)
  const saveJobEdits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Trebuie să fii logat ca să editezi un job.");
      if (!editingId) return alert("Lipsește ID-ul de editare.");

      if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.phone.trim()) {
        return alert("Completează obligatoriu: Titlu, Descriere, Localitate, Telefon.");
      }

      setSending(true);
      setNotice("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        email: (form.email || "").trim(),
        category: "Angajări",
        section: "angajari",
        price: 1,
        intent: "vand",
      };

      await saveListingEdits(editingId, token, payload);

      setNotice("✅ Salvat! Acum poți continua către plată (dacă este draft).");
      fetchJobs();
    } catch (e) {
      alert(e?.message || "Eroare la salvarea modificărilor.");
    } finally {
      setSending(false);
    }
  };

  // ✅ plata pentru draft (se apasă DOAR când vrei tu)
  const continueDraftPayment = async () => {
    try {
      if (!editingId) return alert("Lipsește ID-ul.");
      setSending(true);

      const payRes = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: editingId, plan: "job30" }),
      });

      const payData = await payRes.json().catch(() => null);
      if (!payRes.ok || !payData?.url) {
        alert(payData?.error || "Nu pot porni plata.");
        return;
      }

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

    setNotice("");
    setEditing(false);
    setEditingId("");
    setIsDraftJob(false);
    resetForm();
    setOpen(true);
  };

  const closeModal = () => {
    if (sending) return;
    setOpen(false);
    setNotice("");
    setEditing(false);
    setEditingId("");
    setIsDraftJob(false);
    resetForm();
    if (editIdFromUrl) navigate("/angajari", { replace: true });
  };

  // ✅ arătăm buton “Editează” pe card doar dacă e job-ul meu (după telefon)
  const myPhone = normalizePhone(localStorage.getItem("userPhone") || "");
  const canEditJob = (j) => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const jobPhone = normalizePhone(j?.phone || "");
    return myPhone && jobPhone && myPhone === jobPhone;
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-md border p-8">
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Angajări</h1>
              <p className="mt-2 text-gray-600">
                Anunțuri de locuri de muncă și colaborări în Oltenița și localitățile din jur.{" "}
                <span className="font-semibold">Publicarea este doar plătită</span> și anunțul devine automat promovat 30 zile.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/" className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50">
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

                    <div className="mt-1 mb-3 rounded-xl overflow-hidden border bg-gray-50">
                      <img
                        src={(j?.images && j.images[0]) || angajariImg}
                        alt={j?.title || "Anunț angajare"}
                        className="w-full h-36 object-cover"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">{j.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{j.location}</p>

                    {j.description && (
                      <p className="text-sm text-gray-700 mt-3 line-clamp-4">{j.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {j.createdAt ? `Publicat: ${new Date(j.createdAt).toLocaleDateString("ro-RO")}` : ""}
                      </span>
                      <span>ID: {String(j._id).slice(-6).toUpperCase()}</span>
                    </div>

                    {/* ✅ Buton edit pe card (doar dacă e job-ul meu) */}
                    {canEditJob(j) && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => openEditJob(String(j._id))}
                          className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white hover:opacity-90"
                        >
                          ✏️ Editează (salvează înainte de plată)
                        </button>
                      </div>
                    )}
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
              <h3 className="text-xl font-bold">{editing ? "Editează job" : "Publică job (plătit)"}</h3>
              <button className="px-3 py-1 rounded-lg border" onClick={closeModal} disabled={sending}>
                Închide
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {editing ? (
                <>
                  Editezi anunțul existent. <b>Întâi salvezi</b>, apoi (dacă e draft) poți plăti.
                </>
              ) : (
                <>
                  Completezi anunțul, se salvează ca draft și apoi mergi la plată.
                </>
              )}
            </p>

            {notice && (
              <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-900 text-sm">
                {notice}
              </div>
            )}

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

            {/* ✅ Butoane corecte: la edit -> SALVEAZĂ mereu, și separat plata (dacă e draft) */}
            {!editing ? (
              <button
                disabled={sending}
                onClick={startPaidJobCheckout}
                className="mt-5 w-full rounded-xl bg-blue-700 text-white py-2 font-semibold disabled:opacity-60"
              >
                {sending ? "Se procesează..." : "Continuă către plată"}
              </button>
            ) : (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  disabled={sending}
                  onClick={saveJobEdits}
                  className="w-full rounded-xl bg-blue-700 text-white py-2 font-semibold disabled:opacity-60"
                >
                  {sending ? "Se procesează..." : "Salvează modificările"}
                </button>

                <button
                  disabled={sending || !isDraftJob}
                  onClick={continueDraftPayment}
                  className="w-full rounded-xl bg-green-600 text-white py-2 font-semibold disabled:opacity-40"
                  title={!isDraftJob ? "Plata este disponibilă doar pentru drafturi" : ""}
                >
                  {sending ? "Se procesează..." : "Continuă către plată"}
                </button>
              </div>
            )}

            {!editing && (
              <p className="mt-3 text-xs text-gray-500">
                După plată, anunțul va apărea automat în lista de angajări ca “Promovat”.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}