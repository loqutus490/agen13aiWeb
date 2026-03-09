export const slugifyTopic = (value) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
export const dedupeSources = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.link}|${item.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
export const canTransitionStatus = (from, to) => ({
  draft_generated: ['pending_review', 'failed'],
  pending_review: ['approved', 'failed'],
  approved: ['published', 'failed'],
  published: [],
  failed: ['pending_review'],
}[from]?.includes(to) ?? false);
export const hasDailyDuplicate = (existing, topicTitle, date) => existing.some((p) => p.date === date && p.title.toLowerCase() === topicTitle.toLowerCase());

export const extractJsonObject = (value) => {
  const trimmed = value.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);

  return trimmed;
};

export const wordCountFromHtml = (html) => html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
