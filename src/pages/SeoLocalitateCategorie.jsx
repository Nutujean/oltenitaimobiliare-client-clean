import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API_URL from "../api";
import ListingCard from "../components/ListingCard";
import { calarasiLocalitati, normalizeLocality } from "../data/calarasiLocalitati";

const CATEGORY_CONFIG = {
  case: { label: "Case", singular: "casă", api: ["case", "casa"], icon: "🏠" },
  apartamente: { label: "Apartamente", singular: "apartament", api: ["apartamente", "apartament"], icon: "🏢" },
  terenuri: { label: "Terenuri", singular: "teren", api: ["terenuri", "teren"], icon: "🌿" },
  garsoniere: { label: "Garsoniere", singular: "garsonieră", api: ["garsoniere", "garsoniera"], icon: "🔑" },
  "spatii-comerciale": { label: "Spații comerciale", singular: "spațiu comercial", api: ["spatii-comerciale", "spatiu-comercial", "spatii comerciale"], icon: "🏪" },
  garaje: { label: "Garaje", singular: "garaj", api: ["garaje", "garaj"], icon: "🚗" }
};

const norm = (value = "") => normalizeLocality(String(value));
const number = (value) => {
  const parsed = Number(String(value ?? "").replace(/[^0-9.,-]/g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export default function SeoLocalitateCategorie() {
  const { categorie, localitate } = useParams();
  const config = CATEGORY_CONFIG[categorie];
  const place = calarasiLocalitati.find((item) => item.slug === localitate);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch(`${API_URL}/listings`);
        const data = await response.json();
        if (active) setAllListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Nu s-au putut încărca anunțurile SEO:", error);
        if (active) setAllListings([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const listings = useMemo(() => {
    if (!config || !place) return [];
    const categorySlugs = config.api.map(norm);
    return allListings.filter((listing) => {
      const listingCategory = norm(listing.category || listing.type || listing.propertyType);
      const listingLocation = norm(listing.location || listing.locality || listing.city);
      const categoryMatch = categorySlugs.includes(listingCategory);
      const locationMatch = listingLocation === place.slug || listingLocation.includes(place.slug);
      return categoryMatch && locationMatch;
    });
  }, [allListings, config, place]);

  if (!config || !place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Pagina nu există</h1>
        <p className="text-gray-600 mt-3">Categoria sau localitatea solicitată nu este disponibilă.</p>
        <Link to="/observator-imobiliar" className="inline-block mt-6 text-blue-700 font-semibold">Vezi Observatorul Imobiliar</Link>
      </div>
    );
  }

  const prices = listings.map((item) => number(item.price)).filter(Boolean);
  const average = prices.length ? Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length) : null;
  const minimum = prices.length ? Math.min(...prices) : null;
  const maximum = prices.length ? Math.max(...prices) : null;
  const title = `${config.label} de vânzare în ${place.name}, Călărași`;
  const description = `Descoperă ${config.label.toLowerCase()} de vânzare în ${place.name}, județul Călărași. Anunțuri locale, prețuri actualizate și informații din Observatorul Imobiliar OltenitaImobiliare.ro.`;
  const canonical = `https://oltenitaimobiliare.ro/imobiliare/${categorie}/${localitate}`;
  const nearby = calarasiLocalitati.filter((item) => item.slug !== place.slug).slice(0, 8);

  const faq = [
    { q: `Unde găsesc ${config.label.toLowerCase()} de vânzare în ${place.name}?`, a: `Pe această pagină sunt afișate anunțurile active din ${place.name} publicate pe OltenitaImobiliare.ro.` },
    { q: `Cât costă un ${config.singular} în ${place.name}?`, a: average ? `Prețul mediu calculat din anunțurile disponibile este de aproximativ ${average.toLocaleString("ro-RO")} euro. Valoarea se actualizează automat.` : "Momentan nu există suficiente anunțuri pentru un preț mediu relevant." },
    { q: `Cum public un anunț pentru ${place.name}?`, a: "Creezi un cont, alegi categoria proprietății, completezi localitatea și publici anunțul direct pe platformă." }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "OltenitaImobiliare.ro", url: "https://oltenitaimobiliare.ro" },
    about: { "@type": "Place", name: place.name, containedInPlace: { "@type": "AdministrativeArea", name: "Județul Călărași" } },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.slice(0, 20).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://oltenitaimobiliare.ro/anunt/${item._id}`,
        name: item.title
      }))
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } }))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>{title} | OltenitaImobiliare.ro</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-blue-700">Acasă</Link> <span>›</span>{" "}
        <Link to="/observator-imobiliar" className="hover:text-blue-700">Județul Călărași</Link> <span>›</span>{" "}
        <Link to={`/observator-imobiliar/${place.slug}`} className="hover:text-blue-700">{place.name}</Link> <span>›</span>{" "}
        <span>{config.label}</span>
      </nav>

      <section className="rounded-3xl bg-gradient-to-r from-blue-800 to-blue-600 text-white p-7 md:p-10 shadow-xl">
        <p className="text-blue-100 font-semibold">{config.icon} Imobiliare în județul Călărași</p>
        <h1 className="text-3xl md:text-5xl font-black mt-2">{title}</h1>
        <p className="mt-4 max-w-3xl text-blue-50">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/adauga-anunt" className="bg-white text-blue-800 font-bold px-5 py-3 rounded-xl">Publică un anunț</Link>
          <Link to={`/observator-imobiliar/${place.slug}`} className="border border-white/40 px-5 py-3 rounded-xl font-semibold">Observator {place.name}</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Stat label="Anunțuri active" value={listings.length} />
        <Stat label="Preț mediu" value={average ? `${average.toLocaleString("ro-RO")} €` : "Date insuficiente"} />
        <Stat label="Preț minim" value={minimum ? `${minimum.toLocaleString("ro-RO")} €` : "—"} />
        <Stat label="Preț maxim" value={maximum ? `${maximum.toLocaleString("ro-RO")} €` : "—"} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Anunțuri din {place.name}</h2>
        <p className="text-gray-600 mt-2">Rezultatele sunt preluate automat din anunțurile active ale platformei.</p>
        {loading ? (
          <p className="mt-6">Se încarcă...</p>
        ) : listings.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="font-semibold text-blue-900">Momentan nu există anunțuri active pentru această combinație.</p>
            <p className="text-blue-800 mt-1">Pagina rămâne activă și se actualizează automat când este publicat primul anunț.</p>
          </div>
        )}
      </section>

      <section className="mt-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold">Întrebări frecvente</h2>
          <div className="mt-4 space-y-4">
            {faq.map((item) => (
              <article key={item.q} className="rounded-2xl border p-5">
                <h3 className="font-bold text-gray-900">{item.q}</h3>
                <p className="text-gray-600 mt-2">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Explorează alte localități</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {nearby.map((item) => (
              <Link key={item.slug} to={`/imobiliare/${categorie}/${item.slug}`} className="rounded-xl border p-3 hover:border-blue-500 hover:text-blue-700">
                {config.label} în {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white border shadow-sm p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-lg md:text-xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
}
