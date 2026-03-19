export const PROMPTS = {
  topicSelection: `You are selecting content topics for law-firm decision makers (managing partners, practice group leaders, and IT directors at small-to-midsize law firms). Pick one topic from sources that best fits practical AI adoption, legal document automation, legal RAG, or enterprise AI workflows for general law firm operations. AVOID niche corporate structures (e.g. Swiss Vereins, LLP governance), M&A-specific topics, or issues relevant only to Am Law 100 firms. Focus on topics any law firm of any size can act on.`,

  seoPackage: `Generate an SEO package targeting general law firm audiences (not niche legal structures). The primary keyword should have realistic search volume among legal professionals exploring AI tools. Return JSON with keys: seo_title, primary_keyword, secondary_keywords, meta_description, faq_json, schema_json, internal_links, slug. Ensure the meta_description is under 155 characters and speaks directly to law firm owners or IT leaders evaluating AI.`,

  writer: `Write a 1200-2000+ word blog post for a GENERAL law firm audience — partners, associates, office managers, and IT leaders at firms of all sizes.

TONE: Casual-professional editorial. Use a storytelling intro grounded in a relatable law-firm scenario (e.g. intake bottlenecks, document review backlogs, client communication gaps). Avoid jargon that only BigLaw or corporate-structure specialists would understand.

STRUCTURE:
- Opening narrative hook (2-3 paragraphs)
- "Why this matters for your firm" section
- Practical step-by-step recommendations (numbered or bulleted)
- A callout box emphasizing human oversight requirements
- Conclusion with clear next steps
- FAQ section (3-5 questions) at the end

CONTENT RULES:
- Frame every insight as actionable for a 5-50 attorney firm
- Reference specific workflows: intake, document drafting, knowledge retrieval, client communications, billing review
- Always emphasize human-in-the-loop review for client-facing outputs
- Avoid referencing specific firm names unless universally known
- Do NOT focus on niche corporate structures, governance models, or topics only relevant to global mega-firms
- Include at least one concrete example or mini case study`,

  newsletter: `Create a newsletter draft for law firm professionals. Return JSON with keys: subject_options (array of 3 subject lines), preview_text, body_html. Subject lines should be curiosity-driven and reference practical benefits (time saved, risk reduced, client experience improved). The body should be a concise 3-4 paragraph summary encouraging readers to read the full article. Tone: helpful peer, not salesy.`,

  relevanceScoring: `Score source items for general law-firm usefulness from 1-10. Prioritize topics about: document automation, client intake, knowledge management, AI-assisted drafting, compliance workflows, and operational efficiency. Deprioritize: niche corporate structures, BigLaw-only concerns, pure tech news without legal application, academic/theoretical AI research.`,
};
