export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const dedupeBy = <T>(items: T[], key: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export const parseRssItems = (xml: string) => {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const pubRegex = /<pubDate>(.*?)<\/pubDate>/;
  const out: { title: string; link: string; publishedAt?: string }[] = [];

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const titleMatch = item.match(titleRegex);
    const linkMatch = item.match(linkRegex);
    const pubMatch = item.match(pubRegex);

    const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim();
    const link = (linkMatch?.[1] || "").trim();
    if (title && link) out.push({ title, link, publishedAt: pubMatch?.[1] });
  }

  return out;
};

export const safeJson = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const extractJsonObject = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
};

export const wordCountFromHtml = (html: string): number =>
  html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

export const shouldSkipRunForDay = (params: {
  hasRunningRun: boolean;
  hasCompletedRunToday: boolean;
  force: boolean;
}) => params.hasRunningRun || (!params.force && params.hasCompletedRunToday);
