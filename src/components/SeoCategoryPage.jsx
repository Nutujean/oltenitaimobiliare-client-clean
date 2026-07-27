import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import API_URL from "../api";
import ListingCard from "./ListingCard";
import { calarasiLocalitati, normalizeLocality } from "../data/calarasiLocalitati";

const CATEGORY_LINKS = [
  ["Apartamente", "/apartamente"],
  ["Case", "/case"],
  ["Terenuri", "/terenuri"],
  ["Garsoniere", "/garsoniere"],
  ["Spații comerciale", "/spatii-comerciale"],
  ["Garaje", "/garaje"],
];

export default function SeoCategoryPage({
  slug,
  label,
  title,
  description,
  heading,
  intro,
  emptyMessage,
  aliases = [],
}) {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const canonical = `https://oltenitaimobiliare.ro/${slug}`;
  const priorityLocalities = calarasiLocalitati.filter((item) => item.isUat);

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);

    (async () => {
      try {
        const response = await fetch(`${API_URL}/listings?limit=200`);
        const data = await response.json();
        if (active) setAllListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Eroare la încărcarea categoriei ${slug}:`, error);
        if (active) setAllListings([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  const listings = useMemo(() => {
    const accepted = [slug, ...aliases].map(normalizeLocality);
    return allListings.filter((listing) => {
      const value = normalizeLocality(
        listing.category || listing.type || listing.propertyType || ""
      );
      return accepted.includes(value);
    });
  }, [allListings, aliases, slug]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "OltenitaImobiliare.ro",
      url: "https://oltenitaimobiliare.ro",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.slice(0, 20).map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: listing.title,
        url: `https://oltenitaimobiliare.ro/anunt/${listing._id}`,
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <nav className="text-sm text-slate-500 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-blue-700">Acasă</Link>
        <span> › </span>
        <span>{label}</span>
      </nav>

      <header className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 text-white p-7 md:p-10 shadow-lg">
        <p className="text-blue-100 font-semibold">Imobiliare în județul Călărași</p>
        <h1 className="text-3xl md:text-5xl font-black mt-2">{heading}</h1>
        <p className="mt-4 max-w-3xl text-blue-50 leading-7">{intro}</p>
        <Link
          to="/adauga-anunt"
          className="inline-flex mt-6 rounded-xl bg-white px-5 py-3 font-bold text-blue-800"
        >
          Publică un anunț
        </Link>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">Anunțuri active</h2>
        <p className="text-slate-600 mt-2">
          Ofertele sunt preluate automat din anunțurile publicate pe platformă.
        </p>

        {loading ? (
          <p className="mt-6 rounded-xl bg-slate-50 border p-5">Se încarcă anunțurile...</p>
        ) : listings.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="font-semibold text-blue-900">{emptyMessage}</p>
            <p className="text-blue-800 mt-1">
              Pagina rămâne disponibilă și se actualizează automat când apare un anunț nou.
            </p>
          </div>
        )}
      </section>

      <section className="mt-12 grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{label} după localitate</h2>
          <p className="text-slate-600 mt-2">
            Explorează ofertele din municipiile, orașele și comunele județului Călărași.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-5 max-h-96 overflow-y-auto pr-2">
            {priorityLocalities.map((locality) => (
              <Link
                key={locality.slug}
                to={`/imobiliare/${slug}/${locality.slug}`}
                className="rounded-xl border bg-white px-3 py-2 text-sm hover:border-blue-500 hover:text-blue-700"
              >
                {locality.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Alte categorii imobiliare</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {CATEGORY_LINKS.map(([name, route]) => (
              <Link
                key={route}
                to={route}
                className="rounded-xl border bg-white p-4 font-semibold hover:border-blue-500 hover:text-blue-700"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
