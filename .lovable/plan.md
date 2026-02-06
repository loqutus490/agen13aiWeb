
# AI Chatbot Widget for agent13 ai

A floating AI-powered chatbot that helps visitors learn about your AI services and captures leads when appropriate.

## What You'll Get

- **Floating chat bubble** in the bottom-right corner of every page
- **AI-powered responses** using Lovable AI (no API keys needed)
- **Smart lead capture** - the bot will naturally ask for contact info when visitors show interest
- **Brand-consistent design** matching your existing tech/AI aesthetic
- **Real-time streaming** responses for a natural conversation feel
- **Conversation persistence** within a session

## User Experience

1. Visitor sees a chat bubble with a friendly pulse animation
2. Clicking opens a sleek chat panel with your branding
3. The AI greets them and offers to help
4. As they chat, the AI answers questions about your services, pricing, case studies, etc.
5. When the visitor expresses interest (e.g., "I'd like to learn more"), the AI naturally asks for their contact info
6. Lead data is saved to your existing `download_leads` table (reusing your lead capture infrastructure)

## Components to Create

### 1. Chat Edge Function (`supabase/functions/chat/index.ts`)
- Receives conversation messages from frontend
- Calls Lovable AI with a custom system prompt about agent13 ai
- Streams responses back in real-time
- Handles rate limits and errors gracefully

### 2. ChatWidget Component (`src/components/ChatWidget.tsx`)
- Floating bubble with expand/collapse animation
- Chat message list with markdown rendering
- Input field with send button
- Loading/typing indicators
- Lead capture form that appears inline when triggered

### 3. Chat Message Types (`src/components/ChatMessage.tsx`)
- User message styling (right-aligned, primary color)
- Assistant message styling (left-aligned, with AI avatar)
- Markdown support for formatted responses
- Lead capture card component

### 4. Chat Hook (`src/hooks/useChatBot.ts`)
- Manages conversation state
- Handles streaming responses
- Detects when to trigger lead capture
- Saves leads to database

## AI System Prompt

The chatbot will be configured with knowledge about:
- Your AI services (automation, chatbots, analytics, content, consulting, custom solutions)
- Pricing ranges for each service
- Company mission and approach
- How to naturally transition to lead capture

## Integration Points

- **Existing lead capture**: Uses your `download_leads` table
- **Analytics**: Fires GTM events for chat engagement
- **Rate limiting**: Uses your existing rate limiting infrastructure
- **Design system**: Uses your existing UI components (Button, Card, Badge)

---

## Technical Details

### Edge Function Implementation

```text
+------------------+     +------------------+     +------------------+
|   Chat Widget    | --> |   Edge Function  | --> |   Lovable AI     |
|   (Frontend)     |     |   /chat          |     |   Gateway        |
+------------------+     +------------------+     +------------------+
        |                        |
        v                        v
   Stream tokens            System prompt
   to user                  + conversation
```

### Database Changes
- No new tables needed - reuses existing `download_leads` table
- Leads captured via chat will have `downloaded_resource` set to "AI Chatbot Conversation"

### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/chat/index.ts` | Create | Edge function for AI responses |
| `supabase/config.toml` | Modify | Add chat function config |
| `src/components/ChatWidget.tsx` | Create | Main chat widget component |
| `src/components/chat/ChatBubble.tsx` | Create | Floating trigger button |
| `src/components/chat/ChatPanel.tsx` | Create | Expanded chat interface |
| `src/components/chat/ChatMessage.tsx` | Create | Message display component |
| `src/components/chat/ChatInput.tsx` | Create | Message input component |
| `src/components/chat/LeadCaptureCard.tsx` | Create | Inline lead form |
| `src/hooks/useChatBot.ts` | Create | Chat state management |
| `src/App.tsx` | Modify | Add ChatWidget to app |

### Lead Capture Trigger

The AI will be prompted to suggest sharing contact info when:
- Visitor asks about pricing specifics
- Visitor mentions wanting a consultation
- Visitor expresses interest in getting started
- After 3+ meaningful exchanges

The lead form appears as a chat card, not a separate modal, keeping the experience seamless.
