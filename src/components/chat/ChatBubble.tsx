import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export const ChatBubble = ({ isOpen, onClick, hasUnread }: ChatBubbleProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-primary hover:bg-primary/90
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
      `}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <div className="relative">
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
            )}
          </>
        )}
      </div>
      
      {/* Pulse animation ring */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping opacity-75" />
      )}
    </Button>
  );
};
