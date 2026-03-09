# Content Ingestion Setup

## What was added

1. **Database schema extensions** — Added SEO, newsletter, review workflow, and traceability columns to `blog_posts`. Created `content_generation_runs` table with RLS policies.

2. **`content-ingest` edge function** — Secure POST endpoint for external systems (Azure automation agent) to submit blog drafts.

3. **`content-run-check` edge function** — Secure GET endpoint to check if AI-generated content already exists for a given date.

4. **Admin UI updates** — Extended `/blog-management` with filtering (AI drafts, pending review, published), an inspection dialog showing all SEO/newsletter/source metadata, and separate approve/publish/reject actions for blog posts and newsletters.

---

## Internal Ingestion Endpoint

**URL:**
```
POST https://upmiqdnbvojpodgucxmw.supabase.co/functions/v1/content-ingest
```

**Required Headers:**
```
Content-Type: application/json
x-agent13-internal-key: <your-secret-key>
```

**Required Body Fields:**
- `title` (string)
- `slug` (string)
- `excerpt` (string)
- `content_html` (string) — full HTML article body

**Optional Body Fields:**
- `date` (string, YYYY-MM-DD) — defaults to today
- `category` (string) — defaults to "AI Strategy"
- `author` (string) — defaults to "agent13 ai Team"
- `tags` (string[])
- `featured_image_url` or `image_url` (string)
- `seo_title` (string)
- `meta_description` (string, truncated to 160 chars)
- `primary_keyword` (string)
- `secondary_keywords` (string[])
- `faq_json` (array of `{question, answer}`)
- `schema_json` (object)
- `internal_link_suggestions` (string[])
- `source_links_json` (array of `{title, link, source}`)
- `image_options_json` (array of `{url, alt, filename}`)
- `post_type` (string) — e.g. "deep-dive", "roundup"
- `review_notes` (string)
- `newsletter_subject_options` (string[])
- `newsletter_preview_text` (string)
- `newsletter_body` (string, HTML)
- `generation_run_id` (string)

**Example Payload:**
```json
{
  "title": "How Law Firms Can Use Legal RAG Safely",
  "slug": "how-law-firms-can-use-legal-rag-safely",
  "excerpt": "A practical guide for law firm leaders evaluating AI retrieval systems.",
  "content_html": "<h1>How Law Firms Can Use Legal RAG Safely</h1><p>...</p>",
  "seo_title": "Legal RAG for Law Firms: A Practical Guide",
  "meta_description": "Learn how law firms can evaluate legal RAG systems for secure search and retrieval.",
  "primary_keyword": "legal rag for law firms",
  "secondary_keywords": ["law firm ai automation", "enterprise legal ai"],
  "faq_json": [{"question": "What is legal RAG?", "answer": "..."}],
  "schema_json": {"@type": "Article", "headline": "..."},
  "internal_link_suggestions": ["/services", "/ai-tools"],
  "image_options_json": [{"url": "https://...", "alt": "...", "filename": "..."}],
  "source_links_json": [{"title": "Source article", "link": "https://...", "source": "TechCrunch"}],
  "post_type": "deep-dive",
  "newsletter_subject_options": ["Subject line A", "Subject line B"],
  "newsletter_preview_text": "Quick preview...",
  "newsletter_body": "<p>Newsletter content...</p>",
  "generation_run_id": "azure-run-2026-03-09-001"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "postId": "uuid-here",
  "status": "pending_review"
}
```

**Error Responses:**
- `401` — Missing or invalid `x-agent13-internal-key`
- `400` — Missing required fields or invalid JSON
- `405` — Wrong HTTP method
- `409` — Duplicate slug
- `500` — Database insert failure

---

## Duplicate Check Endpoint

**URL:**
```
GET https://upmiqdnbvojpodgucxmw.supabase.co/functions/v1/content-run-check?date=2026-03-09
```

**Required Headers:**
```
x-agent13-internal-key: <your-secret-key>
```

**Success Response (no content exists):**
```json
{
  "success": true,
  "date": "2026-03-09",
  "exists": false
}
```

**Success Response (content exists):**
```json
{
  "success": true,
  "date": "2026-03-09",
  "exists": true,
  "count": 1,
  "posts": [
    {
      "postId": "uuid-here",
      "status": "pending_review",
      "title": "..."
    }
  ]
}
```

---

## Required Environment Variable

| Secret Name | Purpose |
|---|---|
| `AGENT13_INTERNAL_API_KEY` | Authenticates requests from the Azure automation agent |

This secret is stored in Lovable Cloud secrets and available to edge functions.

---

## How to Test Manually

**Test ingestion:**
```bash
curl -X POST \
  https://upmiqdnbvojpodgucxmw.supabase.co/functions/v1/content-ingest \
  -H "Content-Type: application/json" \
  -H "x-agent13-internal-key: YOUR_SECRET_HERE" \
  -d '{
    "title": "Test Draft Post",
    "slug": "test-draft-post",
    "excerpt": "A test draft from the Azure agent.",
    "content_html": "<h1>Test</h1><p>This is a test draft.</p>"
  }'
```

**Test run check:**
```bash
curl -X GET \
  "https://upmiqdnbvojpodgucxmw.supabase.co/functions/v1/content-run-check?date=2026-03-09" \
  -H "x-agent13-internal-key: YOUR_SECRET_HERE"
```

---

## Review Workflow

1. **Azure agent submits draft** → saved as `status: pending_review`, `newsletter_status: draft`, `created_by_system: true`
2. **Admin opens `/blog-management`** → filters by "AI Drafts" or "Pending Review"
3. **Admin clicks inspect (eye icon)** → reviews SEO metadata, article content, newsletter draft, sources, and image options
4. **Admin approves blog post** → status moves to `approved`
5. **Admin publishes blog post** → status moves to `published`, sets `published_at`
6. **Admin rejects blog post** → status moves to `failed`; can later return to review
7. **Newsletter is independent** → Admin approves newsletter separately, marks as sent when ready

Blog approval and newsletter approval are completely separate actions.
