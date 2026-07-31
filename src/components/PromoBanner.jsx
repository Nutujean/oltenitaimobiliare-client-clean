import React from "react";

const VILLO_URL = "https://villo.ro";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 flex-none">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16.704 5.292a1 1 0 0 1 .004 1.414l-7.25 7.292a1 1 0 0 1-1.42 0l-3.746-3.77a1 1 0 1 1 1.416-1.41l3.037 3.055 6.545-6.577a1 1 0 0 1 1.414-.004Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.75 10a.75.75 0 0 1 .75-.75h9.19l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H4.5a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PropertyIcon({ type }) {
  const paths = {
    home: "M3 9.5 10 4l7 5.5V17a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V9.5Z",
    building: "M5 3h10a1 1 0 0 1 1 1v14H4V4a1 1 0 0 1 1-1Zm2 3v2h2V6H7Zm4 0v2h2V6h-2ZM7 10v2h2v-2H7Zm4 0v2h2v-2h-2ZM8 14v4h4v-4H8Z",
    land: "M2.5 14.5 7 10l3 3 3.5-4 4 5.5V18h-15v-3.5ZM5.5 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z",
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
      <path fill="currentColor" d={paths[type]} />
    </svg>
  );
}

export default function PromoBanner() {
  return (
    <section
      aria-label="Villo.ro - platformă imobiliară națională"
      className="relative z-20 w-full overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-900 text-white shadow-[0_28px_80px_rgba(15,23,42,0.35)] md:w-[calc(200%+4rem)]"
    >
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[34%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

      <div className="relative grid min-h-[350px] gap-8 p-6 sm:p-9 lg:grid-cols-[1.45fr_0.85fr] lg:items-center lg:px-12 lg:py-10">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
              Platformă imobiliară națională
            </span>
            <span className="text-sm font-medium text-white/65">Toată România, într-un singur loc</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-950 shadow-lg shadow-black/20">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
                <path
                  fill="currentColor"
                  d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"
                />
              </svg>
            </div>
            <p className="text-3xl font-black tracking-tight sm:text-4xl">
              VILLO<span className="text-emerald-300">.RO</span>
            </p>
          </div>

          <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-[42px]">
            Fă-ți proprietatea vizibilă în toată România
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50/85 sm:text-lg">
            Vrei să ajungi la cumpărători și chiriași din afara județului Călărași?
            Publică anunțul pe Villo.ro sau descoperă proprietăți din toate județele țării.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
            {["Vizibilitate națională", "Toate județele", "Publicare simplă și rapidă"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="text-emerald-300">
                    <CheckIcon />
                  </span>
                  {item}
                </span>
              )
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={VILLO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-200"
            >
              Publică anunțul pe Villo.ro
              <ArrowIcon />
            </a>

            <a
              href={VILLO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Vezi proprietăți din toată țara
            </a>
          </div>

          <p className="mt-5 text-sm text-white/60">
            Urmărește Villo.ro și pe <strong className="font-semibold text-white/85">Facebook</strong>,{" "}
            <strong className="font-semibold text-white/85">TikTok</strong> și{" "}
            <strong className="font-semibold text-white/85">Instagram</strong>.
          </p>
        </div>

        <div className="relative hidden min-h-[270px] lg:block" aria-hidden="true">
          <div className="absolute inset-0 rotate-2 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm" />
          <div className="absolute inset-4 -rotate-1 rounded-[24px] border border-white/15 bg-slate-950/45 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Explorează România</p>
                <p className="mt-1 text-lg font-bold">Proprietăți pentru fiecare plan</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300 text-slate-950">
                <svg viewBox="0 0 20 20" className="h-5 w-5">
                  <path fill="currentColor" d="M10 1.75a6.25 6.25 0 0 0-6.25 6.25c0 4.5 6.25 10.25 6.25 10.25S16.25 12.5 16.25 8A6.25 6.25 0 0 0 10 1.75Zm0 8.5A2.25 2.25 0 1 1 10 5.75a2.25 2.25 0 0 1 0 4.5Z" />
                </svg>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["home", "Case"],
                ["building", "Apartamente"],
                ["land", "Terenuri"],
              ].map(([type, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <span className="text-emerald-300">
                    <PropertyIcon type={type} />
                  </span>
                  <p className="mt-3 text-sm font-bold">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {["București", "Cluj-Napoca", "Constanța"].map((city, index) => (
                <div key={city} className="flex items-center justify-between rounded-xl bg-white/7 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-400/15 text-xs font-black text-blue-100">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold">{city}</span>
                  </div>
                  <span className="text-xs text-white/45">Vezi anunțuri</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
