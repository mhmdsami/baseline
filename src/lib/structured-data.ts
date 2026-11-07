import { site } from "./site.ts";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    description: site.description,
    url: site.url,
    inLanguage: site.locale,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.author.url,
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
