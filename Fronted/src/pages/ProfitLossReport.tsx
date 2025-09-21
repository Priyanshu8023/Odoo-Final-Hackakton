import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Calendar, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import Header from "@/components/layout/Header";
import { apiClient } from "@/lib/api";

interface ProfitLossData {
  revenue: {
    total: number;
    items: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
  };
  expenses: {
    total: number;
    items: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
  };
  gross_profit: number;
  net_profit: number;
  profit_margin: number;
  period: {
    start_date: string;
    end_date: string;
  };
}

const ProfitLossReport = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportData, setReportData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(false);

  // Load report data when filters change
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getProfitLossReport({
          startDate: dateFrom || undefined,
          endDate: dateTo || undefined
        });
        
        if (response.success) {
          setReportData(response.data);
        }
      } catch (error) {
        console.error('Error loading P&L report:', error);
        // Fallback to sample data
        setReportData({
          revenue: {
            total: 150000,
            items: [
              { name: "Sales Revenue", amount: 120000, percentage: 80 },
              { name: "Service Revenue", amount: 30000, percentage: 20 }
            ]
          },
          expenses: {
            total: 95000,
            items: [
              { name: "Cost of Goods Sold", amount: 60000, percentage: 40 },
              { name: "Operating Expenses", amount: 25000, percentage: 16.67 },
              { name: "Administrative Expenses", amount: 10000, percentage: 6.67 }
            ]
          },
          gross_profit: 90000,
          net_profit: 55000,
          profit_margin: 36.67,
          period: {
            start_date: dateFrom || "2024-01-01",
            end_date: dateTo || "2024-12-31"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [dateFrom, dateTo]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && reportData) {
      let content = `
        <html>
          <head>
            <title>Profit & Loss Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .period { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .amount { text-align: right; }
              .total { font-weight: bold; background-color: #f9f9f9; }
              .profit { color: #059669; }
              .loss { color: #dc2626; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PROFIT & LOSS STATEMENT</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="period">
              <p><strong>Period:</strong> ${reportData.period.start_date} to ${reportData.period.end_date}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount (₹)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colspan="3"><strong>REVENUE</strong></td></tr>
      `;
      
      reportData.revenue.items.forEach(item => {
        content += `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
            <td class="amount">${item.percentage.toFixed(1)}%</td>
          </tr>
        `;
      });
      
      content += `
                <tr class="total">
                  <td><strong>Total Revenue</strong></td>
                  <td class="amount"><strong>${reportData.revenue.total.toLocaleString()}</strong></td>
                  <td class="amount"><strong>100%</strong></td>
                </tr>
                <tr><td colspan="3"><strong>EXPENSES</strong></td></tr>
      `;
      
      reportData.expenses.items.forEach(item => {
        content += `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
            <td class="amount">${item.percentage.toFixed(1)}%</td>
          </tr>
        `;
      });
      
      content += `
                <tr class="total">
                  <td><strong>Total Expenses</strong></td>
                  <td class="amount"><strong>${reportData.expenses.total.toLocaleString()}</strong></td>
                  <td class="amount"><strong>${((reportData.expenses.total / reportData.revenue.total) * 100).toFixed(1)}%</strong></td>
                </tr>
                <tr class="total">
                  <td><strong>Gross Profit</strong></td>
                  <td class="amount profit"><strong>${reportData.gross_profit.toLocaleString()}</strong></td>
                  <td class="amount"><strong>${((reportData.gross_profit / reportData.revenue.total) * 100).toFixed(1)}%</strong></td>
                </tr>
                <tr class="total">
                  <td><strong>Net Profit</strong></td>
                  <td class="amount ${reportData.net_profit >= 0 ? 'profit' : 'loss'}"><strong>${reportData.net_profit.toLocaleString()}</strong></td>
                  <td class="amount"><strong>${reportData.profit_margin.toFixed(1)}%</strong></td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    // TODO: Implement CSV/Excel download functionality
    console.log("Downloading P&L report data...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profit & Loss Report" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profit & Loss Report</h1>
          <p className="text-gray-600 mt-2">Financial performance analysis and profitability metrics</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Profit & Loss Statement</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date To</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Report Content */}
            {loading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading report data...
                </div>
              </div>
            ) : reportData ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Total Revenue</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{reportData.revenue.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Total Expenses</h4>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{reportData.expenses.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Gross Profit</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{reportData.gross_profit.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${reportData.net_profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h4 className={`font-semibold mb-2 ${reportData.net_profit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      Net Profit
                    </h4>
                    <p className={`text-2xl font-bold ${reportData.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{reportData.net_profit.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {reportData.profit_margin.toFixed(1)}% margin
                    </p>
                  </div>
                </div>

                {/* Revenue Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-green-800 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      REVENUE
                    </h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.revenue.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-green-600 font-medium">
                              ₹{item.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {item.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-green-50">
                        <TableCell className="font-bold">Total Revenue</TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-600 font-bold text-lg">
                            ₹{reportData.revenue.total.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Expenses Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-red-800 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      EXPENSES
                    </h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.expenses.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-red-600 font-medium">
                              ₹{item.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {item.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-red-50">
                        <TableCell className="font-bold">Total Expenses</TableCell>
                        <TableCell className="text-right">
                          <span className="text-red-600 font-bold text-lg">
                            ₹{reportData.expenses.total.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {((reportData.expenses.total / reportData.revenue.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Profit Summary */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-blue-800">PROFIT SUMMARY</h3>
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold">Gross Profit</TableCell>
                        <TableCell className="text-right">
                          <span className="text-blue-600 font-bold text-lg">
                            ₹{reportData.gross_profit.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {((reportData.gross_profit / reportData.revenue.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">Net Profit</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-bold text-lg ${reportData.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{reportData.net_profit.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {reportData.profit_margin.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No report data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfitLossReport;
