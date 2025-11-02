import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    category: "",
    images: [],
    phone: "",
    intent: "vand", // 🆕 adăugat
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const localitati = [
    "Oltenița",
    "Chirnogi",
    "Curcani",
    "Spanțov",
    "Radovanu",
    "Ulmeni",
    "Clatesti",
    "Negoiesti",
    "Soldanu",
    "Luica",
    "Nana",
    "Chiselet",
    "Căscioarele",
    "Manastirea",
    "Valea Roșie",
    "Mitreni",
  ];

  const categorii = [
    "Apartamente",
    "Garsoniere",
    "Case",
    "Terenuri",
    "Spatii comerciale",
    "Garaje",
  ];

  const intentOptiuni = [
    { value: "vand", label: "Vând" },
    { value: "inchiriez", label: "Închiriez" },
    { value: "cumpar", label: "Cumpăr" },
    { value: "schimb", label: "Schimb" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const apiTry = async (paths, options = {}) => {
    for (const p of paths) {
      try {
        const res = await fetch(`${API_URL}${p}`, options);
        const data = await res.json().catch(() => ({}));
        if (res.ok) return data;
        if (res.status === 404) continue;
        throw new Error(data.message || data.error || `Eroare ${res.status}`);
      } catch (err) {
        if (String(err).includes("Failed to fetch")) continue;
        throw err;
      }
    }
    throw new Error("Ruta API inexistentă");
  };

  useEffect(() => {
    fetchListings();
    fetchUserProfile();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await apiTry(
        ["/listings/my", "/listings/me", "/listings/user"],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Eroare la anunțurile mele:", e);
      setListings([]);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await apiTry(
        ["/users/profile", "/auth/profile"],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(data?.name || "");
      setPhone(data?.phone || "");
      localStorage.setItem("userInfo", JSON.stringify(data || {}));
    } catch (err) {
      console.error("Eroare la obținerea profilului:", err);
    }
  };

  const handleEdit = (l) => {
    setEditingId(l._id);
    setForm({
      title: l.title || "",
      price: l.price || "",
      description: l.description || "",
      location: l.location || "",
      category: l.category || "",
      images: Array.isArray(l.images) ? l.images : [],
      phone: l.phone || "",
      intent: l.intent || "vand", // 🆕 adăugat
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");
      alert("Anunț șters cu succes!");
      fetchListings();
    } catch (e) {
      alert("Eroare: " + e.message);
    }
  };

  const handleSave = async (id) => {
    try {
      if (!form.title?.trim()) return alert("Titlul este obligatoriu.");
      if (!form.price) return alert("Prețul este obligatoriu.");
      if (!form.location) return alert("Selectează localitatea.");
      if (!form.category) return alert("Selectează categoria.");
      if (!/^\d{10}$/.test(form.phone)) {
        return alert(
          "Numărul de telefon trebuie să conțină exact 10 cifre (ex: 07xxxxxxxx)."
        );
      }

      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");
      setEditingId(null);
      fetchListings();
      setSuccessMsg("✅ Anunț actualizat cu succes!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...form.images];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push(ev.target.result);
        setForm((f) => ({ ...f, images: newImages }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePromote = async (id, planKey) => {
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id, plan: planKey }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Eroare la inițializarea plății");
      window.location.href = data.url;
    } catch (err) {
      alert("Eroare: " + err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!token) {
        alert("Trebuie să fii logat pentru a modifica datele.");
        return;
      }
      const me = await apiTry(
        ["/users/profile", "/auth/profile"],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!me?._id) {
        alert("Eroare la identificarea utilizatorului.");
        return;
      }
      const updated = await apiTry(
        [`/users/update/${me._id}`, `/auth/update/${me._id}`],
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(updated || {}));
      setSuccessMsg("✅ Datele au fost actualizate cu succes!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Eroare:", error);
      setSuccessMsg("❌ Eroare la actualizare!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Anunțurile Mele</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Profil utilizator */}
      {/* (păstrat exact ca la tine) */}

      {listings.length === 0 ? (
        <p className="text-gray-600">
          Nu ai încă anunțuri.{" "}
          <button
            onClick={() => navigate("/adauga-anunt")}
            className="text-blue-600 underline"
          >
            Adaugă unul acum.
          </button>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((l) =>
            editingId === l._id ? (
              <div key={l._id} className="bg-white p-5 rounded-xl shadow-md">
                {/* 🔹 Adăugăm select pentru intent */}
                <select
                  className="w-full border p-2 rounded mb-2"
                  value={form.intent}
                  onChange={(e) =>
                    setForm({ ...form, intent: e.target.value })
                  }
                >
                  {intentOptiuni.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Titlu anunț"
                />
                <input
                  type="number"
                  className="w-full border p-2 rounded mb-2"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="Preț (€)"
                />
                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Telefon (07xxxxxxxx)"
                />
                <textarea
                  className="w-full border p-2 rounded mb-2"
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Descriere"
                />

                {/* localitate + categorie (păstrate exact ca la tine) */}

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleSave(l._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Salvează
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Anulează
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={l._id}
                className="bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden relative"
              >
                {l.featuredUntil &&
                  new Date(l.featuredUntil) > new Date() && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow">
                      🎖️ Promovat
                    </span>
                  )}

                {l.images?.[0] && (
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    className="w-full md:w-1/3 h-52 object-cover"
                  />
                )}

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-blue-700 font-bold text-lg">
                      {l.price} €
                    </p>
                    <h3 className="font-bold text-xl mb-1">{l.title}</h3>
                    <p className="text-gray-600 mb-2">{l.location}</p>

                    {/* 🔹 Badge tip anunț */}
                    {l.intent && (
                      <span
                        className={`inline-block mb-2 px-2 py-1 rounded text-white text-xs font-semibold ${
                          l.intent === "vand"
                            ? "bg-green-600"
                            : l.intent === "inchiriez"
                            ? "bg-yellow-500"
                            : l.intent === "cumpar"
                            ? "bg-blue-600"
                            : "bg-purple-600"
                        }`}
                      >
                        {l.intent === "vand"
                          ? "Vând"
                          : l.intent === "inchiriez"
                          ? "Închiriez"
                          : l.intent === "cumpar"
                          ? "Cumpăr"
                          : "Schimb"}
                      </span>
                    )}

                    {l.phone && (
                      <p className="text-gray-700 text-sm mb-2">
                        📞 {l.phone}
                      </p>
                    )}
                  </div>

                  {/* restul rămâne identic */}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
