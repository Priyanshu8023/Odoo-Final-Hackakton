import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Printer, X, CreditCard } from "lucide-react";
import Header from "@/components/layout/Header";

const BillPayment = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    paymentNo: "",
    paymentDate: new Date().toISOString().split('T')[0],
    vendorName: "",
    vendorBillNo: "",
    billAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    paymentMethod: ""
  });

  const [chequeBankDetails, setChequeBankDetails] = useState({
    chequeNo: "",
    chequeDate: "",
    bankName: "",
    branch: ""
  });

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

  const handleChequeBankChange = (field: string, value: string) => {
    setChequeBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
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

  const showChequeBankFields = formData.paymentMethod === 'cheque' || formData.paymentMethod === 'bank';

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
              <Select onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cheque/Bank Details - Show conditionally */}
            {showChequeBankFields && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {formData.paymentMethod === 'cheque' ? 'Cheque Details' : 'Bank Details'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.paymentMethod === 'cheque' && (
                    <>
                      <div>
                        <Label htmlFor="chequeNo">Cheque No.</Label>
                        <Input
                          id="chequeNo"
                          value={chequeBankDetails.chequeNo}
                          onChange={(e) => handleChequeBankChange("chequeNo", e.target.value)}
                          placeholder="Enter Cheque Number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chequeDate">Cheque Date</Label>
                        <Input
                          id="chequeDate"
                          type="date"
                          value={chequeBankDetails.chequeDate}
                          onChange={(e) => handleChequeBankChange("chequeDate", e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={chequeBankDetails.bankName}
                      onChange={(e) => handleChequeBankChange("bankName", e.target.value)}
                      placeholder="Enter Bank Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={chequeBankDetails.branch}
                      onChange={(e) => handleChequeBankChange("branch", e.target.value)}
                      placeholder="Enter Branch"
                    />
                  </div>
                </div>
              </div>
            )}

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
              <Button onClick={handleSave}>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillPayment;
