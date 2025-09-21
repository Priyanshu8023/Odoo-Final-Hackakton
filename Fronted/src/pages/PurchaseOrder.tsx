import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, Printer, X, FileText, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import { VendorSelector } from "@/components/purchase/VendorSelector";
import { ProductSelector } from "@/components/purchase/ProductSelector";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrderItem {
  id: string;
  srNo: number;
  product: string;
  productId?: string;
  productName?: string;
  qty: number;
  rate: number;
  discount: number;
  tax: number;
  taxRate?: number;
  taxName?: string;
  amount: number;
}

const PurchaseOrder = () => {
  const navigate = useNavigate();
  const { refreshContacts, contacts } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: new Date().toISOString().split('T')[0],
    vendorId: "",
    vendorName: "",
    vendorEmail: "",
    vendorMobile: "",
    vendorAddress: "",
    poRefDate: "",
    billTo: "",
    shipTo: "",
    deliveryDate: ""
  });

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      id: "1",
      srNo: 1,
      product: "",
      qty: 0,
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0
    }
  ]);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh contacts when component mounts to ensure we have latest vendor data
  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

  // Function to trigger vendor refresh
  const handleRefreshVendors = async () => {
    try {
      await refreshContacts();
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: "Vendors Refreshed",
        description: "Vendor list has been updated with latest data",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh vendors",
        variant: "destructive",
      });
    }
  };


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVendorSelect = (vendorId: string, vendor: any) => {
    console.log('Selected vendor:', vendor);
    
    // Auto-fill vendor details
    const addressParts = [];
    if (vendor.address?.city) addressParts.push(vendor.address.city);
    if (vendor.address?.state) addressParts.push(vendor.address.state);
    if (vendor.address?.pincode) addressParts.push(vendor.address.pincode);
    const fullAddress = addressParts.join(', ');
    
    setFormData(prev => ({
      ...prev,
      vendorId: vendorId,
      vendorName: vendor.name,
      vendorEmail: vendor.email || '',
      vendorMobile: vendor.mobile || '',
      vendorAddress: fullAddress,
      // Auto-fill billTo and shipTo with vendor address if they're empty
      billTo: prev.billTo || fullAddress,
      shipTo: prev.shipTo || fullAddress
    }));
  };

  const handleProductSelect = (itemId: string, productId: string, product: any) => {
    console.log('Selected product:', product);
    
    // Auto-fill product details
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newItem = {
          ...item,
          product: product.name,
          productId: productId,
          productName: product.name,
          rate: product.purchase_price,
          taxRate: product.purchase_tax_rate || 0,
          taxName: product.purchase_tax_name || '',
          tax: 0, // Will be calculated based on tax rate
          qty: item.qty || 1 // Set default quantity to 1 if it's 0
        };
        
        // Calculate amount with tax using current values
        const qty = newItem.qty;
        const rate = newItem.rate || 0;
        const discount = newItem.discount || 0;
        const taxRate = newItem.taxRate || 0;
        
        const baseAmount = qty * rate;
        const discountAmount = (baseAmount * discount) / 100;
        const taxableAmount = baseAmount - discountAmount;
        const taxAmount = (taxableAmount * taxRate) / 100;
        
        newItem.tax = taxAmount;
        newItem.amount = taxableAmount + taxAmount;
        
        return newItem;
      }
      return item;
    }));
  };

  const handleItemChange = (id: string, field: keyof PurchaseOrderItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when qty, rate, discount, or tax changes
        if (['qty', 'rate', 'discount', 'tax', 'taxRate'].includes(field)) {
          const qty = field === 'qty' ? Number(value) : updatedItem.qty;
          const rate = field === 'rate' ? Number(value) : updatedItem.rate;
          const discount = field === 'discount' ? Number(value) : updatedItem.discount;
          const taxRate = field === 'taxRate' ? Number(value) : (updatedItem.taxRate || 0);
          
          const subtotal = qty * rate;
          const discountAmount = (subtotal * discount) / 100;
          const taxableAmount = subtotal - discountAmount;
          const taxAmount = (taxableAmount * taxRate) / 100;
          
          updatedItem.tax = taxAmount;
          updatedItem.amount = taxableAmount + taxAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const addNewItem = () => {
    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      srNo: items.length + 1,
      product: "",
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
    // Validation
    if (!formData.vendorId) {
      alert('Please select a vendor before saving');
      return;
    }
    
    if (!formData.poNo.trim()) {
      alert('Please enter a PO Number');
      return;
    }
    
    if (items.length === 0 || items.every(item => !item.product.trim())) {
      alert('Please add at least one item to the purchase order');
      return;
    }
    
    // TODO: Implement save functionality
    console.log("Saving Purchase Order:", { formData, items });
    alert('Purchase Order saved successfully!');
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print();
  };

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log("Canceling Purchase Order");
  };

  const handleCreateBill = () => {
    // Navigate to vendor bill page with current form data
    const billData = {
      poNo: formData.poNo,
      vendorName: formData.vendorName,
      items: items,
      totalAmount: getTotalAmount()
    };
    
    // Store data in sessionStorage to pass to vendor bill page
    sessionStorage.setItem('purchaseOrderData', JSON.stringify(billData));
    navigate('/vendor-bill');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Order</h1>
              <p className="text-gray-600 mt-2">Create and manage purchase orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {contacts.filter(contact => contact.type.includes('vendor')).length} vendors available
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshVendors}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Vendors</span>
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="poNo">PO No.</Label>
                <Input
                  id="poNo"
                  value={formData.poNo}
                  onChange={(e) => handleInputChange("poNo", e.target.value)}
                  placeholder="Enter PO Number"
                />
              </div>
              <div>
                <Label htmlFor="poDate">PO Date</Label>
                <Input
                  id="poDate"
                  type="date"
                  value={formData.poDate}
                  onChange={(e) => handleInputChange("poDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <VendorSelector
                  value={formData.vendorId}
                  onValueChange={handleVendorSelect}
                  placeholder="Select Vendor"
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
            
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poRefDate">PO Ref Date</Label>
                <Input
                  id="poRefDate"
                  type="date"
                  value={formData.poRefDate}
                  onChange={(e) => handleInputChange("poRefDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                />
              </div>
            </div>

            {/* Vendor Details Section */}
            {formData.vendorId && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-blue-900">Selected Vendor Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        vendorId: "",
                        vendorName: "",
                        vendorEmail: "",
                        vendorMobile: "",
                        vendorAddress: ""
                      }));
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Selection
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Vendor Name</Label>
                    <p className="text-sm text-blue-900 font-medium">{formData.vendorName}</p>
                  </div>
                  {formData.vendorEmail && (
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Email</Label>
                      <p className="text-sm text-blue-900">{formData.vendorEmail}</p>
                    </div>
                  )}
                  {formData.vendorMobile && (
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Mobile</Label>
                      <p className="text-sm text-blue-900">{formData.vendorMobile}</p>
                    </div>
                  )}
                  {formData.vendorAddress && (
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Address</Label>
                      <p className="text-sm text-blue-900">{formData.vendorAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bill To / Ship To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billTo">Bill To</Label>
                <Textarea
                  id="billTo"
                  value={formData.billTo}
                  onChange={(e) => handleInputChange("billTo", e.target.value)}
                  placeholder="Billing address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="shipTo">Ship To</Label>
                <Textarea
                  id="shipTo"
                  value={formData.shipTo}
                  onChange={(e) => handleInputChange("shipTo", e.target.value)}
                  placeholder="Shipping address"
                  rows={3}
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
                          <ProductSelector
                            value={item.productId || ''}
                            onSelect={(productId, product) => handleProductSelect(item.id, productId, product)}
                            onClear={() => handleItemChange(item.id, 'product', '')}
                            placeholder="Select Product"
                            className="w-full"
                          />
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
                          <div className="flex flex-col space-y-1">
                            <Input
                              type="number"
                              value={item.taxRate || 0}
                              onChange={(e) => handleItemChange(item.id, 'taxRate', Number(e.target.value))}
                              className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="Tax %"
                            />
                            {item.taxName && (
                              <div className="text-xs text-blue-600 font-medium">
                                {item.taxName}
                              </div>
                            )}
                            <div className="text-xs text-green-600 font-medium">
                              Tax: ₹{item.tax.toFixed(2)}
                            </div>
                          </div>
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
              <Button variant="outline" onClick={handleCreateBill}>
                <FileText className="h-4 w-4 mr-2" />
                Create Bill
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

export default PurchaseOrder;
