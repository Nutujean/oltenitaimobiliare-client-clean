// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Despre */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Oltenița Imobiliare</h3>
          <p className="text-sm leading-relaxed">
            Platformă locală de anunțuri imobiliare pentru Oltenița și împrejurimi.
            Publică, editează, promovează anunțuri rapid și sigur.
          </p>
        </div>

        {/* Link-uri utile – pune-le pe cele pe care le aveai */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Link-uri utile</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Acasă</a></li>
            <li><a href="/categorie/apartamente" className="hover:text-white">Apartamente</a></li>
            <li><a href="/categorie/case" className="hover:text-white">Case</a></li>
            <li><a href="/categorie/terenuri" className="hover:text-white">Terenuri</a></li>
            <li><a href="/despre" className="hover:text-white">Despre noi</a></li>
            <li><a href="/termeni" className="hover:text-white">Termeni și condiții</a></li>
            <li><a href="/confidentialitate" className="hover:text-white">Politica de confidențialitate</a></li>
            <li><a href="/cookies" className="hover:text-white">Politica cookies</a></li>
          </ul>
        </div>

        {/* Contact – formular Netlify (email + telefon + mesaj) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>

          {/* Netlify Forms */}
          <form
            name="footer-contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="space-y-3 text-sm"
          >
            {/* Netlify needs these */}
            <input type="hidden" name="form-name" value="footer-contact" />
            <input type="hidden" name="subject" value="Mesaj nou de pe oltenitaimobiliare.ro (footer)" />

            {/* Honeypot anti-spam */}
            <p className="hidden">
              <label>Nu completa: <input name="bot-field" /></label>
            </p>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                placeholder="ex: nume@email.com"
              />
            </div>

            <div>
              <label className="block mb-1">Telefon</label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                placeholder="+40 7xx xxx xxx"
              />
            </div>

            <div>
              <label className="block mb-1">Mesaj (opțional)</label>
              <textarea
                name="message"
                rows="3"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200"
                placeholder="Scrie mesajul tău..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
            >
              Trimite
            </button>

            <p className="text-[12px] text-gray-500">
              Prin trimitere ești de acord cu prelucrarea datelor conform Politicii de confidențialitate.
            </p>
          </form>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} Oltenița Imobiliare. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
