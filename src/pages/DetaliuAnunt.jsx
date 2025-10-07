import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = "https://oltenitaimobiliare-backend.onrender.com/api";

  // ✅ Preia datele anunțului pentru editare
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          location: data.location || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea anunțului:", err);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <p className="text-center mt-8">Se încarcă...</p>;
  if (!listing) return <p className="text-center mt-8">Anunțul nu există.</p>;

  // ✅ Când se trimite formularul
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Trebuie să fii autentificat pentru a edita anunțul.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔒 foarte important
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Anunț actualizat cu succes!");
        navigate(`/anunt/${id}`);
      } else {
        alert(data.error || "Eroare la actualizare");
      }
    } catch (err) {
      console.error("Eroare la actualizare:", err);
      alert("Eroare la comunicarea cu serverul.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Editează anunțul</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Titlul anunțului"
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descriere"
          rows="5"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Preț"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Locație"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvează modificările
        </button>
      </form>
    </div>
  );
}
