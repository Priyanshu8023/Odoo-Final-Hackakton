import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusWidget } from "@/components/dashboard/StatusWidget";
import { ProductionChart } from "@/components/dashboard/ProductionChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import Header from "@/components/layout/Header";
import { 
  Factory, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Settings,
  Plus,
  Download,
  Upload
} from "lucide-react";

const Dashboard = () => {
  // Sample data for the dashboard
  const productionData = [
    { day: "Mon", planned: 100, actual: 95 },
    { day: "Tue", planned: 120, actual: 118 },
    { day: "Wed", planned: 110, actual: 108 },
    { day: "Thu", planned: 130, actual: 125 },
    { day: "Fri", planned: 115, actual: 119 },
    { day: "Sat", planned: 90, actual: 88 },
    { day: "Sun", planned: 80, actual: 82 },
  ];

  const equipmentStatus = [
    { id: "1", name: "CNC Machine #001", status: "operational" as const, lastUpdate: "2 min ago" },
    { id: "2", name: "Assembly Line A", status: "operational" as const, lastUpdate: "1 min ago" },
    { id: "3", name: "Quality Check Station", status: "warning" as const, lastUpdate: "5 min ago" },
    { id: "4", name: "Packaging Unit", status: "maintenance" as const, lastUpdate: "30 min ago" },
  ];

  const quickActions = [
    {
      id: "start",
      label: "Start Production",
      icon: Play,
      variant: "success" as const,
      onClick: () => console.log("Start production"),
    },
    {
      id: "pause",
      label: "Pause Line",
      icon: Pause,
      variant: "warning" as const,
      onClick: () => console.log("Pause line"),
    },
    {
      id: "reset",
      label: "Reset Counters",
      icon: RotateCcw,
      onClick: () => console.log("Reset counters"),
    },
    {
      id: "report",
      label: "Generate Report",
      icon: FileText,
      onClick: () => console.log("Generate report"),
    },
    {
      id: "settings",
      label: "Line Settings",
      icon: Settings,
      onClick: () => console.log("Line settings"),
    },
    {
      id: "add",
      label: "Add Order",
      icon: Plus,
      variant: "default" as const,
      onClick: () => console.log("Add order"),
    },
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header title="Dashboard" />
      
      <main className="p-6 space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Daily Production"
            value="1,247"
            change="+12.5% from yesterday"
            changeType="positive"
            icon={Factory}
            description="Units produced today"
          />
          <MetricCard
            title="Efficiency Rate"
            value="94.2%"
            change="+2.1% from last week"
            changeType="positive"
            icon={TrendingUp}
            description="Overall equipment effectiveness"
          />
          <MetricCard
            title="Downtime"
            value="23 min"
            change="-15 min from yesterday"
            changeType="positive"
            icon={Clock}
            description="Total downtime today"
          />
          <MetricCard
            title="Active Workers"
            value="28"
            change="All stations covered"
            changeType="neutral"
            icon={Users}
            description="On current shift"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Production Chart - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ProductionChart 
              title="Weekly Production Overview"
              data={productionData}
            />
          </div>
          
          {/* Quick Actions */}
          <QuickActions 
            title="Quick Actions"
            actions={quickActions}
          />
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equipment Status */}
          <StatusWidget
            title="Equipment Status"
            items={equipmentStatus}
          />
          
          {/* Recent Activities or Alerts */}
          <div className="space-y-4">
            <StatusWidget
              title="Recent Alerts"
              items={[
                { 
                  id: "alert1", 
                  name: "Temperature threshold exceeded", 
                  status: "warning" as const, 
                  lastUpdate: "5 min ago" 
                },
                { 
                  id: "alert2", 
                  name: "Maintenance due next week", 
                  status: "maintenance" as const, 
                  lastUpdate: "1 hour ago" 
                },
                { 
                  id: "alert3", 
                  name: "Quality check passed", 
                  status: "operational" as const, 
                  lastUpdate: "30 min ago" 
                },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;