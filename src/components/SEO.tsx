import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "agent13 ai";
const BASE_URL = "https://here-what-now.lovable.app";

interface SEOProps {
  title: string;
  description: string;
  type?: string;
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

const SEO = ({ title, description, type = "website" }: SEOProps) => {
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
  }, [title, description, type, pathname]);

  return null;
};

export default SEO;
