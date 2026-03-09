# Content Automation Implementation Plan

## Repository Assessment
- **Stack**: Vite + React + TypeScript SPA with shadcn/ui components and Supabase JS client.
- **Data layer**: Direct client-side Supabase table access for app data; Supabase Edge Functions used for server-side integrations (Deno runtime).
- **Auth model**: Supabase Auth session in `AuthContext`; admin authorization via `user_roles` table and `has_role` helper.
- **Deployment pattern**: Lovable app + Supabase project; SQL migrations under `supabase/migrations`; edge functions under `supabase/functions`.
- **Admin structure**:
  - `/admin` for lead analytics.
  - `/blog-management` for CRUD on `blog_posts`.
- **Blog storage/rendering**:
  - Blog content stored in `public.blog_posts`.
  - Public blog pages fetch `published=true` posts from Supabase and render HTML content.

## Architecture Decision
Given the TypeScript-first app and existing Supabase Edge Function usage, implement automation as a **Supabase Edge Function orchestration subsystem** with:
1. configurable research sources + prompt templates,
2. modular generation pipeline (research → strategy → SEO → writing → images → newsletter → QA),
3. persistence to `blog_posts` in pending-review states,
4. run history persisted in new `content_generation_runs` table,
5. admin approval controls added to existing `/blog-management` page,
6. manual trigger command + scheduler-safe endpoint call.

## Implementation Steps
1. Extend DB schema (`blog_posts` + `content_generation_runs`) with workflow, SEO, image, newsletter, and run metadata fields.
2. Update Supabase TypeScript types for new fields.
3. Add content automation modules in edge-function scope:
   - source config,
   - prompts,
   - utility + validation,
   - orchestrator function endpoint.
4. Add idempotency + duplicate-guard logic (topic/day collisions and run locks).
5. Extend `/blog-management` with:
   - workflow/status columns,
   - review + publish actions,
   - newsletter approval action,
   - run history visibility.
6. Add manual execution script (`npm run content:generate`) that invokes the edge function securely.
7. Add tests (logic-level unit tests): slug generation, dedupe, status transition, duplicate guard/fallback.
8. Add docs:
   - `.env.example` entries,
   - `CONTENT_AUTOMATION_README.md` operations guide.

## Assumptions
- External LLM provider will be OpenAI-compatible via server-side `fetch` from edge function.
- Unsplash and SendGrid integrations are optional and env-driven; when missing, pipeline falls back to suggestion/draft-only mode.
- Final publish/send are explicitly human-approved actions from admin UI (no auto-publish without approval).
- Existing blog rendering remains compatible by continuing to use `content` and `published`.
