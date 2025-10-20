import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AddEquipmentDialog from "./AddEquipmentDialog";
import EquipmentTable from "./EquipmentTable";

interface EquipmentManagementProps {
  onUpdate: () => void;
}

const EquipmentManagement = ({ onUpdate }: EquipmentManagementProps) => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    const { data } = await supabase
      .from("equipment")
      .select("*")
      .order("name");
    
    if (data) setEquipment(data);
    setLoading(false);
  };

  const handleSuccess = () => {
    fetchEquipment();
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Equipment Management</CardTitle>
            <CardDescription>Manage your inventory items</CardDescription>
          </div>
          <AddEquipmentDialog onSuccess={handleSuccess} />
        </div>
      </CardHeader>
      <CardContent>
        <EquipmentTable equipment={equipment} onUpdate={handleSuccess} />
      </CardContent>
    </Card>
  );
};

export default EquipmentManagement;
