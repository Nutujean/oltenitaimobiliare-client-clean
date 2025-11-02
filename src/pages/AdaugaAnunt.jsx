import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function AdaugaAnunt() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("vand");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const localitati = [
    "Oltenița",
    "Chirnogi",
    "Curcani",
    "Spanțov",
    "Radovanu",
    "Ulmeni",
    "Clătești",
    "Negoești",
    "Șoldanu",
    "Luica",
    "Nana",
    "Chiselet",
    "Căscioarele",
    "Mănăstirea",
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImgs.push(ev.target.result);
        setImages((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Trebuie să fii logat pentru a adăuga un anunț!");
      navigate("/login");
      return;
    }

    if (!title || !description || !price || !category || !location || !phone) {
      alert("Completează toate câmpurile obligatorii!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price,
          category,
          location,
          phone,
          email,
          images,
          intent, // 🟢 sincronizat cu backendul (vand/cumpar/inchiriez)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la adăugarea anunțului");

      alert("✅ Anunț adăugat cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      console.error("Eroare:", err);
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Adaugă un anunț nou
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titlu anunț"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descriere"
          required
          className="w-full border p-2 rounded min-h-[100px]"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Preț (€)"
          required
          className="w-full border p-2 rounded"
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Selectează localitatea</option>
          {localitati.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Selectează categoria</option>
          {categorii.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="vand">Vând</option>
          <option value="inchiriez">Închiriez</option>
          <option value="cumpar">Cumpăr</option>
          <option value="schimb">Schimb</option>
        </select>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (opțional)"
          className="w-full border p-2 rounded"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon (07xxxxxxxx)"
          required
          pattern="^0\\d{9}$"
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="block text-sm mb-1">Imagini</label>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg w-full"
        >
          Publică anunțul
        </button>
      </form>
    </div>
  );
}
