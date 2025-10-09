{editingId === l._id ? (
  <div className="p-4 border rounded-xl bg-gray-50 shadow-inner space-y-4">
    <h3 className="text-xl font-semibold mb-3">Editează anunțul</h3>

    {/* 🖼️ Afișează imaginile existente */}
    {form.images?.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {form.images.map((img, idx) => (
          <div key={idx} className="relative">
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`imagine-${idx}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
          </div>
        ))}
      </div>
    )}

    {/* 📤 Încarcă imagini noi */}
    <input
      type="file"
      multiple
      onChange={(e) =>
        setForm({
          ...form,
          images: [
            ...(form.images || []),
            ...Array.from(e.target.files || []),
          ],
        })
      }
      className="block w-full border p-2 rounded-md"
    />

    {/* ✏️ Titlu */}
    <input
      type="text"
      value={form.title || ""}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
      placeholder="Titlu anunț"
      className="block w-full border p-2 rounded-md"
    />

    {/* 💰 Preț */}
    <input
      type="number"
      value={form.price || ""}
      onChange={(e) => setForm({ ...form, price: e.target.value })}
      placeholder="Preț"
      className="block w-full border p-2 rounded-md"
    />

    {/* 🏠 Locație */}
    <input
      type="text"
      value={form.location || ""}
      onChange={(e) => setForm({ ...form, location: e.target.value })}
      placeholder="Localitate / zonă"
      className="block w-full border p-2 rounded-md"
    />

    {/* 📝 Descriere */}
    <textarea
      value={form.description || ""}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      placeholder="Descriere anunț"
      className="block w-full border p-2 rounded-md min-h-[100px]"
    />

    {/* 🔘 Butoane */}
    <div className="flex gap-3">
      <button
        onClick={() => handleSave(l._id)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Salvează modificările
      </button>
      <button
        onClick={() => setEditingId(null)}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
      >
        Anulează
      </button>
    </div>
  </div>
) : (
  // restul codului pentru afișarea anunțurilor rămâne neschimbat
)}
