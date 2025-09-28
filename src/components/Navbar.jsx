import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Oltenita<span className="text-gray-800">Imobiliare</span>
        </Link>

        {/* Meniu */}
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-600 transition">
            Acasă
          </Link>
          <Link to="/adauga-anunt" className="hover:text-blue-600 transition">
            Adaugă anunț
          </Link>
          <Link to="/login" className="hover:text-blue-600 transition">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Înregistrează-te
          </Link>
        </div>
      </div>
    </nav>
  );
}
