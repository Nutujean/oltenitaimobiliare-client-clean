import { Link } from "react-router-dom";

export default function CumScriiUnAnuntBun() {
  return (
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
          Pentru vânzători
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Cum scrii un anunț imobiliar care atrage mai multe vizualizări
        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-8">
          Un anunț bun nu înseamnă doar să spui că vinzi sau închiriezi o
          proprietate. Un anunț bun oferă informații clare, inspiră încredere și
          îi ajută pe cei interesați să decidă mai repede dacă merită să te
          contacteze.
        </p>

        <div className="space-y-8 text-gray-700 leading-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Scrie un titlu clar și direct
            </h2>
            <p>
              Titlul este primul lucru pe care îl vede utilizatorul. Evită
              formulările vagi și încearcă să spui exact ce oferi.
            </p>
            <p className="mt-3">
              De exemplu, în loc de <strong>„Apartament frumos de vânzare”</strong>,
              mai bine scrii <strong>„Apartament 2 camere, central, Oltenița”</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Include informațiile esențiale din primele rânduri
            </h2>
            <p>
              O persoană interesată vrea să afle rapid lucrurile importante:
              tipul proprietății, localizarea, suprafața, numărul de camere,
              prețul și dacă este de vânzare sau de închiriat.
            </p>
            <p className="mt-3">
              Cu cât aceste detalii apar mai repede în anunț, cu atât cresc
              șansele să primești mesaje relevante.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Descrie proprietatea simplu, dar complet
            </h2>
            <p>
              Nu este nevoie de text complicat. Este mai important să fii clar și
              sincer. Spune ce avantaje are proprietatea și ce o face utilă
              pentru viitorul cumpărător sau chiriaș.
            </p>
            <p className="mt-3">
              Poți menționa: etajul, compartimentarea, anul construcției,
              renovările făcute, încălzirea, utilitățile, curtea, locul de
              parcare sau apropierea de școli, magazine și transport.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Folosește poze bune
            </h2>
            <p>
              Un anunț cu poze clare și luminoase atrage mult mai mult decât unul
              fără imagini sau cu fotografii slabe. Încearcă să adaugi poze din
              camerele principale, baie, bucătărie, exterior și orice alt spațiu
              important.
            </p>
            <p className="mt-3">
              Curățenia și lumina naturală fac o diferență foarte mare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Fii sincer în descriere
            </h2>
            <p>
              Nu promite mai mult decât oferă proprietatea. Dacă exagerezi,
              utilizatorii vor pierde încrederea și este mai probabil să renunțe
              după prima discuție sau vizionare.
            </p>
            <p className="mt-3">
              Un anunț sincer atrage persoane mai potrivite și reduce timpul
              pierdut cu întrebări inutile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Adaugă un preț clar
            </h2>
            <p>
              Anunțurile fără preț sunt de multe ori ocolite. Oamenii vor să știe
              din start dacă proprietatea se încadrează în bugetul lor.
            </p>
            <p className="mt-3">
              Dacă prețul este negociabil, poți menționa acest lucru clar în
              descriere.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7. Încheie cu un îndemn simplu
            </h2>
            <p>
              La finalul anunțului, invită utilizatorul să te contacteze. Un mesaj
              simplu este suficient:
            </p>
            <p className="mt-3 font-medium text-gray-900">
              Pentru mai multe detalii sau pentru programarea unei vizionări,
              contactează-mă direct.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Concluzie
            </h2>
            <p>
              Un anunț bun este clar, complet și ușor de înțeles. Titlul,
              descrierea, pozele și prețul fac împreună diferența dintre un anunț
              ignorat și unul care primește rapid interes.
            </p>
            <p className="mt-3">
              Cu cât prezinți proprietatea mai bine, cu atât cresc șansele să fii
              contactat de persoane cu adevărat interesate.
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
  );
}