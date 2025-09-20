import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChartOfAccount, ChartOfAccountFormData, ACCOUNT_TYPES } from "@/types/chartOfAccounts";

interface ChartOfAccountsFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChartOfAccountFormData) => void;
  account?: ChartOfAccount | null;
  isViewMode?: boolean;
  existingAccounts: ChartOfAccount[];
}

export const ChartOfAccountsFormDialog = ({
  isOpen,
  onClose,
  onSave,
  account,
  isViewMode = false,
  existingAccounts,
}: ChartOfAccountsFormDialogProps) => {
  const [formData, setFormData] = useState<ChartOfAccountFormData>({
    accountName: "",
    accountCode: "",
    accountType: "Assets",
    parentId: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        accountName: account.accountName,
        accountCode: account.accountCode,
        accountType: account.accountType,
        parentId: account.parentId || "",
        description: account.description || "",
        isActive: account.isActive,
      });
    } else {
      setFormData({
        accountName: "",
        accountCode: "",
        accountType: "Assets",
        parentId: "",
        description: "",
        isActive: true,
      });
    }
  }, [account, isOpen]);

  const handleInputChange = (field: keyof ChartOfAccountFormData, value: string | boolean) => {
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

  const getAccountTypeInfo = (type: string) => {
    return ACCOUNT_TYPES.find(t => t.type === type) || ACCOUNT_TYPES[0];
  };

  const getParentAccountOptions = () => {
    return existingAccounts.filter(acc => 
      acc.accountType === formData.accountType && 
      acc.id !== account?.id &&
      !acc.parentId // Only show top-level accounts as parents
    );
  };

  const generateAccountCode = () => {
    const accountsOfType = existingAccounts.filter(acc => acc.accountType === formData.accountType);
    const maxCode = Math.max(...accountsOfType.map(acc => parseInt(acc.accountCode) || 0));
    const nextCode = maxCode + 100;
    return nextCode.toString().padStart(4, '0');
  };

  const handleAccountTypeChange = (newType: string) => {
    setFormData(prev => ({
      ...prev,
      accountType: newType as any,
      parentId: "", // Reset parent when type changes
      accountCode: generateAccountCode(),
    }));
  };

  const typeInfo = getAccountTypeInfo(formData.accountType);

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
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange("accountName", e.target.value)}
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
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={formData.accountType}
                onValueChange={handleAccountTypeChange}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.type} value={type.type}>
                      <div className="flex items-center space-x-2">
                        <span>{type.label}</span>
                        <span className="text-xs text-gray-500">({type.normalBalance})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {typeInfo.description} - Normal balance: {typeInfo.normalBalance}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Account</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => handleInputChange("parentId", value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent account (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Parent (Top Level)</SelectItem>
                  {getParentAccountOptions().map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.accountName} ({parent.accountCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select a parent account to create a sub-account. Leave empty for top-level accounts.
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

          {/* Account Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                disabled={isViewMode}
                className="data-[state=checked]:bg-green-600"
              />
              <div>
                <Label htmlFor="isActive" className="text-sm font-medium">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Label>
                <p className="text-xs text-gray-500">
                  {formData.isActive 
                    ? 'This account will be available for use in transactions' 
                    : 'This account will be hidden and unavailable for new transactions'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Account Preview */}
          {formData.accountName && formData.accountCode && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Account Name:</span>
                    <p className="text-gray-600">{formData.accountName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Code:</span>
                    <p className="text-gray-600 font-mono">{formData.accountCode}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-gray-600">{formData.accountType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Normal Balance:</span>
                    <p className="text-gray-600">{typeInfo.normalBalance}</p>
                  </div>
                  <div>
                    <span className="font-medium">Parent:</span>
                    <p className="text-gray-600">
                      {formData.parentId 
                        ? existingAccounts.find(acc => acc.id === formData.parentId)?.accountName || 'Unknown'
                        : 'Top Level'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className={`${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </p>
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
