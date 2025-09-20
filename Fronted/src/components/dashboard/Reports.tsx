import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerLedger } from "./reports/PartnerLedger";
import { ProfitLossReport } from "./reports/ProfitLossReport";
import { BalanceSheet } from "./reports/BalanceSheet";

interface ReportsProps {
  title: string;
}

export function Reports({ title }: ReportsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PartnerLedger />
          <ProfitLossReport />
          <BalanceSheet />
        </div>
      </CardContent>
    </Card>
  );
}