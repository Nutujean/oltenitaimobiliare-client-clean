// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      {/* 🔷 BARĂ DE PROMOVARE CU UMBRĂ */}
<div className="bg-blue-600 text-white py-6 shadow-lg relative z-10 rounded-t-2xl">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
    <h2 className="text-lg font-semibold drop-shadow-md flex items-center justify-center gap-2">
      <span className="text-2xl">🏠</span> 
      <span>Publică gratuit anunțul tău pe <strong>Oltenița Imobiliare</strong></span>
    </h2>
    <Link
      to="/adauga-anunt"
      className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition shadow-sm"
    >
      + Adaugă anunț
    </Link>
  </div>
</div>

      {/* 🔽 FOOTER PRINCIPAL */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-0">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          
          {/* 🏠 Despre noi */}
          <div className="md:col-span-3 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">Oltenița Imobiliare</h3>
            <p className="text-sm leading-relaxed text-gray-400 max-w-2xl mx-auto">
              Platforma locală de anunțuri imobiliare pentru Oltenița și împrejurimi.
              Găsește rapid apartamente, garsoniere, case, terenuri și spații comerciale 
              disponibile în zonă. Totul simplu, rapid și sigur.
            </p>
            <p className="text-sm leading-relaxed text-gray-400 mt-3 max-w-2xl mx-auto">
              Scopul nostru este să susținem comunitatea locală printr-un portal modern, 
              intuitiv și ușor de folosit, unde fiecare proprietar își poate promova 
              locuința fără comisioane ascunse. 
              Ne dorim ca Oltenița Imobiliare să devină primul pas spre noua ta casă.
            </p>
          </div>

          {/* 🔗 Link-uri utile */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Link-uri utile</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Acasă</a></li>
              <li><a href="/categorie/apartamente" className="hover:text-white">Apartamente</a></li>
              <li><a href="/categorie/garsoniere" className="hover:text-white">Garsoniere</a></li>
              <li><a href="/categorie/case" className="hover:text-white">Case</a></li>
              <li><a href="/categorie/terenuri" className="hover:text-white">Terenuri</a></li>
              <li><a href="/categorie/spatii-comerciale" className="hover:text-white">Spații comerciale</a></li>
              <li><a href="/despre" className="hover:text-white">Despre noi</a></li>
              <li><a href="/termeni" className="hover:text-white">Termeni și condiții</a></li>
              <li><a href="/confidentialitate" className="hover:text-white">Politica de confidențialitate</a></li>
              <li><a href="/cookies" className="hover:text-white">Politica cookies</a></li>
            </ul>
          </div>

          {/* ✉️ Formular Contact – Netlify */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
            <form
              name="footer-contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-3 text-sm"
            >
              <input type="hidden" name="form-name" value="footer-contact" />
              <input type="hidden" name="subject" value="Mesaj nou din footer Oltenița Imobiliare" />
              <p className="hidden">
                <label>Nu completa: <input name="bot-field" /></label>
              </p>

              <div>
                <label className="block mb-1 text-gray-400">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                  placeholder="ex: nume@email.com"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-400">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                  placeholder="+40 7xx xxx xxx"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-400">Mesaj (opțional)</label>
                <textarea
                  name="message"
                  rows="3"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                  placeholder="Scrie mesajul tău..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg mt-2"
              >
                Trimite
              </button>
            </form>
          </div>
        </div>

        {/* ❤️ Subsol final */}
        <div className="text-center text-sm text-gray-500 mt-12 border-t border-gray-800 pt-5">
          <p>© {new Date().getFullYear()} Oltenița Imobiliare. Toate drepturile rezervate.</p>
          <p className="mt-1 text-gray-400">Realizat cu ❤️ în Oltenița</p>
        </div>
      </footer>
    </>
  );
}
