import { useEffect, useState } from "react";
import API_URL from "../api";
import PageMetadata from "./PageMetadata";
import { imageForExternalOffer, externalOfferImageAlt } from "../utils/externalOfferImages";

const PAGE_TITLE = "Oferte imobiliare din alte surse – județul Călărași | Oltenița Imobiliare";
const PAGE_DESCRIPTION = "Referințe către oferte imobiliare din județul Călărași, cu localitate, preț orientativ și sursă. Confirmă disponibilitatea la autorul anunțului.";

function dateRo(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("ro-RO");
}

function ExternalOfferMedia({ category }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = imageForExternalOffer(category);
  return (
    <figure className="relative w-full h-44 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">
      {!imageFailed ? (
        <img
          src={image}
          alt={externalOfferImageAlt(category)}
          width="640"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-blue-900 text-4xl" aria-hidden="true">
          ⌂
        </div>
      )}
      <figcaption className="absolute top-3 left-3 rounded-md bg-gray-950/80 px-3 py-1.5 text-xs font-semibold text-white">
        Imagine ilustrativă
      </figcaption>
    </figure>
  );
}

export default function ExternalOffers({ full = false }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL + "/oferte-externe?limit=" + (full ? 40 : 6), { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [full]);

  // Paginile de referințe către alte site-uri nu sunt destinate indexării.
  // Nu afectăm metadatele indexabile ale paginii de pornire sau anunțurile originale.
  const Heading = full ? "h1" : "h2";
  return (
    <>
      {full && (
        <PageMetadata
          title={PAGE_TITLE}
          description={PAGE_DESCRIPTION}
          route="/oferte-externe"
          robots="noindex, follow"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            url: "https://oltenitaimobiliare.ro/oferte-externe",
          }}
        />
      )}
      {(!full && (!offers.length || loading)) ? null : (
        <section aria-labelledby="oferte-externe" className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <Heading id="oferte-externe" className="text-2xl sm:text-3xl font-bold text-blue-900">
                Oferte imobiliare din alte surse — județul Călărași
              </Heading>
              <p className="text-gray-600 mt-2 max-w-4xl">
                Acestea sunt referințe la anunțuri publicate pe alte site-uri, nu anunțuri
                verificate direct de Oltenița Imobiliare. Imaginile sunt ilustrative.
                Prețul, fotografiile reale și disponibilitatea se verifică la sursa originală.
              </p>
            </div>
            {!full && (
              <a className="font-semibold text-blue-700 whitespace-nowrap hover:underline" href="/oferte-externe">
                Vezi toate ofertele →
              </a>
            )}
          </div>
          {loading ? <p className="text-gray-600">Se încarcă ofertele...</p> :
            !offers.length ? <p className="text-gray-600">Nu sunt momentan oferte externe disponibile.</p> :
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <article key={offer._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <ExternalOfferMedia category={offer.category} />
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-gray-600 mb-2">
                      Ofertă externă · {offer.sourceName}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                      {offer.title}
                    </h3>
                    <p className="text-blue-900 font-semibold mb-2">
                      {offer.locality}, jud. Călărași
                      {Number.isFinite(offer.priceEUR) && offer.priceEUR > 0
                        ? " · " + Number(offer.priceEUR).toLocaleString("ro-RO") + " €"
                        : ""}
                    </p>
                    <p className="text-sm leading-6 text-gray-600 mb-3">{offer.summary}</p>
                    {offer.sourcePublishedAt && (
                      <p className="text-xs text-gray-500 mb-4">
                        Identificată la sursă: {dateRo(offer.sourcePublishedAt)}
                      </p>
                    )}
                    <a
                      href={offer.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-auto inline-flex items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 font-semibold text-sm"
                    >
                      Vezi fotografiile reale și oferta originală ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          }
        </section>
      )}
    </>
  );
}
