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

  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ error: "Missing or invalid 'date' query parameter. Expected YYYY-MM-DD." }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, status, title, created_by_system")
    .eq("date", date)
    .eq("created_by_system", true)
    .limit(5);

  if (error) {
    return json({ error: "Database query failed", details: error.message }, 500);
  }

  if (!posts || posts.length === 0) {
    return json({ success: true, date, exists: false });
  }

  return json({
    success: true,
    date,
    exists: true,
    count: posts.length,
    posts: posts.map((p: any) => ({
      postId: p.id,
      status: p.status,
      title: p.title,
    })),
  });
});
