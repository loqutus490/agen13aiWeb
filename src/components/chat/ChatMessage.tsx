import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChatBot";

interface ChatMessageProps {
  message: ChatMessageType;
}

// Simple markdown-like rendering for chat
const renderContent = (content: string) => {
  // Split by code blocks first
  const parts = content.split(/```/);
  
  return parts.map((part, index) => {
    // Odd indices are code blocks
    if (index % 2 === 1) {
      return (
        <pre key={index} className="bg-muted/50 rounded-md p-3 my-2 text-sm overflow-x-auto">
          <code>{part.trim()}</code>
        </pre>
      );
    }
    
    // Process regular text
    return (
      <span key={index}>
        {part.split("\n").map((line, lineIndex) => {
          // Handle headers
          if (line.startsWith("### ")) {
            return <strong key={lineIndex} className="block mt-2 mb-1">{line.slice(4)}</strong>;
          }
          if (line.startsWith("## ")) {
            return <strong key={lineIndex} className="block mt-2 mb-1 text-lg">{line.slice(3)}</strong>;
          }
          
          // Handle bullet points
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <span key={lineIndex} className="block ml-2">
                • {renderInlineFormatting(line.slice(2))}
              </span>
            );
          }
          
          // Handle numbered lists
          const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
          if (numberedMatch) {
            return (
              <span key={lineIndex} className="block ml-2">
                {numberedMatch[1]}. {renderInlineFormatting(numberedMatch[2])}
              </span>
            );
          }
          
          // Empty lines become line breaks
          if (line.trim() === "") {
            return <br key={lineIndex} />;
          }
          
          return (
            <span key={lineIndex}>
              {renderInlineFormatting(line)}
              {lineIndex < part.split("\n").length - 1 && " "}
            </span>
          );
        })}
      </span>
    );
  });
};

// Handle bold, italic, links
const renderInlineFormatting = (text: string) => {
  // Handle bold
  const boldParts = text.split(/\*\*(.+?)\*\*/g);
  return boldParts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i}>{part}</strong>;
    }
    return part;
  });
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? "bg-primary/20 text-primary" : "bg-accent text-accent-foreground"}
        `}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message bubble */}
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
          ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          }
        `}
      >
        {isUser ? message.content : renderContent(message.content)}
      </div>
    </div>
  );
};
