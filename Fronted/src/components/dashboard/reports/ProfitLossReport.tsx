import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ProfitLossReport() {
  // Sample data for Profit & Loss Report
  const profitLossData = [
    { type: "Income", account: "Sales Income A/c", amount: 23610.0 },
    { type: "Expense", account: "Purchase Expense A/c", amount: 17897.00 },
    { type: "Expense", account: "Other Expense A/c", amount: 5500.00 },
  ];

  // Calculate net profit
  const totalIncome = profitLossData.filter(item => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = profitLossData.filter(item => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2 bg-card border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-md font-medium">Profit & Loss Report</CardTitle>
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
              {profitLossData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.account}</TableCell>
                  <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Net Profit</span>
            <span className="text-sm font-medium">{netProfit.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}