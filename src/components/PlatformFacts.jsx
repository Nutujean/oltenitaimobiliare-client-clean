import { Link } from "react-router-dom";
import { platform, platformCategories, platformLocalities, platformFaqs } from "../data/platform.js";

export default function PlatformFacts() {
  return (
    <div className="space-y-7 text-gray-700 leading-7">
      <p>{platform.summary}</p>
      <p>{platform.role}</p>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Proprietăți de vânzare și de închiriat</h2>
        <div className="flex flex-wrap gap-3">
          {platformCategories.map(({ label, slug }) => <Link key={slug} to={`/${slug}`} className="text-blue-700 underline">{label}</Link>)}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Imobiliare după localitate</h2>
        <div className="flex flex-wrap gap-3">
          {platformLocalities.map(({ name, slug }) => <Link key={slug} to={`/observator-imobiliar/${slug}`} className="text-blue-700 underline">{name}</Link>)}
        </div>
        <p className="mt-3"><Link to="/observator-imobiliar" className="text-blue-700 underline">Vezi toate localitățile din județul Călărași</Link></p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Întrebări frecvente</h2>
        <div className="space-y-5">
          {platformFaqs.map(({ question, answer }) => (
            <div key={question}><h3 className="font-bold text-gray-900">{question}</h3><p>{answer}</p></div>
          ))}
        </div>
      </section>
      <nav className="flex flex-wrap gap-4" aria-label="Informații despre platformă">
        <Link to="/anunturi" className="text-blue-700 underline">Toate anunțurile</Link>
        <Link to="/adauga-anunt" className="text-blue-700 underline">Publică un anunț</Link>
        <Link to="/despre-noi" className="text-blue-700 underline">Despre noi</Link>
        <Link to="/contact" className="text-blue-700 underline">Contact</Link>
      </nav>
    </div>
  );
}
