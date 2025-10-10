import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API_URL from "../api";

export default function AnunturileMele() {
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    category: "",
    images: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Eroare la încărcarea anunțurilor:", e);
    }
  };

  const handleEdit = (l) => {
    setEditingId(l._id);
    setForm({ ...l });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;
    try {
      await fetch(`${API_URL}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchListings();
    } catch (e) {
      alert("Eroare la ștergere: " + e.message);
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Eroare la salvare");
      alert("✅ Anunț actualizat!");
      setEditingId(null);
      fetchListings();
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...form.images];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => newImages.push(ev.target.result);
      reader.readAsDataURL(file);
    });
    setForm({ ...form, images: newImages });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(form.images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setForm({ ...form, images: reordered });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Anunțurile Mele
      </h1>

      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">Nu ai încă anunțuri.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((l) =>
            editingId === l._id ? (
              <div
                key={l._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
                  ✏️ Editează anunțul
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Titlu
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full border p-2 rounded mb-3"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Preț (€)
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full border p-2 rounded mb-3"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Locație
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full border p-2 rounded mb-3"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Categorie
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full border p-2 rounded mb-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descriere
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full border p-2 rounded h-40"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Poze (poți trage pentru a le reordona)
                  </h3>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex flex-wrap gap-3 mb-3"
                        >
                          {form.images.map((img, idx) => (
                            <Draggable
                              key={idx}
                              draggableId={String(idx)}
                              index={idx}
                            >
                              {(prov) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className="relative border border-blue-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-32 h-32 object-cover"
                                  />
                                  <button
                                    onClick={() =>
                                      setForm({
                                        ...form,
                                        images: form.images.filter(
                                          (_, i) => i !== idx
                                        ),
                                      })
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="mb-3"
                  />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => handleSave(l._id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Salvează
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Anulează
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={l._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {l.images?.length > 0 && (
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-blue-700 font-bold text-lg">{l.price} €</p>
                  <h3 className="font-bold text-xl mb-1">{l.title}</h3>
                  <p className="text-gray-600">{l.location}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(l)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Editează
                    </button>
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
