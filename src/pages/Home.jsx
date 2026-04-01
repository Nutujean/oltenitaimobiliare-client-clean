import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PromoBanner from "../components/PromoBanner";
import API_URL from "../api";
import logo from "../assets/OltenitaImobiliare.png";
import angajariImg from "../assets/angajari.png";

const fundal = "/fundal.jpg";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [intent, setIntent] = useState("");
  const [view, setView] = useState("grid");

  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListings = async (overrideSort) => {
    try {
      setLoading(true);
      const sortParam = overrideSort || sort || "newest";
      const res = await fetch(`${API_URL}/listings?sort=${sortParam}&limit=200`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Eroare la preluarea anunțurilor:", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = [...listings];

    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (location) {
      const locFilter = normalize(location);
      results = results.filter((l) => normalize(l.location).includes(locFilter));
    }

    if (intent) {
      results = results.filter(
        (l) => l.intent && l.intent.toLowerCase() === intent.toLowerCase()
      );
    }

    results.sort((a, b) => {
      const getMs = (x) => {
        if (!x) return null;
        const d1 = new Date(x);
        if (!Number.isNaN(d1.getTime())) return d1.getTime();

        const maybe =
          x?.$date ||
          x?.date ||
          x?.value ||
          x?.iso ||
          (typeof x?.toString === "function" ? x.toString() : null);

        const d2 = new Date(maybe);
        if (maybe && !Number.isNaN(d2.getTime())) return d2.getTime();

        return null;
      };

      const aExpMs = getMs(a.expiresAt);
      const bExpMs = getMs(b.expiresAt);

      const aExpired =
        String(a.status || "").toLowerCase() === "expirat" ||
        (aExpMs !== null && aExpMs < Date.now());

      const bExpired =
        String(b.status || "").toLowerCase() === "expirat" ||
        (bExpMs !== null && bExpMs < Date.now());

      const aFeaturedActive =
        !aExpired &&
        (a.featured === true ||
          (a.featuredUntil && new Date(a.featuredUntil).getTime() > Date.now()));

      const bFeaturedActive =
        !bExpired &&
        (b.featured === true ||
          (b.featuredUntil && new Date(b.featuredUntil).getTime() > Date.now()));

      const aGroup = aFeaturedActive ? 0 : aExpired ? 2 : 1;
      const bGroup = bFeaturedActive ? 0 : bExpired ? 2 : 1;

      if (aGroup !== bGroup) return aGroup - bGroup;

      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    setFiltered(results);
  }, [listings, location, intent]);

  useEffect(() => {
    fetchListings(sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const LOCATII = [
    "Localitate",
    "Oltenița",
    "Chirnogi",
    "Ulmeni",
    "Mitreni",
    "Clătești",
    "Spanțov",
    "Căscioarele",
    "Șoldanu",
    "Negoești",
    "Valea Roșie",
    "Radovanu",
    "Crivat",
    "Curcani",
    "Luica",
    "Nana",
    "Chiselet",
    "Mănăstirea",
    "Budești",
    "Gruiu",
    "Aprozi",
    "Buciumeni",
    "Frumusani",
    "Vasilati",
    "Galbinasi",
    "Cucuieti",
    "Podul Pitarului",
    "Sohatu",
    "Fundeni",
    "Dorobantu",
    "Varasti",
    "Ciocanesti",
    "Cunesti",
    "Bogata",
    "Gradistea",
    "Rasa",
    "Cuza voda",
    "Modelu",
  ];

  const ghidArticole = [
    {
      id: 1,
      titlu: "Cum scrii un anunț imobiliar care atrage mai multe vizualizări",
      descriere:
        "Află ce informații contează cel mai mult într-un anunț și cum îl faci mai convingător pentru potențialii cumpărători sau chiriași.",
      categorie: "Pentru vânzători",
      link: "/ghid-imobiliar/cum-scrii-un-anunt-bun",
    },
    {
      id: 2,
      titlu: "Cum faci poze bune pentru apartamentul sau casa ta",
      descriere:
        "Pozele bune pot face diferența dintre un anunț ignorat și unul care primește rapid mesaje și apeluri.",
      categorie: "Pentru vânzători",
      link: "/ghid-imobiliar/cum-faci-poze-bune",
    },
    {
      id: 3,
      titlu: "La ce să fii atent când cumperi un apartament",
      descriere:
        "Vezi ce detalii trebuie să verifici înainte de vizionare și ce întrebări merită puse înainte de a lua o decizie.",
      categorie: "Pentru cumpărători",
      link: "/ghid-imobiliar/la-ce-sa-fii-atent-cand-cumperi-un-apartament",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Oltenița Imobiliare | Anunțuri imobiliare din Oltenița și împrejurimi</title>
        <meta
          name="description"
          content="Platformă locală de anunțuri imobiliare pentru Oltenița și împrejurimi. Vezi apartamente, case, terenuri și sfaturi utile pentru vânzare, cumpărare și închiriere."
        />
      </Helmet>

      <div className="min-h-screen bg-[#f4f6fb]">
        <div
          className="relative h-[60vh] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage: `url(${fundal})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 max-w-2xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Găsește casa potrivită în Oltenița
            </h1>

            <p className="text-lg mb-2">
              Platformă imobiliară locală dedicată Olteniței și localităților din jur.
            </p>
            <p className="text-sm text-white/90">
              Anunțuri reale, publicate de proprietari și agenți locali.
            </p>

            <p className="text-sm text-white/80 mt-2">
              Oltenița • Chirnogi • Ulmeni • Mitreni • Spanțov • Budești • Chiselet •
              Spantov • Valea rosie • Negoiesti • Manastirea • Curcani • Soldanu •
              Radovanu • Cascioarele
            </p>
          </div>
        </div>

        <section className="-mt-8 max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 z-20 relative flex flex-col md:flex-row gap-4">
          <select
            className="border rounded-lg px-4 py-2 flex-1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {LOCATII.map((loc) => (
              <option key={loc} value={loc === "Localitate" ? "" : loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-4 py-2 flex-1"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          >
            <option value="">Toate tipurile</option>
            <option value="vand">Vând</option>
            <option value="cumpar">Cumpăr</option>
            <option value="inchiriez">Închiriez</option>
            <option value="schimb">Schimb</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2 flex-1"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Cele mai noi</option>
            <option value="cheapest">Preț crescător</option>
            <option value="expensive">Preț descrescător</option>
          </select>

          <Link
            to="/adauga-anunt"
            className="bg-green-600 text-white px-6 py-2 rounded-lg text-center"
          >
            ➕ Postează anunț
          </Link>
        </section>

        <div className="max-w-6xl mx-auto mt-6 px-4">
          <div className="bg-white rounded-xl shadow-sm border flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 text-sm text-gray-700">
            <span>✔ Platformă imobiliară locală</span>
            <span>✔ Anunțuri reale și verificate</span>
            <span>✔ Fără spam sau duplicate</span>
            <span>✔ Focus pe Oltenița și împrejurimi</span>
          </div>
        </div>

        <section className="max-w-6xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
            Categorii populare
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Apartamente", path: "/categorie/apartamente", img: "/apartamente.jpg" },
              { name: "Case", path: "/categorie/case", img: "/case.jpg" },
              { name: "Terenuri", path: "/categorie/terenuri", img: "/terenuri.jpg" },
              { name: "Garsoniere", path: "/categorie/garsoniere", img: "/garsoniere.jpg" },
              { name: "Garaje", path: "/categorie/garaje", img: "/garaje.jpg" },
              {
                name: "Spațiu comercial",
                path: "/categorie/spatiu-comercial",
                img: "/spatiu-comercial.jpg",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="relative rounded-xl overflow-hidden shadow-lg"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto pb-12 px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-blue-800">Ghid imobiliar</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Sfaturi utile pentru vânzare, cumpărare și închiriere, explicate
                simplu și clar.
              </p>
            </div>

            <Link
              to="/ghid-imobiliar"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 transition"
            >
              Vezi toate articolele
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ghidArticole.map((articol) => (
              <Link
                key={articol.id}
                to={articol.link}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
              >
                <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
                  {articol.categorie}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {articol.titlu}
                </h3>

                <p className="text-gray-600 text-sm leading-6 mb-5">
                  {articol.descriere}
                </p>

                <span className="text-blue-700 font-semibold hover:text-blue-800 transition">
                  Citește articolul →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto mt-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-6 flex justify-center">
              <PromoBanner />
            </div>

            <Link
              to="/angajari"
              className="relative bg-white rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex">
                <div className="flex-1 p-6 relative z-10">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    💼 Angajări
                  </span>

                  <h3 className="mt-3 text-xl font-bold text-gray-900">
                    Joburi & colaborări în zonă
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Caută locuri de muncă sau publică anunțuri de angajare rapid.
                  </p>

                  <div className="mt-4 inline-flex items-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
                    Intră la Angajări →
                  </div>
                </div>

                <div className="block w-24 sm:w-52 relative">
                  <img
                    src={angajariImg}
                    alt="Angajări"
                    className="h-full w-full object-contain sm:object-cover object-right"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-white/90" />
                </div>
              </div>

              <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-blue-100 opacity-50" />
            </Link>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-10">
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`px-3 py-2 rounded-lg border text-sm ${
                view === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Carduri
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded-lg border text-sm ${
                view === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Listă
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Ultimele anunțuri imobiliare din Oltenița
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Proprietăți publicate recent de proprietari și agenți locali
          </p>

          {loading && <div className="text-gray-600 mb-6">Se încarcă anunțurile...</div>}

          <div className="border-t border-gray-200 pt-6 mb-4">
            <p className="text-sm text-gray-600">
              Vezi ce proprietăți sunt disponibile în acest moment în zona ta
            </p>
          </div>

          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filtered.map((l) => {
              const isFeatured =
                l.featured === true ||
                (l.featuredUntil && new Date(l.featuredUntil).getTime() > Date.now());

              const isNew =
                l.createdAt &&
                (Date.now() - new Date(l.createdAt)) / (1000 * 60 * 60 * 24) <= 5;

              const expiresAtMs = (() => {
                const x = l.expiresAt;
                const d1 = new Date(x);
                if (x && !Number.isNaN(d1.getTime())) return d1.getTime();

                const maybe =
                  x?.$date ||
                  x?.date ||
                  x?.value ||
                  x?.iso ||
                  (typeof x?.toString === "function" ? x.toString() : null);

                const d2 = new Date(maybe);
                if (maybe && !Number.isNaN(d2.getTime())) return d2.getTime();

                return null;
              })();

              const isExpired =
                String(l.status || "").toLowerCase() === "expirat" ||
                (expiresAtMs !== null && expiresAtMs < Date.now());

              const listingHref = `/anunt/${l._id}`;

              const renderInfo = () => (
                <div className="space-y-1">
                  <h3 className="font-semibold text-[17px] text-gray-800 leading-snug">
                    {l.title}
                  </h3>

                  <p className="text-blue-700 font-bold text-lg">{l.price} €</p>

                  <p className="text-sm text-gray-500">{l.location}</p>

                  {l.createdAt && (
                    <p className="text-xs text-gray-400">
                      🕒 Publicat:{" "}
                      {new Date(l.createdAt).toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(l.createdAt).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}

                  {l._id ? (
                    <p className="text-[11px] text-gray-400">
                      ID anunț: {String(l._id).slice(-6).toUpperCase()}
                    </p>
                  ) : null}
                </div>
              );

              const cardBase =
                "relative rounded-xl shadow-md overflow-hidden " +
                (isExpired
                  ? "bg-gray-100 opacity-70 cursor-not-allowed"
                  : "bg-white hover:shadow-lg transition");

              const CardInner = ({ children }) =>
                isExpired ? (
                  <div className="block">{children}</div>
                ) : (
                  <Link to={listingHref} className="block">
                    {children}
                  </Link>
                );

              if (view === "list") {
                return (
                  <div key={l._id} className={cardBase}>
                    <CardInner>
                      <div className="flex gap-4 p-4">
                        <div className="w-36 h-28 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {l.images?.length > 0 ? (
                            <img
                              src={l.images[0]}
                              alt={l.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                              <img
                                src={logo}
                                alt="Oltenița Imobiliare"
                                className="w-12 h-12 opacity-80"
                              />
                              <span className="mt-2 text-[11px] text-gray-500">
                                Fără poză încă
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">{renderInfo()}</div>
                      </div>
                    </CardInner>

                    {!isExpired && isFeatured && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        ⭐ PROMOVAT
                      </span>
                    )}

                    {!isExpired && !isFeatured && isNew && (
                      <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        NOU
                      </span>
                    )}

                    {isExpired && (
                      <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                        EXPIRAT
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div key={l._id} className={cardBase}>
                  <CardInner>
                    {l.images?.length > 0 ? (
                      <img
                        src={l.images[0]}
                        alt={l.title}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                        <img
                          src={logo}
                          alt="Oltenița Imobiliare"
                          className="w-16 h-16 opacity-80"
                        />
                        <span className="mt-2 text-xs text-gray-500">Fără poză încă</span>
                      </div>
                    )}

                    <div className="p-4">{renderInfo()}</div>
                  </CardInner>

                  {!isExpired && isFeatured && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                      ⭐ PROMOVAT
                    </span>
                  )}

                  {!isExpired && !isFeatured && isNew && (
                    <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                      NOU
                    </span>
                  )}

                  {isExpired && (
                    <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      EXPIRAT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 mb-10 text-center px-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">
            Zona noastră - Oltenița și împrejurimi
          </h2>

          <iframe
            title="Harta Oltenița"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2842.6318092784483!2d26.6382815!3d44.0835869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1974a2fa07a5d%3A0x92ad81d23c90249f!2sOlteni%C8%9Ba!5e0!3m2!1sro!2sro!4v1699999999999"
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: "12px" }}
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
}