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
    phone: "", // ✅ adăugat
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
      phone: l.phone || "", // ✅ adăugat
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
        if (form.phone && (!/^(0|\+4)\d{9}$/.test(form.phone) || form.phone.replace(/\D/g, "").length < 10)) {
          return alert("Numărul de telefon trebuie să aibă cel puțin 10 cifre și format valid (ex: 07xxxxxxxx).");
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
      if (!res.ok) throw new Error(data.error || "Eroare la inițializarea plății");
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
      {/* restul codului JSX original */}
    </div>
  );
}

