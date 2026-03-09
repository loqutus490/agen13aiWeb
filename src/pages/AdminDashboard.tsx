import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Filter, TrendingUp, FileText, FlaskConical, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import ContactSubmissionsTab from "@/components/admin/ContactSubmissionsTab";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  downloaded_resource: string;
  created_at: string;
}

interface ResourceStats {
  resource: string;
  count: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [stats, setStats] = useState<ResourceStats[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [deletingLeads, setDeletingLeads] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterLeads();
  }, [searchTerm, resourceFilter, leads]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('download_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads(data || []);
      calculateStats(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error("Failed to load leads");
      setLoading(false);
    }
  };

  const calculateStats = (data: Lead[]) => {
    const resourceCounts: { [key: string]: number } = {};
    data.forEach(lead => {
      resourceCounts[lead.downloaded_resource] = 
        (resourceCounts[lead.downloaded_resource] || 0) + 1;
    });

    const statsArray = Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count);

    setStats(statsArray);
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone_number.includes(searchTerm)
      );
    }

    if (resourceFilter !== "all") {
      filtered = filtered.filter(lead => 
        lead.downloaded_resource === resourceFilter
      );
    }

    setFilteredLeads(filtered);
  };

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Resource', 'Date'];
    const csvData = filteredLeads.map(lead => [
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.phone_number,
      lead.downloaded_resource,
      new Date(lead.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("CSV exported successfully");
  };

  const uniqueResources = [...new Set(leads.map(lead => lead.downloaded_resource))];

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <SEO title="Admin Dashboard" description="Manage leads, users, and site content from the agent13 ai admin dashboard." />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage download leads and view analytics</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/blog-management")}>
                <FileText className="w-4 h-4 mr-2" />Blog Management
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/internal-tests/content-ingestion")}>
                <FlaskConical className="w-4 h-4 mr-2" />Content Ingestion Test
              </Button>
            </div>
          </div>

          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList>
              <TabsTrigger value="leads">Download Leads</TabsTrigger>
              <TabsTrigger value="contact">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads">
              {/* Analytics Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Leads</h3>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{leads.length}</p>
                </Card>

                {stats.slice(0, 2).map((stat, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {index === 0 ? 'Most Popular' : '2nd Most Popular'}
                      </h3>
                      <Badge variant="secondary">{stat.count} downloads</Badge>
                    </div>
                    <p className="text-lg font-semibold truncate">{stat.resource}</p>
                  </Card>
                ))}
              </div>

              {/* Filters and Export */}
              <Card className="p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={resourceFilter} onValueChange={setResourceFilter}>
                    <SelectTrigger className="w-full md:w-[250px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by resource" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      {uniqueResources.map((resource, index) => (
                        <SelectItem key={index} value={resource}>
                          {resource}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={exportToCSV} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredLeads.length} of {leads.length} leads
                </div>
              </Card>

              {/* Leads Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No leads found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">
                              {lead.first_name} {lead.last_name}
                            </TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phone_number}</TableCell>
                            <TableCell>
                              <span className="text-sm">{lead.downloaded_resource}</span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Resource Analytics */}
              <Card className="mt-6 p-6">
                <h2 className="text-xl font-bold mb-4">Download Analytics</h2>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{stat.resource}</span>
                          <span className="text-sm text-muted-foreground">{stat.count} downloads</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ 
                              width: `${(stat.count / leads.length) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                      <Badge variant="outline">
                        {Math.round((stat.count / leads.length) * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <ContactSubmissionsTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
