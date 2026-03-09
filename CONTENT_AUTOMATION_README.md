# Content Automation Subsystem

## How it works
- `supabase/functions/content-automation-run` orchestrates daily generation.
- It fetches configurable RSS sources (`sources.ts`), ranks legal relevance, chooses a topic, generates SEO/article/newsletter drafts, and persists to `blog_posts`.
- Drafts are always saved as non-published with `status=pending_review` and `newsletter_status=newsletter_draft_ready`.
- Each run is logged in `content_generation_runs`.
- Function auth requires either a bearer token or a valid `x-run-secret` header.

## Required environment variables
See `.env.example`.
- Required to run automation: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CONTENT_AUTOMATION_RUN_SECRET`.
- Required for edge function internals: `SUPABASE_SERVICE_ROLE_KEY`.
- Optional integrations: `OPENAI_API_KEY`, `UNSPLASH_ACCESS_KEY`, `SENDGRID_API_KEY`.

## Local usage
1. Deploy/publish migration and edge function.
2. Set local env vars from `.env.example`.
3. Manual trigger:
   - `npm run content:generate`
   - `npm run content:generate -- --mode=roundup`
   - `npm run content:generate -- --mode=deep-dive`

## Review and publish workflow
- Go to `/blog-management`.
- Review generated title/content/SEO/meta/images.
- Click **Approve** (sets `status=approved`).
- Click **Publish** (sets `status=published`, `published=true`, `published_at`).

## Newsletter approval workflow
- Generated with blog draft (`newsletter_status=newsletter_draft_ready`).
- Admin clicks **Approve Newsletter** (`newsletter_status=newsletter_approved`).
- Sending is intentionally separated and must be explicit (no auto-send).

## Scheduler deployment notes
- Call `POST /functions/v1/content-automation-run` daily with `x-run-secret` and mode payload.
- Duplicate guard blocks concurrent daily `running` runs.
- Use `force: true` payload only for intentional override/regeneration.
- The final QA gate rejects drafts missing required SEO/newsletter fields or article length under 1200 words.

## Stubbed vs fully integrated
- **Fully integrated**: research fetch, ranking, SEO/article/newsletter generation, persistence, run history, admin approval transitions.
- **Optional/stubbed fallback**: if OpenAI/Unsplash env vars are missing, function generates deterministic draft content and image suggestions.
- **SendGrid**: draft metadata/state supported; direct send operation intentionally not auto-wired yet to preserve approval safety.
