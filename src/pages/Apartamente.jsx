import SeoCategoryPage from "../components/SeoCategoryPage";

export default function Apartamente() {
  return (
    <SeoCategoryPage
      slug="apartamente"
      label="Apartamente"
      aliases={["apartament"]}
      title="Apartamente de vânzare și de închiriat în județul Călărași | OltenitaImobiliare.ro"
      description="Vezi apartamente de vânzare și de închiriat în Oltenița, Călărași și în întreg județul. Oferte publicate de proprietari și agenții."
      heading="Apartamente în județul Călărași"
      intro="Găsește apartamente de vânzare și de închiriat în municipiile, orașele și comunele județului Călărași, organizate după localitate."
      emptyMessage="Momentan nu există apartamente active în această categorie."
    />
  );
}
