import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function CumAlegiUnChirias() {
  return (
    <>
      <Helmet>
        <title>Cum alegi un chiriaș potrivit | Ghid închirieri Oltenița</title>
        <meta
          name="description"
          content="Află cum alegi un chiriaș potrivit. Sfaturi utile pentru proprietari: comunicare, condiții clare, seriozitate și contract de închiriere."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            to="/ghid-imobiliar"
            className="text-blue-700 hover:text-blue-800 font-medium"
          >
            ← Înapoi la Ghid imobiliar
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">
          <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
            Închirieri
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Cum alegi un chiriaș potrivit
          </h1>

          <p className="text-gray-600 text-lg leading-8 mb-8">
            Alegerea chiriașului potrivit este importantă pentru orice proprietar.
            Un chiriaș serios îți poate oferi liniște, plăți la timp și o relație
            corectă pe termen lung. De aceea, merită să fii atent încă de la
            primele discuții.
          </p>

          <div className="space-y-8 text-gray-700 leading-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                1. Observă cum comunică
              </h2>
              <p>
                Primele mesaje sau apeluri spun multe. Un chiriaș serios comunică
                clar, răspunde politicos și este interesat concret de locuință, nu
                doar întreabă vag dacă mai este disponibilă.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                2. Pune întrebări simple, dar utile
              </h2>
              <p>
                Este normal să întrebi cine va locui în apartament, pe ce perioadă
                caută chirie și dacă are un program stabil. Aceste întrebări te
                ajută să înțelegi dacă persoana se potrivește cu locuința oferită.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                3. Clarifică de la început condițiile
              </h2>
              <p>
                Spune din start chiria, garanția, termenul de plată și regulile
                importante. Cu cât lucrurile sunt mai clare de la început, cu atât
                sunt mai mici șansele de neînțelegeri mai târziu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                4. Vezi dacă este interesat cu adevărat
              </h2>
              <p>
                Un chiriaș potrivit pune întrebări despre utilități, condiții,
                contract și modul de folosire a locuinței. De obicei, acest lucru
                arată că tratează închirierea cu seriozitate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                5. Nu te grăbi doar ca să ocupi repede locuința
              </h2>
              <p>
                Uneori este mai bine să aștepți puțin și să alegi persoana
                potrivită, decât să accepți rapid un chiriaș care poate crea
                probleme ulterior. Graba poate costa mai mult decât câteva zile în
                plus de așteptare.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                6. Contractul este foarte important
              </h2>
              <p>
                Chiar dacă discuția merge bine, este recomandat să existe un
                contract clar. Acesta trebuie să includă chiria, garanția,
                perioada, obligațiile și condițiile de încetare.
              </p>
            </section>

            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Concluzie
              </h2>
              <p>
                Un chiriaș potrivit nu se alege doar după prima impresie, ci după
                seriozitate, claritate și compatibilitate cu regulile locuinței.
                Cu puțină atenție la început, poți evita multe probleme pe viitor.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <Link
              to="/adauga-anunt"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 transition"
            >
              ➕ Publică acum anunțul tău
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}