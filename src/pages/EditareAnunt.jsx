import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();

        setTitle(data.title || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error(err.message);
        setError("Nu s-a putut încărca anunțul.");
      }
    };

    fetchListing();
  }, [id]);

  const validatePhone = (number) => {
    const regex = /^(\+4|0)?7\d{8}$/; // validare nr. românesc (07xxxxxxxx sau +407xxxxxxxx)
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validare câmpuri obligatorii
    if (!title || !price || !category || !phone) {
      setError("Completează titlul, prețul, categoria și telefonul!");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Numărul de telefon nu este valid! Exemplu: 07XXXXXXXX");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, price, description, category, phone }),
      });

      if (!res.ok) throw new Error("Eroare la salvarea anunțului");

      navigate("/anunturile-mele");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editează anunțul</h1>

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

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {loading ? "Se salvează..." : "Salvează modificările"}
        </button>
      </form>
    </div>
  );
}
