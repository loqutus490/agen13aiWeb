import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const allowedOrigins = [
  "https://here-what-now.lovable.app",
  "https://id-preview--2f888fe4-d5d8-4e61-9d34-5bc252b0ec1f.lovable.app",
];

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

const confirmationSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(100, "First name too long"),
  lastName: z.string().trim().min(1, "Last name required").max(100, "Last name too long"),
  email: z.string().email("Invalid email").max(255, "Email too long"),
  resourceTitle: z.string().trim().min(1, "Resource title required").max(200, "Resource title too long"),
});

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

async function sendEmail(to: string, from: { email: string; name: string }, subject: string, htmlContent: string) {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from.email, name: from.name },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`SendGrid error ${res.status}: ${errorBody}`);
  }
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                   req.headers.get("x-real-ip") || 
                   "unknown";
  
  console.log(`Send download confirmation function invoked from IP: ${clientIP}`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting: 3 download requests per hour per IP
    const { data: rateLimit, error: rateLimitError } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("ip_address", clientIP)
      .maybeSingle();

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    if (rateLimit) {
      const windowStart = new Date(rateLimit.window_start);
      if (windowStart > oneHourAgo) {
        if (rateLimit.request_count >= 3) {
          console.warn(`RATE LIMIT: IP ${clientIP} exceeded download limit (${rateLimit.request_count}/3)`);
          return new Response(
            JSON.stringify({ success: false, error: "Too many download requests. Please try again later." }),
            { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "3600", ...corsHeaders } }
          );
        }
        await supabase.from("rate_limits").update({ request_count: rateLimit.request_count + 1, updated_at: now.toISOString() }).eq("ip_address", clientIP);
      } else {
        await supabase.from("rate_limits").update({ request_count: 1, window_start: now.toISOString(), updated_at: now.toISOString() }).eq("ip_address", clientIP);
      }
    } else {
      await supabase.from("rate_limits").insert({ ip_address: clientIP, request_count: 1, window_start: now.toISOString(), updated_at: now.toISOString() });
    }

    const body = await req.json();
    const validatedData = confirmationSchema.parse(body);
    const { firstName, lastName, email, resourceTitle } = validatedData;

    console.log(`Sending confirmation email to ${email} for resource download`);

    await sendEmail(
      email,
      { email: "roybernales@agent13.ai", name: "Agent13 AI" },
      `Your ${escapeHtml(resourceTitle)} is Ready!`,
      `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
              .content { padding: 40px 30px; }
              .content h2 { color: #667eea; margin-top: 0; font-size: 22px; }
              .content p { margin: 16px 0; color: #555; }
              .resource-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 4px; }
              .resource-box strong { color: #667eea; font-size: 18px; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #777; font-size: 14px; border-top: 1px solid #eee; }
              .footer a { color: #667eea; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You, ${escapeHtml(firstName)}! 🎉</h1>
              </div>
              <div class="content">
                <h2>Your Download is Complete</h2>
                <p>Hi ${escapeHtml(firstName)} ${escapeHtml(lastName)},</p>
                <p>Thank you for downloading our resource! We're excited to help you on your AI journey.</p>
                <div class="resource-box">
                  <strong>${escapeHtml(resourceTitle)}</strong>
                </div>
                <p>This resource is designed to provide you with practical insights and actionable steps to implement AI solutions in your business.</p>
                <p style="text-align: center;">
                  <a href="https://agent13ai.com/contact" class="cta-button">Get in Touch</a>
                </p>
                <p><strong>What's Next?</strong><br>
                  • Review the resource at your own pace<br>
                  • Identify opportunities for AI in your business<br>
                  • Schedule a consultation to discuss your specific needs<br>
                  • Explore more resources on our website
                </p>
                <p>Best regards,<br><strong>The Agent13 AI Team</strong></p>
              </div>
              <div class="footer">
                <p>
                  <a href="https://agent13ai.com">Visit Our Website</a> • 
                  <a href="https://agent13ai.com/resources">More Resources</a> • 
                  <a href="https://agent13ai.com/contact">Contact Us</a>
                </p>
                <p>Agent13 AI - Transforming Small Businesses with AI Solutions</p>
              </div>
            </div>
          </body>
        </html>
      `
    );

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-download-confirmation function:", error.message);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...getCorsHeaders(req) } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send confirmation email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...getCorsHeaders(req) } }
    );
  }
};

serve(handler);
