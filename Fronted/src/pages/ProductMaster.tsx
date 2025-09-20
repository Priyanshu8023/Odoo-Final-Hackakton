import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductFormDialog } from "@/components/product/ProductFormDialog";
import Header from "@/components/layout/Header";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  type: string;
  sales_price: number;
  purchase_price: number;
  hsn_code?: string;
  category_id?: string;
  sale_tax_id?: string;
  purchase_tax_id?: string;
  category_name?: string;
  sale_tax_name?: string;
  sale_tax_rate?: number;
  purchase_tax_name?: string;
  purchase_tax_rate?: number;
  created_at: string;
}

const ProductMaster = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts();
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (productData: any) => {
    try {
      console.log("ProductMaster: handleCreateProduct called with data:", productData);
      
      // Transform frontend data to backend format
      const backendData = {
        name: productData.productName,
        type: productData.type === 'Raw Material' ? 'goods' : 'service',
        salesPrice: productData.salesPrice,
        purchasePrice: productData.purchasePrice,
        hsnCode: productData.hsnCode,
        category: productData.category
      };
      
      console.log("ProductMaster: transformed backend data:", backendData);
      
      const response = await apiClient.createProduct(backendData);
      console.log("ProductMaster: API response:", response);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        fetchProducts();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      // Transform frontend data to backend format
      const backendData = {
        name: productData.productName,
        type: productData.type === 'Raw Material' ? 'goods' : 'service',
        salesPrice: productData.salesPrice,
        purchasePrice: productData.purchasePrice,
        hsnCode: productData.hsnCode,
        category: productData.category
      };
      
      const response = await apiClient.updateProduct(id, backendData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await apiClient.deleteProduct(id);
        if (response.success) {
          toast({
            title: "Success",
            description: "Product deleted successfully",
          });
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: error instanceof ApiError ? error.message : "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const openCreateDialog = () => {
    console.log("ProductMaster: openCreateDialog called");
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Goods":
        return "default";
      case "Service":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Header title="Product Master" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header title="Product Master" />
      
      <main className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button onClick={openCreateDialog} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
            </CardHeader>
            <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products found. Create your first product to get started.
              </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sales Price</TableHead>
                    <TableHead>Purchase Price</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                        <Badge variant={getTypeBadgeVariant(product.type)}>
                          {product.type}
                            </Badge>
                          </TableCell>
                      <TableCell>₹{product.sales_price.toFixed(2)}</TableCell>
                      <TableCell>₹{product.purchase_price.toFixed(2)}</TableCell>
                      <TableCell>{product.hsn_code || "-"}</TableCell>
                      <TableCell>{product.category_name || "-"}</TableCell>
                          <TableCell>
                        <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                            onClick={() => openEditDialog(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
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

          <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? 
          (data) => handleUpdateProduct(editingProduct.id, data) : 
          handleCreateProduct
        }
        initialData={editingProduct}
      />
    </div>
  );
};

export default ProductMaster;