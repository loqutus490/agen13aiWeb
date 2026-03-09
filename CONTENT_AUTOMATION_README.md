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
- Review generated title/content/SEO/meta/images/newsletter fields in the metadata review section.
- Click **Approve** (sets `status=approved`).
- Click **Publish** (sets `status=published`, `published=true`, `published_at`).

## Newsletter approval and send workflow
- Generated with blog draft (`newsletter_status=newsletter_draft_ready`).
- Admin clicks **Approve Newsletter** (`newsletter_status=newsletter_approved`).
- Admin clicks **Send Newsletter** which calls `send-newsletter-draft` edge function.
- Function validates approval state before sending and sets `newsletter_status=newsletter_sent` on success.
- No auto-send is performed without explicit admin action.

## Scheduler deployment notes
- Call `POST /functions/v1/content-automation-run` daily with `x-run-secret` and mode payload.
- Duplicate guard blocks concurrent daily `running` runs and skips when mode already completed for the day (unless `force=true`).
- Stale `running` jobs are auto-marked failed after `CONTENT_AUTOMATION_RUN_TIMEOUT_MINUTES`.
- Optional `CONTENT_AUTOMATION_ALERT_WEBHOOK_URL` receives failure alerts.
- The final QA gate rejects drafts missing required SEO/newsletter fields or article length under 1200 words.

## Deployment checklist
1. Apply migrations: `supabase db push` (or your migration pipeline).
2. Deploy functions:
   - `supabase functions deploy content-automation-run`
   - `supabase functions deploy send-newsletter-draft`
3. Set secrets in Supabase:
   - Required: `SUPABASE_SERVICE_ROLE_KEY`, `CONTENT_AUTOMATION_RUN_SECRET`
   - Optional: `OPENAI_API_KEY`, `UNSPLASH_ACCESS_KEY`, `SENDGRID_API_KEY`, `CONTENT_AUTOMATION_ALERT_WEBHOOK_URL`
4. Verify schema:
   - `blog_posts` has SEO/newsletter/status fields.
   - `content_generation_runs` exists with RLS policies.
5. Smoke test:
   - Run `npm run content:generate -- --mode=deep-dive`
   - Confirm run appears in `/blog-management`
   - Approve + publish + approve newsletter + send newsletter

## Stubbed vs fully integrated
- **Fully integrated**: research fetch, ranking, SEO/article/newsletter generation, persistence, run history, admin approval transitions, explicit newsletter send function.
- **Optional/stubbed fallback**: if OpenAI/Unsplash env vars are missing, function generates deterministic draft content and image suggestions.
