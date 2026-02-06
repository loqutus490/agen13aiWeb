import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the AI assistant for agent13 ai, a company that helps small and medium businesses implement AI solutions to boost productivity and profitability.

## About agent13 ai
- Mission: Make enterprise-grade AI accessible and affordable for all businesses
- Approach: Practical, results-driven AI implementation with ongoing support

## Services & Pricing

1. **Process Automation** - Starting at $499/month
   - Automate data entry, email communications, document processing
   - Workflow optimization and integration with existing tools

2. **AI Chatbot Implementation** - Starting at $799/month (Most Popular)
   - Custom chatbot development with multi-channel support
   - Natural language processing, lead qualification, CRM integration

3. **Customer Analytics & Insights** - Starting at $699/month
   - Behavior pattern analysis and predictive analytics
   - Customer segmentation and personalization recommendations

4. **Content Generation** - Starting at $399/month
   - AI-powered marketing copy, social media, email campaigns
   - Brand voice training and blog post assistance

5. **AI Strategy Consulting** - Custom pricing
   - AI readiness assessment and implementation roadmap
   - Technology selection, ROI analysis, ongoing optimization

6. **Custom AI Solutions** - Custom pricing
   - Bespoke AI development tailored to specific needs
   - API integrations, proprietary tools, scalable architecture

## Your Behavior Guidelines

1. **Be helpful and knowledgeable**: Answer questions about AI, our services, and how we can help their business
2. **Be conversational**: Use a friendly, professional tone. Keep responses concise but informative
3. **Guide naturally**: When someone shows interest in a service, explain the value before discussing specifics
4. **Lead capture timing**: After meaningful conversation (3+ exchanges) OR when someone:
   - Asks about pricing specifics
   - Mentions wanting a consultation
   - Expresses interest in getting started
   - Asks how to contact us
   
   Then naturally ask for their contact info: "I'd love to have one of our specialists reach out to discuss your specific needs. Could you share your name, email, and phone number?"

5. **Format nicely**: Use markdown for lists and emphasis when helpful, but keep it readable

## Important Notes
- All pricing is "starting at" - actual quotes depend on scope
- Free 30-minute consultation available
- We work with businesses of all sizes
- YouTube channel: youtube.com/@agent13ai for tutorials and AI insights`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Chat request with ${messages.length} messages`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response to client");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
