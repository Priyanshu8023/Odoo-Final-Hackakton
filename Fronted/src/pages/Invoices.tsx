import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Search, Eye, Download, Filter } from "lucide-react";
import Header from "@/components/layout/Header";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  type: 'sales' | 'purchase';
}

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Sample invoice data
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customerName: "ABC Company Ltd",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 15000.00,
      status: 'paid',
      type: 'sales'
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      customerName: "XYZ Corporation",
      date: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 25000.00,
      status: 'pending',
      type: 'sales'
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      customerName: "DEF Industries",
      date: "2024-01-10",
      dueDate: "2024-02-10",
      amount: 18000.00,
      status: 'overdue',
      type: 'sales'
    },
    {
      id: "4",
      invoiceNumber: "PO-2024-001",
      customerName: "Supplier ABC",
      date: "2024-01-25",
      dueDate: "2024-02-25",
      amount: 12000.00,
      status: 'draft',
      type: 'purchase'
    },
    {
      id: "5",
      invoiceNumber: "INV-2024-004",
      customerName: "GHI Solutions",
      date: "2024-01-30",
      dueDate: "2024-03-01",
      amount: 32000.00,
      status: 'paid',
      type: 'sales'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales':
        return 'bg-blue-100 text-blue-800';
      case 'purchase':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handlePrint = (invoice: Invoice) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-details { margin-bottom: 20px; }
              .customer-details { margin-bottom: 20px; }
              .amount { font-size: 18px; font-weight: bold; }
              .status { padding: 4px 8px; border-radius: 4px; }
              .paid { background-color: #d1fae5; color: #065f46; }
              .pending { background-color: #fef3c7; color: #92400e; }
              .overdue { background-color: #fee2e2; color: #991b1b; }
              .draft { background-color: #f3f4f6; color: #374151; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE</h1>
              <h2>${invoice.invoiceNumber}</h2>
            </div>
            <div class="invoice-details">
              <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span class="status ${invoice.status}">${invoice.status.toUpperCase()}</span></p>
            </div>
            <div class="customer-details">
              <p><strong>Customer:</strong> ${invoice.customerName}</p>
              <p><strong>Type:</strong> ${invoice.type.toUpperCase()}</p>
            </div>
            <div class="amount">
              <p><strong>Amount:</strong> ₹${invoice.amount.toLocaleString()}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintAll = () => {
    // Print all filtered invoices
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let content = `
        <html>
          <head>
            <title>All Invoices</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .status { padding: 2px 6px; border-radius: 3px; font-size: 12px; }
              .paid { background-color: #d1fae5; color: #065f46; }
              .pending { background-color: #fef3c7; color: #92400e; }
              .overdue { background-color: #fee2e2; color: #991b1b; }
              .draft { background-color: #f3f4f6; color: #374151; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE LIST</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
      `;
      
      filteredInvoices.forEach(invoice => {
        content += `
          <tr>
            <td>${invoice.invoiceNumber}</td>
            <td>${invoice.customerName}</td>
            <td>${new Date(invoice.date).toLocaleDateString()}</td>
            <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
            <td>₹${invoice.amount.toLocaleString()}</td>
            <td><span class="status ${invoice.status}">${invoice.status.toUpperCase()}</span></td>
            <td>${invoice.type.toUpperCase()}</td>
          </tr>
        `;
      });
      
      content += `
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

  const handleView = (invoice: Invoice) => {
    // TODO: Implement view functionality
    console.log("Viewing invoice:", invoice);
  };

  const handleDownload = (invoice: Invoice) => {
    // TODO: Implement download functionality
    console.log("Downloading invoice:", invoice);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Invoices" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">View and manage all invoices</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Invoice List</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handlePrintAll} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(invoice.type)}>
                          {invoice.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(invoice)}
                            title="View Invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint(invoice)}
                            title="Print Invoice"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(invoice)}
                            title="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
              <p>Showing {filteredInvoices.length} of {invoices.length} invoices</p>
              <p>
                Total Amount: ₹{filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invoices;
