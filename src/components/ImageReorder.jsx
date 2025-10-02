// src/components/ImageReorder.jsx
import React from "react";

export default function ImageReorder({ images, setImages, title = "Imagini" }) {
  if (!Array.isArray(images)) return null;

  const move = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const next = images.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setImages(next);
  };

  const removeAt = (idx) => {
    const next = images.slice();
    next.splice(idx, 1);
    setImages(next);
  };

  const setCover = (idx) => {
    if (idx === 0) return;
    const next = images.slice();
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    setImages(next);
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">{title} ({images.length})</h3>

      {images.length === 0 ? (
        <p className="text-sm text-gray-500">Nu ai adăugat încă imagini.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <img
                src={url}
                alt={`img-${idx}`}
                className="w-full h-28 object-cover"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x250?text=Fara+imagine")}
              />

              {/* Badge copertă */}
              <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${idx === 0 ? "bg-blue-600 text-white" : "bg-black/60 text-white"}`}>
                {idx === 0 ? "Copertă" : `#${idx + 1}`}
              </div>

              {/* Acțiuni */}
              <div className="p-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, idx - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                    aria-label="Mută sus"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, idx + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                    aria-label="Mută jos"
                  >
                    ↓
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCover(idx)}
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                    aria-label="Setează copertă"
                    title="Setează copertă"
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                    aria-label="Șterge"
                    title="Șterge"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Sfat: pune poza de copertă pe poziția #1 (butonul ★ mută imaginea pe prima poziție).
      </p>
    </div>
  );
}
