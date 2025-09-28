import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          Oltenita Imobiliare
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/login" className="px-4">Login</Link>
          <Link to="/register" className="px-4">Register</Link>
          <Link to="/">Acasă</Link>
          <Link to="/adauga">Adaugă Anunț</Link>
          <Link to="/anunturile-mele">Anunțurile Mele</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register
