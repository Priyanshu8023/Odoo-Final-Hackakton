import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, ProductFormData } from "@/types/product";

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  product?: Product | null;
  isViewMode?: boolean;
}

const unitOptions = [
  { value: "KG", label: "Kilogram (KG)" },
  { value: "BAG", label: "Bag (BAG)" },
  { value: "SHEET", label: "Sheet (SHEET)" },
  { value: "PIECE", label: "Piece (PIECE)" },
  { value: "METER", label: "Meter (METER)" },
  { value: "LITER", label: "Liter (LITER)" },
  { value: "BOX", label: "Box (BOX)" },
  { value: "ROLL", label: "Roll (ROLL)" },
  { value: "TON", label: "Ton (TON)" },
  { value: "UNIT", label: "Unit (UNIT)" },
];

const categoryOptions = [
  "Construction Materials",
  "Metal Sheets",
  "Fasteners",
  "Electrical Components",
  "Raw Materials",
  "Components",
  "Tools",
  "Equipment",
  "Other"
];

const typeOptions = [
  "Raw Material",
  "Component",
  "Finished Product",
  "Tool",
  "Equipment",
  "Other"
];

export const ProductFormDialog = ({
  isOpen,
  onClose,
  onSave,
  product,
  isViewMode = false,
}: ProductFormDialogProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    hsnCode: "",
    unit: "",
    purchasePrice: 0,
    salesPrice: 0,
    gstPercentage: 0,
    description: "",
    category: "",
    type: "",
    code: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        hsnCode: product.hsnCode,
        unit: product.unit,
        purchasePrice: product.purchasePrice,
        salesPrice: product.salesPrice,
        gstPercentage: product.gstPercentage,
        description: product.description || "",
        category: product.category || "",
        type: product.type || "",
        code: product.code || "",
      });
    } else {
      setFormData({
        productName: "",
        hsnCode: "",
        unit: "",
        purchasePrice: 0,
        salesPrice: 0,
        gstPercentage: 0,
        description: "",
        category: "",
        type: "",
        code: "",
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      productName: "",
      hsnCode: "",
      unit: "",
      purchasePrice: 0,
      salesPrice: 0,
      gstPercentage: 0,
      description: "",
      category: "",
      type: "",
      code: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {isViewMode 
                ? "View Product Details" 
                : product 
                  ? "Edit Product" 
                  : "Add New Product"
              }
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  placeholder="Enter product name"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Product Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="Enter product code"
                  disabled={isViewMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hsnCode">HSN Code *</Label>
                <Input
                  id="hsnCode"
                  value={formData.hsnCode}
                  onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                  placeholder="Enter HSN code"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleInputChange("unit", value)}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
                disabled={isViewMode}
                rows={3}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange("purchasePrice", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesPrice">Sales Price *</Label>
                <Input
                  id="salesPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salesPrice}
                  onChange={(e) => handleInputChange("salesPrice", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstPercentage">GST % *</Label>
                <Input
                  id="gstPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.gstPercentage}
                  onChange={(e) => handleInputChange("gstPercentage", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {product ? "Update Product" : "Save Product"}
              </Button>
            </div>
          )}
          
          {isViewMode && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
