import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { PROMPTS } from "./prompts.ts";
import { RESEARCH_SOURCES } from "./sources.ts";
import { dedupeBy, extractJsonObject, parseRssItems, safeJson, slugify, wordCountFromHtml } from "./utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-run-secret",
};

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const llm = async (prompt: string): Promise<string | null> => {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) {
    console.error("LOVABLE_API_KEY not set – falling back to stub content");
    return null;
  }

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    console.error("Lovable AI gateway error:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content as string | undefined ?? null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    const runSecret = req.headers.get("x-run-secret");
    const expected = Deno.env.get("CONTENT_AUTOMATION_RUN_SECRET");
    const hasValidSecret = Boolean(expected && runSecret === expected);

    let authorized = hasValidSecret;

    if (!authorized && authHeader?.toLowerCase().startsWith("bearer ")) {
      // Verify the bearer token belongs to an admin user
      const token = authHeader.replace(/^bearer\s+/i, "");
      const { data: userData, error: userErr } = await supabase.auth.getUser(token);
      if (!userErr && userData?.user?.id) {
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();
        authorized = !!role;
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode === "roundup" ? "roundup" : "deep-dive";
    const triggerType = body.triggerType || "manual";

    const today = new Date().toISOString().slice(0, 10);
    const { data: existingRun } = await supabase
      .from("content_generation_runs")
      .select("id")
      .eq("status", "running")
      .gte("started_at", `${today}T00:00:00.000Z`)
      .maybeSingle();

    if (existingRun) {
      return new Response(JSON.stringify({ skipped: true, reason: "run_already_in_progress", runId: existingRun.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: run, error: runErr } = await supabase.from("content_generation_runs").insert({ mode, trigger_type: triggerType, status: "running", logs_json: [] }).select().single();
    if (runErr) throw runErr;

    const logs: string[] = [];
    const log = (m: string) => logs.push(`[${new Date().toISOString()}] ${m}`);

    try {
      log("Starting research fetch");
      const sourceItems: { title: string; link: string; source: string; score: number }[] = [];
      for (const src of RESEARCH_SOURCES) {
        try {
          const xml = await (await fetch(src.url)).text();
          const items = parseRssItems(xml).slice(0, 5).map((i) => ({ ...i, source: src.name }));
          items.forEach((item) => {
            const lc = `${item.title} ${item.link}`.toLowerCase();
            const relevance = [
              "law firm", "legal", "attorney", "lawyer", "practice management",
              "client intake", "document automation", "case management", "billing",
              "compliance", "rag", "knowledge management", "drafting", "workflow",
              "small firm", "solo practitioner",
            ].filter((t) => lc.includes(t)).length;
            sourceItems.push({ title: item.title, link: item.link, source: src.name, score: src.weight * 5 + relevance * 1.5 });
          });
        } catch {
          log(`Source fetch failed: ${src.name}`);
        }
      }

      const deduped = dedupeBy(sourceItems.sort((a, b) => b.score - a.score), (x) => x.link).slice(0, 12);
      if (!deduped.length) throw new Error("No research sources could be fetched");

      const selected = deduped[0];
      const suggestedTitle = mode === "roundup"
        ? `Daily AI Roundup for Law Firms: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
        : `${selected.title}: What Law Firms Should Do Next`;
      const baseSlug = slugify(suggestedTitle);

      // Check for duplicate slug and auto-append suffix if needed
      const ensureUniqueSlug = async (slug: string): Promise<string> => {
        const { data } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
        if (!data) return slug;
        // Try appending date, then incrementing counter
        const dated = `${slug}-${today}`;
        const { data: d2 } = await supabase.from("blog_posts").select("id").eq("slug", dated).maybeSingle();
        if (!d2) return dated;
        for (let i = 2; i <= 10; i++) {
          const candidate = `${slug}-${today}-${i}`;
          const { data: d3 } = await supabase.from("blog_posts").select("id").eq("slug", candidate).maybeSingle();
          if (!d3) return candidate;
        }
        return `${slug}-${Date.now()}`;
      };

      const seoFallback = {
        seo_title: suggestedTitle,
        primary_keyword: "ai automation for law firms",
        secondary_keywords: ["legal rag", "law firm ai workflow", "enterprise ai adoption"],
        meta_description: `A practical guide for law firms based on recent AI news: ${selected.title}`.slice(0, 155),
        faq_json: [
          { question: "How can law firms start with AI?", answer: "Start with one workflow, enforce review gates, and measure impact." },
        ],
        schema_json: { "@type": "Article", headline: suggestedTitle },
        internal_links: ["/services", "/ai-tools", "/blog"],
      };

      const seoRaw = await llm(`${PROMPTS.seoPackage}\n\nTopic: ${selected.title}\nReturn strict JSON with keys: seo_title,primary_keyword,secondary_keywords,meta_description,faq_json,schema_json,internal_links,slug.`);
      const seo = seoRaw ? safeJson(extractJsonObject(seoRaw), seoFallback) : seoFallback;
      const finalSlug = await ensureUniqueSlug(slugify(seo.slug || baseSlug));

      if (!seo.meta_description || !seo.primary_keyword || !(seo.secondary_keywords || []).length) {
        throw new Error("SEO package missing required fields");
      }
      if (!Array.isArray(seo.faq_json) || !seo.schema_json) {
        throw new Error("Malformed FAQ/schema payload");
      }

      const articlePrompt = `${PROMPTS.writer}\n\nTopic: ${selected.title}\nPrimary keyword: ${seo.primary_keyword}\nSecondary: ${(seo.secondary_keywords || []).join(", ")}\nInclude FAQ section at the end.`;
      const fallbackArticle = `<h1>${suggestedTitle}</h1>
<p>AI adoption in law firms is moving from experimentation to operational discipline. Firms that approach this transition thoughtfully can improve speed, consistency, and service quality without compromising professional standards.</p>
<p>This draft summarizes the latest development and translates it into practical actions for law-firm owners, partners, and IT leaders. It focuses on documented workflows, governance, and measurable implementation steps.</p>
<h2>What changed in this story and why legal teams should care</h2>
<p>${selected.title}</p>
<p>For legal practices, the key issue is rarely whether AI exists. The real issue is how to apply it in controlled, reviewable, and client-safe ways. New model releases and platform updates can create opportunities, but only when integrated into defined internal processes.</p>
<p>Law firms handle sensitive documents, strict deadlines, and nuanced communications. That makes governance and quality controls non-negotiable. A useful AI rollout must preserve attorney judgment, maintain confidentiality, and provide clear accountability for outputs.</p>
<h2>A practical law-firm adoption framework</h2>
<p>Start with one workflow where both volume and repeatability are high. Strong candidates include internal knowledge retrieval, intake triage, first-pass drafting support, and templated client communications. Scope the pilot narrowly and define what success looks like before launch.</p>
<p>Next, build a grounded knowledge layer. This is where legal RAG becomes critical: approved policies, precedent references, playbooks, and templates should be indexed and retrievable with citation context. The assistant should prioritize internal, verified content over generic responses.</p>
<p>Then, enforce review gates. AI outputs should be treated as drafts that require human validation. Establish who reviews what, which types of content require attorney sign-off, and what quality checklist is used before any external communication is sent.</p>
<p>Finally, measure outcomes. Track turnaround time, revision rates, internal adoption, and error patterns. Use those signals to refine prompts, strengthen retrieval sources, and identify where additional training or process changes are needed.</p>
<h2>Where enterprise readiness matters</h2>
<p>Many firms underestimate integration overhead. The model itself is only one component. Enterprise readiness requires access controls, auditability, data lifecycle policies, and role-based boundaries so teams see only the information appropriate to their responsibilities.</p>
<p>Operational reliability also matters. Teams need predictable output formats, fallback behavior during outages, and clear escalation paths when responses are uncertain. A dependable system should make uncertainty explicit instead of presenting weak output with false confidence.</p>
<p>For leadership teams, governance documentation is a strategic asset. Written standards for acceptable use, review obligations, and exception handling improve consistency and reduce implementation risk across practice areas.</p>
<h2>How legal RAG can create near-term value</h2>
<p>Legal RAG is often the fastest path to practical ROI because it improves response quality while reducing search overhead. Attorneys and staff can find relevant internal guidance faster, reducing duplicated effort and improving consistency across matter work.</p>
<p>A well-maintained retrieval layer also supports onboarding. New team members can access documented procedures and approved language more easily, shortening ramp time and reducing dependency on ad-hoc knowledge transfer.</p>
<p>To make this sustainable, assign ownership for content freshness. Stale templates and outdated policies degrade output quality quickly. Set recurring review cycles and define who can approve content changes for the retrieval corpus.</p>
<h2>Daily operational recommendations for law-firm leaders</h2>
<p>1) Focus on one KPI per pilot phase. Avoid trying to optimize everything at once. <br/>2) Keep prompts and policies versioned. Treat changes like controlled configuration updates. <br/>3) Require a final human reviewer for client-facing content. <br/>4) Capture edge cases and convert them into process improvements. <br/>5) Build a monthly governance review with legal, operations, and IT stakeholders.</p>
<p>These habits convert AI usage from informal experimentation into a repeatable operational capability. Over time, firms can expand from one pilot workflow to a broader automation roadmap with lower risk.</p>
<h2>FAQ</h2>
<p><strong>What should law firms automate first?</strong> Start with internal knowledge retrieval and draft-generation tasks that already follow existing templates and review processes.</p>
<p><strong>Can AI outputs be used without review?</strong> No. Treat outputs as draft material and require human oversight before final use, especially for client-facing work.</p>
<p><strong>How do we reduce hallucination risk?</strong> Ground responses in approved internal sources, require citations where practical, and add workflow checks for uncertain responses.</p>
<p><strong>How long should a pilot run?</strong> A focused 4-8 week pilot is usually enough to evaluate adoption, quality, and process impact before broader rollout.</p>`;
      const article = await llm(articlePrompt) || fallbackArticle;

      const words = wordCountFromHtml(article);
      if (words < 1200) throw new Error("Generated article too short");

      const unsplashKey = Deno.env.get("UNSPLASH_ACCESS_KEY");
      let imageOptions = [
        { url: null, alt: "Law firm team reviewing AI workflow dashboards", filename: `law-firm-ai-workflow-${today}.jpg`, query: "law office technology ai" },
        { url: null, alt: "Attorney using AI-powered document search", filename: `legal-rag-document-search-${today}.jpg`, query: "legal technology document" },
      ];
      if (unsplashKey) {
        const q = encodeURIComponent("law firm artificial intelligence");
        const r = await fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=3`, { headers: { Authorization: `Client-ID ${unsplashKey}` } });
        if (r.ok) {
          const j = await r.json();
          imageOptions = (j.results || []).slice(0, 3).map((img: any, idx: number) => ({
            url: img.urls?.regular || null,
            alt: img.alt_description || `AI in law firm operations image ${idx + 1}`,
            filename: `law-firm-ai-${idx + 1}-${today}.jpg`,
            query: "law firm artificial intelligence",
          }));
        }
      }

      const newsletterRaw = await llm(`${PROMPTS.newsletter}\n\nArticle title: ${suggestedTitle}\nReturn JSON keys: subject_options,preview_text,body_html`);
      const newsletterFallback = {
        subject_options: [`${suggestedTitle} - Daily legal AI briefing`, "What this AI shift means for your firm", "Law firm AI update: today’s key move"],
        preview_text: "A quick breakdown of today’s AI development and what law firm leaders should do next.",
        body_html: `<p>Hi there,</p><p>We drafted a new article: <strong>${suggestedTitle}</strong>.</p><p>Review it in the admin panel before publishing.</p>`,
      };
      const newsletter = newsletterRaw ? safeJson(extractJsonObject(newsletterRaw), newsletterFallback) : newsletterFallback;

      if (!Array.isArray(newsletter.subject_options) || !newsletter.subject_options.length || !newsletter.preview_text || !newsletter.body_html) {
        throw new Error("Newsletter output missing required fields");
      }

      const { data: post, error: postErr } = await supabase.from("blog_posts").insert({
        slug: finalSlug,
        title: suggestedTitle,
        excerpt: seo.meta_description,
        content: article,
        date: today,
        category: mode === "roundup" ? "Daily Roundup" : "AI Strategy",
        author: "agent13 ai Team",
        published: false,
        tags: ["AI", "Law Firms", "Automation"],
        seo_title: seo.seo_title,
        meta_description: seo.meta_description,
        primary_keyword: seo.primary_keyword,
        secondary_keywords: seo.secondary_keywords,
        faq_json: seo.faq_json,
        schema_json: seo.schema_json,
        internal_link_suggestions: seo.internal_links,
        source_links_json: deduped.slice(0, 5),
        image_options_json: imageOptions,
        image_url: imageOptions[0]?.url || null,
        post_type: mode,
        status: "pending_review",
        created_by_system: true,
        newsletter_status: "newsletter_draft_ready",
        newsletter_subject_options: newsletter.subject_options,
        newsletter_preview_text: newsletter.preview_text,
        newsletter_body: newsletter.body_html,
        generation_run_id: run.id,
      }).select().single();
      if (postErr) throw postErr;

      await supabase.from("content_generation_runs").update({
        completed_at: new Date().toISOString(),
        status: "completed",
        selected_topic: selected.title,
        selected_keyword: seo.primary_keyword,
        source_count: deduped.length,
        output_post_id: post.id,
        newsletter_generated: true,
        logs_json: logs,
      }).eq("id", run.id);

      return new Response(JSON.stringify({ success: true, runId: run.id, postId: post.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : typeof err === "object" ? JSON.stringify(err) : String(err);
      log(`FATAL: ${errMsg}`);
      await supabase.from("content_generation_runs").update({
        completed_at: new Date().toISOString(),
        status: "failed",
        error_message: errMsg,
        logs_json: logs,
      }).eq("id", run.id);
      throw err;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : typeof error === "object" ? JSON.stringify(error) : String(error);
    console.error("content-automation-run error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
