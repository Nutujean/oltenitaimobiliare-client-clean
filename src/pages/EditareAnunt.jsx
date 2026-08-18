import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";
import { LOCATII } from "../constants/localitati";

const CATEGORII = [
  { value: "apartamente", label: "Apartamente" },
  { value: "garsoniere", label: "Garsoniere" },
  { value: "case", label: "Case" },
  { value: "terenuri", label: "Terenuri" },
  { value: "spatiu_comercial", label: "Spațiu comercial" },
  { value: "garaj", label: "Garaj" },
];

const TIPURI_TRANZACTIE = [
  { value: "vand", label: "Vând" },
  { value: "cumpar", label: "Cumpăr" },
  { value: "inchiriez", label: "Închiriez" },
  { value: "schimb", label: "Schimb" },
];

export default function EditareAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    type: "",
    location: "",
    phone: "",
    images: [],
    isFree: true,
  });

  const [newImages, setNewImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [draggedExistingIndex, setDraggedExistingIndex] = useState(null);
  const [draggedNewIndex, setDraggedNewIndex] = useState(null);

  const maxTotalImages = formData.isFree ? 10 : 15;

  const totalImagesCount = useMemo(
    () => (formData.images?.length || 0) + (newImageFiles?.length || 0),
    [formData.images, newImageFiles]
  );

  function normalizePhone(value) {
    if (!value) return "";
    return String(value).replace(/\D/g, "");
  }

  function validateForm(fd) {
    const title = String(fd.title || "").trim();
    const category = String(fd.category || "").trim();
    const type = String(fd.type || "").trim();
    const location = String(fd.location || "").trim();
    const phone = normalizePhone(fd.phone);

    if (!title) return "Titlul este obligatoriu.";
    if (!category) return "Categoria este obligatorie.";
    if (!type)
      return "Tipul (Vând/Cumpăr/Închiriez/Schimb) este obligatoriu.";
    if (!location) return "Localitatea este obligatorie.";
    if (!phone) return "Numărul de telefon este obligatoriu.";
    if (phone.length < 9) return "Numărul de telefon pare invalid.";

    return "";
  }

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Eroare la încărcare");
        }

        const payload = data?.listing ? data.listing : data;

        setFormData({
          title: payload.title || "",
          description: payload.description || "",
          price: payload.price ?? "",
          category: payload.category || "",
          type: payload.intent || payload.type || "",
          location: payload.location || "",
          phone: payload.phone || "",
          images: Array.isArray(payload.images) ? payload.images : [],
          isFree: payload.isFree ?? true,
        });

        setNewImages([]);
        setNewImageFiles([]);
      } catch (err) {
        setError(err.message || "Eroare");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const freeSlots = maxTotalImages - totalImagesCount;

    if (freeSlots <= 0) {
      alert(
        `Ai atins limita de ${maxTotalImages} imagini (${
          formData.isFree ? "FREE" : "PROMOVAT"
        }).`
      );

      e.target.value = "";
      return;
    }

    const accepted = files.slice(0, freeSlots);

    if (files.length > freeSlots) {
      alert(
        `Poți adăuga doar ${freeSlots} ${
          freeSlots === 1 ? "imagine" : "imagini"
        }.`
      );
    }

    setNewImageFiles((prev) => [...prev, ...accepted]);

    accepted.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        setNewImages((prev) => [...prev, event.target.result]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const replaceImage = (index, file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setNewImageFiles((prev) => [...prev, file]);

    const reader = new FileReader();

    reader.onload = (event) => {
      setNewImages((prev) => [...prev, event.target.result]);
    };

    reader.readAsDataURL(file);
  };

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExistingImage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    setFormData((prev) => {
      const arr = [...prev.images];

      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);

      return {
        ...prev,
        images: arr,
      };
    });
  };

  const moveNewImage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    setNewImages((prev) => {
      const arr = [...prev];

      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);

      return arr;
    });

    setNewImageFiles((prev) => {
      const arr = [...prev];

      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);

      return arr;
    });
  };

  const handleSave = async () => {
    try {
      if (!token || token === "undefined" || token === "null") {
        alert("Trebuie să fii logat ca să editezi anunțul.");
        navigate("/login");
        return;
      }

      const validationError = validateForm(formData);

      if (validationError) {
        alert("❌ " + validationError);
        return;
      }

      if (totalImagesCount > maxTotalImages) {
        alert(Maxim ${maxTotalImages} imagini pentru acest tip de anunț.);
        return;
      }

      setSaving(true);

      const fd = new FormData();

      fd.append("title", String(formData.title || "").trim());
      fd.append(
        "description",
        String(formData.description || "").trim()
      );
      fd.append("price", String(formData.price ?? ""));
      fd.append("category", String(formData.category || "").trim());
      fd.append("type", String(formData.type || "").trim());
      fd.append("location", String(formData.location || "").trim());
      fd.append("phone", normalizePhone(formData.phone));

      (formData.images || []).forEach((url) => {
        fd.append("existingImages", url);
      });

      (newImageFiles || []).forEach((file) => {
        fd.append("images", file);
      });

      const res = await fetch(${API_URL}/listings/${id}, {
        method: "PUT",
        headers: {
          Authorization: Bearer ${token},
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Eroare la salvare");
      }

      alert("✅ Anunț actualizat cu succes!");
      navigate("/anunturile-mele");
    } catch (err) {
      alert("❌ " + (err.message || "Eroare la salvare"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10">
        Se încarcă anunțul...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">
        ✏️ Editează Anunțul
      </h1>

      <p className="text-center text-sm text-gray-600 mb-6">
        Tip:{" "}
        <b>
          {formData.isFree
            ? "FREE (max 10 poze)"
            : "PROMOVAT (max 15 poze)"}
        </b>
      </p>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titlul anunțului"
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descriere"
          className="w-full border p-3 rounded h-32"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Preț (€) – opțional"
          className="w-full border p-3 rounded"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">
            Alege tipul (Vând / Cumpăr / Închiriez / Schimb)
          </option>

          {TIPURI_TRANZACTIE.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">
            Alege categoria
          </option>

          {CATEGORII.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">
            Alege localitatea
          </option>

          {LOCATII.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Telefon"
          className="w-full border p-3 rounded"
          required
        />

        {formData.images?.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">
              📸 Imagini existente
            </label>

            <p className="text-xs text-gray-500 mb-3">
              Prinde fotografia și trage-o direct în poziția dorită.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.images.map((img, i) => (
                <div
                  key={${img}-${i}}
                  draggable
                  onDragStart={(e) => {
                    setDraggedExistingIndex(i);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    if (
                      draggedExistingIndex !== null &&
                      draggedExistingIndex !== i
                    ) {
                      moveExistingImage(draggedExistingIndex, i);
                    }

                    setDraggedExistingIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedExistingIndex(null);
                  }}
                  className={`relative group cursor-grab active:cursor-grabbing rounded-lg transition-all duration-150 ${
                    draggedExistingIndex === i
                      ? "opacity-40 scale-95"
                      : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={img-${i}}
                    draggable={false}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm select-none"
                  />

                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                    {i + 1}
                  </div>

                  {i === 0 && (
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                      Poză principală
                    </div>
                  )}

                  <button
                    type="button"
                    draggable={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingImage(i);
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg shadow z-20"
                    title="Șterge fotografia"
                  >
                    🗑️
                  </button>

                  <button
                    type="button"
                    draggable={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      document
                        .getElementById(replace-${i})
                        ?.click();
                    }}
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg shadow z-20"
                    title="Înlocuiește fotografia"
                  >
                    🔄
                  </button>

                  <input
                    id={replace-${i}}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      replaceImage(i, e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <label className="block font-semibold mb-2">
            ➕ Adaugă imagini noi
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {newImages.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mt-4 mb-3">
                Și pozele noi pot fi prinse și mutate în poziția dorită.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {newImages.map((img, i) => (
                  <div
                    key={new-${i}}
                    draggable
                    onDragStart={(e) => {
                      setDraggedNewIndex(i);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();

                      if (
                        draggedNewIndex !== null &&
                        draggedNewIndex !== i
                      ) {
                        moveNewImage(draggedNewIndex, i);
                      }

                      setDraggedNewIndex(null);
                    }}
                    onDragEnd={() => {
                      setDraggedNewIndex(null);
                    }}
                    className={`relative group cursor-grab active:cursor-grabbing rounded-lg transition-all duration-150 ${
                      draggedNewIndex === i
                        ? "opacity-40 scale-95"
                        : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={new-${i}}
                      draggable={false}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm select-none"
                    />

                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                      {i + 1}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                      Nouă
                    </div>

                    <button
                      type="button"
                      draggable={false}
                      onClick={() => removeNewImage(i)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg shadow"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="text-xs text-gray-500 mt-3">
            Total imagini: <b>{totalImagesCount}</b> / {maxTotalImages}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-medium"
          >
            {saving
              ? "Se salvează..."
              : "💾 Salvează modificările"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/anunturile-mele")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            ← Înapoi
          </button>
        </div>
      </div>
    </div>
  );
}