import React from "react";
import { Helmet } from "react-helmet-async";

export default function DespreNoi() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "20px",
        color: "#333",
        lineHeight: "1.8",
      }}
    >
      <Helmet>
        <title>Despre Oltenița Imobiliare | Platformă pentru județul Călărași</title>
        <meta
          name="description"
          content="Află mai multe despre OltenițaImobiliare.ro, platforma de anunțuri imobiliare dedicată tuturor localităților din județul Călărași."
        />
      </Helmet>

      <h2 style={{ color: "#0a58ca", textAlign: "center", marginBottom: "20px" }}>
        Despre Oltenița Imobiliare
      </h2>

      <p>
        <strong>Oltenița Imobiliare</strong> este platforma de anunțuri imobiliare
        dedicată întregului județ Călărași. Aici, proprietarii, cumpărătorii,
        chiriașii, dezvoltatorii și agențiile imobiliare se întâlnesc într-un spațiu
        simplu, modern și transparent.
      </p>

      <p>
        Platforma acoperă municipiile, orașele, comunele și satele din județul
        Călărași și oferă acces rapid la anunțuri pentru apartamente, case, terenuri,
        garsoniere, garaje și spații comerciale.
      </p>

      <p>
        Scopul nostru este să facem publicarea și găsirea unei proprietăți cât mai
        ușoare, prin anunțuri clare, filtre utile, promovare eficientă și instrumente
        adaptate pieței imobiliare locale.
      </p>

      <p>
        OltenițaImobiliare.ro este administrată independent și susține dezvoltarea
        pieței imobiliare din județul Călărași, oferind vizibilitate reală
        proprietăților din toate localitățile județului.
      </p>

      <p style={{ marginTop: "30px", color: "#0a58ca", fontWeight: "bold" }}>
        ✉️ Contact: oltenitaimobiliare@gmail.com
      </p>
    </div>
  );
}
