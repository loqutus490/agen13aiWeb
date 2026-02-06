import { useState, useEffect } from "react";
import { ChatBubble } from "./chat/ChatBubble";
import { ChatPanel } from "./chat/ChatPanel";
import { useChatBot } from "@/hooks/useChatBot";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    isLoading,
    showLeadCapture,
    sendMessage,
    submitLead,
    cancelStream,
    resetChat,
    hideLeadCapture,
  } = useChatBot();

  // Fire GTM event when chat is opened
  const handleOpen = () => {
    setIsOpen(true);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "chat_opened",
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <ChatBubble isOpen={isOpen} onClick={handleOpen} />
      <ChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        isLoading={isLoading}
        showLeadCapture={showLeadCapture}
        onSendMessage={sendMessage}
        onCancelStream={cancelStream}
        onReset={resetChat}
        onSubmitLead={submitLead}
        onHideLeadCapture={hideLeadCapture}
      />
    </>
  );
};
