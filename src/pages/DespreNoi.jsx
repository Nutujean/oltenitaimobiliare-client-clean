import PageMetadata from "../components/PageMetadata";
import PlatformFacts from "../components/PlatformFacts";
import { platform, aboutPage, platformPageSchema } from "../data/platform.js";

export default function DespreNoi() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <PageMetadata {...aboutPage} route="/despre-noi" structuredData={platformPageSchema("AboutPage", "/despre-noi", aboutPage.title, aboutPage.description)} />
      <h1 className="text-3xl font-bold text-gray-900 mb-7">{aboutPage.heading}</h1>
      <PlatformFacts />
      <p className="mt-7">Email: <a className="text-blue-700 underline" href={`mailto:${platform.email}`}>{platform.email}</a></p>
    </div>
  );
}
