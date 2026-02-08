import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input validation schema
const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(100, "First name too long"),
  lastName: z.string().trim().min(1, "Last name required").max(100, "Last name too long"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  phoneNumber: z.string().trim().min(10, "Phone number too short").max(20, "Phone number too long")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  downloadedResource: z.string().trim().min(1, "Resource required").max(200, "Resource name too long"),
});

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const handler = async (req: Request): Promise<Response> => {
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";
  
  console.log(`Submit lead function invoked from IP: ${clientIP}`);

  // Handle CORS preflight requests
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
      
      // If within the same hour window
      if (windowStart > oneHourAgo) {
        if (rateLimit.request_count >= 5) {
          console.warn(`RATE LIMIT: IP ${clientIP} exceeded lead submission limit (${rateLimit.request_count}/5)`);
          return new Response(
            JSON.stringify({ 
              success: false,
              error: "Too many submissions. Please try again later." 
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": "3600",
                ...corsHeaders,
              },
            }
          );
        }
        
        // Increment count
        await supabase
          .from("rate_limits")
          .update({ 
            request_count: rateLimit.request_count + 1,
            updated_at: now.toISOString()
          })
          .eq("ip_address", `lead_${clientIP}`);
      } else {
        // Reset window
        await supabase
          .from("rate_limits")
          .update({ 
            request_count: 1,
            window_start: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq("ip_address", `lead_${clientIP}`);
      }
    } else {
      // First request from this IP
      await supabase
        .from("rate_limits")
        .insert({ 
          ip_address: `lead_${clientIP}`,
          request_count: 1,
          window_start: now.toISOString(),
          updated_at: now.toISOString()
        });
    }

    const body = await req.json();
    
    // Validate input
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

    // Send welcome email to the lead
    try {
      const isChatbotLead = validatedData.downloadedResource.toLowerCase().includes("chatbot");
      
      const emailResponse = await resend.emails.send({
        from: "agent13 ai <roybernales@agent13.ai>",
        to: [validatedData.email],
        subject: isChatbotLead 
          ? "Thanks for Connecting with agent13 ai!" 
          : `Your ${escapeHtml(validatedData.downloadedResource)} from agent13 ai`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0BA5EC; margin: 0; font-size: 28px;">agent13 ai</h1>
              <p style="color: #666; margin: 5px 0 0;">AI Solutions for Growing Businesses</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${escapeHtml(validatedData.firstName)}! 👋</h2>
            
            ${isChatbotLead ? `
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Thank you for expressing interest in our AI services! We're excited to learn more about your business and explore how we can help you leverage AI for growth.
              </p>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                One of our AI specialists will reach out to you shortly to schedule a free consultation. In the meantime, here's what you can expect:
              </p>
              
              <ul style="color: #444; font-size: 16px; line-height: 1.8;">
                <li><strong>Discovery Call:</strong> We'll learn about your business challenges and goals</li>
                <li><strong>Custom Recommendations:</strong> Tailored AI solutions based on your needs</li>
                <li><strong>Clear Roadmap:</strong> A practical plan to implement AI in your operations</li>
              </ul>
            ` : `
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Thank you for downloading <strong>${escapeHtml(validatedData.downloadedResource)}</strong>! We hope you find it valuable as you explore how AI can transform your business.
              </p>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Our team is here to help if you have any questions or would like to discuss how we can support your AI journey.
              </p>
            `}
            
            <div style="background: linear-gradient(135deg, #0BA5EC 0%, #0077B6 100%); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
              <p style="color: white; font-size: 18px; margin: 0 0 15px; font-weight: 600;">Ready to Transform Your Business with AI?</p>
              <a href="https://here-what-now.lovable.app/contact" style="display: inline-block; background: white; color: #0BA5EC; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Schedule a Free Consultation</a>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Have questions? Simply reply to this email – we'd love to hear from you!
            </p>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>The agent13 ai Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} agent13 ai. All rights reserved.<br>
              <a href="https://here-what-now.lovable.app/privacy-policy" style="color: #999;">Privacy Policy</a> | 
              <a href="https://here-what-now.lovable.app/terms-of-service" style="color: #999;">Terms of Service</a>
            </p>
          </div>
        `,
        replyTo: "RoyBernales@agent13.ai",
      });

      console.log(`Welcome email sent successfully to ${validatedData.email}`);
    } catch (emailError: any) {
      // Log but don't fail the lead submission if email fails
      console.error("Failed to send welcome email:", emailError.message);
    }

    // Send notification to business
    try {
      await resend.emails.send({
        from: "agent13 ai Leads <roybernales@agent13.ai>",
        to: ["roybernales@agent13.ai"],
        subject: `🎯 New Lead: ${escapeHtml(validatedData.firstName)} ${escapeHtml(validatedData.lastName)}`,
        html: `
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
        replyTo: validatedData.email,
      });

      console.log(`Business notification sent for lead: ${validatedData.email}`);
    } catch (notifyError: any) {
      console.error("Failed to send business notification:", notifyError.message);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-lead function:", error.message);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid input data",
          details: error.errors.map(e => e.message)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to submit lead" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
