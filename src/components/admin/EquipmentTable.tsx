import { useState } from "react";
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
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EditEquipmentDialog from "./EditEquipmentDialog";

interface EquipmentTableProps {
  equipment: any[];
  onUpdate: () => void;
}

const EquipmentTable = ({ equipment, onUpdate }: EquipmentTableProps) => {
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (item: any) => {
    setEditingEquipment(item);
    setEditDialogOpen(true);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case "checked_out":
        return <Badge className="bg-info text-info-foreground">Checked Out</Badge>;
      case "under_repair":
        return <Badge className="bg-warning text-warning-foreground">Under Repair</Badge>;
      case "retired":
        return <Badge className="bg-destructive text-destructive-foreground">Retired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;

    try {
      const { error } = await supabase.from("equipment").delete().eq("id", id);
      if (error) throw error;
      toast.success("Equipment deleted successfully!");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No equipment found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.serial_number || "N/A"}
                </TableCell>
                <TableCell className="capitalize">{item.condition}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.location || "N/A"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {editingEquipment && (
        <EditEquipmentDialog
          equipment={editingEquipment}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
};

export default EquipmentTable;
