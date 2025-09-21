import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Printer, X, CreditCard, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { PaymentService } from "@/services/paymentService";

const BillPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    paymentNo: "",
    paymentDate: new Date().toISOString().split('T')[0],
    vendorName: "",
    vendorBillNo: "",
    billAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    paymentMethod: "cash_on_delivery"
  });


  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load data from Vendor Bill if available
  useEffect(() => {
    const vendorBillData = sessionStorage.getItem('vendorBillData');
    if (vendorBillData) {
      try {
        const data = JSON.parse(vendorBillData);
        setFormData(prev => ({
          ...prev,
          vendorName: data.vendorName || "",
          vendorBillNo: data.vendorBillNo || "",
          billAmount: data.billAmount || 0,
          paidAmount: data.billAmount || 0, // Default to full amount
          balanceAmount: 0 // Will be calculated
        }));
      } catch (error) {
        console.error('Error parsing vendor bill data:', error);
      }
    }
  }, []);

  // Calculate balance amount when paid amount changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      balanceAmount: prev.billAmount - prev.paidAmount
    }));
  }, [formData.billAmount, formData.paidAmount]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  // Handle different payment methods
  const handleProcessPayment = async () => {
    if (!formData.paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    // Only handle cash on delivery
    await handleCashOnDeliveryPayment();
  };

  // Handle cash on delivery payment
  const handleCashOnDeliveryPayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing for cash on delivery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process payment using the new workflow
      console.log('Starting cash on delivery payment processing with data:', {
        invoiceNumber: formData.vendorBillNo,
        partnerName: formData.vendorName,
        amountPaid: formData.paidAmount,
        paymentMethod: formData.paymentMethod
      });

      const paymentResult = await PaymentService.processPayment({
        invoiceNumber: formData.vendorBillNo,
        partnerId: 'vendor-123', // In real app, get from form data
        partnerName: formData.vendorName,
        partnerEmail: 'vendor@example.com', // In real app, get from partner data
        partnerAddress: 'Vendor Address', // In real app, get from partner data
        amountPaid: formData.paidAmount,
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        transactionId: `COD-${Date.now()}` // Generate COD transaction ID
      });

      console.log('Payment processing result:', paymentResult);

      if (paymentResult.success && paymentResult.paymentData) {
        console.log('Payment successful, navigating to success page');
        toast({
          title: "Order Placed Successfully",
          description: `Your order has been placed successfully. Payment of ₹${formData.paidAmount.toFixed(2)} will be collected upon delivery.`,
        });
        
        // Navigate to success page with payment data
        navigate('/payment-success', { 
          state: paymentResult.paymentData 
        });
      } else {
        console.error('Payment processing failed:', paymentResult.error);
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "An error occurred while placing your order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving Bill Payment:", { formData, chequeBankDetails });
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print();
  };

  const handleCancel = () => {
    // Clear session storage and navigate back
    sessionStorage.removeItem('vendorBillData');
    navigate('/vendor-bill');
  };

  const handleBackToBill = () => {
    navigate('/vendor-bill');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" onClick={handleBackToBill}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendor Bill
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bill Payment</h1>
          <p className="text-gray-600 mt-2">Process payment for vendor bills</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="paymentNo">Payment No.</Label>
                <Input
                  id="paymentNo"
                  value={formData.paymentNo}
                  onChange={(e) => handleInputChange("paymentNo", e.target.value)}
                  placeholder="Enter Payment Number"
                />
              </div>
              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange("vendorName", e.target.value)}
                  placeholder="Vendor Name"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="vendorBillNo">Vendor Bill No.</Label>
                <Input
                  id="vendorBillNo"
                  value={formData.vendorBillNo}
                  onChange={(e) => handleInputChange("vendorBillNo", e.target.value)}
                  placeholder="Bill Number"
                  readOnly
                />
              </div>
            </div>

            {/* Amount Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="billAmount">Bill Amount</Label>
                <Input
                  id="billAmount"
                  type="number"
                  value={formData.billAmount}
                  onChange={(e) => handleInputChange("billAmount", Number(e.target.value))}
                  placeholder="0.00"
                  readOnly
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => handleInputChange("paidAmount", Number(e.target.value))}
                  placeholder="0.00"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="balanceAmount">Balance Amount</Label>
                <Input
                  id="balanceAmount"
                  type="number"
                  value={formData.balanceAmount}
                  placeholder="0.00"
                  readOnly
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select onValueChange={(value) => handleInputChange("paymentMethod", value)} value="cash_on_delivery">
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-green-600 mt-1">
                💰 Payment will be collected upon delivery
              </p>
            </div>


            {/* Payment Status Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Payment Information:</h4>
              <p className="text-sm text-blue-800">
                {formData.balanceAmount === 0 
                  ? "Full payment will be processed. Vendor bill status will be changed to 'Paid'."
                  : `Partial payment of ₹${formData.paidAmount.toFixed(2)}. Balance amount of ₹${formData.balanceAmount.toFixed(2)} will remain in the vendor bill.`
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                onClick={handleProcessPayment}
                disabled={isProcessingPayment || !formData.paymentMethod}
              >
                {isProcessingPayment ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                {isProcessingPayment ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillPayment;
