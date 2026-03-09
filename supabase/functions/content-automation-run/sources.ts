export interface ResearchSource {
  id: string;
  name: string;
  type: "rss";
  url: string;
  weight: number;
  tags: string[];
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  { id: "openai-blog", name: "OpenAI Blog", type: "rss", url: "https://openai.com/news/rss.xml", weight: 0.9, tags: ["ai", "enterprise"] },
  { id: "google-cloud-ai", name: "Google Cloud AI", type: "rss", url: "https://cloudblog.withgoogle.com/rss/", weight: 0.8, tags: ["ai", "enterprise"] },
  { id: "microsoft-ai", name: "Microsoft AI Blog", type: "rss", url: "https://blogs.microsoft.com/ai/feed/", weight: 0.8, tags: ["ai", "enterprise"] },
  { id: "anthropic-news", name: "Anthropic News", type: "rss", url: "https://www.anthropic.com/news/rss.xml", weight: 0.8, tags: ["ai", "safety"] },
  { id: "lawsites", name: "LawSites", type: "rss", url: "https://www.lawnext.com/feed", weight: 1, tags: ["legal", "legal-tech"] },
  { id: "legalitinsider", name: "Legal IT Insider", type: "rss", url: "https://legaltechnology.com/feed/", weight: 1, tags: ["legal", "enterprise"] },
  { id: "venturebeat-ai", name: "VentureBeat AI", type: "rss", url: "https://venturebeat.com/category/ai/feed/", weight: 0.7, tags: ["ai", "news"] },
];
