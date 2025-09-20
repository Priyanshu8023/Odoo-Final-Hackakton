import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Contact, ContactFormData } from "@/types/contact";

interface ContactFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
  initialData?: any;
  isViewMode?: boolean;
}

export const ContactFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isViewMode = false,
}: ContactFormDialogProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
    gstNo: "",
    panNo: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    profileImage: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        mobileNo: initialData.mobile || "",
        address: initialData.address ? 
          `${initialData.address.city || ''}, ${initialData.address.state || ''}, ${initialData.address.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') : "",
        gstNo: "",
        panNo: "",
        bankName: "",
        accountNo: "",
        ifscCode: "",
        profileImage: initialData.profileImageURL || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        mobileNo: "",
        address: "",
        gstNo: "",
        panNo: "",
        bankName: "",
        accountNo: "",
        ifscCode: "",
        profileImage: "",
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      mobileNo: "",
      address: "",
      gstNo: "",
      panNo: "",
      bankName: "",
      accountNo: "",
      ifscCode: "",
      profileImage: "",
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
                ? "View Contact Details" 
                : initialData 
                  ? "Edit Contact" 
                  : "Add New Contact"
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
          {/* Profile Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            <div className="flex justify-center">
              <ImageUpload
                value={formData.profileImage}
                onChange={(image) => handleInputChange("profileImage", image || "")}
                disabled={isViewMode}
                className="w-full max-w-xs"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter contact name"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={isViewMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No. *</Label>
                <Input
                  id="mobileNo"
                  value={formData.mobileNo}
                  onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                  placeholder="Enter mobile number"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  required
                  disabled={isViewMode}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstNo">GST No.</Label>
                <Input
                  id="gstNo"
                  value={formData.gstNo}
                  onChange={(e) => handleInputChange("gstNo", e.target.value)}
                  placeholder="Enter GST number"
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNo">PAN No.</Label>
                <Input
                  id="panNo"
                  value={formData.panNo}
                  onChange={(e) => handleInputChange("panNo", e.target.value)}
                  placeholder="Enter PAN number"
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  placeholder="Enter bank name"
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNo">Account No.</Label>
                <Input
                  id="accountNo"
                  value={formData.accountNo}
                  onChange={(e) => handleInputChange("accountNo", e.target.value)}
                  placeholder="Enter account number"
                  disabled={isViewMode}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                placeholder="Enter IFSC code"
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Contact" : "Save Contact"}
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
