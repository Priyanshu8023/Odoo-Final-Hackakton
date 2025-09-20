import Header from "@/components/layout/Header";
import { PartnerLedger } from "@/components/dashboard/reports/PartnerLedger";

const PartnerLedgerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Partner Ledger" />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <PartnerLedger />
        </div>
      </main>
    </div>
  );
};

export default PartnerLedgerPage;