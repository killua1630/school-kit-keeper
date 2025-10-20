import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import RequestEquipmentDialog from "./RequestEquipmentDialog";

interface EquipmentCardProps {
  equipment: any;
  onRequestSuccess: () => void;
}

const EquipmentCard = ({ equipment, onRequestSuccess }: EquipmentCardProps) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent": return "bg-success text-success-foreground";
      case "good": return "bg-info text-info-foreground";
      case "fair": return "bg-warning text-warning-foreground";
      case "poor": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="h-48 bg-muted flex items-center justify-center">
          {equipment.photo_url ? (
            <img
              src={equipment.photo_url}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1">{equipment.name}</h3>
            <Badge className={getConditionColor(equipment.condition)}>
              {equipment.condition}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{equipment.type}</p>
          {equipment.location && (
            <p className="text-xs text-muted-foreground">📍 {equipment.location}</p>
          )}
          {equipment.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {equipment.description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <RequestEquipmentDialog equipment={equipment} onSuccess={onRequestSuccess} />
      </CardFooter>
    </Card>
  );
};

export default EquipmentCard;
