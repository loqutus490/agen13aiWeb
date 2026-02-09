import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// SECURITY: Webhook secret is MANDATORY for this endpoint
const webhookSecret = Deno.env.get("ZAPIER_WEBHOOK_SECRET");
if (!webhookSecret) {
  console.error("CRITICAL: ZAPIER_WEBHOOK_SECRET is not configured. This endpoint will reject all requests.");
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Allowed origins for CORS
const allowedOrigins = [
  "https://here-what-now.lovable.app",
  "https://id-preview--2f888fe4-d5d8-4e61-9d34-5bc252b0ec1f.lovable.app",
  "https://hooks.zapier.com",
];

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
    "Access-Control-Allow-Credentials": "true",
  };
};

// ============================================================
// ZAPIER FIELD MAPPING GUIDE
// ============================================================
// Configure your Zapier "Webhooks by Zapier" action with these fields:
//
// REQUIRED FIELDS (webhook will fail without these):
//   title        → Blog post title (e.g. "AI Trends in 2026")
//   slug         → URL-friendly identifier, lowercase + hyphens only (e.g. "ai-trends-2026")
//   content      → Full blog post body as HTML (e.g. "<p>Your article...</p>")
//                   Alt field names accepted: "body", "html_content", "text"
//                   Falls back to "excerpt" if all are empty
//   excerpt      → Short summary/description (max 500 chars)
//   category     → Post category (e.g. "AI Tools", "Automation")
//
// OPTIONAL FIELDS:
//   author       → Author name (e.g. "agent13 ai Team")
//   tags         → Comma-separated string OR JSON array (e.g. "AI, Automation, Tools")
//   published    → "true" or "false" string, or boolean (default: false)
//   date         → ISO date string (e.g. "2026-02-09"), defaults to today
//   image_url    → Full URL to featured image (must start with http:// or https://)
//                   NOTE: This must be an actual image URL, NOT an image prompt/description
//
// AUTHENTICATION:
//   Header: x-webhook-secret → Your ZAPIER_WEBHOOK_SECRET value
//
// EXAMPLE PAYLOAD:
// {
//   "title": "AI Trends for Small Business in 2026",
//   "slug": "ai-trends-small-business-2026",
//   "content": "<h2>Introduction</h2><p>AI is transforming...</p>",
//   "excerpt": "Discover the top AI trends reshaping small business in 2026",
//   "category": "AI Tools",
//   "author": "agent13 ai Team",
//   "tags": "AI, Small Business, Trends",
//   "published": "true",
//   "image_url": "https://example.com/images/ai-trends.jpg"
// }
// ============================================================

// Schema for incoming blog post data from Zapier
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt too long"),
  category: z.string().min(1, "Category is required").max(100, "Category too long"),
  author: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  date: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().nullable(),
});

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  
  console.log(`Zapier blog webhook received ${req.method} request from IP: ${clientIP}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    // SECURITY: Webhook secret is MANDATORY - reject all requests if not configured
    if (!webhookSecret) {
      console.error(`SECURITY: Rejected request from ${clientIP} - ZAPIER_WEBHOOK_SECRET not configured`);
      return new Response(
        JSON.stringify({ success: false, error: "Service temporarily unavailable" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate webhook secret from request header
    const providedSecret = req.headers.get("x-webhook-secret");
    if (!providedSecret) {
      console.error(`SECURITY: Rejected request from ${clientIP} - Missing x-webhook-secret header`);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - Missing authentication" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Use timing-safe comparison to prevent timing attacks
    const encoder = new TextEncoder();
    const providedBytes = encoder.encode(providedSecret);
    const expectedBytes = encoder.encode(webhookSecret);
    
    // Constant-time comparison: always compare same length and iterate all bytes
    const maxLen = Math.max(providedBytes.length, expectedBytes.length);
    let mismatch = providedBytes.length !== expectedBytes.length ? 1 : 0;
    
    for (let i = 0; i < maxLen; i++) {
      const a = providedBytes[i] ?? 0;
      const b = expectedBytes[i] ?? 0;
      mismatch |= a ^ b;
    }
    
    if (mismatch !== 0) {
      console.error(`SECURITY: Rejected request from ${clientIP} - Invalid webhook secret`);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - Invalid authentication" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`SECURITY: Authenticated request from ${clientIP}`);

    const rawBody = await req.json();
    console.log("Raw body keys:", Object.keys(rawBody));
    console.log("Raw body:", JSON.stringify(rawBody).substring(0, 500));

    // Zapier may nest data or send flat - try to extract the actual data
    const body = rawBody.data || rawBody;

    // Preprocess Zapier-specific formatting issues
    const preprocessed = {
      ...body,
      // Tags: Zapier sends comma-separated string, convert to array
      tags: Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string" && body.tags.trim()
          ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
      // Published: Zapier sends "true"/"false" strings
      published: typeof body.published === "string"
        ? body.published.toLowerCase() === "true"
        : Boolean(body.published ?? false),
      // Image URL: must be a valid URL, ignore prompt text or empty strings
      image_url: (() => {
        const url = (body.image_url || "").trim();
        return url && (url.startsWith("http://") || url.startsWith("https://")) ? url : null;
      })(),
      // Content: try multiple field names, fall back to excerpt
      content: body.content || body.body || body.html_content || body.text || body.excerpt || "",
    };

    console.log("Preprocessed data for slug:", preprocessed.slug || "unknown");

    // Validate the incoming data
    const validatedData = blogPostSchema.parse(preprocessed);
    console.log("Validated data:", validatedData);

    // Check if slug already exists
    const { data: existingPost, error: checkError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", validatedData.slug)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing post:", checkError);
      throw checkError;
    }

    if (existingPost) {
      // Update existing post
      const { data: updatedPost, error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title: validatedData.title,
          content: validatedData.content,
          excerpt: validatedData.excerpt,
          category: validatedData.category,
          author: validatedData.author || null,
          tags: validatedData.tags,
          published: validatedData.published,
          date: validatedData.date || new Date().toISOString().split("T")[0],
          updated_at: new Date().toISOString(),
          image_url: validatedData.image_url || null,
        })
        .eq("slug", validatedData.slug)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating blog post:", updateError);
        throw updateError;
      }

      console.log("Blog post updated successfully:", updatedPost.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Blog post updated successfully",
          post: {
            id: updatedPost.id,
            slug: updatedPost.slug,
            title: updatedPost.title,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Insert new blog post
    const { data: newPost, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        category: validatedData.category,
        author: validatedData.author || null,
        tags: validatedData.tags,
        published: validatedData.published,
        date: validatedData.date || new Date().toISOString().split("T")[0],
        image_url: validatedData.image_url || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting blog post:", insertError);
      throw insertError;
    }

    console.log("Blog post created successfully:", newPost.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog post created successfully",
        post: {
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in zapier-blog-webhook:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Validation failed",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to save blog post",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
      }
    );
  }
};

serve(handler);
