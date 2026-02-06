import { useEffect, useRef } from "react";
import { X, RotateCcw, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LeadCaptureCard } from "./LeadCaptureCard";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChatBot";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  showLeadCapture: boolean;
  onSendMessage: (message: string) => void;
  onCancelStream: () => void;
  onReset: () => void;
  onSubmitLead: (data: { firstName: string; lastName: string; email: string; phoneNumber: string }) => Promise<boolean>;
  onHideLeadCapture: () => void;
}

export const ChatPanel = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  showLeadCapture,
  onSendMessage,
  onCancelStream,
  onReset,
  onSubmitLead,
  onHideLeadCapture,
}: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showLeadCapture]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        w-[380px] max-w-[calc(100vw-48px)]
        h-[600px] max-h-[calc(100vh-100px)]
        bg-card border border-border rounded-2xl
        shadow-2xl shadow-primary/10
        flex flex-col overflow-hidden
        transition-all duration-300 ease-out
        ${isOpen 
          ? "opacity-100 scale-100 translate-y-0" 
          : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">agent13 ai</h3>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-8 w-8"
            aria-label="Reset conversation"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Lead capture card */}
        {showLeadCapture && (
          <LeadCaptureCard onSubmit={onSubmitLead} onClose={onHideLeadCapture} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSendMessage}
        onCancel={onCancelStream}
        isLoading={isLoading}
      />
    </div>
  );
};
