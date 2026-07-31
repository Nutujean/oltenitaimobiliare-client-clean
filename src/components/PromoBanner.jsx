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

        section:has([data-villo-banner]) > div > a {
          background: linear-gradient(110deg, #ffffff 0%, #f0f7ff 58%, #e0f2fe 100%) !important;
          border: 1px solid rgba(37, 99, 235, 0.18) !important;
          box-shadow: 0 16px 38px rgba(30, 64, 175, 0.12) !important;
          isolation: isolate;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }

        section:has([data-villo-banner]) > div > a:hover {
          transform: translateY(-2px);
          border-color: rgba(37, 99, 235, 0.34) !important;
          box-shadow: 0 20px 46px rgba(30, 64, 175, 0.18) !important;
        }

        section:has([data-villo-banner]) > div > a::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, #2563eb, #06b6d4, #22c55e);
          z-index: 3;
        }

        section:has([data-villo-banner]) > div > a::after {
          content: "";
          position: absolute;
          left: -42px;
          bottom: -66px;
          width: 150px;
          height: 150px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.10);
          z-index: -1;
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > span {
          display: grid !important;
          place-items: center;
          width: 58px;
          height: 58px;
          padding: 0 !important;
          border-radius: 18px !important;
          background: linear-gradient(145deg, #1d4ed8, #0ea5e9) !important;
          color: white !important;
          font-size: 24px !important;
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.26);
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > h3 {
          color: #172554 !important;
          font-size: clamp(20px, 2vw, 27px) !important;
          font-weight: 900 !important;
          letter-spacing: -0.02em;
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > p {
          color: #475569 !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > p::after {
          content: "Cauți un job?  •  Angajezi?  •  Publică rapid";
          display: block;
          margin-top: 7px;
          color: #2563eb;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.01em;
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > div {
          border-radius: 14px !important;
          background: linear-gradient(135deg, #1d4ed8, #0284c7) !important;
          box-shadow: 0 10px 22px rgba(30, 64, 175, 0.24);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        section:has([data-villo-banner]) > div > a:hover > div:first-child > div:first-child > div {
          transform: translateX(3px);
          box-shadow: 0 13px 28px rgba(30, 64, 175, 0.30);
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:last-child {
          background: linear-gradient(145deg, #dbeafe, #e0f2fe);
          overflow: hidden;
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:last-child img {
          filter: saturate(1.08) contrast(1.02);
          transition: transform 300ms ease;
        }

        section:has([data-villo-banner]) > div > a:hover > div:first-child > div:last-child img {
          transform: scale(1.04);
        }

        section:has([data-villo-banner]) > div > a > div:first-child > div:last-child::after {
          content: "Oportunități locale";
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 3;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.82);
          color: white;
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
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
            column-gap: 20px;
            row-gap: 3px;
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
            width: 210px !important;
            min-width: 210px;
            max-height: 158px;
          }
        }

        @media (max-width: 767px) {
          section:has([data-villo-banner]) > div > a > div:first-child > div:first-child > p::after {
            line-height: 1.55;
          }

          section:has([data-villo-banner]) > div > a > div:first-child > div:last-child::after {
            right: 8px;
            bottom: 8px;
          }
        }
      `}</style>
    </>
  );
}
