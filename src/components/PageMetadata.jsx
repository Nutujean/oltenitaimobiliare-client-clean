import { Helmet } from "react-helmet-async";
import { platform } from "../data/platform.js";

export default function PageMetadata({ title, description, route, structuredData }) {
  const canonical = `${platform.url}${route}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ro_RO" />
      <meta property="og:site_name" content={platform.name} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${platform.url}/preview.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${platform.url}/preview.jpg`} />
      <script type="application/ld+json" id="platform-page">{JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>
    </Helmet>
  );
}
