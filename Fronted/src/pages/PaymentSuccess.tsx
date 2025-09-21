import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Printer, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { PDFGenerator, InvoiceData } from '@/utils/pdfGenerator';

interface PaymentSuccessData {
  paymentId: string;
  invoiceNumber: string;
  partnerName: string;
  partnerEmail?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  status: 'success' | 'pending' | 'failed';
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment data from location state or URL params
    const state = location.state as PaymentSuccessData;
    if (state) {
      setPaymentData(state);
      setLoading(false);
    } else {
      // If no state, try to get from URL params
      const urlParams = new URLSearchParams(location.search);
      const paymentId = urlParams.get('paymentId');
      if (paymentId) {
        // In a real app, you'd fetch payment details from API
        setPaymentData({
          paymentId,
          invoiceNumber: urlParams.get('invoiceNumber') || 'N/A',
          partnerName: urlParams.get('partnerName') || 'N/A',
          partnerEmail: urlParams.get('partnerEmail') || undefined,
          amountPaid: parseFloat(urlParams.get('amountPaid') || '0'),
          paymentDate: urlParams.get('paymentDate') || new Date().toISOString(),
          paymentMethod: urlParams.get('paymentMethod') || 'N/A',
          transactionId: urlParams.get('transactionId') || undefined,
          status: 'success'
        });
        setLoading(false);
      } else {
        // Redirect to dashboard if no payment data
        navigate('/dashboard');
      }
    }
  }, [location, navigate]);

  const handleDownloadPDF = () => {
    if (!paymentData) return;
    
    // Create invoice data for PDF generation
    const invoiceData: InvoiceData = {
      invoiceNumber: paymentData.invoiceNumber,
      partnerName: paymentData.partnerName,
      partnerEmail: paymentData.partnerEmail,
      invoiceDate: paymentData.paymentDate,
      dueDate: paymentData.paymentDate,
      items: [{
        description: `Payment for Invoice ${paymentData.invoiceNumber}`,
        quantity: 1,
        rate: paymentData.amountPaid,
        amount: paymentData.amountPaid
      }],
      subtotal: paymentData.amountPaid,
      totalTax: 0,
      grandTotal: paymentData.amountPaid,
      amountPaid: paymentData.amountPaid,
      balanceDue: 0,
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId
    };
    
    PDFGenerator.downloadPDF(invoiceData, `payment-${paymentData.paymentId}.pdf`);
  };

  const handlePrint = () => {
    if (!paymentData) return;
    
    // Create invoice data for PDF generation
    const invoiceData: InvoiceData = {
      invoiceNumber: paymentData.invoiceNumber,
      partnerName: paymentData.partnerName,
      partnerEmail: paymentData.partnerEmail,
      invoiceDate: paymentData.paymentDate,
      dueDate: paymentData.paymentDate,
      items: [{
        description: `Payment for Invoice ${paymentData.invoiceNumber}`,
        quantity: 1,
        rate: paymentData.amountPaid,
        amount: paymentData.amountPaid
      }],
      subtotal: paymentData.amountPaid,
      totalTax: 0,
      grandTotal: paymentData.amountPaid,
      amountPaid: paymentData.amountPaid,
      balanceDue: 0,
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId
    };
    
    PDFGenerator.printInvoice(invoiceData);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewInvoice = () => {
    navigate('/invoices');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Payment Processing" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Payment Error" />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Data Not Found</h1>
              <p className="text-gray-600 mb-6">Unable to retrieve payment information.</p>
              <Button onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Payment Success" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Your order has been placed successfully. Payment will be collected upon delivery.</p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order ID</label>
                  <p className="text-lg font-semibold">{paymentData.paymentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                  <p className="text-lg font-semibold">{paymentData.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vendor</label>
                  <p className="text-lg font-semibold">{paymentData.partnerName}</p>
                  {paymentData.partnerEmail && (
                    <p className="text-sm text-gray-600">{paymentData.partnerEmail}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Amount</label>
                  <p className="text-2xl font-bold text-green-600">₹{paymentData.amountPaid.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Date</label>
                  <p className="text-lg font-semibold">
                    {new Date(paymentData.paymentDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <p className="text-lg font-semibold">{paymentData.paymentMethod}</p>
                </div>
                {paymentData.transactionId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-lg font-semibold font-mono">{paymentData.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  {paymentData.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Payment completed successfully
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Invoice PDF has been generated</li>
                <li>• Payment added to Profit & Loss report</li>
                <li>• Partner status updated to Paid</li>
                <li>• Transaction recorded in system</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleDownloadPDF} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button onClick={handleViewInvoice} variant="outline" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            View Invoice
          </Button>
          <Button onClick={handleBackToDashboard} variant="outline" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
