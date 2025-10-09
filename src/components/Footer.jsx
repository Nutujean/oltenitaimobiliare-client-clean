// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Despre noi */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Despre Oltenița Imobiliare
          </h3>
          <p className="text-sm leading-relaxed">
            Platformă locală pentru anunțuri imobiliare din Oltenița și împrejurimi.
            Găsește rapid locuința potrivită sau publică gratuit anunțurile tale.
          </p>
        </div>

        {/* Linkuri utile */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Linkuri utile</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white">Acasă</a>
            </li>
            <li>
              <a href="/categorie/apartamente" className="hover:text-white">Apartamente</a>
            </li>
            <li>
              <a href="/categorie/case" className="hover:text-white">Case</a>
            </li>
            <li>
              <a href="/categorie/terenuri" className="hover:text-white">Terenuri</a>
            </li>
          </ul>
        </div>

        {/* Fără contact personal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Informații</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/termeni" className="hover:text-white">Termeni și condiții</a>
            </li>
            <li>
              <a href="/confidentialitate" className="hover:text-white">Politica de confidențialitate</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Oltenița Imobiliare. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
