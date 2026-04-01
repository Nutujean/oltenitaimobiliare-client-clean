import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function VerificariInchiriereLocuinta() {
  return (
    <>
      <Helmet>
        <title>Ce trebuie să verifici înainte să închiriezi o locuință | Ghid Oltenița</title>
        <meta
          name="description"
          content="Vezi ce trebuie să verifici înainte să închiriezi o locuință: stare, utilități, costuri, zonă, mobilare și contract de închiriere."
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
            Ce trebuie să verifici înainte să închiriezi o locuință
          </h1>

          <p className="text-gray-600 text-lg leading-8 mb-8">
            Înainte să închiriezi o locuință, este bine să verifici atent mai
            multe detalii, nu doar prețul și pozele din anunț. O vizionare făcută
            cu atenție te poate ajuta să eviți neplăceri și costuri neașteptate.
          </p>

          <div className="space-y-8 text-gray-700 leading-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                1. Starea generală a locuinței
              </h2>
              <p>
                Uită-te atent la pereți, podele, uși, geamuri și baie. Verifică
                dacă există urme de umezeală, igrasie, infiltrații sau reparații
                făcute superficial.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                2. Instalațiile și utilitățile
              </h2>
              <p>
                Este important să vezi dacă funcționează bine apa, încălzirea,
                prizele, lumina și eventual aparatele deja existente în locuință.
                Aceste lucruri contează mult în viața de zi cu zi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                3. Costurile lunare reale
              </h2>
              <p>
                Nu te uita doar la chiria lunară. Întreabă și despre întreținere,
                utilități, internet, garanție și alte costuri care pot apărea
                regulat.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                4. Zona și vecinătatea
              </h2>
              <p>
                Contează cât de aproape sunt magazinele, transportul, farmacia,
                școala sau locul de muncă. Este bine să observi și cât de liniștită
                este zona, mai ales dacă vizionezi locuința la ore diferite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                5. Mobilarea și dotările
              </h2>
              <p>
                Dacă locuința este mobilată, verifică exact ce rămâne disponibil:
                pat, dulapuri, electrocasnice, mașină de spălat, frigider și alte
                dotări importante. Este bine ca aceste lucruri să fie clare înainte
                de semnare.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                6. Contractul de închiriere
              </h2>
              <p>
                Înainte să accepți, citește atent condițiile. Verifică perioada,
                chiria, garanția, termenul de plată și cine răspunde pentru anumite
                reparații sau costuri.
              </p>
            </section>

            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Concluzie
              </h2>
              <p>
                O locuință închiriată trebuie aleasă atent, nu doar rapid.
                Verificând starea apartamentului, costurile și condițiile
                contractuale, ai șanse mult mai mari să faci o alegere bună și să
                eviți surprizele neplăcute.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition"
            >
              Vezi proprietățile disponibile
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}