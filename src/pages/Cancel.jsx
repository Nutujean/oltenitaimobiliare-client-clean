import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          ❌ Plata a fost anulată
        </h1>
        <p className="text-gray-600 mb-6">
          Nu s-a efectuat nicio plată. Poți reveni și alege un alt plan de promovare
          oricând dorești.
        </p>

        <Link
          to="/anunturile-mele"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          ← Înapoi la anunțurile mele
        </Link>
      </div>
    </div>
  );
}
