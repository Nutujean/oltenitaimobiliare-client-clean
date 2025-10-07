import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow px-6 py-4">
      <Link to="/" className="text-xl font-semibold text-blue-600">
        Oltenița Imobiliare
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-blue-600">Acasă</Link>
        <Link to="/adauga-anunt" className="hover:text-blue-600">Adaugă anunț</Link>

        {!token ? (
          <>
            <Link to="/login" className="text-blue-600 font-medium">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Înregistrare
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-700">Salut, {user?.name || "Utilizator"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
