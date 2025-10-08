import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

export default function AnunturileMele() {
  const [anunturi, setAnunturi] = useState([]);
  const [error, setError] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchMyListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLogged(false);
        setError("Trebuie să fii autentificat pentru a-ți vedea anunțurile.");
        return;
      }

      setIsLogged(true);

      try {
        const res = await fetch(`${API_URL}/listings/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Eroare la încărcare");
        setAnunturi(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyListings();
  }, []);

  if (!isLogged)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-red-600 mb-3">
          Trebuie să fii autentificat
        </h2>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Autentifică-te
        </Link>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );

  if (anunturi.length === 0)
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Nu ai încă niciun anunț.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Anunțurile Mele</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {anunturi.map((a) => (
          <div
            key={a._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {a.images?.[0] && (
              <img
                src={a.images[0]}
                alt={a.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold line-clamp-2">{a.title}</h3>
              <p className="text-gray-600">{a.price} €</p>
              <p className="text-sm text-gray-500">{a.location}</p>

              <div className="flex justify-between mt-3">
                <Link
                  to={`/editeaza-anunt/${a._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Editează
                </Link>
                <Link
                  to={`/anunt/${a._id}`}
                  className="text-green-600 hover:underline"
                >
                  Vizualizează
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
