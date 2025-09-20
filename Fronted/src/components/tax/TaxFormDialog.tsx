import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tax, TaxFormData } from "@/types/tax";

interface TaxFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  tax?: any;
  isViewMode?: boolean;
}

const computationOptions = [
  { value: "percentage", label: "Percentage of base amount" },
  { value: "fixed", label: "Fixed amount" },
  { value: "compound", label: "Compound calculation" },
  { value: "exempt", label: "Exempt from tax" },
  { value: "reverse", label: "Reverse charge" },
];

const commonTaxRates = [
  { value: 0, label: "0% (Zero-rated)" },
  { value: 0.25, label: "0.25%" },
  { value: 1, label: "1%" },
  { value: 3, label: "3%" },
  { value: 5, label: "5%" },
  { value: 12, label: "12%" },
  { value: 18, label: "18%" },
  { value: 28, label: "28%" },
];

export const TaxFormDialog = ({
  isOpen,
  onClose,
  onSave,
  tax,
  isViewMode = false,
}: TaxFormDialogProps) => {
  const [formData, setFormData] = useState({
    tax_name: "",
    rate: 0,
    computation_method: "percentage",
    applicable_on: "both",
  });

  useEffect(() => {
    if (tax) {
      setFormData({
        tax_name: tax.tax_name || "",
        rate: tax.rate || 0,
        computation_method: tax.computation_method || "percentage",
        applicable_on: tax.applicable_on || "both",
      });
    } else {
      setFormData({
        tax_name: "",
        rate: 0,
        computation_method: "percentage",
        applicable_on: "both",
      });
    }
  }, [tax, isOpen]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
      taxName: "",
      taxPercentage: 0,
      description: "",
      computation: "percentage",
      isActive: true,
    });
    onClose();
  };

  const handleQuickRateSelect = (rate: number) => {
    setFormData(prev => ({
      ...prev,
      rate: rate,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {isViewMode 
                ? "View Tax Details" 
                : tax 
                  ? "Edit Tax" 
                  : "Add New Tax"
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
          {/* Basic Tax Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxName">Tax Name *</Label>
                <Input
                  id="tax_name"
                  value={formData.tax_name}
                  onChange={(e) => handleInputChange("tax_name", e.target.value)}
                  placeholder="e.g., GST 18%, CGST 9%"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxPercentage">Tax Percentage *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.rate}
                    onChange={(e) => handleInputChange("rate", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                    disabled={isViewMode}
                    className="flex-1"
                  />
                  <span className="flex items-center text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Quick Rate Selection */}
            {!isViewMode && (
              <div className="space-y-2">
                <Label>Quick Rate Selection</Label>
                <div className="flex flex-wrap gap-2">
                  {commonTaxRates.map((rate) => (
                    <Button
                      key={rate.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickRateSelect(rate.value)}
                      className={`text-xs ${
                        formData.rate === rate.value 
                          ? 'bg-blue-100 border-blue-300 text-blue-700' 
                          : ''
                      }`}
                    >
                      {rate.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="computation">Computation Method</Label>
              <Select
                value={formData.computation_method}
                onValueChange={(value) => handleInputChange("computation_method", value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select computation method" />
                </SelectTrigger>
                <SelectContent>
                  {computationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicable_on">Applicable On</Label>
              <Select
                value={formData.applicable_on}
                onValueChange={(value) => handleInputChange("applicable_on", value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicable on" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Only</SelectItem>
                  <SelectItem value="purchase">Purchase Only</SelectItem>
                  <SelectItem value="both">Both Sales & Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Tax Preview */}
          {formData.tax_name && formData.rate > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tax Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tax Name:</span>
                    <p className="text-gray-600">{formData.tax_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Rate:</span>
                    <p className="text-gray-600">{formData.rate}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Computation:</span>
                    <p className="text-gray-600">
                      {computationOptions.find(opt => opt.value === formData.computation_method)?.label}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Applicable On:</span>
                    <p className="text-gray-600 capitalize">{formData.applicable_on}</p>
                  </div>
                </div>
                {formData.rate > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <strong>Example:</strong> On a base amount of ₹1,000, this tax would be ₹{formData.rate * 10}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {tax ? "Update Tax" : "Save Tax"}
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
