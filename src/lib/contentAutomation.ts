export const slugifyTopic = (value: string): string =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

export interface ScoredSourceItem { title: string; link: string; score: number }

export const dedupeSources = (items: ScoredSourceItem[]): ScoredSourceItem[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.link}|${item.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const canTransitionStatus = (from: string, to: string): boolean => {
  const graph: Record<string, string[]> = {
    draft_generated: ["pending_review", "approved", "failed"],
    pending_review: ["approved", "failed"],
    approved: ["published", "failed"],
    published: [],
    failed: ["pending_review"],
  };
  return graph[from]?.includes(to) ?? false;
};

export const hasDailyDuplicate = (
  existing: { title: string; date: string }[],
  topicTitle: string,
  date: string,
): boolean => existing.some((p) => p.date === date && p.title.toLowerCase() === topicTitle.toLowerCase());

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
