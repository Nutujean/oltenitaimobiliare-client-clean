import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        const data = await res.json();
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
        });
      } catch (error) {
        console.error("Eroare la încărcarea anunțului pentru editare:", error);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      navigate(`/anunt/${id}`);
    } catch (error) {
      console.error("Eroare la actualizarea anunțului:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editează Anunț</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titlu"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descriere"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Preț"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Salvează modificările
        </button>
      </form>
    </div>
  );
}
