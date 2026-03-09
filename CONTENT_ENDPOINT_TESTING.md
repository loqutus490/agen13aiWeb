# Content Ingestion Endpoint — Testing Guide

## Endpoint URL

**Draft Ingestion:**
```
POST {SUPABASE_URL}/functions/v1/content-ingest
```

**Daily Run Check:**
```
GET {SUPABASE_URL}/functions/v1/content-run-check?date=YYYY-MM-DD
```

## Required Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `apikey` | Your Supabase anon key |
| `x-agent13-internal-key` | The value of the `AGENT13_INTERNAL_API_KEY` secret |

## Required Payload Fields

| Field | Type | Required |
|-------|------|----------|
| `title` | string | ✅ |
| `slug` | string | ✅ |
| `excerpt` | string | ✅ |
| `content_html` | string | ✅ |

## Optional Payload Fields

| Field | Type |
|-------|------|
| `seo_title` | string |
| `meta_description` | string (max 160 chars) |
| `primary_keyword` | string |
| `secondary_keywords` | string[] |
| `faq_json` | array of `{question, answer}` |
| `schema_json` | object |
| `internal_link_suggestions` | string[] |
| `source_links_json` | array of `{title, link, source}` |
| `image_options_json` | array of `{url, alt, filename}` |
| `post_type` | string (e.g. `"deep-dive"`, `"roundup"`) |
| `newsletter_subject_options` | string[] |
| `newsletter_preview_text` | string |
| `newsletter_body` | string (HTML) |
| `generation_run_id` | string |
| `tags` | string[] |
| `category` | string (default: `"AI Strategy"`) |
| `author` | string (default: `"agent13 ai Team"`) |

## Auto-Set Fields

These are set automatically by the endpoint and cannot be overridden:

- `created_by_system = true`
- `status = "pending_review"`
- `newsletter_status = "draft"`
- `published = false`

## Example curl — Submit Draft

```bash
curl -X POST https://upmiqdnbvojpodgucxmw.supabase.co/functions/v1/content-ingest \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "x-agent13-internal-key: YOUR_INTERNAL_KEY" \
  -d '{
    "title": "How Law Firms Can Safely Adopt Legal RAG Systems",
    "slug": "legal-rag-law-firms-guide",
    "excerpt": "A practical guide for law firm leaders evaluating AI retrieval systems.",
    "content_html": "<h1>Article content here</h1><p>...</p>",
    "seo_title": "Legal RAG for Law Firms: A Practical Guide",
    "meta_description": "Learn how law firms can evaluate and deploy legal RAG systems safely.",
    "primary_keyword": "legal rag for law firms",
    "secondary_keywords": ["law firm ai automation", "enterprise legal ai"],
    "post_type": "deep-dive",
    "generation_run_id": "test-run-001"
  }'
```

## Success Response (201)

```json
{
  "success": true,
  "postId": "uuid-here",
  "status": "pending_review"
}
```

## Error Responses

| Status | Meaning |
|--------|---------|
| 401 | Missing or invalid `x-agent13-internal-key` |
| 400 | Missing required fields or invalid JSON |
| 405 | Wrong HTTP method |
| 409 | Duplicate slug already exists |
| 500 | Database insert failure |

## Example curl — Check Daily Generation

```bash
curl -X GET "https://upmiqdnbvojpodgucxmw.supabase.co/functions/v1/content-run-check?date=2026-03-09" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "x-agent13-internal-key: YOUR_INTERNAL_KEY"
```

## In-App Testing

Navigate to `/admin/internal-tests/content-ingestion` (admin-only) to use the built-in testing UI:

1. Click **Generate Test Payload** to fill the form with sample data
2. Click **Send Draft to Endpoint** to submit
3. Check the result and click **View in Blog Management** to verify
4. Use **Check Daily Generation** to test the run-check endpoint

## Review Workflow

After ingestion, drafts appear in `/blog-management`:
- Filter by **AI Drafts** or **Pending Review** tabs
- Use the **Inspect** (eye icon) to review all metadata
- Click **Approve** → **Publish** for the blog post
- Separately **Approve Newsletter** for the newsletter draft
