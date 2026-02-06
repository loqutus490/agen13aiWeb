

# Plan: Train Chatbot with Business FAQ Information

## Overview
Update the AI chatbot's system prompt to include your comprehensive FAQ information, enabling it to answer detailed questions about your AI Assistant service accurately and consistently.

## What Will Change

### Enhanced Chatbot Knowledge
The chatbot will be able to answer questions about:
- **Service type** - Professional service vs. software product
- **Data ownership** - Clear answers about who owns what
- **Target audience** - Law firms, professional services, document-heavy businesses
- **Capabilities** - What the AI can and cannot do
- **Security & privacy** - How documents are handled and protected
- **Setup process** - Timeline and pilot approach
- **Pricing structure** - Setup fees and monthly support
- **How to get started** - Discovery call process

## Implementation Steps

### 1. Restructure System Prompt
Organize the expanded knowledge into clear sections:
- About the Service
- How It Works
- Security & Data
- Capabilities & Limitations
- Setup & Onboarding
- Pricing & Getting Started

### 2. Add FAQ Knowledge Base
Incorporate all 26 FAQ items as reference knowledge the AI can draw from when answering questions.

### 3. Update Behavior Guidelines
Refine how the chatbot should:
- Emphasize that this is a managed service, not software
- Clarify that AI supports staff (never replaces)
- Explain document security clearly
- Guide users toward discovery calls

### 4. Deploy Updated Edge Function
Redeploy the chat function with the new system prompt.

---

## Technical Details

**File to modify:** `supabase/functions/chat/index.ts`

The `SYSTEM_PROMPT` constant will be expanded to include:

```text
## Service Overview

### What We Offer
- Professional service (not standalone software)
- Design, configure, and manage AI assistants using trusted platforms
- You own your data, documents, and access
- We provide configuration, expertise, and ongoing support

### Who This Is For
- Document-heavy, process-driven businesses
- Law firms and professional services
- Operations-focused teams

### What the AI Assistant Does
- Reduces repetitive email and document drafting
- Improves consistency across staff
- Speeds up internal responses
- Reduces time searching for procedures/templates

### What the AI Assistant Does NOT Do
- Provide legal advice
- Make decisions or develop strategy
- Act independently
- Access information outside approved content

## Security & Data Handling

### Document Security
- Access is read-only, limited to approved folders
- Data is never used to train other clients' systems
- Original files remain unchanged
- Automatically updates when files change

### Access Control
- Organization designates internal admin
- Access can be restricted by role
- We never control your internal permissions

## Setup & Process

### Timeline
- Initial setup: typically a few weeks
- Depends on document volume and workflow complexity

### Approach
- Start with pilot focused on one workflow
- Ensure accuracy and confidence before expanding
- No special document formatting required

### Interaction
- Simple chat interface
- Plain language questions
- Can draft emails using approved templates
- All outputs require human review

## Pricing & Getting Started

### Pricing Structure
- One-time setup fee
- Monthly support fee
- Depends on scope and complexity

### Getting Started
- Short discovery call to identify workflows
- Focus on areas that benefit most from automation

## FAQ Quick Reference
[Full FAQ knowledge for accurate responses]
```

---

## Expected Behavior After Update

| User Question | Chatbot Response |
|---------------|------------------|
| "Is this software I can buy?" | Explains it's a professional service, not software |
| "Do you train on our data?" | Clarifies data is never used for training other systems |
| "Will this replace our staff?" | Emphasizes AI supports staff, requires human review |
| "How long to get started?" | Explains few weeks setup, pilot approach |
| "What if we want to stop?" | Can end with notice, documents remain yours |

---

## Deployment
After updating the edge function, it will be automatically redeployed and the chatbot will immediately have access to all this knowledge.

