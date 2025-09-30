import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdaugaAnunt() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const validatePhone = (number) => {
    const regex = /^(\+4|0)?7\d{8}$/; // acceptă 07XXXXXXXX sau +407XXXXXXXX
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validare câmpuri obligatorii
    if (!title || !price || !category || !phone) {
      setError("Te rog completează titlul, prețul, categoria și telefonul!");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Numărul de telefon nu este valid! Exemplu: 07XXXXXXXX");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("phone", phone);

      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Eroare la adăugarea anunțului");

      navigate("/anunturile-mele");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Adaugă un anunț nou</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titlu anunț"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Preț (€)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Categorie (ex: apartament, casă...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Telefon (ex: 07XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows="4"
        ></textarea>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Se adaugă..." : "Adaugă Anunț"}
        </button>
      </form>
    </div>
  );
}
