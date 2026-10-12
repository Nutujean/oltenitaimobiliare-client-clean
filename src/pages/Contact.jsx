import { Link } from "react-router-dom";
import PageMetadata from "../components/PageMetadata";
import { platform, contactPage, platformPageSchema } from "../data/platform.js";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12 space-y-6 text-gray-700 leading-7">
      <PageMetadata {...contactPage} route="/contact" structuredData={platformPageSchema("ContactPage", "/contact", contactPage.title, contactPage.description)} />
      <h1 className="text-3xl font-bold text-gray-900">{contactPage.heading}</h1>
      <p>{contactPage.description}</p>
      <p>Email: <a className="text-blue-700 underline" href={`mailto:${platform.email}`}>{platform.email}</a></p>
      <p>Pentru o proprietate, contactează direct autorul folosind datele afișate în anunț. Pentru întrebări despre platformă, scrie-ne prin email sau prin formularul de mai jos.</p>
      <a href="#contact-form" className="inline-block rounded-xl bg-blue-700 text-white font-semibold px-5 py-3">Trimite-ne un mesaj</a>
      <div className="flex gap-5">{platform.socialLinks.map(({ label, url }) => <a key={label} href={url} rel="noreferrer" target="_blank" className="text-blue-700 underline">{label}</a>)}</div>
      <Link to="/despre-noi" className="block text-blue-700 underline">Despre platformă și întrebări frecvente</Link>
    </div>
  );
}
