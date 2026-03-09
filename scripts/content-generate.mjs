#!/usr/bin/env node
const modeArg = process.argv.find((a) => a.startsWith("--mode="));
const mode = (modeArg?.split("=")[1] || "deep-dive");

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
const secret = process.env.CONTENT_AUTOMATION_RUN_SECRET;

if (!url || !anon || !secret) {
  console.error("Missing required env vars: SUPABASE_URL, SUPABASE_ANON_KEY, CONTENT_AUTOMATION_RUN_SECRET");
  process.exit(1);
}

const endpoint = `${url}/functions/v1/content-automation-run`;
const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    "x-run-secret": secret,
  },
  body: JSON.stringify({ mode, triggerType: "cli" }),
});

const body = await res.text();
if (!res.ok) {
  console.error(body);
  process.exit(1);
}

console.log(body);
