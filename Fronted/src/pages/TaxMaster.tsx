import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Receipt, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tax, TaxFormData } from "@/types/tax";
import { TaxFormDialog } from "@/components/tax/TaxFormDialog";
import Header from "@/components/layout/Header";

// Sample data - in a real app, this would come from an API
const sampleTaxes: Tax[] = [
  {
    id: "1",
    taxName: "GST 18%",
    taxPercentage: 18,
    description: "Goods and Services Tax at 18% rate",
    computation: "Percentage of base amount",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    taxName: "GST 12%",
    taxPercentage: 12,
    description: "Goods and Services Tax at 12% rate",
    computation: "Percentage of base amount",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    taxName: "GST 5%",
    taxPercentage: 5,
    description: "Goods and Services Tax at 5% rate",
    computation: "Percentage of base amount",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    taxName: "GST 0%",
    taxPercentage: 0,
    description: "Zero-rated Goods and Services Tax",
    computation: "No tax applied",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "5",
    taxName: "IGST 18%",
    taxPercentage: 18,
    description: "Integrated Goods and Services Tax at 18% rate",
    computation: "Percentage of base amount for inter-state transactions",
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "6",
    taxName: "CGST 9%",
    taxPercentage: 9,
    description: "Central Goods and Services Tax at 9% rate",
    computation: "Percentage of base amount for intra-state transactions",
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "7",
    taxName: "SGST 9%",
    taxPercentage: 9,
    description: "State Goods and Services Tax at 9% rate",
    computation: "Percentage of base amount for intra-state transactions",
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "8",
    taxName: "CESS 1%",
    taxPercentage: 1,
    description: "Additional cess on certain goods",
    computation: "Additional percentage on base amount",
    isActive: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

const TaxMaster = () => {
  const [taxes, setTaxes] = useState<Tax[]>(sampleTaxes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [viewingTax, setViewingTax] = useState<Tax | null>(null);

  const handleCreateTax = () => {
    setEditingTax(null);
    setIsFormOpen(true);
  };

  const handleEditTax = (tax: Tax) => {
    setEditingTax(tax);
    setIsFormOpen(true);
  };

  const handleViewTax = (tax: Tax) => {
    setViewingTax(tax);
    setIsFormOpen(true);
  };

  const handleDeleteTax = (taxId: string) => {
    setTaxes(taxes.filter(tax => tax.id !== taxId));
  };

  const handleToggleActive = (taxId: string) => {
    setTaxes(taxes.map(tax => 
      tax.id === taxId 
        ? { ...tax, isActive: !tax.isActive, updatedAt: new Date() }
        : tax
    ));
  };

  const handleSaveTax = (formData: TaxFormData) => {
    if (editingTax) {
      // Update existing tax
      setTaxes(taxes.map(tax => 
        tax.id === editingTax.id 
          ? { 
              ...tax, 
              ...formData, 
              updatedAt: new Date() 
            }
          : tax
      ));
    } else {
      // Create new tax
      const newTax: Tax = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTaxes([...taxes, newTax]);
    }
    setIsFormOpen(false);
    setEditingTax(null);
    setViewingTax(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTax(null);
    setViewingTax(null);
  };

  const activeTaxes = taxes.filter(tax => tax.isActive);
  const inactiveTaxes = taxes.filter(tax => !tax.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Tax Master" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              Manage tax rates, configurations, and rules for your business
            </p>
          </div>

          {/* Actions Bar */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Total Taxes: {taxes.length}
              </Badge>
              <Badge variant="default" className="text-sm bg-green-100 text-green-800">
                Active: {activeTaxes.length}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Inactive: {inactiveTaxes.length}
              </Badge>
            </div>
            <Button onClick={handleCreateTax} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Tax</span>
            </Button>
          </div>

          {/* Tax List Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tax List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Name</TableHead>
                      <TableHead>Tax %</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Computation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No taxes found. Click "Add New Tax" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      taxes.map((tax) => (
                        <TableRow key={tax.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Receipt className="h-4 w-4 text-gray-400" />
                              <span>{tax.taxName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {tax.taxPercentage}%
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <span className="text-sm text-gray-600 truncate block">
                              {tax.description || "No description"}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <span className="text-sm text-gray-600 truncate block">
                              {tax.computation || "Standard calculation"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={tax.isActive}
                                onCheckedChange={() => handleToggleActive(tax.id)}
                                className="data-[state=checked]:bg-green-600"
                              />
                              <span className={`text-sm ${tax.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                {tax.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewTax(tax)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTax(tax)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTax(tax.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Tax Form Dialog */}
          <TaxFormDialog
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSave={handleSaveTax}
            tax={editingTax || viewingTax}
            isViewMode={!!viewingTax}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxMaster;
