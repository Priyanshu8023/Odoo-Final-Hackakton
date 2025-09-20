import Header from "@/components/layout/Header";
import { BalanceSheet } from "@/components/dashboard/reports/BalanceSheet";

const BalanceSheetPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Balance Sheet" />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <BalanceSheet />
        </div>
      </main>
    </div>
  );
};

export default BalanceSheetPage;