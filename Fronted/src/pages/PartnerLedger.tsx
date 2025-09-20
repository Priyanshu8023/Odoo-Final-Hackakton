import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Printer, Search, Download, Calendar, User, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { apiClient } from "@/lib/api";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  type: 'invoice' | 'payment' | 'credit_note' | 'debit_note';
}

const PartnerLedger = () => {
  const [selectedPartner, setSelectedPartner] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [partners, setPartners] = useState<Array<{id: string; name: string; type: string; email?: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total_debit: 0,
    total_credit: 0,
    current_balance: 0
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'credit_note':
        return 'bg-yellow-100 text-yellow-800';
      case 'debit_note':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'Invoice';
      case 'payment':
        return 'Payment';
      case 'credit_note':
        return 'Credit Note';
      case 'debit_note':
        return 'Debit Note';
      default:
        return type;
    }
  };

  // Load partners on component mount
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await apiClient.getPartners();
        if (response.success) {
          setPartners(response.data.contacts.map(contact => ({
            id: contact._id,
            name: contact.name,
            type: contact.type.join(', '),
            email: contact.email
          })));
        }
      } catch (error) {
        console.error('Error loading partners:', error);
      }
    };
    loadPartners();
  }, []);

  // Load ledger data when filters change
  useEffect(() => {
    const loadLedgerData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getPartnerLedger({
          partnerId: selectedPartner || undefined,
          startDate: dateFrom || undefined,
          endDate: dateTo || undefined,
          search: searchTerm || undefined
        });
        
        if (response.success) {
          setLedgerEntries(response.data.entries);
          setSummary(response.data.summary);
        }
      } catch (error) {
        console.error('Error loading ledger data:', error);
        // Fallback to empty data
        setLedgerEntries([]);
        setSummary({ total_debit: 0, total_credit: 0, current_balance: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadLedgerData();
  }, [selectedPartner, dateFrom, dateTo, searchTerm]);

  const filteredEntries = ledgerEntries;
  const totalDebit = summary.total_debit;
  const totalCredit = summary.total_credit;
  const currentBalance = summary.current_balance;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let content = `
        <html>
          <head>
            <title>Partner Ledger Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .partner-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .debit { text-align: right; color: #dc2626; }
              .credit { text-align: right; color: #059669; }
              .balance { text-align: right; font-weight: bold; }
              .summary { margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PARTNER LEDGER REPORT</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="partner-info">
              <h3>Partner: ${selectedPartner || 'All Partners'}</h3>
              <p>Period: ${dateFrom || 'All Time'} to ${dateTo || 'Present'}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
      `;
      
      filteredEntries.forEach(entry => {
        content += `
          <tr>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td>${entry.description}</td>
            <td>${entry.reference}</td>
            <td>${getTypeLabel(entry.type)}</td>
            <td class="debit">${entry.debit > 0 ? '₹' + entry.debit.toLocaleString() : '-'}</td>
            <td class="credit">${entry.credit > 0 ? '₹' + entry.credit.toLocaleString() : '-'}</td>
            <td class="balance">₹${entry.balance.toLocaleString()}</td>
          </tr>
        `;
      });
      
      content += `
              </tbody>
            </table>
            <div class="summary">
              <h3>Summary</h3>
              <p><strong>Total Debit:</strong> ₹${totalDebit.toLocaleString()}</p>
              <p><strong>Total Credit:</strong> ₹${totalCredit.toLocaleString()}</p>
              <p><strong>Current Balance:</strong> ₹${currentBalance.toLocaleString()}</p>
            </div>
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
    console.log("Downloading partner ledger data...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Partner Ledger" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Partner Ledger</h1>
          <p className="text-gray-600 mt-2">View partner transaction history and balances</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Partner Ledger Report</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Partner</label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Partners</SelectItem>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name} ({partner.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          Loading ledger data...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No ledger entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{entry.description}</TableCell>
                      <TableCell>{entry.reference}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(entry.type)}>
                          {getTypeLabel(entry.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.debit > 0 ? (
                          <span className="text-red-600 font-medium">
                            ₹{entry.debit.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.credit > 0 ? (
                          <span className="text-green-600 font-medium">
                            ₹{entry.credit.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{entry.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Total Debit</h4>
                <p className="text-2xl font-bold text-red-600">
                  ₹{totalDebit.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Total Credit</h4>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalCredit.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Current Balance</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{currentBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Entry Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredEntries.length} of {ledgerEntries.length} entries
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerLedger;
