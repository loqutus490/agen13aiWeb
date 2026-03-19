import { useState, useEffect } from "react";
import { DownloadLeadForm } from "@/components/DownloadLeadForm";

const POPUP_STORAGE_KEY = "lead_popup_dismissed";
const POPUP_DELAY_MS = 45000; // 45 seconds on page

const LeadCapturePopup = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) return;

    // Timer-based trigger
    const timer = setTimeout(() => {
      setIsFormOpen(true);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'popup_shown',
        popup_name: 'lead_capture_timed',
      });
    }, POPUP_DELAY_MS);

    // Exit-intent trigger (mouse leaves viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        clearTimeout(timer);
        setIsFormOpen(true);
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: 'popup_shown',
          popup_name: 'lead_capture_exit_intent',
        });
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsFormOpen(false);
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
  };

  return (
    <DownloadLeadForm
      isOpen={isFormOpen}
      onClose={handleClose}
      resourceTitle="AI Readiness Assessment for Law Firms"
      resourceFileName="ai-readiness-assessment-law-firms.pdf"
      downloadUrl="/guides/ai-readiness-assessment-law-firms.pdf"
    />
  );
};

export default LeadCapturePopup;
