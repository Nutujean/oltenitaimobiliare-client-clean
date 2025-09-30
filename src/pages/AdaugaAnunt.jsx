import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdaugaAnunt() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 15) {
      alert("Maxim 15 imagini sunt permise!");
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = [];

      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );

        const imgData = await res.json();
        uploadedImages.push(imgData.secure_url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      console.error("Eroare la upload:", error);
      alert("Nu s-au putut încărca pozele.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Anunț adăugat cu succes!");
        navigate("/anunturile-mele");
      } else {
        alert("❌ Eroare la adăugarea anunțului.");
      }
    } catch (error) {
      console.error("Eroare:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Adaugă un anunț</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Titlu"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Descriere"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Preț (€)"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Selectează categoria</option>
          <option value="Apartamente">Apartamente</option>
          <option value="Case">Case</option>
          <option value="Terenuri">Terenuri</option>
          <option value="Garsoniere">Garsoniere</option>
          <option value="Garaje">Garaje</option>
          <option value="Spații comerciale">Spații comerciale</option>
        </select>

        {/* Upload poze */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* Previzualizare */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {formData.images.map((img, i) => (
              <img key={i} src={img} alt="preview" className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {uploading ? "Se încarcă..." : "Adaugă anunț"}
        </button>
      </form>
    </div>
  );
}
