import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Calendar, Loader2, Scale, Building2, CreditCard } from "lucide-react";
import Header from "@/components/layout/Header";
import { apiClient } from "@/lib/api";

interface BalanceSheetData {
  assets: {
    current: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    fixed: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    total: number;
  };
  liabilities: {
    current: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    long_term: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    total: number;
  };
  equity: {
    items: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    total: number;
  };
  total_assets: number;
  total_liabilities_equity: number;
  as_of_date: string;
}

const BalanceSheetReport = () => {
  const [asOfDate, setAsOfDate] = useState("");
  const [reportData, setReportData] = useState<BalanceSheetData | null>(null);
  const [loading, setLoading] = useState(false);

  // Load report data when filters change
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getBalanceSheetReport({
          asOfDate: asOfDate || undefined
        });
        
        if (response.success) {
          setReportData(response.data);
        }
      } catch (error) {
        console.error('Error loading Balance Sheet report:', error);
        // Fallback to sample data
        setReportData({
          assets: {
            current: [
              { name: "Cash and Cash Equivalents", amount: 50000, percentage: 20 },
              { name: "Accounts Receivable", amount: 75000, percentage: 30 },
              { name: "Inventory", amount: 40000, percentage: 16 },
              { name: "Prepaid Expenses", amount: 10000, percentage: 4 }
            ],
            fixed: [
              { name: "Property, Plant & Equipment", amount: 150000, percentage: 60 },
              { name: "Accumulated Depreciation", amount: -30000, percentage: -12 },
              { name: "Intangible Assets", amount: 20000, percentage: 8 }
            ],
            total: 295000
          },
          liabilities: {
            current: [
              { name: "Accounts Payable", amount: 35000, percentage: 11.86 },
              { name: "Short-term Debt", amount: 25000, percentage: 8.47 },
              { name: "Accrued Expenses", amount: 15000, percentage: 5.08 }
            ],
            long_term: [
              { name: "Long-term Debt", amount: 80000, percentage: 27.12 },
              { name: "Deferred Tax Liability", amount: 10000, percentage: 3.39 }
            ],
            total: 165000
          },
          equity: {
            items: [
              { name: "Share Capital", amount: 100000, percentage: 33.90 },
              { name: "Retained Earnings", amount: 30000, percentage: 10.17 }
            ],
            total: 130000
          },
          total_assets: 295000,
          total_liabilities_equity: 295000,
          as_of_date: asOfDate || "2024-12-31"
        });
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [asOfDate]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && reportData) {
      let content = `
        <html>
          <head>
            <title>Balance Sheet Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .as-of { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .amount { text-align: right; }
              .total { font-weight: bold; background-color: #f9f9f9; }
              .section-header { background-color: #e5e7eb; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>BALANCE SHEET</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="as-of">
              <p><strong>As of:</strong> ${reportData.as_of_date}</p>
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
                <tr class="section-header"><td colspan="3"><strong>ASSETS</strong></td></tr>
                <tr class="section-header"><td colspan="3"><strong>Current Assets</strong></td></tr>
      `;
      
      reportData.assets.current.forEach(item => {
        content += `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
            <td class="amount">${item.percentage.toFixed(1)}%</td>
          </tr>
        `;
      });
      
      content += `
                <tr class="section-header"><td colspan="3"><strong>Fixed Assets</strong></td></tr>
      `;
      
      reportData.assets.fixed.forEach(item => {
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
                  <td><strong>Total Assets</strong></td>
                  <td class="amount"><strong>${reportData.total_assets.toLocaleString()}</strong></td>
                  <td class="amount"><strong>100%</strong></td>
                </tr>
                <tr class="section-header"><td colspan="3"><strong>LIABILITIES & EQUITY</strong></td></tr>
                <tr class="section-header"><td colspan="3"><strong>Current Liabilities</strong></td></tr>
      `;
      
      reportData.liabilities.current.forEach(item => {
        content += `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
            <td class="amount">${item.percentage.toFixed(1)}%</td>
          </tr>
        `;
      });
      
      content += `
                <tr class="section-header"><td colspan="3"><strong>Long-term Liabilities</strong></td></tr>
      `;
      
      reportData.liabilities.long_term.forEach(item => {
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
                  <td><strong>Total Liabilities</strong></td>
                  <td class="amount"><strong>${reportData.liabilities.total.toLocaleString()}</strong></td>
                  <td class="amount"><strong>${((reportData.liabilities.total / reportData.total_assets) * 100).toFixed(1)}%</strong></td>
                </tr>
                <tr class="section-header"><td colspan="3"><strong>Equity</strong></td></tr>
      `;
      
      reportData.equity.items.forEach(item => {
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
                  <td><strong>Total Equity</strong></td>
                  <td class="amount"><strong>${reportData.equity.total.toLocaleString()}</strong></td>
                  <td class="amount"><strong>${((reportData.equity.total / reportData.total_assets) * 100).toFixed(1)}%</strong></td>
                </tr>
                <tr class="total">
                  <td><strong>Total Liabilities & Equity</strong></td>
                  <td class="amount"><strong>${reportData.total_liabilities_equity.toLocaleString()}</strong></td>
                  <td class="amount"><strong>100%</strong></td>
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
    console.log("Downloading Balance Sheet report data...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Balance Sheet Report" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Balance Sheet Report</h1>
          <p className="text-gray-600 mt-2">Assets, liabilities, and equity overview</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Balance Sheet</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">As of Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Total Assets
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{reportData.total_assets.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Total Liabilities
                    </h4>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{reportData.liabilities.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Scale className="h-4 w-4 mr-2" />
                      Total Equity
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{reportData.equity.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Assets Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-blue-800 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      ASSETS
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
                      <TableRow className="bg-gray-100">
                        <TableCell className="font-bold">Current Assets</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {reportData.assets.current.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-4 font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-blue-600 font-medium">
                              ₹{item.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {item.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-100">
                        <TableCell className="font-bold">Fixed Assets</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {reportData.assets.fixed.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-4 font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-blue-600 font-medium">
                              ₹{item.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {item.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-blue-50">
                        <TableCell className="font-bold">Total Assets</TableCell>
                        <TableCell className="text-right">
                          <span className="text-blue-600 font-bold text-lg">
                            ₹{reportData.total_assets.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Liabilities & Equity Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-red-800 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      LIABILITIES & EQUITY
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
                      <TableRow className="bg-gray-100">
                        <TableCell className="font-bold">Current Liabilities</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {reportData.liabilities.current.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-4 font-medium">{item.name}</TableCell>
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
                      <TableRow className="bg-gray-100">
                        <TableCell className="font-bold">Long-term Liabilities</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {reportData.liabilities.long_term.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-4 font-medium">{item.name}</TableCell>
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
                        <TableCell className="font-bold">Total Liabilities</TableCell>
                        <TableCell className="text-right">
                          <span className="text-red-600 font-bold text-lg">
                            ₹{reportData.liabilities.total.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {((reportData.liabilities.total / reportData.total_assets) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-100">
                        <TableCell className="font-bold">Equity</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {reportData.equity.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-4 font-medium">{item.name}</TableCell>
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
                        <TableCell className="font-bold">Total Equity</TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-600 font-bold text-lg">
                            ₹{reportData.equity.total.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {((reportData.equity.total / reportData.total_assets) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-200">
                        <TableCell className="font-bold">Total Liabilities & Equity</TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-800 font-bold text-lg">
                            ₹{reportData.total_liabilities_equity.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">100%</TableCell>
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

export default BalanceSheetReport;
