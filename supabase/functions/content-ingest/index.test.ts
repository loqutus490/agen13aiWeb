import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// These are publishable values from the project .env
const SUPABASE_URL = "https://upmiqdnbvojpodgucxmw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbWlxZG5idm9qcG9kZ3VjeG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzQ2OTIsImV4cCI6MjA3ODExMDY5Mn0._m-iWpUm23Xo7abFx-UEhTLO3eAnMRKIQbd5QIlxUfg";
const INTERNAL_KEY = Deno.env.get("AGENT13_INTERNAL_API_KEY");

const BASE_URL = `${SUPABASE_URL}/functions/v1/content-ingest`;

Deno.test("rejects request without auth header", async () => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ title: "test" }),
  });
  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.error.includes("Unauthorized"), true);
});

Deno.test("rejects request with wrong auth key", async () => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      "x-agent13-internal-key": "wrong-key-value",
    },
    body: JSON.stringify({ title: "test" }),
  });
  assertEquals(res.status, 401);
  await res.text();
});

Deno.test("rejects missing required fields", async () => {
  if (!INTERNAL_KEY) {
    console.warn("Skipping: AGENT13_INTERNAL_API_KEY not set");
    return;
  }
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      "x-agent13-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify({ title: "test" }),
  });
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error.includes("Missing required fields"), true);
});

Deno.test("successfully ingests a test draft", async () => {
  if (!INTERNAL_KEY) {
    console.warn("Skipping: AGENT13_INTERNAL_API_KEY not set");
    return;
  }
  const uniqueSlug = `test-ingestion-${Date.now()}`;
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      "x-agent13-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify({
      title: "Test: Legal RAG for Law Firms",
      slug: uniqueSlug,
      excerpt: "A test draft from the automated test suite.",
      content_html: "<h1>Test Draft</h1><p>This is a test draft to verify the content ingestion pipeline.</p>",
      seo_title: "Legal RAG Test",
      meta_description: "Test meta description.",
      primary_keyword: "legal rag",
      secondary_keywords: ["ai automation"],
      faq_json: [{ question: "Is this a test?", answer: "Yes." }],
      post_type: "deep-dive",
      newsletter_subject_options: ["Test Subject"],
      newsletter_preview_text: "Test preview",
      newsletter_body: "<p>Test newsletter</p>",
      generation_run_id: "test-run-automated",
    }),
  });
  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.success, true);
  assertEquals(typeof body.postId, "string");
  assertEquals(body.status, "pending_review");
  console.log("Created test post:", body.postId);
});

Deno.test("rejects duplicate slug", async () => {
  if (!INTERNAL_KEY) {
    console.warn("Skipping: AGENT13_INTERNAL_API_KEY not set");
    return;
  }
  // Try inserting with a slug that's very likely to already exist from the previous test
  // We use a fixed slug for this test
  const fixedSlug = "duplicate-test-slug-fixed";
  
  // First insert
  const res1 = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      "x-agent13-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify({
      title: "Duplicate Test",
      slug: fixedSlug,
      excerpt: "Testing duplicate detection.",
      content_html: "<p>Dup test</p>",
    }),
  });
  const body1 = await res1.json();
  // May be 201 or 409 depending on prior runs
  
  // Second insert with same slug
  const res2 = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      "x-agent13-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify({
      title: "Duplicate Test 2",
      slug: fixedSlug,
      excerpt: "Should be rejected.",
      content_html: "<p>Dup test 2</p>",
    }),
  });
  assertEquals(res2.status, 409);
  const body2 = await res2.json();
  assertEquals(body2.error.includes("Duplicate slug"), true);
});
