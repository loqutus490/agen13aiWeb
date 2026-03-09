import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-agent13-internal-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // --- Auth ---
  const internalKey = req.headers.get("x-agent13-internal-key");
  const expected = Deno.env.get("AGENT13_INTERNAL_API_KEY");
  if (!expected || !internalKey || internalKey !== expected) {
    return json({ error: "Unauthorized: invalid or missing x-agent13-internal-key header" }, 401);
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // --- Validate required fields ---
  const requiredFields = ["title", "slug", "excerpt", "content_html"];
  const missing = requiredFields.filter((f) => !body[f] || typeof body[f] !== "string" || !(body[f] as string).trim());
  if (missing.length) {
    return json({ error: `Missing required fields: ${missing.join(", ")}` }, 400);
  }

  // --- Sanitize slug ---
  const slug = (body.slug as string)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    return json({ error: "Invalid slug after sanitization" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // --- Check duplicate slug ---
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return json({ error: "Duplicate slug already exists", existingPostId: existing.id }, 409);
  }

  // --- Safe JSON parsing helper ---
  const safeJsonField = (val: unknown, fallback: unknown = null) => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "object") return val;
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return fallback; }
    }
    return fallback;
  };

  const safeArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.filter((v) => typeof v === "string");
    return [];
  };

  // --- Build insert record ---
  const record: Record<string, unknown> = {
    title: (body.title as string).trim(),
    slug,
    excerpt: (body.excerpt as string).trim(),
    content: (body.content_html as string).trim(),
    date: typeof body.date === "string" && body.date.match(/^\d{4}-\d{2}-\d{2}$/) ? body.date : new Date().toISOString().slice(0, 10),
    category: typeof body.category === "string" ? body.category.trim() : "AI Strategy",
    author: typeof body.author === "string" ? body.author.trim() : "agent13 ai Team",
    published: false,
    tags: safeArray(body.tags),
    image_url: typeof body.featured_image_url === "string" ? body.featured_image_url : (typeof body.image_url === "string" ? body.image_url : null),
    seo_title: typeof body.seo_title === "string" ? body.seo_title.trim() : null,
    meta_description: typeof body.meta_description === "string" ? body.meta_description.trim().slice(0, 160) : null,
    primary_keyword: typeof body.primary_keyword === "string" ? body.primary_keyword.trim() : null,
    secondary_keywords: safeArray(body.secondary_keywords),
    faq_json: safeJsonField(body.faq_json, []),
    schema_json: safeJsonField(body.schema_json, {}),
    internal_link_suggestions: safeArray(body.internal_link_suggestions),
    source_links_json: safeJsonField(body.source_links_json, []),
    image_options_json: safeJsonField(body.image_options_json, []),
    post_type: typeof body.post_type === "string" ? body.post_type.trim() : "deep-dive",
    status: "pending_review",
    created_by_system: true,
    review_notes: typeof body.review_notes === "string" ? body.review_notes.trim() : null,
    newsletter_status: "draft",
    newsletter_subject_options: safeArray(body.newsletter_subject_options),
    newsletter_preview_text: typeof body.newsletter_preview_text === "string" ? body.newsletter_preview_text.trim() : null,
    newsletter_body: typeof body.newsletter_body === "string" ? body.newsletter_body.trim() : null,
    generation_run_id: typeof body.generation_run_id === "string" ? body.generation_run_id.trim() : null,
  };

  // --- Insert ---
  try {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert(record)
      .select("id, status")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return json({ error: "Database insert failed", details: error.message }, 500);
    }

    return json({ success: true, postId: post.id, status: post.status }, 201);
  } catch (err) {
    console.error("Unexpected error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
