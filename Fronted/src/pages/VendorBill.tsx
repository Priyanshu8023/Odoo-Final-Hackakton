import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, Printer, X, ArrowLeft, CreditCard } from "lucide-react";
import Header from "@/components/layout/Header";

interface VendorBillItem {
  id: string;
  srNo: number;
  product: string;
  unit: string;
  qty: number;
  rate: number;
  discount: number;
  tax: number;
  amount: number;
}

const VendorBill = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    vendorBillNo: "20230701-0001", // Pre-filled as shown in design
    billDate: new Date().toISOString().split('T')[0],
    vendorName: "",
    billRefNo: "",
    billRefDate: "",
    dueDate: "",
    billingOrPayWithin: ""
  });

  const [items, setItems] = useState<VendorBillItem[]>([
    {
      id: "1",
      srNo: 1,
      product: "",
      unit: "",
      qty: 0,
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0
    }
  ]);

  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Load data from Purchase Order if available
  useEffect(() => {
    const purchaseOrderData = sessionStorage.getItem('purchaseOrderData');
    if (purchaseOrderData) {
      try {
        const data = JSON.parse(purchaseOrderData);
        setFormData(prev => ({
          ...prev,
          vendorName: data.vendorName || "",
          billRefNo: data.vendorRefNo || ""
        }));
        
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (error) {
        console.error('Error parsing purchase order data:', error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (id: string, field: keyof VendorBillItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when qty, rate, discount, or tax changes
        if (['qty', 'rate', 'discount', 'tax'].includes(field)) {
          const qty = field === 'qty' ? Number(value) : item.qty;
          const rate = field === 'rate' ? Number(value) : item.rate;
          const discount = field === 'discount' ? Number(value) : item.discount;
          const tax = field === 'tax' ? Number(value) : item.tax;
          
          const subtotal = qty * rate;
          const discountAmount = (subtotal * discount) / 100;
          const taxableAmount = subtotal - discountAmount;
          const taxAmount = (taxableAmount * tax) / 100;
          updatedItem.amount = taxableAmount + taxAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const addNewItem = () => {
    const newItem: VendorBillItem = {
      id: Date.now().toString(),
      srNo: items.length + 1,
      product: "",
      unit: "",
      qty: 0,
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    // Update serial numbers
    setItems(prev => prev.map((item, index) => ({ ...item, srNo: index + 1 })));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving Vendor Bill:", { formData, items });
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print();
  };

  const handleCancel = () => {
    // Clear session storage and navigate back
    sessionStorage.removeItem('purchaseOrderData');
    navigate('/purchase-order');
  };

  const handleBackToPO = () => {
    navigate('/purchase-order');
  };

  const handlePay = () => {
    // Navigate to bill payment page with current bill data
    const billPaymentData = {
      vendorBillNo: formData.vendorBillNo,
      vendorName: formData.vendorName,
      billAmount: getTotalAmount(),
      billDate: formData.billDate,
      dueDate: formData.dueDate
    };
    
    // Store data in sessionStorage to pass to bill payment page
    sessionStorage.setItem('vendorBillData', JSON.stringify(billPaymentData));
    navigate('/bill-payment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" onClick={handleBackToPO}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Purchase Order
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Bill</h1>
          <p className="text-gray-600 mt-2">Create and manage vendor bills</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Bill Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="vendorBillNo">Vendor Bill No.</Label>
                <Input
                  id="vendorBillNo"
                  value={formData.vendorBillNo}
                  onChange={(e) => handleInputChange("vendorBillNo", e.target.value)}
                  placeholder="20230701-0001"
                />
              </div>
              <div>
                <Label htmlFor="billDate">Bill Date</Label>
                <Input
                  id="billDate"
                  type="date"
                  value={formData.billDate}
                  onChange={(e) => handleInputChange("billDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Select onValueChange={(value) => handleInputChange("vendorName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor1">ABC Suppliers</SelectItem>
                    <SelectItem value="vendor2">XYZ Corporation</SelectItem>
                    <SelectItem value="vendor3">DEF Industries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billRefNo">Bill Ref No.</Label>
                <Input
                  id="billRefNo"
                  value={formData.billRefNo}
                  onChange={(e) => handleInputChange("billRefNo", e.target.value)}
                  placeholder="Bill Reference"
                />
              </div>
              <div>
                <Label htmlFor="billRefDate">Bill Ref Date</Label>
                <Input
                  id="billRefDate"
                  type="date"
                  value={formData.billRefDate}
                  onChange={(e) => handleInputChange("billRefDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billingOrPayWithin">Billing or Pay within</Label>
                <Input
                  id="billingOrPayWithin"
                  value={formData.billingOrPayWithin}
                  onChange={(e) => handleInputChange("billingOrPayWithin", e.target.value)}
                  placeholder="e.g., 30 days"
                />
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button onClick={addNewItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Sr. No.</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-24">Unit</TableHead>
                      <TableHead className="w-24">Qty</TableHead>
                      <TableHead className="w-24">Rate</TableHead>
                      <TableHead className="w-24">Discount %</TableHead>
                      <TableHead className="w-24">Tax %</TableHead>
                      <TableHead className="w-24">Amount</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.srNo}</TableCell>
                        <TableCell>
                          <Select 
                            value={item.product} 
                            onValueChange={(value) => handleItemChange(item.id, 'product', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="product1">Product A</SelectItem>
                              <SelectItem value="product2">Product B</SelectItem>
                              <SelectItem value="product3">Product C</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.unit} 
                            onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pcs">Pcs</SelectItem>
                              <SelectItem value="kg">Kg</SelectItem>
                              <SelectItem value="m">Meter</SelectItem>
                              <SelectItem value="l">Liter</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(item.id, 'discount', Number(e.target.value))}
                            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.tax}
                            onChange={(e) => handleItemChange(item.id, 'tax', Number(e.target.value))}
                            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ₹{item.amount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total Section */}
              <div className="flex justify-end mt-4">
                <div className="w-64">
                  <div className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
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
              <Button variant="outline" onClick={handlePay}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorBill;
