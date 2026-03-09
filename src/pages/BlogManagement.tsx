import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { BlogImageUpload } from "@/components/BlogImageUpload";
import { Pencil, Trash2, Plus, Tag, Image as ImageIcon, Bot, Eye, CheckCircle, XCircle, Mail, ExternalLink, Save } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { canTransitionStatus } from "@/lib/contentAutomation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string | null;
  published: boolean;
  tags: string[];
  image_url: string | null;
  status?: string | null;
  newsletter_status?: string | null;
  created_by_system?: boolean | null;
  primary_keyword?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  secondary_keywords?: string[] | null;
  faq_json?: any;
  schema_json?: any;
  source_links_json?: any;
  image_options_json?: any;
  internal_link_suggestions?: string[] | null;
  post_type?: string | null;
  review_notes?: string | null;
  newsletter_subject_options?: string[] | null;
  newsletter_preview_text?: string | null;
  newsletter_body?: string | null;
  generation_run_id?: string | null;
  published_at?: string | null;
  scheduled_publish_at?: string | null;
}

interface GenerationRun {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  selected_topic: string | null;
  error_message: string | null;
}

const statusColors: Record<string, string> = {
  draft_generated: "bg-yellow-100 text-yellow-800",
  pending_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  published: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};

const newsletterStatusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  sent: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};

const BlogManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [runs, setRuns] = useState<GenerationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [inspectPost, setInspectPost] = useState<BlogPost | null>(null);
  const [filterTab, setFilterTab] = useState("all");
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    slug: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0],
    category: "", author: "agent13 ai Team", published: false, tags: [] as string[], image_url: "",
    status: "pending_review", newsletter_status: "draft",
  });

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) navigate("/");
      else Promise.all([fetchPosts(), fetchRuns()]).finally(() => setLoading(false));
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const fetchPosts = async () => {
    const { data, error } = await (supabase.from("blog_posts") as any).select("*").order("date", { ascending: false });
    if (error) throw error;
    setPosts(data || []);
  };

  const fetchRuns = async () => {
    const { data, error } = await (supabase.from("content_generation_runs") as any).select("id,status,started_at,completed_at,selected_topic,error_message").order("started_at", { ascending: false }).limit(10);
    if (!error) setRuns(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) await (supabase.from("blog_posts") as any).update(formData).eq("id", editingPost.id);
      else await (supabase.from("blog_posts") as any).insert([{ ...formData, author_id: user?.id, created_by_system: false }]);
      resetForm();
      await fetchPosts();
      toast({ title: "Success", description: `Blog post ${editingPost ? "updated" : "created"} successfully` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateStatus = async (post: BlogPost, status: string, published = false) => {
    const currentStatus = post.status || "pending_review";
    if (!canTransitionStatus(currentStatus, status) && !(currentStatus === "published" && status === "published")) {
      return toast({
        title: "Invalid workflow transition",
        description: `Cannot move post from ${currentStatus} to ${status}.`,
        variant: "destructive",
      });
    }

    const patch: any = { status, published };
    if (status === "published") patch.published_at = new Date().toISOString();
    const { error } = await (supabase.from("blog_posts") as any).update(patch).eq("id", post.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Status updated", description: `Post moved to "${status}"` });
    await fetchPosts();
  };

  const updateNewsletterStatus = async (post: BlogPost, newsletter_status: string) => {
    const { error } = await (supabase.from("blog_posts") as any).update({ newsletter_status }).eq("id", post.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Newsletter status updated", description: `Newsletter set to "${newsletter_status}"` });
    await fetchPosts();
  };

  const updateReviewNotes = async (post: BlogPost, review_notes: string) => {
    const { error } = await (supabase.from("blog_posts") as any).update({ review_notes }).eq("id", post.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await fetchPosts();
  };

  const triggerGeneration = async (mode: "roundup" | "deep-dive") => {
    const { error } = await supabase.functions.invoke("content-automation-run", { body: { mode, triggerType: "admin" } });
    if (error) return toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    toast({ title: "Generation started", description: `Content automation run started in ${mode} mode.` });
    await Promise.all([fetchPosts(), fetchRuns()]);
  };

  const handleDelete = async () => {
    if (!deletePostId) return;
    await supabase.from("blog_posts").delete().eq("id", deletePostId);
    setDeletePostId(null);
    await fetchPosts();
  };

  const resetForm = () => {
    setFormData({ slug: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0], category: "", author: "agent13 ai Team", published: false, tags: [], image_url: "", status: "pending_review", newsletter_status: "draft" });
    setEditingPost(null);
    setIsCreating(false);
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, date: post.date, category: post.category, author: post.author || "agent13 ai Team", published: post.published, tags: post.tags || [], image_url: post.image_url || "", status: post.status || "pending_review", newsletter_status: post.newsletter_status || "draft" });
    setIsCreating(true);
  };

  const filteredPosts = posts.filter((post) => {
    if (filterTab === "ai-drafts") return post.created_by_system === true;
    if (filterTab === "pending") return post.status === "pending_review";
    if (filterTab === "published") return post.published === true;
    return true;
  });

  if (authLoading || adminLoading || loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return <div className="min-h-screen">
    <SEO title="Blog Management" description="Create, edit, and manage blog posts for the agent13 ai website." />
    <Navbar />
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
          <h1 className="text-4xl font-bold">Blog Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => triggerGeneration("roundup")}>Run Daily Roundup</Button>
            <Button variant="outline" onClick={() => triggerGeneration("deep-dive")}>Run Deep Dive</Button>
            {!isCreating && <Button onClick={() => setIsCreating(true)}><Plus className="w-4 h-4 mr-2" />New Post</Button>}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Recent Automation Runs</CardTitle></CardHeader>
          <CardContent className="space-y-2">{runs.length === 0 ? <p className="text-sm text-muted-foreground">No runs yet</p> : runs.map((run) => <div className="flex justify-between text-sm" key={run.id}><span>{run.selected_topic || "Pending topic selection"}</span><Badge variant={run.status === "failed" ? "destructive" : "secondary"}>{run.status}</Badge></div>)}</CardContent>
        </Card>

        {isCreating && <Card className="mb-8"><CardHeader><CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle><CardDescription>{editingPost ? "Update your blog post" : "Write a new blog post"}</CardDescription></CardHeader><CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div><Label htmlFor="slug">Slug (URL)</Label><Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required /></div>
            </div>
            <div><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={3} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label htmlFor="category">Category</Label><Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required /></div>
              <div><Label htmlFor="date">Date</Label><Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
              <div><Label htmlFor="author">Author</Label><Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required /></div>
            </div>
            <TagInput tags={formData.tags} onChange={(tags) => setFormData({ ...formData, tags })} placeholder="Add tags" />
            <BlogImageUpload imageUrl={formData.image_url} onImageChange={(url) => setFormData({ ...formData, image_url: url })} />
            <div><Label>Content</Label><RichTextEditor content={formData.content} onChange={(html) => setFormData({ ...formData, content: html })} /></div>
            <div className="flex items-center space-x-2"><Switch id="published" checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} /><Label htmlFor="published">Published</Label></div>
            <div className="flex gap-2"><Button type="submit">{editingPost ? "Update Post" : "Create Post"}</Button><Button type="button" variant="outline" onClick={resetForm}>Cancel</Button></div>
          </form>
        </CardContent></Card>}

        {/* Filter tabs */}
        <Tabs value={filterTab} onValueChange={setFilterTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="ai-drafts">
              <Bot className="w-4 h-4 mr-1" />AI Drafts ({posts.filter(p => p.created_by_system).length})
            </TabsTrigger>
            <TabsTrigger value="pending">Pending Review ({posts.filter(p => p.status === "pending_review").length})</TabsTrigger>
            <TabsTrigger value="published">Published ({posts.filter(p => p.published).length})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{filterTab === "ai-drafts" ? "AI-Generated Drafts" : filterTab === "pending" ? "Pending Review" : filterTab === "published" ? "Published Posts" : "All Posts"}</h2>
          {filteredPosts.length === 0 && <p className="text-muted-foreground">No posts found.</p>}
          {filteredPosts.map((post) => <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {post.created_by_system && <Bot className="w-5 h-5 text-blue-500 shrink-0" />}
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.category} • {new Date(post.date).toLocaleDateString()} • {post.author}</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[post.status || "pending_review"] || "bg-gray-100 text-gray-800"}`}>
                      {post.status || "pending_review"}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${newsletterStatusColors[post.newsletter_status || "draft"] || "bg-gray-100 text-gray-800"}`}>
                      <Mail className="w-3 h-3 mr-1" />NL: {post.newsletter_status || "draft"}
                    </span>
                    {post.post_type && <Badge variant="outline">{post.post_type}</Badge>}
                    {post.primary_keyword && <Badge variant="outline">SEO: {post.primary_keyword}</Badge>}
                    {post.image_url && <Badge variant="secondary" className="text-xs"><ImageIcon className="w-3 h-3 mr-1" />Has image</Badge>}
                    {post.generation_run_id && <Badge variant="outline" className="text-xs">Run: {post.generation_run_id.slice(0, 8)}</Badge>}
                  </div>
                  {post.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{post.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs"><Tag className="w-3 h-3 mr-1" />{tag}</Badge>)}</div>}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => setInspectPost(post)} title="Inspect"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(post)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeletePostId(post.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">{post.excerpt}</p>
              <div className="mb-3">
                <Label className="text-xs font-medium mb-1 block">Review Notes</Label>
                <div className="flex gap-2">
                  <Textarea
                    className="text-sm min-h-[60px]"
                    placeholder="Add review notes..."
                    value={editingNotes[post.id] ?? post.review_notes ?? ""}
                    onChange={(e) => setEditingNotes((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    rows={2}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 self-end"
                    disabled={editingNotes[post.id] === undefined}
                    onClick={async () => {
                      await updateReviewNotes(post, editingNotes[post.id] ?? "");
                      setEditingNotes((prev) => { const n = { ...prev }; delete n[post.id]; return n; });
                      toast({ title: "Notes saved" });
                    }}
                  >
                    <Save className="w-4 h-4 mr-1" />Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Blog workflow actions */}
                {(post.status === "pending_review" || post.status === "draft_generated") && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(post, "approved", false)}>
                    <CheckCircle className="w-4 h-4 mr-1" />Approve
                  </Button>
                )}
                {post.status === "approved" && (
                  <Button size="sm" onClick={() => updateStatus(post, "published", true)}>
                    <CheckCircle className="w-4 h-4 mr-1" />Publish
                  </Button>
                )}
                {post.status !== "failed" && post.status !== "published" && (
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(post, "failed", false)}>
                    <XCircle className="w-4 h-4 mr-1" />Reject
                  </Button>
                )}
                {post.status === "failed" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(post, "pending_review", false)}>
                    Return to Review
                  </Button>
                )}
                <Separator orientation="vertical" className="h-8" />
                {/* Newsletter workflow actions */}
                {post.newsletter_body && post.newsletter_status === "draft" && (
                  <Button size="sm" variant="outline" onClick={() => updateNewsletterStatus(post, "approved")}>
                    <Mail className="w-4 h-4 mr-1" />Approve Newsletter
                  </Button>
                )}
                {post.newsletter_status === "approved" && (
                  <Button size="sm" variant="outline" onClick={() => updateNewsletterStatus(post, "sent")}>
                    <Mail className="w-4 h-4 mr-1" />Mark NL Sent
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>)}
        </div>
      </div>
    </div>

    {/* Inspect Dialog */}
    <Dialog open={!!inspectPost} onOpenChange={() => setInspectPost(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {inspectPost?.created_by_system && <Bot className="w-5 h-5 text-blue-500" />}
            {inspectPost?.title}
          </DialogTitle>
          <DialogDescription>
            {inspectPost?.category} • {inspectPost?.post_type} • {inspectPost?.date}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {inspectPost && (
            <div className="space-y-4 pr-4">
              <Accordion type="multiple" defaultValue={["seo", "content", "newsletter", "sources"]}>
                <AccordionItem value="seo">
                  <AccordionTrigger>SEO & Metadata</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <div><strong>SEO Title:</strong> {inspectPost.seo_title || "—"}</div>
                    <div><strong>Meta Description:</strong> {inspectPost.meta_description || "—"}</div>
                    <div><strong>Primary Keyword:</strong> {inspectPost.primary_keyword || "—"}</div>
                    <div><strong>Secondary Keywords:</strong> {(inspectPost.secondary_keywords || []).join(", ") || "—"}</div>
                    <div><strong>Slug:</strong> /{inspectPost.slug}</div>
                    {inspectPost.faq_json && Array.isArray(inspectPost.faq_json) && inspectPost.faq_json.length > 0 && (
                      <div>
                        <strong>FAQ ({inspectPost.faq_json.length}):</strong>
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                          {inspectPost.faq_json.map((faq: any, i: number) => (
                            <li key={i}><strong>{faq.question}</strong> — {faq.answer}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {inspectPost.schema_json && Object.keys(inspectPost.schema_json).length > 0 && (
                      <div>
                        <strong>Schema JSON:</strong>
                        <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-auto max-h-32">{JSON.stringify(inspectPost.schema_json, null, 2)}</pre>
                      </div>
                    )}
                    {(inspectPost.internal_link_suggestions || []).length > 0 && (
                      <div>
                        <strong>Internal Links:</strong>
                        <ul className="list-disc ml-5">{inspectPost.internal_link_suggestions!.map((l, i) => <li key={i}>{l}</li>)}</ul>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="content">
                  <AccordionTrigger>Article Content</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: inspectPost.content }} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="newsletter">
                  <AccordionTrigger>Newsletter Draft</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <div><strong>Status:</strong> <Badge>{inspectPost.newsletter_status || "draft"}</Badge></div>
                    {(inspectPost.newsletter_subject_options || []).length > 0 && (
                      <div>
                        <strong>Subject Options:</strong>
                        <ul className="list-disc ml-5">{inspectPost.newsletter_subject_options!.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </div>
                    )}
                    {inspectPost.newsletter_preview_text && <div><strong>Preview Text:</strong> {inspectPost.newsletter_preview_text}</div>}
                    {inspectPost.newsletter_body && (
                      <div>
                        <strong>Body:</strong>
                        <div className="mt-1 border rounded p-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: inspectPost.newsletter_body }} />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sources">
                  <AccordionTrigger>Sources & Images</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {inspectPost.source_links_json && Array.isArray(inspectPost.source_links_json) && inspectPost.source_links_json.length > 0 && (
                      <div>
                        <strong>Sources:</strong>
                        <ul className="list-disc ml-5 space-y-1">
                          {inspectPost.source_links_json.map((s: any, i: number) => (
                            <li key={i}>
                              <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                {s.title || s.link} <ExternalLink className="w-3 h-3" />
                              </a>
                              {s.source && <span className="text-xs text-muted-foreground ml-1">({s.source})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {inspectPost.image_options_json && Array.isArray(inspectPost.image_options_json) && inspectPost.image_options_json.length > 0 && (
                      <div>
                        <strong>Image Options:</strong>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {inspectPost.image_options_json.map((img: any, i: number) => (
                            <div key={i} className="border rounded p-2">
                              {img.url && <img src={img.url} alt={img.alt || ""} className="w-full h-24 object-cover rounded mb-1" />}
                              <p className="text-xs">{img.alt || img.filename || `Option ${i + 1}`}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {inspectPost.generation_run_id && <div><strong>Generation Run ID:</strong> <code className="text-xs">{inspectPost.generation_run_id}</code></div>}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>

    <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
    </AlertDialog>
    <Footer />
  </div>;
};

export default BlogManagement;
