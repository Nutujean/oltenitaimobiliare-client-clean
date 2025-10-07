import { useState, useMemo } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({ imagesText, setImagesText, max = 15 }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const urls = useMemo(
    () =>
      (imagesText || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [imagesText]
  );

  const appendUrls = (newOnes) => {
    const all = [...urls, ...newOnes];
    setImagesText(all.join("\n"));
  };

  const handleSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setMsg("Lipsește configurarea Cloudinary în .env (CLOUD_NAME/UPLOAD_PRESET).");
      return;
    }

    const left = max - urls.length;
    if (left <= 0) {
      setMsg(`Ai atins limita de ${max} imagini.`);
      return;
    }

    const toUpload = files.slice(0, left);
    if (toUpload.length < files.length) {
      setMsg(`Se vor încărca doar ${toUpload.length} imagini (limită ${max}).`);
    } else {
      setMsg("");
    }

    setBusy(true);
    const done = [];

    try {
      for (const f of toUpload) {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("upload_preset", UPLOAD_PRESET);
        // opțional: folder dedicat
        fd.append("folder", "listings");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );
        const data = await res.json();
        if (res.ok && data.secure_url) {
          done.push(data.secure_url);
        } else {
          console.error("Cloudinary error:", data);
          setMsg("Unele imagini nu s-au putut încărca.");
        }
      }
      if (done.length) appendUrls(done);
    } catch (err) {
      console.error(err);
      setMsg("Eroare la încărcare imagini.");
    } finally {
      setBusy(false);
      // reset input pentru a putea selecta aceleași fișiere din nou, dacă vrei
      e.target.value = "";
    }
  };

  const removeAt = (idx) => {
    const next = urls.filter((_, i) => i !== idx);
    setImagesText(next.join("\n"));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="inline-block bg-gray-800 text-white px-4 py-2 rounded cursor-pointer hover:bg-black">
          {busy ? "Se încarcă..." : "Încarcă imagini"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSelect}
            className="hidden"
            disabled={busy}
          />
        </label>
        <span className="text-sm text-gray-600">
          {urls.length}/{max} imagini
        </span>
      </div>

      {msg && (
        <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
          {msg}
        </div>
      )}

      {/* Previews */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {urls.map((u, i) => (
            <div key={i} className="relative group border rounded overflow-hidden">
              <img
                src={u}
                alt={`img-${i}`}
                className="w-full h-28 object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                title="Șterge"
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
