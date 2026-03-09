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
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { BlogImageUpload } from "@/components/BlogImageUpload";
import { Pencil, Trash2, Plus, Tag, Image as ImageIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { canTransitionStatus } from "@/lib/contentAutomation";

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
}

interface GenerationRun {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  selected_topic: string | null;
  error_message: string | null;
}

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

  const [formData, setFormData] = useState({
    slug: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0],
    category: "", author: "agent13 ai Team", published: false, tags: [] as string[], image_url: "",
    status: "pending_review", newsletter_status: "draft_generated",
  });

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) navigate("/");
      else Promise.all([fetchPosts(), fetchRuns()]).finally(() => setLoading(false));
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false });
    if (error) throw error;
    setPosts(data || []);
  };

  const fetchRuns = async () => {
    const { data, error } = await supabase.from("content_generation_runs").select("id,status,started_at,completed_at,selected_topic,error_message").order("started_at", { ascending: false }).limit(10);
    if (!error) setRuns(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) await supabase.from("blog_posts").update(formData).eq("id", editingPost.id);
      else await supabase.from("blog_posts").insert([{ ...formData, author_id: user?.id, created_by_system: false }]);
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
    const { error } = await supabase.from("blog_posts").update(patch).eq("id", post.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await fetchPosts();
  };

  const updateNewsletterStatus = async (post: BlogPost, newsletter_status: string) => {
    const { error } = await supabase.from("blog_posts").update({ newsletter_status }).eq("id", post.id);
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
    setFormData({ slug: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0], category: "", author: "agent13 ai Team", published: false, tags: [], image_url: "", status: "pending_review", newsletter_status: "draft_generated" });
    setEditingPost(null);
    setIsCreating(false);
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, date: post.date, category: post.category, author: post.author || "agent13 ai Team", published: post.published, tags: post.tags || [], image_url: post.image_url || "", status: post.status || "pending_review", newsletter_status: post.newsletter_status || "draft_generated" });
    setIsCreating(true);
  };

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
          <CardContent className="space-y-2">{runs.map((run) => <div className="flex justify-between text-sm" key={run.id}><span>{run.selected_topic || "Pending topic selection"}</span><Badge variant={run.status === "failed" ? "destructive" : "secondary"}>{run.status}</Badge></div>)}</CardContent>
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

        <div className="space-y-4"><h2 className="text-2xl font-bold">All Posts</h2>{posts.map((post) => <Card key={post.id}><CardHeader><div className="flex justify-between items-start"><div className="flex-1"><CardTitle>{post.title}</CardTitle><CardDescription>{post.category} • {new Date(post.date).toLocaleDateString()} • {post.published ? " Published" : " Draft"}</CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{post.status || "pending_review"}</Badge>
            <Badge variant="secondary">Newsletter: {post.newsletter_status || "draft_generated"}</Badge>
            {post.created_by_system && <Badge>System Draft</Badge>}
            {post.primary_keyword && <Badge variant="outline">SEO: {post.primary_keyword}</Badge>}
            {post.image_url && <Badge variant="secondary" className="text-xs"><ImageIcon className="w-3 h-3 mr-1" />Has image</Badge>}
          </div>
          {post.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{post.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs"><Tag className="w-3 h-3 mr-1" />{tag}</Badge>)}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" onClick={() => startEdit(post)}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDeletePostId(post.id)}><Trash2 className="w-4 h-4" /></Button>
          </div></div></CardHeader>
          <CardContent><p className="text-muted-foreground mb-3">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => updateStatus(post, "approved", false)}>Approve</Button>
              <Button size="sm" onClick={() => updateStatus(post, "published", true)}>Publish</Button>
              <Button size="sm" variant="outline" onClick={() => updateNewsletterStatus(post, "newsletter_approved")}>Approve Newsletter</Button>
            </div>
          </CardContent>
        </Card>)}</div>
      </div>
    </div>
    <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
      <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
    </AlertDialog>
    <Footer />
  </div>;
};

export default BlogManagement;
