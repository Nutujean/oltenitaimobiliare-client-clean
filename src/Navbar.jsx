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
    <nav className="navbar">
      <Link to="/">Acasă</Link>
      <Link to="/adauga-anunt">Adaugă anunț</Link>

      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Înregistrare</Link>
        </>
      ) : (
        <>
          <span>Bun venit, {user?.name || "Utilizator"}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}
