import { useState, useEffect } from "react";
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
  const [previewUrls, setPreviewUrls] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [error, setError] = useState("");
  const [mustPromote, setMustPromote] = useState(false);

  // ✅ NOU: alegere Gratuit / Promovat
  const [plan, setPlan] = useState("free"); // "free" | "paid"

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || token === "undefined" || token === "null" || token.trim() === "") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [token]);

  const localitati = [
    "Oltenița", "Chirnogi", "Curcani", "Spanțov", "Radovanu", "Ulmeni",
    "Clătești", "Negoești", "Șoldanu", "Luica", "Nana", "Budesti",
    "Chiselet", "Căscioarele", "Mănăstirea", "Valea Roșie", "Mitreni",
  ];

  const categorii = [
    "Apartamente",
    "Garsoniere",
    "Case",
    "Terenuri",
    "Spatii comerciale",
    "Garaje",
  ];

  const maxImages = plan === "paid" ? 15 : 10;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ✅ limitare imagini (10 free / 15 paid)
    const sliced = files.slice(0, maxImages);
    setImages(sliced);

    // cleanup previews vechi
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls(sliced.map((file) => URL.createObjectURL(file)));

    if (files.length > maxImages) {
      setError(`Ai selectat ${files.length} poze. Limita este ${maxImages} pentru ${plan === "paid" ? "Promovat" : "Gratuit"}.`);
    } else {
      setError("");
    }
  };

  useEffect(() => {
    // cleanup la unmount
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMustPromote(false);

    if (!token) {
      navigate("/login");
      return;
    }

    if (!title || !description || !price || !category || !location || !phone) {
      alert("Completează toate câmpurile obligatorii!");
      return;
    }

    if (parseFloat(price) <= 0) {
      alert("⚠️ Introdu un preț valid, mai mare de 0 euro!");
      return;
    }

    if (!/^0\d{9}$/.test(phone)) {
      alert("⚠️ Număr de telefon invalid (ex: 07xxxxxxxx)");
      return;
    }

    if (!images.length) {
      alert("⚠️ Adaugă cel puțin o imagine!");
      return;
    }

    if (images.length > maxImages) {
      alert(`⚠️ Prea multe imagini. Maxim ${maxImages} pentru ${plan === "paid" ? "Promovat" : "Gratuit"}.`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("intent", intent);

      // ✅ CHEIA PROBLEMEI:
      // Gratuit => isFree=true (aplică regula)
      // Promovat => isFree=false (nelimitat / publicare imediată)
      formData.append("isFree", plan === "paid" ? "false" : "true");

      images.forEach((file) => formData.append("images", file));

      const res = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // dacă ai păstrat acest flow în backend, îl lăsăm
        if (data.mustPay) {
          setError(
            data.message ||
              "Ai deja un anunț gratuit activ sau recent pentru acest număr de telefon. Poți adăuga alt anunț doar dacă promovezi unul dintre anunțurile existente sau după ce trec aproximativ 15 zile."
          );
          setMustPromote(true);
          return;
        }
        throw new Error(data.error || "Eroare la adăugarea anunțului");
      }

      sessionStorage.setItem("refreshAnunturi", "true");
      sessionStorage.setItem("anuntAdaugat", "✅ Anunțul tău a fost publicat cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      console.error("Eroare:", err);
      setError(err.message || "A apărut o eroare la publicarea anunțului.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🔒 Acces restricționat</h2>
          <p className="text-gray-600 mb-6">
            Trebuie să fii logat pentru a adăuga un anunț.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold w-full sm:w-auto"
            >
              🔐 Autentifică-te
            </button>
            <button
              onClick={() => navigate("/inregistrare")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold w-full sm:w-auto"
            >
              🆕 Creează cont
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">
        Adaugă un anunț nou
      </h1>

      {/* ✅ NOU: Gratuit / Promovat */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPlan("free")}
          className={`p-3 rounded-xl border text-left ${
            plan === "free"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-900">Gratuit</div>
          <div className="text-xs text-gray-600">Max 10 poze</div>
        </button>

        <button
          type="button"
          onClick={() => setPlan("paid")}
          className={`p-3 rounded-xl border text-left ${
            plan === "paid"
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-gray-900">Promovat (plătit)</div>
          <div className="text-xs text-gray-600">Publici imediat • Max 15 poze</div>
        </button>
      </div>

      {error && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm ${
            mustPromote
              ? "bg-yellow-100 border border-yellow-300 text-yellow-900"
              : "bg-red-100 border border-red-300 text-red-900"
          }`}
        >
          <strong>
            {mustPromote ? "Limită anunțuri gratuite" : "Eroare"}
          </strong>
          <p className="mt-1">{error}</p>

          {mustPromote && (
            <div className="mt-3 space-y-2 text-xs text-yellow-800">
              <p>
                Poți păstra anunțul gratuit existent, iar pentru a publica anunțuri
                suplimentare poți:
              </p>
              <ul className="list-disc list-inside">
                <li>promova unul dintre anunțurile tale existente; sau</li>
                <li>așteapta 15 zile de la expirarea anunțului gratuit.</li>
              </ul>
              <button
                type="button"
                onClick={() => navigate("/anunturile-mele")}
                className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-yellow-500 text-xs font-semibold text-gray-900 hover:bg-yellow-600"
              >
                Vezi anunțurile mele și promovează
              </button>
            </div>
          )}
        </div>
      )}

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
          placeholder="Preț (în €)"
          required
          min="1"
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
          pattern="^0[0-9]{9}$"
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="block text-sm mb-1">
            Imagini (max {maxImages} pentru {plan === "paid" ? "Promovat" : "Gratuit"})
          </label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {previewUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`text-white font-semibold px-4 py-2 rounded-lg w-full ${
            plan === "paid"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {plan === "paid" ? "Publică Promovat" : "Publică anunțul"}
        </button>
      </form>
    </div>
  );
}
