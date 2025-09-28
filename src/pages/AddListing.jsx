import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "Apartament",
    rooms: "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post(`${API_URL}/api/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, res.data.url],
      }));
    } catch (err) {
      console.error(err);
      alert("Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/listings`, formData);
      alert("Anunț adăugat cu succes!");
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        type: "Apartament",
        rooms: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      alert("Eroare la adăugare anunț");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Adaugă un anunț</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* restul inputurilor */}
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500">Se încarcă...</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Salvează anunț
        </button>
      </form>
    </div>
  );
}
