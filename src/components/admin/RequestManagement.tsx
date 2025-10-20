import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RequestsTable from "./RequestsTable";

interface RequestManagementProps {
  onUpdate: () => void;
}

const RequestManagement = ({ onUpdate }: RequestManagementProps) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("requests")
      .select(`
        *,
        equipment:equipment_id (name, type),
        profiles:user_id (full_name, email)
      `)
      .order("created_at", { ascending: false });
    
    if (data) setRequests(data);
    setLoading(false);
  };

  const handleUpdate = () => {
    fetchRequests();
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Management</CardTitle>
        <CardDescription>Review and manage equipment requests</CardDescription>
      </CardHeader>
      <CardContent>
        <RequestsTable requests={requests} onUpdate={handleUpdate} />
      </CardContent>
    </Card>
  );
};

export default RequestManagement;
