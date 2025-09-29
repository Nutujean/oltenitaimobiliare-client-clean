import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdaugaAnunt() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // dacă nu e logat, redirect la login
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      navigate("/anunturile-mele");
    } catch (error) {
      console.error("Eroare la adăugarea anunțului:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Adaugă Anunț</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Titlu"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Descriere"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Preț (€)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="URL imagine"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Select pentru categorie */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Alege categoria</option>
          <option value="apartamente">Apartamente</option>
          <option value="case">Case</option>
          <option value="terenuri">Terenuri</option>
          <option value="garsoniere">Garsoniere</option>
          <option value="garaje">Garaje</option>
          <option value="spatii-comerciale">Spații comerciale</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Adaugă
        </button>
      </form>
    </div>
  );
}
