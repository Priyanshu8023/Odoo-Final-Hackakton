import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product, ProductFormData } from "@/types/product";
import { ProductFormDialog } from "@/components/product/ProductFormDialog";
import Header from "@/components/layout/Header";

// Sample data - in a real app, this would come from an API
const sampleProducts: Product[] = [
  {
    id: "1",
    productName: "Steel Rod 12mm",
    hsnCode: "72142090",
    unit: "KG",
    purchasePrice: 45.50,
    salesPrice: 55.00,
    gstPercentage: 18,
    description: "High quality steel rod for construction purposes",
    category: "Construction Materials",
    type: "Raw Material",
    code: "SR-12MM",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    productName: "Cement Bag 50kg",
    hsnCode: "25232910",
    unit: "BAG",
    purchasePrice: 320.00,
    salesPrice: 380.00,
    gstPercentage: 18,
    description: "Portland cement for general construction",
    category: "Construction Materials",
    type: "Raw Material",
    code: "CB-50KG",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    productName: "Aluminum Sheet 2mm",
    hsnCode: "76061190",
    unit: "SHEET",
    purchasePrice: 180.00,
    salesPrice: 220.00,
    gstPercentage: 18,
    description: "Lightweight aluminum sheet for manufacturing",
    category: "Metal Sheets",
    type: "Raw Material",
    code: "AS-2MM",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    productName: "Industrial Bolts M12",
    hsnCode: "73181590",
    unit: "PIECE",
    purchasePrice: 2.50,
    salesPrice: 3.20,
    gstPercentage: 18,
    description: "High tensile industrial bolts for heavy machinery",
    category: "Fasteners",
    type: "Component",
    code: "IB-M12",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "5",
    productName: "Copper Wire 2.5mm",
    hsnCode: "74130000",
    unit: "METER",
    purchasePrice: 85.00,
    salesPrice: 105.00,
    gstPercentage: 18,
    description: "Pure copper wire for electrical applications",
    category: "Electrical Components",
    type: "Raw Material",
    code: "CW-2.5MM",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];

const ProductMaster = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { 
              ...product, 
              ...formData, 
              updatedAt: new Date() 
            }
          : product
      ));
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts([...products, newProduct]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
    setViewingProduct(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setViewingProduct(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Product Master" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              Manage your products, inventory, and pricing in one place
            </p>
          </div>

          {/* Actions Bar */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Total Products: {products.length}
              </Badge>
            </div>
            <Button onClick={handleCreateProduct} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Button>
          </div>

          {/* Product List Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Sales Price</TableHead>
                      <TableHead>GST %</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No products found. Click "Add New Product" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span>{product.productName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.hsnCode}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.unit}</Badge>
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatCurrency(product.purchasePrice)}
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatCurrency(product.salesPrice)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {product.gstPercentage}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {product.category || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
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

          {/* Product Form Dialog */}
          <ProductFormDialog
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSave={handleSaveProduct}
            product={editingProduct || viewingProduct}
            isViewMode={!!viewingProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductMaster;
