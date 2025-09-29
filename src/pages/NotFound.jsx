import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Pagina nu a fost găsită</h2>
      <p className="text-gray-600 mb-6">
        Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Înapoi la Acasă
      </Link>
    </div>
  );
}
