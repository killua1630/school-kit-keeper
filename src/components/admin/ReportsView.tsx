import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const ReportsView = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: requests } = await supabase.from("requests").select("status");

    if (requests) {
      setStats({
        totalRequests: requests.length,
        approvedRequests: requests.filter(r => r.status === "approved").length,
        pendingRequests: requests.filter(r => r.status === "pending").length,
        rejectedRequests: requests.filter(r => r.status === "rejected").length,
      });
    }
  };

  const exportToCSV = async () => {
    try {
      const { data: requests } = await supabase
        .from("requests")
        .select(`
          *,
          equipment:equipment_id (name, type)
        `)
        .order("created_at", { ascending: false });
      
      // Fetch user profiles separately
      const userIds = [...new Set(requests?.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      if (!requests) throw new Error("No data to export");

      // Create CSV content
      const profileMap = new Map(profiles?.map(p => [p.id, p]));
      
      const headers = ["User", "Email", "Equipment", "Type", "Borrow Date", "Return Date", "Status", "Requested At"];
      const rows = requests.map(r => {
        const profile = profileMap.get(r.user_id);
        return [
          profile?.full_name || "N/A",
          profile?.email || "N/A",
          r.equipment?.name || "N/A",
          r.equipment?.type || "N/A",
          new Date(r.borrow_date).toLocaleDateString(),
          new Date(r.return_date).toLocaleDateString(),
          r.status,
          new Date(r.created_at).toLocaleDateString(),
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `equipment-requests-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();

      toast.success("Report exported successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>View system statistics and export reports</CardDescription>
            </div>
            <Button onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRequests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {stats.approvedRequests}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">
                  {stats.pendingRequests}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {stats.rejectedRequests}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsView;
