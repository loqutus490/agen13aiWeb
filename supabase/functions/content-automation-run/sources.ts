export interface ResearchSource {
  id: string;
  name: string;
  type: "rss";
  url: string;
  weight: number;
  tags: string[];
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  // Legal-tech primary sources (highest weight)
  { id: "lawsites", name: "LawSites (LawNext)", type: "rss", url: "https://www.lawnext.com/feed", weight: 1.0, tags: ["legal", "legal-tech", "law-firm-ai"] },
  { id: "legalitinsider", name: "Legal IT Insider", type: "rss", url: "https://legaltechnology.com/feed/", weight: 1.0, tags: ["legal", "enterprise", "legal-tech"] },
  { id: "artificial-lawyer", name: "Artificial Lawyer", type: "rss", url: "https://www.artificiallawyer.com/feed/", weight: 1.0, tags: ["legal", "ai", "law-firm-ai"] },
  { id: "above-the-law", name: "Above the Law - Legal Tech", type: "rss", url: "https://abovethelaw.com/legal-innovation-center/feed/", weight: 0.9, tags: ["legal", "legal-tech", "practice-management"] },
  { id: "ilta-net", name: "ILTA (Int'l Legal Tech Assoc)", type: "rss", url: "https://www.iltanet.org/blogs/blogs-all?format=rss", weight: 0.9, tags: ["legal", "enterprise", "legal-tech"] },

  // AI enterprise sources (moderate weight — filtered for legal relevance by scoring)
  { id: "openai-blog", name: "OpenAI Blog", type: "rss", url: "https://openai.com/news/rss.xml", weight: 0.6, tags: ["ai", "enterprise"] },
  { id: "google-cloud-ai", name: "Google Cloud AI", type: "rss", url: "https://cloudblog.withgoogle.com/rss/", weight: 0.5, tags: ["ai", "enterprise"] },
  { id: "microsoft-ai", name: "Microsoft AI Blog", type: "rss", url: "https://blogs.microsoft.com/ai/feed/", weight: 0.5, tags: ["ai", "enterprise"] },
  { id: "anthropic-news", name: "Anthropic News", type: "rss", url: "https://www.anthropic.com/news/rss.xml", weight: 0.5, tags: ["ai", "safety"] },

  // Practical SMB / workflow automation sources
  { id: "clio-blog", name: "Clio Blog", type: "rss", url: "https://www.clio.com/blog/feed/", weight: 0.9, tags: ["legal", "practice-management", "law-firm-ops"] },
  { id: "lawyerist", name: "Lawyerist", type: "rss", url: "https://lawyerist.com/feed/", weight: 0.85, tags: ["legal", "small-firm", "practice-management"] },
  { id: "smokeball-blog", name: "Smokeball Blog", type: "rss", url: "https://www.smokeball.com/blog/feed/", weight: 0.8, tags: ["legal", "practice-management", "automation"] },
];
