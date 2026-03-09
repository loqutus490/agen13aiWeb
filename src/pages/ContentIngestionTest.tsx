import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  FlaskConical, Send, RotateCcw, CheckCircle, XCircle, ExternalLink, CalendarCheck, Loader2,
} from "lucide-react";

const SAMPLE_CONTENT_HTML = `<h1>How Law Firms Can Safely Adopt Legal RAG Systems</h1>
<p>Retrieval-Augmented Generation (RAG) is transforming how law firms interact with their document repositories. But adopting these systems requires careful evaluation of security, accuracy, and compliance considerations.</p>
<h2>What Is Legal RAG?</h2>
<p>Legal RAG combines large language models with document retrieval systems, allowing lawyers to query internal knowledge bases using natural language. Unlike general-purpose AI chat, RAG systems ground their answers in your firm's actual documents.</p>
<h2>Key Evaluation Criteria</h2>
<p>When evaluating a legal RAG system, firms should consider: data residency and encryption, citation accuracy and hallucination rates, integration with existing document management systems, and compliance with bar association guidelines on AI use.</p>
<h2>Security Best Practices</h2>
<p>Any legal RAG deployment must ensure that client data never leaves the firm's security perimeter. Look for systems that offer on-premise or private cloud deployment options, end-to-end encryption, and SOC 2 Type II compliance.</p>
<h2>Implementation Roadmap</h2>
<p>Start with a pilot program in a low-risk practice area. Measure accuracy against human research, gather attorney feedback, and iterate before expanding firm-wide. A phased approach minimizes risk while building internal confidence.</p>
<h2>The Business Case</h2>
<p>Firms that adopt legal RAG report 40-60% reductions in research time. Associates can focus on higher-value analysis while the AI handles document retrieval and initial synthesis.</p>`;

const SAMPLE_PAYLOAD = {
  title: "How Law Firms Can Safely Adopt Legal RAG Systems",
  slug: "legal-rag-law-firms-guide",
  excerpt: "A practical guide for law firm leaders evaluating AI retrieval systems.",
  content_html: SAMPLE_CONTENT_HTML,
  seo_title: "Legal RAG for Law Firms: A Practical Guide",
  meta_description: "Learn how law firms can evaluate and deploy legal RAG systems safely.",
  primary_keyword: "legal rag for law firms",
  secondary_keywords: ["law firm ai automation", "enterprise legal ai", "legal ai workflow"],
  faq_json: [
    { question: "What is Legal RAG?", answer: "RAG combines LLMs with document retrieval to ground answers in your firm's actual documents." },
    { question: "Is Legal RAG secure?", answer: "When deployed with proper encryption and data residency controls, yes." },
  ],
  post_type: "deep-dive",
  newsletter_subject_options: ["Legal RAG: What Law Firms Need to Know", "Is Your Firm Ready for Legal RAG?"],
  newsletter_preview_text: "A practical guide for evaluating legal RAG systems",
  newsletter_body: "<p>This week we explore how law firms can safely adopt Legal RAG systems for document retrieval and research automation.</p>",
  generation_run_id: `test-run-${Date.now()}`,
};

const ContentIngestionTest = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; postId?: string; status?: string; error?: string } | null>(null);

  const [checkingDaily, setCheckingDaily] = useState(false);
  const [dailyResult, setDailyResult] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !adminLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const generatePayload = () => {
    const ts = Date.now();
    setTitle(SAMPLE_PAYLOAD.title);
    setSlug(`${SAMPLE_PAYLOAD.slug}-${ts}`);
    setExcerpt(SAMPLE_PAYLOAD.excerpt);
    setContentHtml(SAMPLE_PAYLOAD.content_html);
    setSeoTitle(SAMPLE_PAYLOAD.seo_title);
    setMetaDescription(SAMPLE_PAYLOAD.meta_description);
    setPrimaryKeyword(SAMPLE_PAYLOAD.primary_keyword);
    setSecondaryKeywords(SAMPLE_PAYLOAD.secondary_keywords.join(", "));
    setResult(null);
    toast({ title: "Payload generated", description: "Form filled with sample data. Slug has a unique timestamp suffix." });
  };

  const resetForm = () => {
    setTitle(""); setSlug(""); setExcerpt(""); setContentHtml("");
    setSeoTitle(""); setMetaDescription(""); setPrimaryKeyword(""); setSecondaryKeywords("");
    setResult(null); setDailyResult(null);
  };

  const sendDraft = async () => {
    if (!title || !slug || !excerpt || !contentHtml) {
      return toast({ title: "Missing fields", description: "Title, slug, excerpt, and content are required.", variant: "destructive" });
    }

    setSending(true);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content_html: contentHtml.trim(),
        seo_title: seoTitle.trim() || undefined,
        meta_description: metaDescription.trim() || undefined,
        primary_keyword: primaryKeyword.trim() || undefined,
        secondary_keywords: secondaryKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        generation_run_id: `test-run-${Date.now()}`,
        ...SAMPLE_PAYLOAD.faq_json && { faq_json: SAMPLE_PAYLOAD.faq_json },
        post_type: "deep-dive",
        newsletter_subject_options: SAMPLE_PAYLOAD.newsletter_subject_options,
        newsletter_preview_text: SAMPLE_PAYLOAD.newsletter_preview_text,
        newsletter_body: SAMPLE_PAYLOAD.newsletter_body,
      };

      const { data, error } = await supabase.functions.invoke("content-ingest", {
        body: payload,
        headers: {
          "x-agent13-internal-key": import.meta.env.VITE_AGENT13_INTERNAL_KEY || "",
        },
      });

      if (error) {
        const msg = typeof error === "object" && "message" in error ? (error as any).message : String(error);
        setResult({ success: false, error: msg });
        toast({ title: "Request failed", description: msg, variant: "destructive" });
        return;
      }

      if (data?.success) {
        setResult({ success: true, postId: data.postId, status: data.status });
        toast({ title: "Draft created!", description: `Post ID: ${data.postId}` });
      } else {
        setResult({ success: false, error: data?.error || "Unknown error" });
        toast({ title: "Endpoint returned error", description: data?.error, variant: "destructive" });
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message });
      toast({ title: "Network error", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const checkDailyGeneration = async () => {
    setCheckingDaily(true);
    setDailyResult(null);
    const today = new Date().toISOString().slice(0, 10);
    try {
      const { data, error } = await supabase.functions.invoke("content-run-check", {
        body: null,
        headers: {
          "x-agent13-internal-key": import.meta.env.VITE_AGENT13_INTERNAL_KEY || "",
        },
        method: "GET",
      });

      // The edge function expects a GET with query params, but supabase.functions.invoke
      // doesn't support query params natively. We'll call it via fetch instead.
    } catch {}

    // Use direct fetch for GET with query params
    try {
      const today = new Date().toISOString().slice(0, 10);
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/content-run-check?date=${today}`;
      const res = await fetch(url, {
        headers: {
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "x-agent13-internal-key": import.meta.env.VITE_AGENT13_INTERNAL_KEY || "",
        },
      });
      const data = await res.json();
      setDailyResult(data);
    } catch (err: any) {
      setDailyResult({ error: err.message });
    } finally {
      setCheckingDaily(false);
    }
  };

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen">
      <SEO title="Content Ingestion Test" description="Internal testing for the content ingestion API endpoint." />
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Content Ingestion Test</h1>
              <p className="text-muted-foreground">Simulate the Azure automation agent to test draft ingestion end-to-end.</p>
            </div>
          </div>

          {/* Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Draft Payload</CardTitle>
              <CardDescription>Fill in the fields or click "Generate Test Payload" for sample data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-title">Title *</Label>
                  <Input id="test-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog post title" />
                </div>
                <div>
                  <Label htmlFor="test-slug">Slug *</Label>
                  <Input id="test-slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="url-friendly-slug" />
                </div>
              </div>
              <div>
                <Label htmlFor="test-excerpt">Excerpt *</Label>
                <Textarea id="test-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Brief summary" />
              </div>
              <div>
                <Label htmlFor="test-content">Content (HTML) *</Label>
                <Textarea id="test-content" value={contentHtml} onChange={(e) => setContentHtml(e.target.value)} rows={8} placeholder="<h1>Article content...</h1>" className="font-mono text-xs" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-seo">SEO Title</Label>
                  <Input id="test-seo" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="SEO optimized title" />
                </div>
                <div>
                  <Label htmlFor="test-keyword">Primary Keyword</Label>
                  <Input id="test-keyword" value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} placeholder="main keyword" />
                </div>
              </div>
              <div>
                <Label htmlFor="test-meta">Meta Description</Label>
                <Input id="test-meta" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Max 160 characters" maxLength={160} />
              </div>
              <div>
                <Label htmlFor="test-secondary">Secondary Keywords (comma-separated)</Label>
                <Input id="test-secondary" value={secondaryKeywords} onChange={(e) => setSecondaryKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" />
              </div>

              <Separator />

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={generatePayload}>
                  <FlaskConical className="w-4 h-4 mr-2" />Generate Test Payload
                </Button>
                <Button onClick={sendDraft} disabled={sending}>
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Draft to Endpoint
                </Button>
                <Button variant="ghost" onClick={resetForm}>
                  <RotateCcw className="w-4 h-4 mr-2" />Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card className={`mb-6 border-2 ${result.success ? "border-green-500/50" : "border-destructive/50"}`}>
              <CardContent className="pt-6">
                {result.success ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold text-lg">Draft successfully created</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Post ID:</strong> <code className="bg-muted px-2 py-0.5 rounded text-xs">{result.postId}</code></p>
                      <p><strong>Status:</strong> <Badge className="bg-blue-100 text-blue-800">{result.status}</Badge></p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate("/blog-management")}>
                      <ExternalLink className="w-4 h-4 mr-2" />View in Blog Management
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Request failed</span>
                    </div>
                    <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">{result.error}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Daily check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                Daily Generation Check
              </CardTitle>
              <CardDescription>Check if AI-generated content already exists for today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" onClick={checkDailyGeneration} disabled={checkingDaily}>
                {checkingDaily ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CalendarCheck className="w-4 h-4 mr-2" />}
                Check Daily Generation
              </Button>
              {dailyResult && (
                <div className="p-3 bg-muted rounded text-sm">
                  {dailyResult.error ? (
                    <p className="text-destructive">{dailyResult.error}</p>
                  ) : dailyResult.exists ? (
                    <div>
                      <p className="font-medium text-amber-600">⚠️ Content already exists for {dailyResult.date}</p>
                      <p className="text-xs mt-1">{dailyResult.count} post(s) found</p>
                      {dailyResult.posts?.map((p: any) => (
                        <p key={p.postId} className="text-xs mt-1">
                          • {p.title} — <Badge variant="outline" className="text-xs">{p.status}</Badge>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-600">✅ No content generated yet for {dailyResult.date}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContentIngestionTest;
