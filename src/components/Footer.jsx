import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 - Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">
            Oltenița Imobiliare
          </h2>
          <p className="text-sm">
            Platformă locală de vânzări și închirieri imobiliare. Simplu, rapid
            și sigur pentru toată zona Oltenița și împrejurimi.
          </p>
        </div>

        {/* Col 2 - Linkuri utile */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Linkuri utile</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/despre" className="hover:text-white">
                Despre noi
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/termeni" className="hover:text-white">
                Termeni și condiții
              </Link>
            </li>
            <li>
              <Link to="/confidentialitate" className="hover:text-white">
                Politică de confidențialitate
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 - Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Urmărește-ne</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Oltenița Imobiliare. Toate drepturile
        rezervate.
      </div>
    </footer>
  );
}
