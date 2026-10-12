// Keep listing metadata consistent with the backend HTML renderer.
export const PUBLIC_SITE = "https://oltenitaimobiliare.ro";

export const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function isoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export function isPublicListing(listing) {
  return Boolean(listing) && (!listing.visibility || listing.visibility === "public");
}

export function isActiveListing(listing, now = new Date()) {
  const expiresAt = isoDate(listing?.expiresAt);
  return isPublicListing(listing) && listing.status !== "expirat" && listing.vandut !== true
    && (!expiresAt || new Date(expiresAt) > now);
}

export function activeListingFilter(now = new Date()) {
  return { $and: [
    { $or: [{ visibility: "public" }, { visibility: { $exists: false } }] },
    { status: { $ne: "expirat" } },
    { vandut: { $ne: true } },
    { $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }] },
  ] };
}

function publicImage(value) {
  const raw = typeof value === "string" ? value : value?.secure_url || value?.url || "";
  try {
    const url = new URL(raw, PUBLIC_SITE);
    if (!["https:", "http:"].includes(url.protocol) || !raw) return null;
    // Use the same derivative as the application to avoid downloading originals
    // before React loads, or requesting a second Cloudinary transformation.
    const marker = "/image/upload/";
    const markerIndex = url.href.indexOf(marker);
    if (url.hostname === "res.cloudinary.com" && markerIndex >= 0) {
      const prefix = url.href.slice(0, markerIndex + marker.length);
      const rest = url.href.slice(markerIndex + marker.length);
      const versionIndex = rest.search(/v\d+\//);
      const assetPath = versionIndex >= 0 ? rest.slice(versionIndex) : rest;
      return `${prefix}f_auto,q_auto:good,c_limit,w_1600,h_1000/${assetPath}`;
    }
    return url.href;
  } catch { return null; }
}

export function listingSeoData(listing, now = new Date()) {
  const canonical = `${PUBLIC_SITE}/anunt/${listing._id}`;
  const title = `${listing.title || "Anunț imobiliar"} - Oltenița Imobiliare`;
  const description = [listing.title, listing.location, listing.description]
    .filter(Boolean).join(" – ").replace(/\s+/g, " ").trim().slice(0, 180);
  const images = [...new Set([...(listing.images || []), listing.imageUrl].map(publicImage).filter(Boolean))];
  const active = isActiveListing(listing, now);
  const status = listing.vandut ? "Proprietate vândută" : !active ? "Anunț expirat" : listing.rezervat ? "Proprietate rezervată" : "Anunț activ";
  const schema = {
    "@context": "https://schema.org",
    "@type": listing.section === "angajari" || ["cumpar", "schimb"].includes(listing.intent) ? "WebPage" : "RealEstateListing",
    "@id": `${canonical}#page`,
    url: canonical,
    name: listing.title,
    description: listing.description || description,
    inLanguage: "ro-RO",
    isPartOf: { "@type": "WebSite", "@id": `${PUBLIC_SITE}/#website`, name: "Oltenița Imobiliare", url: `${PUBLIC_SITE}/` },
    ...(images.length ? { image: images } : {}),
    ...(isoDate(listing.createdAt) ? { datePublished: isoDate(listing.createdAt) } : {}),
    ...(isoDate(listing.updatedAt) ? { dateModified: isoDate(listing.updatedAt) } : {}),
    ...(listing.location ? { contentLocation: { "@type": "Place", name: listing.location } } : {}),
  };
  return { canonical, title, description, images, active, status, schema };
}

