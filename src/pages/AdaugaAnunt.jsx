import { useState } from "react";

export default function AdaugaAnunt() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  // ✅ Upload multiplu de poze (max 15)
  const handleImageUpload = async (files) => {
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
        if (data.secure_url) {
          uploadedImages.push(data.secure_url);
        }
      } catch (err) {
        console.error("❌ Eroare la upload imagine:", err);
      }
    }

    return uploadedImages;
  };

  // ✅ Trimitem anunțul la backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    try {
      const uploadedImages = await handleImageUpload(images);

      const bodyToSend = {
        title,
        description,
        price,
        category,
        location,
        images: uploadedImages, // array complet cu poze
        userEmail,
      };

      console.log("📤 Body trimis la backend:", bodyToSend);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyToSend),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Eroare la salvarea anunțului: ${errText}`);
      }

      const data = await res.json();
      console.log("✅ Anunț salvat:", data);
      alert("✅ Anunț adăugat cu succes!");
    } catch (err) {
      console.error("❌ Eroare fetch:", err);
      alert("❌ Eroare la salvarea anunțului");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Adaugă un anunț</h2>
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
          placeholder="Locație"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* ✅ Input poze cu limită de 15 */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 15) {
              alert("Poți încărca maximum 15 poze!");
              return;
            }
            setImages(files);
          }}
          className="w-full border p-2 rounded"
        />

        {/* ✅ Preview poze */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {Array.from(images).map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Adaugă anunț
        </button>
      </form>
    </div>
  );
}
