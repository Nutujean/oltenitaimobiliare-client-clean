import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function CloudinaryUploader({
  value = [],            // array cu URL-uri
  onChange = () => {},
  max = 15,              // limită max. imagini
  folder = "oltenitaimobiliare", // opțional: folder în Cloudinary
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const handleSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary nu este configurat (lipsesc variabilele VITE_CLOUDINARY_*).");
      return;
    }

    // respectă limita
    const slots = Math.max(0, max - value.length);
    const toUpload = files.slice(0, slots);
    if (toUpload.length < files.length) {
      setError(`Sunt permise max. ${max} imagini. Se vor încărca doar primele ${toUpload.length}.`);
    } else {
      setError("");
    }

    setBusy(true);
    try {
      const uploaded = [];
      for (const file of toUpload) {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", UPLOAD_PRESET);
        if (folder) form.append("folder", folder);

        const r = await fetch(uploadUrl, { method: "POST", body: form });
        const data = await r.json();
        if (!r.ok || !data.secure_url) {
          throw new Error(data?.error?.message || "Upload eșuat");
        }
        uploaded.push(data.secure_url);
      }
      onChange([...value, ...uploaded]);
    } catch (e) {
      setError(e.message || "Eroare la upload");
    } finally {
      setBusy(false);
      e.target.value = ""; // reset file input
    }
  };

  const removeAt = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="block text-sm font-medium">Imagini</label>
          <p className="text-xs text-gray-500">
            Poți încărca până la {max} imagini. Prima imagine devine copertă.
          </p>
        </div>
        <label className="inline-block bg-gray-800 text-white px-3 py-2 rounded cursor-pointer hover:bg-black">
          {busy ? "Se încarcă..." : "Încarcă imagini"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelect}
            disabled={busy || value.length >= max}
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {value.length === 0 ? (
        <div className="text-sm text-gray-500">Nicio imagine încărcată.</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {value.map((url, i) => (
            <li key={url} className="bg-gray-50 rounded overflow-hidden border">
              <div className="aspect-video bg-gray-100">
                <img
                  src={url}
                  alt={`img-${i}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                    disabled={i === 0}
                    title="Mută la stânga"
                  >
                    ⬅️
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                    disabled={i === value.length - 1}
                    title="Mută la dreapta"
                  >
                    ➡️
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  title="Șterge imaginea"
                >
                  Șterge
                </button>
              </div>
              {i === 0 && (
                <div className="px-2 pb-2 text-xs text-green-700">Copertă</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
