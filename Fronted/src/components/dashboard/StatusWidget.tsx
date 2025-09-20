import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusItem {
  id: string;
  name: string;
  status: "operational" | "warning" | "critical" | "maintenance";
  lastUpdate: string;
}

interface StatusWidgetProps {
  title: string;
  items: StatusItem[];
  className?: string;
}

export function StatusWidget({ title, items, className }: StatusWidgetProps) {
  const getStatusVariant = (status: StatusItem["status"]) => {
    switch (status) {
      case "operational":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "maintenance":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: StatusItem["status"]) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "warning":
        return "Warning";
      case "critical":
        return "Critical";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className={cn("bg-metric-card border-metric-border", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.lastUpdate}</p>
            </div>
            <Badge className={cn("text-xs", getStatusVariant(item.status))}>
              {getStatusText(item.status)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}