
# Update All Email Addresses to RoyBernales@agent13.ai

## Summary
Replace all email addresses across the website with the unified address: `RoyBernales@agent13.ai`

## Files to Update

### 1. Contact Page
**File:** `src/pages/Contact.tsx` (line 237)
- Change `contact@agent13.ai` → `RoyBernales@agent13.ai`

### 2. Privacy Policy Page
**File:** `src/pages/PrivacyPolicy.tsx` (line 111)
- Change `support@agent13ai.com` → `RoyBernales@agent13.ai`

### 3. Terms of Service Page
**File:** `src/pages/TermsOfService.tsx` (line 126)
- Change `support@agent13ai.com` → `RoyBernales@agent13.ai`

### 4. Contact Form Email Function (Backend)
**File:** `supabase/functions/send-contact-email/index.ts` (line 135)
- Change `roy.bernales@agent13.ai` → `RoyBernales@agent13.ai`

---

## Technical Notes
- Four files require changes total
- The YouTube channel links (`@agent13ai`) will remain unchanged as those are social media handles, not email addresses
- The chat function reference to YouTube is also left unchanged
