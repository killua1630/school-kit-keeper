import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface RequestsTableProps {
  requests: any[];
  onUpdate: () => void;
}

const RequestsTable = ({ requests, onUpdate }: RequestsTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      case "returned":
        return <Badge className="bg-info text-info-foreground">Returned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApprove = async (requestId: string, equipmentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update request status
      const { error: requestError } = await supabase
        .from("requests")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: user.id,
        })
        .eq("id", requestId);

      if (requestError) throw requestError;

      // Update equipment status
      const { error: equipmentError } = await supabase
        .from("equipment")
        .update({ status: "checked_out" })
        .eq("id", equipmentId);

      if (equipmentError) throw equipmentError;

      toast.success("Request approved successfully!");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("requests")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Request rejected");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReturn = async (requestId: string, equipmentId: string) => {
    try {
      // Update request status
      const { error: requestError } = await supabase
        .from("requests")
        .update({
          status: "returned",
          returned_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (requestError) throw requestError;

      // Update equipment status
      const { error: equipmentError } = await supabase
        .from("equipment")
        .update({ status: "available" })
        .eq("id", equipmentId);

      if (equipmentError) throw equipmentError;

      toast.success("Equipment returned successfully!");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No requests found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{request.profiles?.full_name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.profiles?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{request.equipment?.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.equipment?.type}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(request.borrow_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(request.return_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(request.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApprove(request.id, request.equipment_id)}
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReject(request.id)}
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                  {request.status === "approved" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReturn(request.id, request.equipment_id)}
                      title="Mark as Returned"
                    >
                      <RotateCcw className="h-4 w-4 text-info" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestsTable;
