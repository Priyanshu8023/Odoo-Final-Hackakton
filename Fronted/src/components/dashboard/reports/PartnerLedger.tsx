import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PartnerLedger() {
  // Sample data for Partner Ledger
  const partnerData = [
    { name: "Acme Industries", book: "Creditors A/c", reference: "INV/2023/001", date: "16/09/2023", amount: 14892.0 },
    { name: "Acme Industries", book: "Creditors A/c", reference: "PAYMENT", date: "16/09/2023", amount: -7489.0 },
    { name: "Pinnacle Tech", book: "Debtors A/c", reference: "INV/2023/002", date: "18/09/2023", amount: 23.0 },
    { name: "Pinnacle Tech", book: "Debtors A/c", reference: "PAYMENT", date: "18/09/2023", amount: -23.0 },
  ];

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2 bg-card border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-md font-medium">Partner Ledger</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Name</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.book}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">{item.amount.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-medium">7,403.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}