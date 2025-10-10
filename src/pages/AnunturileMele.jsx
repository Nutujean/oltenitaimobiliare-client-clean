import { useEffect, useState } from "react";
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
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Funcție fallback API
  const apiTry = async (paths, options = {}) => {
    for (const p of paths) {
      try {
        const res = await fetch(`${API_URL}${p}`, options);
        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          data = {};
        }
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
    setForm({ ...l });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la ștergere");
      alert("Anunț șters cu succes!");
      fetchListings();
    } catch (e) {
      alert("Eroare: " + e.message);
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");
      alert("✅ Anunț actualizat cu succes!");
      setEditingId(null);
      fetchListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...form.images];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => newImages.push(ev.target.result);
      reader.readAsDataURL(file);
    });
    setForm({ ...form, images: newImages });
  };

  // 🔹 Promovare Stripe
  const handlePromote = async (id, days, price) => {
    try {
      const res = await fetch(`${API_URL}/stripe/create-checkout-session/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Eroare la inițializarea plății.");
      }
    } catch (err) {
      console.error("Eroare Stripe:", err);
      alert("Eroare la promovare.");
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
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (error) {
      console.error("Eroare:", error);
      setSuccessMsg("❌ Eroare la actualizare!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // ================== INTERFAȚA ==================
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Anunțurile Mele</h1>

      {/* 🔵 PROFIL UTILIZATOR */}
      <div className="bg-blue-50 border border-blue-300 p-5 rounded-xl mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Profilul meu</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">Nume complet</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded-md" placeholder="Introdu numele tău" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">Telefon</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded-md" placeholder="07xxxxxxxx" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <button onClick={handleUpdateProfile} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Salvează modificările
          </button>
          <button onClick={() => setPhone("")} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Șterge numărul
          </button>
        </div>
        {successMsg && (
          <p className={`mt-3 font-medium ${successMsg.includes("Eroare") ? "text-red-600" : "text-green-600"}`}>{successMsg}</p>
        )}
      </div>

      {/* 🔹 LISTA ANUNȚURI */}
      {listings.length === 0 ? (
        <p className="text-gray-600">Nu ai încă anunțuri.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((l) => (
            <div key={l._id} className="relative bg-white rounded-xl shadow-md overflow-hidden border">
              {/* ⭐ Banner Promovat */}
              {l.featuredUntil && new Date(l.featuredUntil) > new Date() && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-white font-semibold px-2 py-1 text-xs rounded shadow">
                  ⭐ Promovat până la {new Date(l.featuredUntil).toLocaleDateString("ro-RO")}
                </div>
              )}

              {/* Imagine */}
              {l.images?.length > 0 && (
                <img src={l.images[0]} alt={l.title} className="w-full h-48 object-cover" />
              )}

              {/* Informații */}
              <div className="p-4">
                <p className="text-blue-700 font-bold text-lg">{l.price} €</p>
                <h3 className="font-bold text-xl mb-1">{l.title}</h3>
                <p className="text-gray-600">{l.location}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => handleEdit(l)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Editează
                  </button>
                  <button onClick={() => handleDelete(l._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Șterge
                  </button>
                </div>

                {/* 🟡 PROMOVARE */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => handlePromote(l._id, 7, 50)} className="bg-yellow-400 text-white font-semibold px-3 py-1 rounded hover:bg-yellow-500">
                    7 zile - 50 lei
                  </button>
                  <button onClick={() => handlePromote(l._id, 14, 85)} className="bg-orange-500 text-white font-semibold px-3 py-1 rounded hover:bg-orange-600">
                    14 zile - 85 lei
                  </button>
                  <button onClick={() => handlePromote(l._id, 30, 125)} className="bg-red-600 text-white font-semibold px-3 py-1 rounded hover:bg-red-700">
                    30 zile - 125 lei
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
