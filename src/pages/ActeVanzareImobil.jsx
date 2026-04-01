import { Link } from "react-router-dom";

export default function ActeVanzareImobil() {
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
          Acte și proceduri
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Acte necesare pentru vânzarea unui imobil
        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-8">
          Atunci când vrei să vinzi un imobil, este important să ai pregătite
          din timp documentele principale. Asta te ajută să eviți întârzierile
          și să inspiri mai multă încredere cumpărătorului.
        </p>

        <div className="space-y-8 text-gray-700 leading-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Actul de proprietate
            </h2>
            <p>
              Primul document important este actul care dovedește că ești
              proprietarul imobilului. Acesta poate fi contract de vânzare,
              contract de donație, certificat de moștenitor sau alt document
              legal relevant.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Extras de carte funciară
            </h2>
            <p>
              Acest document arată situația juridică a imobilului și este foarte
              important într-o tranzacție. De regulă, extrasul actualizat este
              solicitat înainte de semnarea actelor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Cadastru și intabulare
            </h2>
            <p>
              Imobilul trebuie să fie identificat corect în documente. Cadastrul
              și intabularea sunt esențiale pentru ca vânzarea să poată fi făcută
              în condiții normale și fără blocaje.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Acte de identitate
            </h2>
            <p>
              Proprietarul sau proprietarii trebuie să aibă actele de identitate
              valabile. Dacă sunt mai mulți proprietari, este nevoie de datele și
              documentele fiecăruia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Certificat fiscal
            </h2>
            <p>
              În multe situații este necesar un certificat fiscal care să arate
              că nu există datorii legate de imobil către bugetul local. Acesta
              este un document frecvent cerut în procesul de vânzare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Certificat energetic
            </h2>
            <p>
              Pentru multe tipuri de tranzacții imobiliare este necesar și
              certificatul energetic. Acesta oferă informații despre performanța
              energetică a locuinței.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7. Alte documente utile
            </h2>
            <p>
              În funcție de situație, pot fi necesare și alte documente:
              schițe, relevee, acte suplimentare pentru succesiuni, procuri sau
              documente legate de regimul matrimonial.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Concluzie
            </h2>
            <p>
              Cu cât pregătești din timp actele necesare, cu atât vânzarea poate
              merge mai simplu și mai rapid. O documentație clară ajută atât
              proprietarul, cât și cumpărătorul să aibă mai multă încredere în
              tranzacție.
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