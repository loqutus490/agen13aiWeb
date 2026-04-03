import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, Search, Trash2, TrendingUp, Mail } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

const NewsletterSubscribersTab = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers" as any)
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      setSubscribers((data as any) || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subscribers.filter((s) => !s.unsubscribed_at).length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} subscriber(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .delete()
        .in("id", Array.from(selectedIds));
      if (error) throw error;
      setSubscribers((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
      toast.success(`Deleted ${selectedIds.size} subscriber(s)`);
    } catch (err) {
      console.error("Error deleting subscribers:", err);
      toast.error("Failed to delete subscribers");
    } finally {
      setDeleting(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Subscribed Date", "Status"];
    const rows = filtered.map((s) => [
      s.email,
      new Date(s.subscribed_at).toLocaleDateString(),
      s.unsubscribed_at ? "Unsubscribed" : "Active",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  if (loading) {
    return <div className="animate-pulse text-center py-8">Loading subscribers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Subscribers</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold">{subscribers.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active</h3>
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold">{activeCount}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Unsubscribed</h3>
          </div>
          <p className="text-3xl font-bold">{subscribers.length - activeCount}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedIds.size > 0 && (
            <Button onClick={deleteSelected} variant="destructive" disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filtered.length} of {subscribers.length} subscribers
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No subscribers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id} data-state={selectedIds.has(s.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(s.id)}
                        onCheckedChange={() => toggleSelect(s.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(s.subscribed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {s.unsubscribed_at ? (
                        <Badge variant="secondary">Unsubscribed</Badge>
                      ) : (
                        <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default NewsletterSubscribersTab;
