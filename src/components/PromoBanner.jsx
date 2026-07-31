import React from "react";

const VILLO_URL = "https://villo.ro";

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16.704 5.292a1 1 0 0 1 .004 1.414l-7.25 7.292a1 1 0 0 1-1.42 0l-3.746-3.77a1 1 0 1 1 1.416-1.41l3.037 3.055 6.545-6.577a1 1 0 0 1 1.414-.004Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PromoBanner() {
  return (
    <>
      <section
        data-villo-banner
        aria-label="Villo.ro - platformă imobiliară națională"
        className="relative w-full overflow-hidden rounded-2xl border border-blue-300/20 bg-gradient-to-r from-slate-950 via-blue-950 to-emerald-900 text-white shadow-xl"
      >
        <div className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-12 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative grid gap-4 p-5 sm:p-6 md:min-h-[158px] md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6 md:px-8 md:py-5">
          <div className="flex items-center gap-3 md:block">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-950 shadow-lg md:h-14 md:w-14 md:rounded-2xl">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 md:h-8 md:w-8">
                <path
                  fill="currentColor"
                  d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"
                />
              </svg>
            </div>
            <p className="text-2xl font-black tracking-tight md:mt-2 md:text-xl">
              VILLO<span className="text-emerald-300">.RO</span>
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-100">
                Platformă națională
              </span>
              <span className="text-xs font-medium text-white/60">Toată România</span>
            </div>

            <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
              Fă-ți proprietatea vizibilă în toată țara
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-50/80 sm:text-base">
              Publică pe Villo.ro sau descoperă rapid case, apartamente și terenuri din toate județele.
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-white/75">
              {["Toate județele", "Publicare rapidă", "Facebook • TikTok • Instagram"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <span className="text-emerald-300">
                      <CheckIcon />
                    </span>
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <a
            href={VILLO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-200 md:min-w-[190px]"
          >
            Intră pe Villo.ro
            <ArrowIcon />
          </a>
        </div>
      </section>

      <style>{`
        section:has([data-villo-banner]) > div > div:first-child {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border: 0 !important;
        }

        @media (min-width: 768px) {
          section:has([data-villo-banner]) > div {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }

          section:has([data-villo-banner]) > div > a {
            min-height: 148px;
            max-height: 158px;
          }

          section:has([data-villo-banner]) > div > a > div:first-child {
            min-height: 148px;
            align-items: stretch;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:first-child {
            display: grid !important;
            grid-template-columns: auto minmax(0, 1fr) auto;
            grid-template-rows: auto auto;
            align-items: center;
            column-gap: 18px;
            row-gap: 2px;
            width: 100%;
            padding: 20px 28px !important;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > span {
            grid-column: 1;
            grid-row: 1 / 3;
            margin: 0 !important;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > h3 {
            grid-column: 2;
            grid-row: 1;
            margin: 0 !important;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > p {
            grid-column: 2;
            grid-row: 2;
            margin: 0 !important;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > div {
            grid-column: 3;
            grid-row: 1 / 3;
            margin: 0 !important;
            white-space: nowrap;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:last-child {
            width: 190px !important;
            min-width: 190px;
            max-height: 158px;
          }
        }
      `}</style>
    </>
  );
}
