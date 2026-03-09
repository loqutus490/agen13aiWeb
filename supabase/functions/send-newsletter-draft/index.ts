import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sendSchema = z.object({
  postId: z.string().uuid(),
  toEmail: z.string().email().optional(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const SENDGRID_FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@agent13.ai";
const SENDGRID_FROM_NAME = Deno.env.get("SENDGRID_FROM_NAME") || "agent13 ai";
const SENDGRID_NEWSLETTER_TO = Deno.env.get("SENDGRID_NEWSLETTER_TO");

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_FROM_EMAIL, name: SENDGRID_FROM_NAME },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`SendGrid error ${res.status}: ${errorBody}`);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = sendSchema.parse(await req.json());
    const toEmail = payload.toEmail || SENDGRID_NEWSLETTER_TO;

    if (!toEmail) {
      return new Response(JSON.stringify({ success: false, error: "No target recipient configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: post, error: postErr } = await supabase
      .from("blog_posts")
      .select("id,title,slug,newsletter_status,newsletter_subject_options,newsletter_body,newsletter_preview_text,status")
      .eq("id", payload.postId)
      .single();

    if (postErr || !post) {
      throw new Error(postErr?.message || "Post not found");
    }

    if (post.newsletter_status !== "newsletter_approved") {
      return new Response(JSON.stringify({ success: false, error: "Newsletter must be approved before sending" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = post.newsletter_subject_options?.[0] || `${post.title} | agent13 ai`;
    const body = post.newsletter_body || `<p>New article draft: <a href="https://www.agent13.ai/blog/${post.slug}">${post.title}</a></p>`;

    await sendEmail(toEmail, subject, body);

    const { error: updateErr } = await supabase
      .from("blog_posts")
      .update({ newsletter_status: "newsletter_sent" })
      .eq("id", post.id);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true, postId: post.id, sentTo: toEmail }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-newsletter-draft error:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message || "Failed to send newsletter" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
