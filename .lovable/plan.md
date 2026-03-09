
# Fix Contact Form CORS and Email Routing

## Overview
The Contact form fails with "Failed to send message" because the edge function's CORS configuration blocks requests from domains not in its whitelist. Additionally, the business notification email needs to be routed to the same destination as the lead capture form.

## Root Cause Analysis
1. **CORS Whitelist Issue**: The `send-contact-email` function only allows specific origins, but the browser may be accessing from a different subdomain or preview URL variant
2. **Email Routing Mismatch**: Contact form notifications still go to `RoyBernales@agent13.ai` instead of `agent13leads@theimoroip.resend.app`

## Solution

### Step 1: Update CORS Configuration
Change the CORS headers to use the standard `'*'` wildcard, matching the pattern used successfully in other edge functions like `submit-lead` and `chat`.

```text
File: supabase/functions/send-contact-email/index.ts

Change from:
- Restrictive origin whitelist

Change to:
- Standard corsHeaders with '*' allow-origin
```

### Step 2: Update Business Email Destination
Route business notifications to `agent13leads@theimoroip.resend.app` for consistency with lead capture form.

```text
File: supabase/functions/send-contact-email/index.ts

Line ~135: to: ["RoyBernales@agent13.ai"]
Change to: to: ["agent13leads@theimoroip.resend.app"]
```

### Step 3: Deploy and Test
- Deploy the updated edge function
- Test the contact form end-to-end to verify emails are sent successfully

---

## Technical Details

### Files to Modify
| File | Change |
|------|--------|
| `supabase/functions/send-contact-email/index.ts` | Update CORS headers and business email recipient |

### CORS Headers Update
```typescript
// Replace restrictive origin whitelist with standard headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### Email Recipient Change
```typescript
// Line 135
to: ["agent13leads@theimoroip.resend.app"],
```

## Expected Outcome
- Contact form submissions will work from any domain
- Business notifications will go to the consolidated leads inbox
- User confirmations will still be sent to the submitter
