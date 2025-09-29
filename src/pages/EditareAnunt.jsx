import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  const token = localStorage.getItem("token");

  /* ========================
     Load anunț by ID
  ======================== */
  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/listings/${id}`
      );
      if (res.ok) {
        const data = await res.json();
        setListing(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);
        setLocation(data.location);
        setImages(data.images || []);
      }
    };
    fetchListing();
  }, [id]);

  /* ========================
     Upload poze pe Cloudinary
  ======================== */
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 15) {
      alert("Poți adăuga maxim 15 imagini!");
      return;
    }

    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    setImages((prev) => [...prev, ...uploaded]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ========================
     Save editări
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
      method: "PUT",
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
        images,
      }),
    });

    if (res.ok) {
      alert("Anunț actualizat cu succes!");
      navigate("/anunturile-mele");
    } else {
      alert("Eroare la actualizare!");
    }
  };

  if (!listing) return <p className="text-center mt-6">Se încarcă...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Editează Anunțul</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titlu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows="4"
          required
        />
        <input
          type="number"
          placeholder="Preț"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Categorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Localitate"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* ✅ Galerie poze */}
        <div>
          <p className="font-semibold mb-2">Imagini</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt="poza"
                  className="rounded h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="mt-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Salvează modificările
        </button>
      </form>
    </div>
  );
}
