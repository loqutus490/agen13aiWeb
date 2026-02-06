import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, onCancel, isLoading, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isLoading && !disabled) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t border-border">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        rows={1}
        className="
          flex-1 resize-none bg-muted/50 border border-input rounded-xl
          px-4 py-2.5 text-sm
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
      
      {isLoading ? (
        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={onCancel}
          className="h-10 w-10 rounded-xl"
          aria-label="Stop generating"
        >
          <Square className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      )}
    </form>
  );
};
