export interface Product {
  id: string;
  productName: string;
  hsnCode: string;
  unit: string;
  purchasePrice: number;
  salesPrice: number;
  gstPercentage: number;
  description?: string;
  category?: string;
  type?: string;
  code?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  productName: string;
  hsnCode: string;
  unit: string;
  purchasePrice: number;
  salesPrice: number;
  gstPercentage: number;
  description?: string;
  category?: string;
  type?: string;
  code?: string;
}

export interface ProductDetails {
  product: string;
  hsn: string;
  unit: string;
  qty: number;
  price: number;
  gstPercentage: number;
  amount: number;
  total: number;
}
