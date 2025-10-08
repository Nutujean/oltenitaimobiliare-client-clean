import { useSearchParams, Link } from "react-router-dom";

export default function PromovareSucces() {
  const [params] = useSearchParams();
  const listingId = params.get("listingId");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Promovare reușită!
      </h1>
      <p className="text-gray-700 mb-6">
        Anunțul tău a fost promovat cu succes.
      </p>
      {listingId && (
        <Link
          to={`/anunt/${listingId}`}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Vezi anunțul promovat
        </Link>
      )}
      <Link
        to="/anunturile-mele"
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Înapoi la anunțurile mele
      </Link>
    </div>
  );
}
