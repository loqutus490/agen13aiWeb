import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "agent13 ai";
const BASE_URL = "https://agent13.ai";
const LOGO_URL = `${BASE_URL}/lovable-uploads/agent13-logo.png`;

interface ArticleData {
  headline: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  description: string;
}

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  article?: ArticleData;
  noJsonLd?: boolean;
}

const setMeta = (attr: string, key: string, value: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const JSONLD_ID = "seo-json-ld";

const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "agent13 ai",
  url: BASE_URL,
  logo: LOGO_URL,
  description: "AI-Powered Document Solutions for Law Firms",
  sameAs: [],
});

const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

const buildArticleSchema = (article: ArticleData, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.headline,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  description: article.description,
  url,
  ...(article.image && { image: article.image }),
  author: {
    "@type": "Person",
    name: article.author || "agent13 ai Team",
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: LOGO_URL },
  },
});

const SEO = ({ title, description, type = "website", article, noJsonLd }: SEOProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", `${BASE_URL}${pathname}`);
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${BASE_URL}${pathname}`);

    // JSON-LD
    if (!noJsonLd) {
      const schemas: object[] = [];
      const pageUrl = `${BASE_URL}${pathname}`;

      if (pathname === "/") {
        schemas.push(buildOrganizationSchema(), buildWebSiteSchema());
      }

      if (type === "article" && article) {
        schemas.push(buildArticleSchema(article, pageUrl));
      }

      let scriptEl = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
      if (schemas.length > 0) {
        if (!scriptEl) {
          scriptEl = document.createElement("script");
          scriptEl.id = JSONLD_ID;
          scriptEl.type = "application/ld+json";
          document.head.appendChild(scriptEl);
        }
        scriptEl.textContent = JSON.stringify(
          schemas.length === 1 ? schemas[0] : schemas
        );
      } else if (scriptEl) {
        scriptEl.remove();
      }
    }

    return () => {
      const el = document.getElementById(JSONLD_ID);
      if (el) el.remove();
    };
  }, [title, description, type, pathname, article, noJsonLd]);

  return null;
};

export default SEO;
