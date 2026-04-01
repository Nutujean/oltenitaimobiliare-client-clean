import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function GhidImobiliar() {
  const categorii = [
    "Pentru vânzători",
    "Pentru cumpărători",
    "Închirieri",
    "Acte și proceduri",
  ];

  const articole = [
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
    {
      id: 4,
      titlu: "Acte necesare pentru vânzarea unui imobil",
      descriere:
        "Un ghid simplu despre documentele importante de care ai nevoie când vrei să vinzi o proprietate.",
      categorie: "Acte și proceduri",
      link: "/ghid-imobiliar/acte-necesare-pentru-vanzarea-unui-imobil",
    },
    {
      id: 5,
      titlu: "Cum alegi un chiriaș potrivit",
      descriere:
        "Sfaturi practice pentru proprietarii care vor să închirieze în siguranță și să evite problemele.",
      categorie: "Închirieri",
      link: "/ghid-imobiliar/cum-alegi-un-chirias-potrivit",
    },
    {
      id: 6,
      titlu: "Ce trebuie să verifici înainte să închiriezi o locuință",
      descriere:
        "Lucrurile esențiale pe care un chiriaș ar trebui să le verifice înainte să semneze.",
      categorie: "Închirieri",
      link: "/ghid-imobiliar/ce-trebuie-sa-verifici-inainte-sa-inchiriezi-o-locuinta",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Ghid imobiliar Oltenița | Sfaturi utile pentru vânzare, cumpărare și închiriere</title>
        <meta
          name="description"
          content="Ghid imobiliar cu sfaturi utile pentru vânzători, cumpărători și chiriași din Oltenița și împrejurimi. Informații practice despre anunțuri, acte și închirieri."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
          >
            ← Înapoi la Acasă
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Ghid imobiliar
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Sfaturi utile pentru vânzare, cumpărare și închiriere, explicate
            simplu și clar.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categorii.map((categorie) => (
            <span
              key={categorie}
              className="inline-flex items-center rounded-full bg-white border border-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
            >
              {categorie}
            </span>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articole.map((articol) => (
            <div
              key={articol.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
            >
              <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
                {articol.categorie}
              </span>

              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {articol.titlu}
              </h2>

              <p className="text-gray-600 text-sm leading-6 mb-5">
                {articol.descriere}
              </p>

              <Link
                to={articol.link}
                className="text-blue-700 font-semibold hover:text-blue-800 transition"
              >
                Citește articolul →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}