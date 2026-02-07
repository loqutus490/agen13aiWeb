import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

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
