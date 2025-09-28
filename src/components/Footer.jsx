export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Oltenita Imobiliare</h3>
          <p>
            Platformă locală pentru anunțuri imobiliare în Oltenița și împrejurimi.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Linkuri utile</h3>
          <ul className="space-y-2">
            <li><a href="/termeni" className="hover:text-white">Termeni și condiții</a></li>
            <li><a href="/despre" className="hover:text-white">Despre noi</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <p>Email: contact@oltenitaimobiliare.ro</p>
          <p>Telefon: +40 700 000 000</p>
        </div>
      </div>

      <div className="bg-gray-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} Oltenita Imobiliare. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
