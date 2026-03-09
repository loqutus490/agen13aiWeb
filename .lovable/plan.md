

# Website Audit Summary

## Features Reviewed
All pages (Home, Features, Services, AI Tools, Case Studies, Resources, Blog, Blog Post, Pricing, About, Contact, Contact Thank You, FAQ, Privacy Policy, Terms of Service, Login, Signup, Admin Dashboard, Blog Management, 404) plus the AI chatbot widget, lead capture forms, email edge functions, and auth system.

---

## Issues Found (by priority)

### HIGH Priority

1. **Duplicate content in chatbot system prompt** -- Lines 161-162 of `supabase/functions/chat/index.ts` repeat service descriptions ("Bespoke AI development..." and "API integrations...") that already appear earlier in the prompt. This wastes tokens and could confuse the AI model.

2. **404 page is unstyled / off-brand** -- `NotFound.tsx` uses hardcoded `bg-gray-100`, `text-blue-500` colors instead of the brand's design system (no Navbar, no Footer, no themed colors). Every other page uses the branded layout.

3. **useAdmin hook does not react to auth changes** -- The `useAdmin` hook runs `checkAdminStatus()` only once on mount (`useEffect([], [])`). If a user logs in or out, the admin status is stale until a full page reload. It should listen to auth state changes.

### MEDIUM Priority

4. **Blog RLS policies are all RESTRICTIVE (not PERMISSIVE)** -- The `blog_posts` table has both "Published blog posts are viewable by everyone" and "Admins can view all blog posts" as `Permissive: No` (restrictive). Restrictive policies require ALL to pass. This means a non-admin user must satisfy ALL restrictive policies simultaneously, which could block reads unexpectedly. These should be PERMISSIVE so that either condition grants access.

5. **`download_leads` insert is fully blocked by RLS** -- The insert policy on `download_leads` is `WITH CHECK: false`. Leads are saved via the `submit-lead` edge function using the service role key (which bypasses RLS), so it works, but if any code path tries to insert directly from the client, it will silently fail. This is by design but worth documenting.

6. **No email verification feedback on signup** -- The signup page redirects to `/login` with a toast saying "Account created successfully! You can now sign in." But if email confirmation is required (which it should be), users cannot actually sign in until they verify. The message should say "Check your email to verify your account."

### LOW Priority

7. **AI Tools page references external product (prodscript.ai)** -- The AI Tools page links to `https://prodscript.ai/` as a "Product Description Generator." Verify this is still the correct URL and the tool is still active.

8. **No `<meta>` tags or SEO handling** -- Pages do not set document title or meta descriptions dynamically. This affects search engine visibility.

9. **Chat widget `verify_jwt = false`** -- The `chat` edge function does not verify JWT tokens. This is intentional for public access but means anyone can call the endpoint. Rate limiting is handled at the edge function level via the `rate_limits` table, which is good.

10. **Missing `About` page review** -- The About, FAQ, CaseStudies, Features, and Services pages are static content pages. They render correctly with Navbar/Footer but should be reviewed for content accuracy periodically.

---

## What's Working Well
- Auth system (login/signup/signout) is properly wired with Supabase
- Role-based access control via `user_roles` table with `has_role()` security definer function
- Blog system with CRUD, image upload, DOMPurify sanitization, tag filtering
- Contact form with Zod validation on both client and server, SendGrid integration
- Lead capture in chatbot and resource downloads
- Admin dashboard with search, filter, and CSV export
- Cookie consent banner
- GTM dataLayer events for analytics
- Design token rename (orange → navy) completed cleanly with no stale references

