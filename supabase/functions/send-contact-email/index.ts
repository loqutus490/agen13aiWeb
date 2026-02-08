import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(100, "Name too long"),
  email: z.string().email("Invalid email").max(255, "Email too long"),
  company: z.string().trim().min(2, "Company name too short").max(100, "Company name too long"),
  message: z.string().trim().min(10, "Message too short").max(2000, "Message too long"),
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
  // Handle CORS preflight requests

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
               req.headers.get("x-real-ip") || 
               "unknown";

    // Check rate limit
    const { data: rateLimit, error: rateLimitError } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("ip_address", ip)
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
          return new Response(
            JSON.stringify({ 
              success: false,
              error: "Too many requests. Please try again later." 
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
          .eq("ip_address", ip);
      } else {
        // Reset window
        await supabase
          .from("rate_limits")
          .update({ 
            request_count: 1,
            window_start: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq("ip_address", ip);
      }
    } else {
      // First request from this IP
      await supabase
        .from("rate_limits")
        .insert({ 
          ip_address: ip,
          request_count: 1,
          window_start: now.toISOString(),
          updated_at: now.toISOString()
        });
    }

    const body = await req.json();
    const validatedData = contactSchema.parse(body);
    const { name, email, company, message } = validatedData;

    console.log("Processing contact form submission");

    // Send email to the business (you)
    const businessEmail = await resend.emails.send({
      from: "agent13 ai Contact Form <roybernales@agent13.ai>",
      to: ["agent13leads@theimoroip.resend.app"],
      subject: `New Contact Form Submission from ${escapeHtml(name)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Reply to: ${escapeHtml(email)}</small></p>
      `,
      replyTo: email,
    });

    console.log("Business notification email sent successfully");

    // Send confirmation email to the user
    const confirmationEmail = await resend.emails.send({
      from: "agent13 ai <roybernales@agent13.ai>",
      to: [email],
      subject: "We received your message!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0BA5EC;">Thank you for contacting us, ${escapeHtml(name)}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Message:</h3>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          
          <p>If you have any urgent questions, feel free to reply to this email.</p>
          
          <p style="color: #666;">Best regards,<br>The agent13 ai Team</p>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully" 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function");
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid input data" 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to send email. Please try again." 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
