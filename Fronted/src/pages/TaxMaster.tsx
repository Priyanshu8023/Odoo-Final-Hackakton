import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TaxFormDialog } from "@/components/tax/TaxFormDialog";
import Header from "@/components/layout/Header";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Tax {
  id: string;
  tax_name: string;
  computation_method: string;
  rate: number;
  applicable_on: string;
  created_at: string;
}

const TaxMaster = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const { toast } = useToast();

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTaxes();
      if (response.success) {
        setTaxes(response.data.taxes);
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch taxes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleCreateTax = async (taxData: any) => {
    try {
      console.log("TaxMaster: handleCreateTax called with data:", taxData);
      const response = await apiClient.createTax(taxData);
      console.log("TaxMaster: API response:", response);
      if (response.success) {
        toast({
          title: "Success",
          description: "Tax created successfully",
        });
        fetchTaxes();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating tax:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create tax",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTax = async (id: string, taxData: any) => {
    try {
      const response = await apiClient.updateTax(id, taxData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Tax updated successfully",
        });
        fetchTaxes();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating tax:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to update tax",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTax = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tax?")) {
      try {
        const response = await apiClient.deleteTax(id);
        if (response.success) {
          toast({
            title: "Success",
            description: "Tax deleted successfully",
          });
          fetchTaxes();
        }
      } catch (error) {
        console.error("Error deleting tax:", error);
        toast({
          title: "Error",
          description: error instanceof ApiError ? error.message : "Failed to delete tax",
          variant: "destructive",
        });
      }
    }
  };

  const openCreateDialog = () => {
    console.log("TaxMaster: openCreateDialog called");
    setEditingTax(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (tax: Tax) => {
    setEditingTax(tax);
    setIsDialogOpen(true);
  };

  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case "Percentage":
        return "default";
      case "Fixed":
        return "secondary";
      default:
        return "default";
    }
  };

  const getApplicabilityBadgeVariant = (applicable: string) => {
    switch (applicable) {
      case "Sales":
        return "default";
      case "Purchase":
        return "secondary";
      case "Both":
        return "outline";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Header title="Tax Master" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header title="Tax Master" />
      
      <main className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tax Rates</CardTitle>
            <Button onClick={openCreateDialog} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Tax</span>
            </Button>
          </CardHeader>
          <CardContent>
            {taxes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tax rates found. Create your first tax rate to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Name</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Applicable On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxes.map((tax) => (
                    <TableRow key={tax.id}>
                      <TableCell className="font-medium">{tax.tax_name}</TableCell>
                      <TableCell>
                        <Badge variant={getMethodBadgeVariant(tax.computation_method)}>
                          {tax.computation_method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tax.computation_method === "Percentage" 
                          ? `${tax.rate}%` 
                          : `₹${tax.rate.toFixed(2)}`
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={getApplicabilityBadgeVariant(tax.applicable_on)}>
                          {tax.applicable_on}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(tax)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTax(tax.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <TaxFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTax(null);
        }}
        onSave={editingTax ? (data) => handleUpdateTax(editingTax.id, data) : handleCreateTax}
        tax={editingTax}
      />
    </div>
  );
};

export default TaxMaster;