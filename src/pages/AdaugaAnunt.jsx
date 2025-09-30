import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AdaugaAnunt() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("apartamente");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        // 🔹 optimizăm link-ul direct după upload
        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/f_auto,q_auto/"
        );

        uploadedImages.push(optimizedUrl);
      } catch (error) {
        console.error("Eroare la upload:", error);
      }
    }

    setImages((prev) => [...prev, ...uploadedImages]);
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
        body: JSON.stringify({
          title,
          price,
          description,
          category,
          images,
        }),
      });

      if (res.ok) {
        navigate("/anunturile-mele");
      } else {
        console.error("Eroare la adăugarea anunțului");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Adaugă un anunț - Oltenița Imobiliare</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Adaugă un anunț nou</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titlu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Preț (€)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows="5"
          required
        ></textarea>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="apartamente">Apartamente</option>
          <option value="case">Case</option>
          <option value="terenuri">Terenuri</option>
          <option value="garsoniere">Garsoniere</option>
          <option value="garaje">Garaje</option>
          <option value="spații comerciale">Spații comerciale</option>
        </select>

        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />

        {/* Preview poze */}
        <div className="flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Preview ${idx}`}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Adaugă anunț
        </button>
      </form>
    </div>
  );
}
