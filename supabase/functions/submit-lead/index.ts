import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(100, "First name too long"),
  lastName: z.string().trim().min(1, "Last name required").max(100, "Last name too long"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  phoneNumber: z.string().trim().min(10, "Phone number too short").max(20, "Phone number too long")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  downloadedResource: z.string().trim().min(1, "Resource required").max(200, "Resource name too long"),
  sendDownloadConfirmation: z.boolean().optional(),
});

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

async function sendEmail(to: string, from: { email: string; name: string }, subject: string, htmlContent: string, replyTo?: string) {
  const payload: any = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from.email, name: from.name },
    subject,
    content: [{ type: "text/html", value: htmlContent }],
  };
  if (replyTo) {
    payload.reply_to = { email: replyTo };
  }

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`SendGrid error ${res.status}: ${errorBody}`);
  }
}

const handler = async (req: Request): Promise<Response> => {
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";
  
  console.log(`Submit lead function invoked from IP: ${clientIP}`);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting: 5 lead submissions per hour per IP
    const { data: rateLimit, error: rateLimitError } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("ip_address", `lead_${clientIP}`)
      .maybeSingle();

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    if (rateLimit) {
      const windowStart = new Date(rateLimit.window_start);
      if (windowStart > oneHourAgo) {
        if (rateLimit.request_count >= 5) {
          console.warn(`RATE LIMIT: IP ${clientIP} exceeded lead submission limit (${rateLimit.request_count}/5)`);
          return new Response(
            JSON.stringify({ success: false, error: "Too many submissions. Please try again later." }),
            { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "3600", ...corsHeaders } }
          );
        }
        await supabase.from("rate_limits").update({ request_count: rateLimit.request_count + 1, updated_at: now.toISOString() }).eq("ip_address", `lead_${clientIP}`);
      } else {
        await supabase.from("rate_limits").update({ request_count: 1, window_start: now.toISOString(), updated_at: now.toISOString() }).eq("ip_address", `lead_${clientIP}`);
      }
    } else {
      await supabase.from("rate_limits").insert({ ip_address: `lead_${clientIP}`, request_count: 1, window_start: now.toISOString(), updated_at: now.toISOString() });
    }

    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    // Insert lead into database
    const { error: insertError } = await supabase.from("download_leads").insert({
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      phone_number: validatedData.phoneNumber,
      downloaded_resource: validatedData.downloadedResource,
    });

    if (insertError) {
      console.error("Lead insert error:", insertError);
      throw new Error("Failed to save lead");
    }

    console.log(`Lead submitted successfully for ${validatedData.email}`);

    const sendDownloadConfirmation = validatedData.sendDownloadConfirmation === true && !isChatbotLead;

    // Send welcome/confirmation email to the lead
    try {
      const emailSubject = isChatbotLead 
        ? "Thanks for Connecting with agent13 ai!" 
        : sendDownloadConfirmation
          ? `Your ${escapeHtml(validatedData.downloadedResource)} is Ready!`
          : `Your ${escapeHtml(validatedData.downloadedResource)} from agent13 ai`;

      const emailBody = sendDownloadConfirmation
        ? `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;background-color:#f4f4f4;margin:0;padding:0}.container{max-width:600px;margin:40px auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:40px 30px;text-align:center}.header h1{margin:0;font-size:28px;font-weight:600}.content{padding:40px 30px}.content h2{color:#667eea;margin-top:0;font-size:22px}.content p{margin:16px 0;color:#555}.resource-box{background:#f8f9fa;border-left:4px solid #667eea;padding:20px;margin:24px 0;border-radius:4px}.resource-box strong{color:#667eea;font-size:18px}.cta-button{display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:600;margin:20px 0}.footer{background:#f8f9fa;padding:30px;text-align:center;color:#777;font-size:14px;border-top:1px solid #eee}.footer a{color:#667eea;text-decoration:none}</style></head>
          <body><div class="container"><div class="header"><h1>Thank You, ${escapeHtml(validatedData.firstName)}! 🎉</h1></div>
          <div class="content"><h2>Your Download is Complete</h2>
          <p>Hi ${escapeHtml(validatedData.firstName)} ${escapeHtml(validatedData.lastName)},</p>
          <p>Thank you for downloading our resource!</p>
          <div class="resource-box"><strong>${escapeHtml(validatedData.downloadedResource)}</strong></div>
          <p>This resource provides practical insights and actionable steps to implement AI solutions in your business.</p>
          <p style="text-align:center"><a href="https://agent13ai.com/contact" class="cta-button">Get in Touch</a></p>
          <p>Best regards,<br><strong>The Agent13 AI Team</strong></p></div>
          <div class="footer"><p><a href="https://agent13ai.com">Website</a> • <a href="https://agent13ai.com/resources">Resources</a> • <a href="https://agent13ai.com/contact">Contact</a></p></div>
          </div></body></html>`
        : `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="text-align:center;margin-bottom:30px;"><h1 style="color:#0BA5EC;margin:0;font-size:28px;">agent13 ai</h1><p style="color:#666;margin:5px 0 0;">AI Solutions for Growing Businesses</p></div>
            <h2 style="color:#333;margin-bottom:20px;">Hi ${escapeHtml(validatedData.firstName)}! 👋</h2>
            ${isChatbotLead ? `<p style="color:#444;font-size:16px;line-height:1.6;">Thank you for expressing interest in our AI services!</p><p style="color:#444;font-size:16px;line-height:1.6;">One of our AI specialists will reach out shortly.</p><ul style="color:#444;font-size:16px;line-height:1.8;"><li><strong>Discovery Call:</strong> We'll learn about your challenges</li><li><strong>AI Strategy Overview:</strong> Proven solutions to streamline operations</li><li><strong>Clear Roadmap:</strong> A practical plan for AI implementation</li></ul>` : `<p style="color:#444;font-size:16px;line-height:1.6;">Thank you for downloading <strong>${escapeHtml(validatedData.downloadedResource)}</strong>! We hope you find it valuable.</p><p style="color:#444;font-size:16px;line-height:1.6;">Our team is here to help if you have any questions.</p>`}
            <div style="background:linear-gradient(135deg,#0BA5EC 0%,#0077B6 100%);border-radius:12px;padding:25px;margin:30px 0;text-align:center;"><p style="color:white;font-size:18px;margin:0 0 15px;font-weight:600;">Ready to Transform Your Business with AI?</p><a href="https://here-what-now.lovable.app/contact" style="display:inline-block;background:white;color:#0BA5EC;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Schedule a Free Consultation</a></div>
            <p style="color:#444;font-size:16px;line-height:1.6;">Have questions? Simply reply to this email!</p>
            <p style="color:#444;font-size:16px;line-height:1.6;">Best regards,<br><strong>The agent13 ai Team</strong></p>
            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;"><p style="color:#999;font-size:12px;text-align:center;">© ${new Date().getFullYear()} agent13 ai. All rights reserved.<br><a href="https://here-what-now.lovable.app/privacy-policy" style="color:#999;">Privacy Policy</a> | <a href="https://here-what-now.lovable.app/terms-of-service" style="color:#999;">Terms of Service</a></p>
          </div>`;

      await sendEmail(validatedData.email, { email: "roybernales@agent13.ai", name: "agent13 ai" }, emailSubject, emailBody, "roybernales@agent13.ai");
      console.log(`Welcome email sent successfully to ${validatedData.email}`);
    } catch (emailError: any) {
      console.error("Failed to send welcome email:", emailError.message);
    }

    // Send notification to business
    try {
      await sendEmail(
        "roybernales@agent13.ai",
        { email: "roybernales@agent13.ai", name: "agent13 ai Leads" },
        `🎯 New Lead: ${escapeHtml(validatedData.firstName)} ${escapeHtml(validatedData.lastName)}`,
        `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0BA5EC; margin-bottom: 20px;">New Lead Captured! 🎉</h2>
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px; color: #333;">Contact Information</h3>
              <p style="margin: 8px 0; color: #444;"><strong>Name:</strong> ${escapeHtml(validatedData.firstName)} ${escapeHtml(validatedData.lastName)}</p>
              <p style="margin: 8px 0; color: #444;"><strong>Email:</strong> <a href="mailto:${escapeHtml(validatedData.email)}">${escapeHtml(validatedData.email)}</a></p>
              <p style="margin: 8px 0; color: #444;"><strong>Phone:</strong> <a href="tel:${escapeHtml(validatedData.phoneNumber)}">${escapeHtml(validatedData.phoneNumber)}</a></p>
              <p style="margin: 8px 0; color: #444;"><strong>Source:</strong> ${escapeHtml(validatedData.downloadedResource)}</p>
              <p style="margin: 8px 0; color: #666;"><strong>Captured:</strong> ${now.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Reply directly to this email to reach ${escapeHtml(validatedData.firstName)} at ${escapeHtml(validatedData.email)}.
            </p>
          </div>
        `,
        validatedData.email
      );
      console.log(`Business notification sent for lead: ${validatedData.email}`);
    } catch (notifyError: any) {
      console.error("Failed to send business notification:", notifyError.message);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in submit-lead function:", error.message);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input data", details: error.errors.map(e => e.message) }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: "Failed to submit lead" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
