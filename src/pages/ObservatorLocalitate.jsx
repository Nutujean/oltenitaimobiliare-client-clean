import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API_URL from "../api";
import ListingCard from "../components/ListingCard";
import {
  calarasiLocalitati,
  normalizeLocality,
} from "../data/calarasiLocalitati";

const categoryLabels = {
  apartamente: "Apartamente",
  garsoniere: "Garsoniere",
  case: "Case",
  terenuri: "Terenuri",
  garaje: "Garaje",
  "spatii-comerciale": "Spații comerciale",
};

function getNumericPrice(value) {
  const price = Number(String(value ?? "").replace(/[^0-9.,]/g, "").replace(",", "."));
  return Number.isFinite(price) && price > 0 ? price : null;
}

export default function ObservatorLocalitate() {
  const { slug } = useParams();
  const locality = calarasiLocalitati.find((item) => item.slug === slug);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadListings() {
      try {
        const response = await fetch(`${API_URL}/listings`);
        const data = await response.json();
        if (active) setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Eroare la încărcarea statisticilor:", error);
        if (active) setListings([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadListings();
    return () => {
      active = false;
    };
  }, []);

  const localListings = useMemo(() => {
    if (!locality) return [];
    return listings.filter(
      (listing) => normalizeLocality(listing.location) === locality.slug
    );
  }, [listings, locality]);

  const statistics = useMemo(() => {
    const prices = localListings.map((item) => getNumericPrice(item.price)).filter(Boolean);
    const averagePrice = prices.length
      ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
      : null;
    const minimumPrice = prices.length ? Math.min(...prices) : null;
    const maximumPrice = prices.length ? Math.max(...prices) : null;

    const categories = localListings.reduce((result, item) => {
      const key = item.category || "altele";
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});

    return { averagePrice, minimumPrice, maximumPrice, categories };
  }, [localListings]);

  if (!locality) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Localitatea nu a fost găsită</h1>
        <Link className="text-blue-700 font-semibold" to="/observator-imobiliar">
          Înapoi la Observator
        </Link>
      </div>
    );
  }

  const canonical = `https://oltenitaimobiliare.ro/observator-imobiliar/${locality.slug}`;
  const title = `Piața imobiliară din ${locality.name} – statistici și anunțuri`;
  const description = `Statistici imobiliare și anunțuri active din ${locality.name}, județul Călărași. Vezi oferta de case, apartamente și terenuri.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
    about: {
      "@type": "Place",
      name: locality.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Județul Călărași",
      },
    },
  };

  const formatEuro = (value) =>
    value ? `${value.toLocaleString("ro-RO")} €` : "Date insuficiente";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <nav className="text-sm text-slate-500 mb-5">
        <Link to="/observator-imobiliar" className="hover:text-blue-700">
          Observator imobiliar
        </Link>{" "}
        / {locality.name}
      </nav>

      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-blue-700 mb-2">
          {locality.type} · județul Călărași
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
          Piața imobiliară din {locality.name}
        </h1>
        <p className="text-slate-600 max-w-3xl">
          Datele de mai jos sunt calculate automat din anunțurile publicate pe
          OltenitaImobiliare.ro. Nu reprezintă evaluări oficiale și devin mai
          relevante pe măsură ce oferta locală crește.
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <article className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Anunțuri active</p>
          <p className="text-3xl font-bold mt-2">{loading ? "…" : localListings.length}</p>
        </article>
        <article className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Preț mediu cerut</p>
          <p className="text-xl font-bold mt-2">{loading ? "…" : formatEuro(statistics.averagePrice)}</p>
        </article>
        <article className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Cel mai mic preț</p>
          <p className="text-xl font-bold mt-2">{loading ? "…" : formatEuro(statistics.minimumPrice)}</p>
        </article>
        <article className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Cel mai mare preț</p>
          <p className="text-xl font-bold mt-2">{loading ? "…" : formatEuro(statistics.maximumPrice)}</p>
        </article>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Oferta pe categorii</h2>
        {Object.keys(statistics.categories).length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(statistics.categories).map(([category, count]) => (
              <div key={category} className="rounded-lg bg-slate-100 px-4 py-3 flex justify-between">
                <span>{categoryLabels[category] || category}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-amber-50 border border-amber-200 p-5 text-amber-900">
            Momentan nu sunt suficiente anunțuri pentru statistici detaliate în
            {" "}{locality.name}. Poți fi primul care publică o proprietate din această localitate.
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-2xl font-bold">Anunțuri din {locality.name}</h2>
          <Link to="/adauga-anunt" className="rounded-lg bg-blue-700 text-white px-4 py-2 font-semibold">
            Publică un anunț
          </Link>
        </div>

        {loading ? (
          <p>Se încarcă...</p>
        ) : localListings.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {localListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Nu există încă anunțuri active pentru această localitate.</p>
        )}
      </section>
    </div>
  );
}
