import { Link } from "react-router-dom";

export default function LaCeSaFiiAtent() {
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
          Pentru cumpărători
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          La ce să fii atent când cumperi un apartament
        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-8">
          Cumpărarea unui apartament este o decizie importantă și merită să
          verifici atent mai multe detalii înainte să spui da. Un preț bun nu
          este suficient dacă locuința are probleme care apar mai târziu.
        </p>

        <div className="space-y-8 text-gray-700 leading-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Verifică zona
            </h2>
            <p>
              Uită-te nu doar la apartament, ci și la împrejurimi. Contează
              dacă ai aproape magazine, școli, transport, farmacii sau alte
              puncte utile pentru viața de zi cu zi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Analizează starea apartamentului
            </h2>
            <p>
              Verifică pereții, geamurile, ușile, podelele și instalațiile.
              Uneori un apartament arată bine în poze, dar la vizionare se pot
              observa infiltrații, igrasie, fisuri sau alte probleme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Întreabă despre costurile lunare
            </h2>
            <p>
              Pe lângă prețul de cumpărare, contează și cheltuielile de
              întreținere. Este bine să știi dacă apartamentul este eficient din
              punct de vedere al încălzirii și ce costuri apar lunar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Verifică actele
            </h2>
            <p>
              Asigură-te că proprietatea are actele în regulă. Este important să
              existe claritate privind proprietarul, cadastrul, intabularea și
              situația juridică a apartamentului.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Vezi compartimentarea și lumina
            </h2>
            <p>
              Un apartament poate avea o suprafață bună, dar să nu fie bine
              compartimentat. Uită-te dacă spațiile sunt practice și dacă există
              suficientă lumină naturală în camere.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Întreabă despre vecini și bloc
            </h2>
            <p>
              Contează și cum este blocul în ansamblu: scara, acoperișul,
              subsolul, liniștea din zonă și starea generală a clădirii. Toate
              acestea influențează confortul pe termen lung.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7. Nu lua decizia în grabă
            </h2>
            <p>
              Chiar dacă un apartament pare potrivit, este bine să compari mai
              multe oferte și să revii asupra detaliilor importante. O decizie
              luată calm este aproape întotdeauna mai bună decât una luată sub
              presiune.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Concluzie
            </h2>
            <p>
              Când cumperi un apartament, nu te uita doar la preț și la poze.
              Zona, starea locuinței, actele și costurile reale sunt la fel de
              importante. Cu cât verifici mai atent aceste lucruri, cu atât
              șansele de a face o alegere bună sunt mai mari.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <Link
            to="/anunturi"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition"
          >
            Vezi anunțurile disponibile
          </Link>
        </div>
      </article>
    </div>
  );
}