import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
  onClick: () => void;
}

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ title, actions, className }: QuickActionsProps) {
  return (
    <Card className={cn("bg-metric-card border-metric-border", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || "outline"}
                className="h-auto flex flex-col items-center gap-2 p-4"
                onClick={action.onClick}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}