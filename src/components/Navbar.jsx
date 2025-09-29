import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Oltenița Imobiliare
        </Link>

        {/* Meniu */}
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-600">
            Acasă
          </Link>
          <Link to="/anunturile-mele" className="hover:text-blue-600">
            Anunțurile Mele
          </Link>
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link to="/register" className="hover:text-blue-600">
            Register
          </Link>

          {/* Buton special */}
          <Link
            to="/adauga-anunt"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Adaugă anunț
          </Link>
        </div>
      </div>
    </nav>
  );
}
