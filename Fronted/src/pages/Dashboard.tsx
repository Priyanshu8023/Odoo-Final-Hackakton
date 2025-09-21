import { FinancialMetrics } from "@/components/dashboard/FinancialMetrics";
import Header from "@/components/layout/Header";

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <main className="p-8">
        {/* Financial Metrics - Only Section */}
        <FinancialMetrics />
      </main>
    </div>
  );
};

export default Dashboard;