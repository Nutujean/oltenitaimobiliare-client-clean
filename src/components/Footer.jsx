import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:oltenitaimobiliare@gmail.com?subject=Mesaj de la ${encodeURIComponent(
      form.name
    )}&body=${encodeURIComponent(form.message)}%0A%0ADe la: ${encodeURIComponent(
      form.email
    )}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* 🌐 Despre site */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Oltenița Imobiliare 🏠</h2>
          <p className="text-sm leading-relaxed">
            Platforma locală de anunțuri imobiliare pentru Oltenița și împrejurimi. 
            Găsește rapid apartamente, case, terenuri și spații comerciale disponibile în zonă.
            Totul simplu, rapid și sigur — locul unde fiecare proprietate își găsește cumpărătorul potrivit.
          </p>
          <div className="flex justify-start mt-4">
            <Link
              to="/adauga-anunt"
              className="text-lg font-semibold flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
            >
              ➕ Adaugă anunț
            </Link>
          </div>
        </div>

        {/* 🔗 Linkuri utile */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Linkuri utile</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/despre" className="hover:text-white">Despre noi</Link></li>
            <li><Link to="/termeni" className="hover:text-white">Termeni și condiții</Link></li>
            <li><Link to="/confidentialitate" className="hover:text-white">Politica de confidențialitate</Link></li>
            <li><Link to="/cookies" className="hover:text-white">Politica cookies</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* ✉️ Formular contact */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Trimite-ne un mesaj</h2>
          {sent ? (
            <p className="text-green-400">Mulțumim! Mesajul tău a fost pregătit pentru trimitere.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Numele tău"
                required
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
              />
              <input
                type="email"
                name="email"
                placeholder="Emailul tău"
                required
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
              />
              <textarea
                name="message"
                placeholder="Mesajul tău"
                required
                rows="3"
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
              >
                Trimite
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 🔸 Copyright */}
      <div className="text-center py-4 border-t border-gray-700 text-sm text-gray-500">
        © {new Date().getFullYear()} Oltenița Imobiliare. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
