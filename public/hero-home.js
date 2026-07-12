(() => {
  const replaceExactText = (selector, oldText, newText) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    const node = nodes.find((item) => item.textContent.trim() === oldText);
    if (node) node.textContent = newText;
  };

  const applyHero = () => {
    if (window.location.pathname !== "/") return false;

    const headings = Array.from(document.querySelectorAll("h1"));
    const heading = headings.find((node) =>
      node.textContent.includes("Găsește casa potrivită în Oltenița")
    );

    if (heading) {
      const container = heading.parentElement;

      if (container && container.dataset.heroUpdated !== "true") {
        container.dataset.heroUpdated = "true";
        container.classList.remove("max-w-2xl");
        container.classList.add("max-w-4xl");

        container.innerHTML = `
          <div class="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm mb-5">
            🏡 Acoperim toate localitățile din județul Călărași
          </div>

          <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Găsește proprietatea potrivită în județul Călărași
          </h1>

          <p class="text-base md:text-lg mb-3 text-white/95 max-w-3xl mx-auto leading-relaxed">
            Platforma imobiliară dedicată județului Călărași. Descoperă apartamente, case, terenuri și spații comerciale publicate de proprietari și agenții imobiliare.
          </p>

          <p class="text-sm md:text-base text-white/90">
            Anunțuri reale, actualizate zilnic, din toate localitățile județului Călărași.
          </p>

          <p class="text-xs md:text-sm text-white/80 mt-3 leading-relaxed">
            📍 Călărași • Oltenița • Budești • Fundulea • Lehliu-Gară • Chirnogi • Curcani • Frumușani • Mânăstirea • Mitreni • și toate localitățile din județ
          </p>

          <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#ultimele-anunturi" class="inline-flex min-w-[210px] items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800">
              Vezi toate anunțurile
            </a>
            <a href="/adauga-anunt" class="inline-flex min-w-[210px] items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700">
              Publică un anunț gratuit
            </a>
          </div>
        `;
      }
    }

    replaceExactText("span", "✔ Platformă imobiliară locală", "✔ Platformă pentru întreg județul Călărași");
    replaceExactText("span", "✔ Focus pe Oltenița și împrejurimi", "✔ Toate localitățile județului Călărași");
    replaceExactText("h2", "Ultimele anunțuri imobiliare din Oltenița", "Ultimele anunțuri imobiliare din județul Călărași");
    replaceExactText("p", "Proprietăți publicate recent de proprietari și agenți locali", "Proprietăți publicate recent în toate localitățile județului Călărași");
    replaceExactText("h2", "Zona noastră - Oltenița și împrejurimi", "Acoperire în întreg județul Călărași");

    const listingHeading = Array.from(document.querySelectorAll("h2")).find((node) =>
      node.textContent.includes("Ultimele anunțuri imobiliare")
    );

    if (listingHeading) {
      const section = listingHeading.closest("div.max-w-6xl") || listingHeading.parentElement;
      if (section) section.id = "ultimele-anunturi";
    }

    return Boolean(heading || listingHeading);
  };

  if (applyHero()) {
    setTimeout(applyHero, 100);
  }

  const observer = new MutationObserver(() => {
    applyHero();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("popstate", () => {
    setTimeout(applyHero, 0);
  });
})();
