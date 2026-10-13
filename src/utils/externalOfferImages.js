// Refolosește exclusiv imaginile de prezentare existente în platformă.
// Nu pretindem niciodată că acestea reprezintă proprietatea de la sursa externă.
export const externalOfferImageByCategory = Object.freeze({
  Apartamente: "/apartamente.jpg",
  Garsoniere: "/garsoniere.jpg",
  Case: "/case.jpg",
  Terenuri: "/terenuri.jpg",
  "Spatii comerciale": "/spatiu-comercial.jpg",
  Garaje: "/garaje.jpg",
});

export function imageForExternalOffer(category) {
  return externalOfferImageByCategory[String(category || "")] || "/fundal.jpg";
}

export function externalOfferImageAlt(category) {
  const type = String(category || "proprietate").toLowerCase();
  return `Imagine ilustrativă pentru categoria ${type}; nu este fotografia ofertei.`;
}
