import Header from "@/components/layout/Header";
import { ProfitLossReport } from "@/components/dashboard/reports/ProfitLossReport";

const ProfitLossPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profit & Loss Report" />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <ProfitLossReport />
        </div>
      </main>
    </div>
  );
};

export default ProfitLossPage;