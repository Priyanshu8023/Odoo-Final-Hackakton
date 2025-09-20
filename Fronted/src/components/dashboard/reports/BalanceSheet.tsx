import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BalanceSheet() {
  // Sample data for Balance Sheet
  const balanceSheetData = [
    { type: "Liabilities", account: "Capital A/c", amount: 8752.0 },
    { type: "Assets", account: "Cash A/c", amount: 8752.0 },
    { type: "Assets", account: "Debtors A/c", amount: 0.0 },
    { type: "Liabilities", account: "Creditors A/c", amount: 0.0 },
  ];

  // Calculate totals
  const totalAssets = balanceSheetData.filter(item => item.type === "Assets").reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = balanceSheetData.filter(item => item.type === "Liabilities").reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2 bg-card border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-md font-medium">Balance Sheet</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balanceSheetData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.account}</TableCell>
                  <TableCell className="text-right">{item.amount.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-medium">{totalAssets.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}