import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetaliuAnunt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anunt, setAnunt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const fetchAnunt = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
        const data = await res.json();
        setAnunt(data);
      } catch (error) {
        console.error("Eroare la încărcarea anunțului:", error);
      }
    };
    fetchAnunt();
  }, [id]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? anunt.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === anunt.images.length - 1 ? 0 : prev + 1
    );
  };

  if (!anunt) return <p className="text-center mt-8">Se încarcă...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Înapoi
      </button>

      <h1 className="text-3xl font-bold mb-4">{anunt.title}</h1>
      <p className="text-xl text-blue-600 font-semibold mb-6">{anunt.price} €</p>

      {/* Carusel imagini */}
      {anunt.images && anunt.images.length > 0 && (
        <div className="relative w-full h-96 overflow-hidden rounded-lg shadow">
          <img
            src={anunt.images[currentIndex]}
            alt="imagine anunt"
            onClick={() => setZoom(true)}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500"
          />

          {/* Butoane navigare */}
          {anunt.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl px-3 py-1 rounded-full"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl px-3 py-1 rounded-full"
              >
                ›
              </button>
            </>
          )}

          {/* Indicatori */}
          {anunt.images.length > 1 && (
            <div className="absolute bottom-2 w-full flex justify-center space-x-2">
              {anunt.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ZOOM fullscreen */}
      {zoom && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setZoom(false)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ✕
          </button>
          <img
            src={anunt.images[currentIndex]}
            alt="zoom"
            className="max-w-full max-h-full object-contain"
          />
          {/* Navigare și în fullscreen */}
          {anunt.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 text-white text-4xl"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 text-white text-4xl"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      <p className="mt-6 text-gray-700">{anunt.description}</p>
      <p className="mt-4 text-sm text-gray-500">Categorie: {anunt.category}</p>
      <p className="mt-2 text-sm text-gray-500">Status: {anunt.status}</p>
    </div>
  );
}
