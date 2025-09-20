import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
    <header className={cn("bg-card border-b border-metric-border shadow-custom-sm", className)}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">ManufactureOps</h1>
          </div>
          <Badge variant="outline" className="text-xs">
            Production Line A
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Last updated: 2 min ago</span>
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">John Doe</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}