import { useState } from "react";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;

export default function ImageUploader({ value = [], onChange, max = 12 }) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    if (!CLOUD || !PRESET) {
      alert("Cloudinary nu este configurat corect (verifică .env).");
      return;
    }
    setUploading(true);

    const newUrls = [];
    for (const file of list) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);
      // opțional: fd.append("folder", "listings");

      const res = await fetch(ENDPOINT, { method: "POST", body: fd });
      if (!res.ok) {
        const t = await res.text();
        console.error("Cloudinary upload error:", t);
        continue;
      }
      const json = await res.json();
      if (json.secure_url) newUrls.push(json.secure_url);
    }

    setUploading(false);
    onChange([...(value || []), ...newUrls].slice(0, max));
  };

  const removeAt = (idx) => {
    const copy = [...value];
    copy.splice(idx, 1);
    onChange(copy);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Fotografii</label>

      <div className="flex items-center gap-3 mb-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading || (value?.length || 0) >= max}
        />
        <span className="text-sm text-gray-500">
          {uploading ? "Se încarcă..." : `${value?.length || 0}/${max} imagini`}
        </span>
      </div>

      {value && value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt={`img-${i}`} className="w-full h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
