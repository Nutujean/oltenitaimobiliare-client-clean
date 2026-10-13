import { useEffect, useState } from "react";
import API_URL from "../api";

function dateRo(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("ro-RO");
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

  // Fără surse, nu afișăm un bloc gol: site-ul rămâne ca înainte.
  if (!full && (!offers.length || loading)) return null;

  return (
    <section aria-labelledby="oferte-externe" className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <h2 id="oferte-externe" className="text-2xl sm:text-3xl font-bold text-blue-900">
            Oferte imobiliare din alte surse — județul Călărași
          </h2>
          <p className="text-gray-600 mt-2">
            Referințe la oferte publicate în alte locuri, nu anunțuri publicate de proprietari pe site-ul nostru.
            Prețul și disponibilitatea se confirmă la sursă.
          </p>
        </div>
        {!full && (
          <a className="font-semibold text-blue-700 whitespace-nowrap hover:underline" href="/oferte-externe">
            Vezi toate sursele →
          </a>
        )}
      </div>
      {loading ? <p className="text-gray-600">Se încarcă...</p> :
        !offers.length ? <p className="text-gray-600">Nu sunt încă oferte externe verificate.</p> :
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-medium text-gray-600 mb-3">Sursă externă: {offer.sourceName}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.title}</h3>
              <p className="text-sm font-semibold text-blue-900 mb-2">
                {offer.locality}, jud. Călărași
                {Number.isFinite(offer.priceEUR) && offer.priceEUR > 0
                  ? " · " + Number(offer.priceEUR).toLocaleString("ro-RO") + " €"
                  : ""}
              </p>
              <p className="text-gray-600 text-sm leading-6 mb-3">{offer.summary}</p>
              {offer.sourcePublishedAt && (
                <p className="text-xs text-gray-500 mb-4">Identificată la sursă: {dateRo(offer.sourcePublishedAt)}</p>
              )}
              <a
                href={offer.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 font-semibold text-sm"
              >
                Verifică oferta originală ↗
              </a>
            </article>
          ))}
        </div>
      }
    </section>
  );
}
