import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    images: [],
  });

  const [loading, setLoading] = useState(true);

  // ✅ Preluăm anunțul
  useEffect(() => {
    const fetchAnunt = async () => {
      try {
        const res = await axios.get(`${API_URL}/listings/${id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Eroare la încărcarea anunțului:", error);
      }
    };
    fetchAnunt();
  }, [id]);

  // ✅ Actualizăm câmpurile din formular
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Actualizare anunț
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/listings/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Anunț actualizat cu succes!");
      navigate(`/anunt/${id}`);
    } catch (error) {
      console.error("❌ Eroare la actualizarea anunțului:", error);
      alert("Eroare la actualizare");
    }
  };

  // ✅ Ștergere anunț
  const handleDelete = async () => {
    if (window.confirm("Sigur vrei să ștergi acest anunț?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🗑️ Anunț șters cu succes!");
        navigate("/"); // redirect spre pagina principală
      } catch (error) {
        console.error("❌ Eroare la ștergere:", error);
        alert("Eroare la ștergere");
      }
    }
  };

  if (loading) return <p>Se încarcă...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Editează Anunț</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titlu */}
        <input
          type="text"
          name="title"
          placeholder="Titlu"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Descriere"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          rows="4"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Preț"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Categorie"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Locație"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* Butoane */}
        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Salvează Modificările
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
          >
            Șterge Anunțul
          </button>
        </div>
      </form>
    </div>
  );
}
