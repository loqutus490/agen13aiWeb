import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLeadCapture?: boolean;
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi there! 👋 I'm the agent13 ai assistant. I can help you learn about our AI services, pricing, and how we can help transform your business. What would you like to know?",
  timestamp: new Date(),
};

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const streamChat = async (userMessage: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Prepare messages for API (exclude welcome message metadata)
    const apiMessages = [...messages, userMsg]
      .filter((m) => m.id !== "welcome" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    let assistantContent = "";
    const assistantId = generateId();

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Create initial assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put back and wait for more
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Fire GTM event for chat engagement
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "chat_message_sent",
        chat_message_count: messages.length + 2,
      });

      // Check if we should show lead capture (after 3+ exchanges, not already captured)
      const messageCount = messages.length + 2;
      if (messageCount >= 6 && !leadCaptured && !showLeadCapture) {
        // Check if AI response suggests lead capture
        const lcKeywords = ["reach out", "contact info", "get in touch", "consultation", "specialist"];
        if (lcKeywords.some((kw) => assistantContent.toLowerCase().includes(kw))) {
          setTimeout(() => setShowLeadCapture(true), 1000);
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Chat request aborted");
        return;
      }

      console.error("Chat error:", error);
      toast({
        title: "Connection issue",
        description: "Couldn't get a response. Please try again.",
        variant: "destructive",
      });

      // Remove empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const submitLead = async (data: LeadData) => {
    try {
      const { error } = await supabase.from("download_leads").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        downloaded_resource: "AI Chatbot Conversation",
      });

      if (error) throw error;

      // Fire GTM event
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "chat_lead_captured",
        lead_source: "AI Chatbot",
        lead_email: data.email,
      });

      setLeadCaptured(true);
      setShowLeadCapture(false);

      // Add confirmation message
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: `Thanks ${data.firstName}! 🎉 One of our AI specialists will reach out to you soon at ${data.email}. In the meantime, feel free to ask me any other questions!`,
          timestamp: new Date(),
        },
      ]);

      toast({
        title: "Thank you!",
        description: "We'll be in touch soon.",
      });

      return true;
    } catch (error) {
      console.error("Lead submission error:", error);
      toast({
        title: "Error",
        description: "Couldn't submit your info. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  const resetChat = useCallback(() => {
    cancelStream();
    setMessages([INITIAL_MESSAGE]);
    setShowLeadCapture(false);
    setLeadCaptured(false);
  }, [cancelStream]);

  return {
    messages,
    isLoading,
    showLeadCapture,
    leadCaptured,
    sendMessage: streamChat,
    submitLead,
    cancelStream,
    resetChat,
    hideLeadCapture: () => setShowLeadCapture(false),
  };
};
