// src/pages/Angajari.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../api";

// ✅ fallback servit direct din /public (stabil pe mobil) + cache-bust
const FALLBACK_IMG = "/angajari.png?v=4";

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

  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [isDraftJob, setIsDraftJob] = useState(false);
  const [notice, setNotice] = useState("");

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

  const isJobFromListing = (l) => {
    const s = String(l?.section || "").toLowerCase();
    const c = String(l?.category || "").toLowerCase();
    return s.includes("angaj") || c.includes("angaj");
  };

  const pickListingFromPayload = (payload) => {
    if (!payload) return null;
    return payload.listing || payload.draft || payload.data?.listing || payload.data?.draft || payload;
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setErr("");

      const url = `${API_URL}/listings?section=angajari&sort=newest&_=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json().catch(() => null);

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

  // ✅ fetch pentru edit (încearcă public + draft, no-store)
  const fetchForEdit = async (id, token) => {
    const tries = [
      `${API_URL}/listings/${id}?_=${Date.now()}`,
      `${API_URL}/listings/draft/${id}?_=${Date.now()}`,
    ];

    let lastErr = null;

    for (const url of tries) {
      try {
        const res = await fetch(url, {
          cache: "no-store",
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

  // ✅ Salvare: draft vs public + JSON + fallback FormData
  const saveListingEdits = async (id, token, obj, draftFirst = false) => {
    const order = draftFirst
      ? [
          { url: `${API_URL}/listings/draft/${id}`, method: "PUT" },
          { url: `${API_URL}/listings/${id}`, method: "PUT" },
        ]
      : [
          { url: `${API_URL}/listings/${id}`, method: "PUT" },
          { url: `${API_URL}/listings/draft/${id}`, method: "PUT" },
        ];

    let lastErr = null;

    // 1) JSON
    for (const t of order) {
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

    for (const t of order) {
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

      const draft =
        String(l?.visibility || "").toLowerCase() === "draft" ||
        String(l?.status || "").toLowerCase() === "draft" ||
        String(l?.state || "").toLowerCase() === "draft" ||
        Boolean(l?.isDraft);

      setEditing(true);
      setEditingId(realId);
      setIsDraftJob(draft);

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

  // auto-edit din URL
  useEffect(() => {
    if (!editIdFromUrl) return;
    openEditJob(editIdFromUrl, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIdFromUrl]);

  // job nou: draft + checkout
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

      if (!listingId) return alert("Nu am primit ID-ul draftului.");

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

  // ✅ edit: SALVEAZĂ și confirmă prin re-fetch
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

      await saveListingEdits(editingId, token, payload, isDraftJob);

      const latest = await fetchForEdit(editingId, token);

      const draftNow =
        String(latest?.visibility || "").toLowerCase() === "draft" ||
        String(latest?.status || "").toLowerCase() === "draft" ||
        String(latest?.state || "").toLowerCase() === "draft" ||
        Boolean(latest?.isDraft);

      setIsDraftJob(draftNow);

      setForm({
        title: latest?.title || "",
        description: latest?.description || "",
        location: latest?.location || "Oltenița",
        phone: latest?.phone || localStorage.getItem("userPhone") || "",
        email: latest?.email || "",
      });

      setNotice("✅ Salvat! (confirmat din baza de date)");
      fetchJobs();
    } catch (e) {
      alert(e?.message || "Eroare la salvarea modificărilor.");
    } finally {
      setSending(false);
    }
  };

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

  // ✅ buton edit pe card doar dacă e al meu (după telefon)
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
                Anunțuri de locuri de muncă și colaborări.{" "}
                <span className="font-semibold">Publicarea este doar plătită</span>.
              </p>

              {/* ✅ BUTOANELE (nu se ating) */}
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

            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">💼</div>
          </div>

          <div className="mt-8">
            {/* ✅ Banner imagine (mereu vizibil) */}
            <div className="mb-6 rounded-2xl overflow-hidden border bg-gray-50">
              <img
                src={FALLBACK_IMG}
                alt="Angajări"
                className="w-full h-44 md:h-58 object-cover block"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "/angajari.png?v=4";
                }}
              />
            </div>

            {loading && <div className="text-gray-600">Se încarcă...</div>}
            {err && <div className="text-red-600">{err}</div>}

            {!loading && !err && jobs.length === 0 && (
  <div className="rounded-xl border border-dashed p-6 text-center text-gray-600">
    <div className="text-base font-semibold">Nu există încă anunțuri de angajare.</div>
    <div className="mt-2 text-sm text-gray-500">Apasă „💼 Publică job (plătit)” ca să adaugi primul anunț.</div>
  </div>
)}
            {!loading && !err && jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((j) => (
                  <div key={j._id || j.id} className="relative bg-white rounded-xl border shadow-sm p-5">
                    {/* ✅ Imagine FIXĂ pe fiecare card (aceeași poză) */}
                    <div className="mt-1 mb-3 rounded-xl overflow-hidden border bg-gray-50">
                      <img
                        src={FALLBACK_IMG}
                        alt={j?.title || "Anunț angajare"}
                        className="w-full h-36 object-cover block"
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "/angajari.png?v=4";
                        }}
                      />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">{j.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{j.location}</p>

                    {j.description && <p className="text-sm text-gray-700 mt-3 line-clamp-4">{j.description}</p>}

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {j.createdAt ? `Publicat: ${new Date(j.createdAt).toLocaleDateString("ro-RO")}` : ""}
                      </span>
                      <span>ID: {String(j._id || j.id || "").slice(-6).toUpperCase()}</span>
                    </div>

                    {canEditJob(j) && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => openEditJob(String(j._id || j.id))}
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
                  Întâi <b>salvezi</b>. Apoi (dacă e draft) poți plăti.
                </>
              ) : (
                <>Se creează draft și apoi mergi la plată.</>
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
                placeholder="Titlu"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Localitate"
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
                placeholder="Descriere"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

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
                >
                  {sending ? "Se procesează..." : "Continuă către plată"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}