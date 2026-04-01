import { Link } from "react-router-dom";

export default function CumFaciPozeBune() {
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
          Cum faci poze bune pentru apartamentul sau casa ta
        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-8">
          Pozele sunt printre primele lucruri pe care le observă un utilizator
          atunci când intră pe un anunț. Imaginile clare și bine făcute pot
          atrage mai mult interes și pot crește șansele să primești mai repede
          apeluri sau mesaje.
        </p>

        <div className="space-y-8 text-gray-700 leading-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Fă curățenie înainte de fotografii
            </h2>
            <p>
              O cameră curată și ordonată arată automat mai bine în poze. Strânge
              obiectele inutile, aranjează paturile, mesele și canapelele și
              încearcă să lași spațiul cât mai aerisit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Folosește lumină naturală
            </h2>
            <p>
              Cel mai bun moment pentru fotografii este ziua, când încăperile au
              lumină naturală. Deschide perdelele și jaluzelele pentru a face
              camerele să pară mai luminoase și mai primitoare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Fotografiază din colțul camerei
            </h2>
            <p>
              Dacă faci poza dintr-un colț, spațiul pare mai mare și se vede mai
              bine întreaga încăpere. Încearcă să surprinzi cât mai mult din
              cameră într-un singur cadru.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Fă poze la toate spațiile importante
            </h2>
            <p>
              Nu te limita doar la living. Este bine să fotografiezi și
              dormitoarele, bucătăria, baia, holul, balconul, curtea sau orice
              alt spațiu relevant pentru proprietate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Evită pozele neclare sau întunecate
            </h2>
            <p>
              O imagine neclară sau întunecată poate face proprietatea să pară
              mai puțin atractivă decât este în realitate. Verifică fiecare poză
              înainte să o încarci și refă-o dacă nu este clară.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Nu exagera cu filtrele
            </h2>
            <p>
              Este mai bine să păstrezi imaginile naturale. Dacă modifici prea
              mult culorile sau lumina, cei care vin la vizionare pot avea o
              impresie diferită față de ce au văzut în anunț.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Concluzie
            </h2>
            <p>
              Pozele bune transmit seriozitate și pot face anunțul tău să iasă în
              evidență. Cu puțină ordine, lumină bună și cadre clare, poți
              prezenta proprietatea mult mai bine și poți atrage mai repede
              persoane interesate.
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