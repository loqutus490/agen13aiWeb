
# Plan: Make Secure Document AI the Flagship Service

## Overview
Reposition the entire website to highlight **Secure Document AI** as your core offering and primary expertise, while maintaining other services as complementary offerings.

## What Will Change

### 1. Home Page (`src/pages/Home.tsx`)
**Hero Section:**
- Update headline from generic "AI Solutions" to focus on document-grounded AI
- New headline: "Secure Document AI for Professional Services"
- Subheadline emphasizing law firms and document-heavy businesses
- Primary CTA: "Schedule Discovery Call"

**Problem/Solution Section:**
- Reframe challenges around document work, email drafting, and consistency
- Solution focused on secure, document-grounded AI assistants

**Features Grid:**
- Lead with document-related capabilities
- Emphasize security, human oversight, and workflow support

### 2. Services Page (`src/pages/Services.tsx`)
**Hero Section:**
- Update headline to emphasize Secure Document AI expertise

**Services Reordering:**
- Move "Secure Document AI" to prominent first position
- Add visual distinction (larger card, featured badge already exists)
- Consider a dedicated section above other services

### 3. Features Page (`src/pages/Features.tsx`)
**Restructure Features:**
- Lead with document AI capabilities
- Add specific features: document indexing, email drafting, template usage
- Include security and compliance features prominently

### 4. About Page (`src/pages/About.tsx`)
**Mission Update:**
- Emphasize expertise in secure, document-grounded AI
- Highlight target market: law firms, professional services

### 5. Pricing Page (`src/pages/Pricing.tsx`)
**Complete Overhaul:**
- Replace generic product tiers with service-based pricing
- Feature Secure Document AI ($999/month) prominently
- Include other services as additional offerings
- Remove outdated "Free Trial" / "$19/month" product references

### 6. FAQ Page (`src/pages/FAQ.tsx`)
**Add New Category:**
- "Secure Document AI" category with relevant questions from your FAQ document
- Security and data handling questions

### 7. Navbar (`src/components/Navbar.tsx`)
**Optional Enhancement:**
- Add "Secure Document AI" as a prominent navigation item
- Or rename "Services" link to draw attention

### 8. Footer (`src/components/Footer.tsx`)
**Update Tagline:**
- From "AI-powered tools for modern business"
- To something like "Secure Document AI for Professional Services"

---

## Detailed Changes by File

### Home Page Hero
```text
Current: "Empower Your Business with AI Solutions"
New: "Secure Document AI for Professional Services"

Current subheadline: Generic productivity message
New: "Reduce repetitive email and document work with secure, 
     document-grounded AI assistants. Built for law firms 
     and professional services."
```

### Home Problem/Solution Cards
**Problems to highlight:**
- Repetitive email and document drafting consuming staff time
- Inconsistent responses across team members
- Time lost searching for procedures and templates
- Need to maintain strict data security

**Solutions:**
- Document-grounded AI using your existing materials
- Improved consistency and response speed
- Simple chat interface for staff
- Your data, your control - never used for training

### Services Page Structure
```text
┌─────────────────────────────────────────────────┐
│  FLAGSHIP: Secure Document AI                   │
│  Full-width featured card with detailed info    │
│  Starting at $999/month                         │
└─────────────────────────────────────────────────┘

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Process     │  │ AI Chatbot  │  │ Analytics   │
│ Automation  │  │ $799/mo     │  │ $699/mo     │
│ $499/mo     │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Pricing Page Transformation
**From:** Product tiers ($0/$19)
**To:** Service offerings focused on professional services

New structure:
- **Secure Document AI** - $999/month (Featured)
- **Discovery Call** - Free consultation CTA
- Comparison of service tiers or custom quote option

---

## Technical Details

**Files to modify:**
1. `src/pages/Home.tsx` - Hero, problem/solution, features
2. `src/pages/Services.tsx` - Reorder, enhance flagship service
3. `src/pages/Features.tsx` - Document AI focus
4. `src/pages/Pricing.tsx` - Replace product tiers with services
5. `src/pages/About.tsx` - Mission and expertise update
6. `src/pages/FAQ.tsx` - Add Document AI category
7. `src/components/Footer.tsx` - Update tagline

**No database changes required**

---

## Key Messaging Throughout

| Element | Current | New |
|---------|---------|-----|
| Primary audience | Generic "business" | Law firms, professional services |
| Core offering | AI solutions | Secure Document AI |
| Key benefit | Productivity | Reduce repetitive work, improve consistency |
| Trust signals | Generic | Data security, human oversight, no training on data |
| CTA | "Get Started" | "Schedule Discovery Call" |

---

## Chatbot Already Updated
The chatbot system prompt already emphasizes Secure Document AI as the primary service, so it will align with these website changes.
