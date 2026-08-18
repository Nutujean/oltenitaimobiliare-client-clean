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
  const [dragOverExistingIndex, setDragOverExistingIndex] = useState(null);

  const [draggedNewIndex, setDraggedNewIndex] = useState(null);
  const [dragOverNewIndex, setDragOverNewIndex] = useState(null);

  const maxTotalImages = formData.isFree ? 10 : 15;

  const totalImagesCount = useMemo(() => {
    return (
      (formData.images ? formData.images.length : 0) +
      (newImageFiles ? newImageFiles.length : 0)
    );
  }, [formData.images, newImageFiles]);

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
    if (!type) {
      return "Tipul (Vând/Cumpăr/Închiriez/Schimb) este obligatoriu.";
    }
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

        const res = await fetch(API_URL + "/listings/" + id);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Eroare la încărcare");
        }

        const payload = data && data.listing ? data.listing : data;

        setFormData({
          title: payload.title || "",
          description: payload.description || "",
          price: payload.price !== undefined ? payload.price : "",
          category: payload.category || "",
          type: payload.intent || payload.type || "",
          location: payload.location || "",
          phone: payload.phone || "",
          images: Array.isArray(payload.images) ? payload.images : [],
          isFree: payload.isFree !== undefined ? payload.isFree : true,
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

  // =========================================================
  // ADĂUGARE IMAGINI NOI
  // =========================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const imageFiles = files.filter((file) => {
      return file.type && file.type.startsWith("image/");
    });

    if (!imageFiles.length) {
      alert("Selectează doar fișiere imagine.");
      e.target.value = "";
      return;
    }

    const freeSlots = maxTotalImages - totalImagesCount;

    if (freeSlots <= 0) {
      alert(
        "Ai atins limita de " +
          maxTotalImages +
          " imagini (" +
          (formData.isFree ? "FREE" : "PROMOVAT") +
          ")."
      );

      e.target.value = "";
      return;
    }

    const accepted = imageFiles.slice(0, freeSlots);

    if (imageFiles.length > freeSlots) {
      alert(
        "Poți adăuga doar " +
          freeSlots +
          (freeSlots === 1 ? " imagine." : " imagini.") +
          " Limita totală este " +
          maxTotalImages +
          "."
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

  // =========================================================
  // ÎNLOCUIRE IMAGINE EXISTENTĂ
  // =========================================================

  const replaceImage = (index, file) => {
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      alert("Selectează un fișier imagine.");
      return;
    }

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

  // =========================================================
  // ȘTERGERE
  // =========================================================

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

  // =========================================================
  // MUTARE POZE EXISTENTE PRIN DRAG & DROP
  // =========================================================

  const moveExistingImage = (fromIndex, toIndex) => {
    if (fromIndex === null) return;
    if (toIndex === null) return;
    if (fromIndex === toIndex) return;

    setFormData((prev) => {
      const arr = [...prev.images];
      const movedItems = arr.splice(fromIndex, 1);

      if (!movedItems.length) return prev;

      arr.splice(toIndex, 0, movedItems[0]);

      return {
        ...prev,
        images: arr,
      };
    });
  };

  // =========================================================
  // MUTARE POZE NOI PRIN DRAG & DROP
  // =========================================================

  const moveNewImage = (fromIndex, toIndex) => {
    if (fromIndex === null) return;
    if (toIndex === null) return;
    if (fromIndex === toIndex) return;

    setNewImages((prev) => {
      const arr = [...prev];
      const movedItems = arr.splice(fromIndex, 1);

      if (!movedItems.length) return prev;

      arr.splice(toIndex, 0, movedItems[0]);
      return arr;
    });

    setNewImageFiles((prev) => {
      const arr = [...prev];
      const movedItems = arr.splice(fromIndex, 1);

      if (!movedItems.length) return prev;

      arr.splice(toIndex, 0, movedItems[0]);
      return arr;
    });
  };

  // =========================================================
  // SALVARE
  // =========================================================

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
        alert(
          "Maxim " +
            maxTotalImages +
            " imagini pentru acest tip de anunț."
        );
        return;
      }

      setSaving(true);

      const fd = new FormData();

      fd.append("title", String(formData.title || "").trim());
      fd.append(
        "description",
        String(formData.description || "").trim()
      );
      fd.append("price", String(formData.price || ""));
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

      const res = await fetch(API_URL + "/listings/" + id, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
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

        {/* =====================================================
            IMAGINI EXISTENTE
        ====================================================== */}

        {formData.images && formData.images.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">
              📸 Imagini
            </label>

            <p className="text-sm text-gray-600 mb-3">
              Prinde fotografia cu mouse-ul și trage-o în poziția dorită.
              Prima fotografie este poza principală.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.images.map((img, i) => (
                <div
                  key={String(img) + "-" + String(i)}
                  draggable={true}
                  onDragStart={(e) => {
                    setDraggedExistingIndex(i);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOverExistingIndex(i);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOverExistingIndex(i);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    moveExistingImage(
                      draggedExistingIndex,
                      i
                    );

                    setDraggedExistingIndex(null);
                    setDragOverExistingIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedExistingIndex(null);
                    setDragOverExistingIndex(null);
                  }}
                  className={
                    "relative group rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 " +
                    (draggedExistingIndex === i
                      ? "opacity-40 scale-95 "
                      : "") +
                    (dragOverExistingIndex === i &&
                    draggedExistingIndex !== i
                      ? "ring-4 ring-blue-400 scale-[1.03] "
                      : "")
                  }
                >
                  <img
                    src={img}
                    alt={"img-" + i}
                    draggable={false}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm select-none"
                  />

                  <div className="absolute top-2 left-2 bg-black/75 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
                    {i + 1}
                  </div>

                  {i === 0 && (
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded pointer-events-none">
                      ⭐ Principală
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

                      const input = document.getElementById(
                        "replace-" + i
                      );

                      if (input) {
                        input.click();
                      }
                    }}
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg shadow z-20"
                    title="Înlocuiește fotografia"
                  >
                    🔄
                  </button>

                  <input
                    id={"replace-" + i}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file =
                        e.target.files &&
                        e.target.files.length > 0
                          ? e.target.files[0]
                          : null;

                      replaceImage(i, file);
                      e.target.value = "";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            IMAGINI NOI
        ====================================================== */}

        <div className="mt-5">
          <label className="block font-semibold mb-2">
            ➕ Adaugă imagini noi
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm"
          />

          {newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                Și fotografiile noi pot fi prinse și mutate.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {newImages.map((img, i) => (
                  <div
                    key={"new-" + String(i)}
                    draggable={true}
                    onDragStart={(e) => {
                      setDraggedNewIndex(i);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragOverNewIndex(i);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setDragOverNewIndex(i);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();

                      moveNewImage(
                        draggedNewIndex,
                        i
                      );

                      setDraggedNewIndex(null);
                      setDragOverNewIndex(null);
                    }}
                    onDragEnd={() => {
                      setDraggedNewIndex(null);
                      setDragOverNewIndex(null);
                    }}
                    className={
                      "relative group rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 " +
                      (draggedNewIndex === i
                        ? "opacity-40 scale-95 "
                        : "") +
                      (dragOverNewIndex === i &&
                      draggedNewIndex !== i
                        ? "ring-4 ring-blue-400 scale-[1.03] "
                        : "")
                    }
                  >
                    <img
                      src={img}
                      alt={"new-" + i}
                      draggable={false}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm select-none"
                    />

                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
                      NOUĂ {i + 1}
                    </div>

                    <button
                      type="button"
                      draggable={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNewImage(i);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg shadow z-20"
                      title="Șterge fotografia"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-3">
            Total imagini:{" "}
            <b>{totalImagesCount}</b> /{" "}
            <b>{maxTotalImages}</b>
          </div>
        </div>

        {/* =====================================================
            BUTOANE
        ====================================================== */}

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