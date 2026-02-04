import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

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
  date: z.string().optional(), // ISO date string
  image_url: z.string().url("Must be a valid URL").optional().nullable(),
});

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  console.log("Zapier blog webhook received request");

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
    // Optional: Verify webhook secret for security
    const webhookSecret = Deno.env.get("ZAPIER_WEBHOOK_SECRET");
    if (webhookSecret) {
      const providedSecret = req.headers.get("x-webhook-secret");
      if (providedSecret !== webhookSecret) {
        console.error("Invalid webhook secret");
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    const body = await req.json();
    console.log("Received blog post data:", JSON.stringify(body, null, 2));

    // Validate the incoming data
    const validatedData = blogPostSchema.parse(body);
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
