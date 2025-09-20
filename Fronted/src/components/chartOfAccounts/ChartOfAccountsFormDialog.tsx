import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ChartOfAccountsFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  account?: any;
  isViewMode?: boolean;
  existingAccounts: any[];
}

export const ChartOfAccountsFormDialog = ({
  isOpen,
  onClose,
  onSave,
  account,
  isViewMode = false,
  existingAccounts,
}: ChartOfAccountsFormDialogProps) => {
  const [formData, setFormData] = useState({
    account_name: "",
    account_type: "asset",
    description: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        account_name: account.account_name || "",
        account_type: account.account_type || "asset",
        description: account.description || "",
      });
    } else {
      setFormData({
        account_name: "",
        account_type: "asset",
        description: "",
      });
    }
  }, [account, isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
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
      accountName: "",
      accountCode: "",
      accountType: "Assets",
      parentId: "",
      description: "",
      isActive: true,
    });
    onClose();
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {isViewMode 
                ? "View Account Details" 
                : account 
                  ? "Edit Account" 
                  : "Add New Account"
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
          {/* Basic Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="account_name"
                  value={formData.account_name}
                  onChange={(e) => handleInputChange("account_name", e.target.value)}
                  placeholder="e.g., Cash, Bank, Sales"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountCode">Account Code *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accountCode"
                    value={formData.accountCode}
                    onChange={(e) => handleInputChange("accountCode", e.target.value)}
                    placeholder="e.g., 1100, 2100"
                    required
                    disabled={isViewMode}
                    className="flex-1"
                  />
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("accountCode", generateAccountCode())}
                    >
                      Auto
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_type">Account Type *</Label>
              <Select
                value={formData.account_type}
                onValueChange={(value) => handleInputChange("account_type", value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select the type of account for proper categorization
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter account description and usage details"
                disabled={isViewMode}
                rows={3}
              />
            </div>
          </div>

          {/* Account Preview */}
          {formData.account_name && formData.account_type && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Account Name:</span>
                    <p className="text-gray-600">{formData.account_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-gray-600 capitalize">{formData.account_type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-600">{formData.description || 'No description'}</p>
                  </div>
                </div>
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
                {account ? "Update Account" : "Save Account"}
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
