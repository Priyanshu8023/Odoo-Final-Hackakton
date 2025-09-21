import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { Contact } from '@/types/contact';

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

interface Tax {
  id: string;
  tax_name: string;
  computation_method: string;
  rate: number;
  applicable_on: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'void';
  subTotal: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  lineItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    tax: {
      taxId?: string;
      name?: string;
      rate?: number;
    };
    total: number;
  }>;
  createdAt: string;
  updatedAt?: string;
}

interface DataContextType {
  // Data
  contacts: Contact[];
  products: Product[];
  taxes: Tax[];
  invoices: Invoice[];
  
  // Loading states
  contactsLoading: boolean;
  productsLoading: boolean;
  taxesLoading: boolean;
  invoicesLoading: boolean;
  
  // Actions
  refreshContacts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshTaxes: () => Promise<void>;
  refreshInvoices: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Create actions
  createContact: (contactData: any) => Promise<boolean>;
  createProduct: (productData: any) => Promise<boolean>;
  createTax: (taxData: any) => Promise<boolean>;
  createInvoice: (invoiceData: any) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [contactsLoading, setContactsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [taxesLoading, setTaxesLoading] = useState(false);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const refreshContacts = useCallback(async () => {
    try {
      setContactsLoading(true);
      console.log('Fetching contacts...');
      const response = await apiClient.getContacts();
      console.log('Contacts response:', response);
      if (response.success) {
        setContacts(response.data.contacts);
        console.log('Contacts loaded:', response.data.contacts.length);
      } else {
        console.error('Failed to fetch contacts:', response);
        toast({
          title: "Error",
          description: response.message || "Failed to fetch contacts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setContactsLoading(false);
    }
  }, [toast]);

  const refreshProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const response = await apiClient.getProducts();
      if (response.success) {
        // Convert numeric IDs to strings for consistency
        const productsWithStringIds = response.data.products.map(product => ({
          ...product,
          id: String(product.id),
          category_id: product.category_id ? String(product.category_id) : undefined,
          sale_tax_id: product.sale_tax_id ? String(product.sale_tax_id) : undefined,
          purchase_tax_id: product.purchase_tax_id ? String(product.purchase_tax_id) : undefined,
        }));
        setProducts(productsWithStringIds);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setProductsLoading(false);
    }
  }, [toast]);

  const refreshTaxes = useCallback(async () => {
    try {
      setTaxesLoading(true);
      const response = await apiClient.getTaxes();
      if (response.success) {
        // Convert numeric IDs to strings for consistency
        const taxesWithStringIds = response.data.taxes.map(tax => ({
          ...tax,
          id: String(tax.id),
        }));
        setTaxes(taxesWithStringIds);
      }
    } catch (error) {
      console.error('Error fetching taxes:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch taxes",
        variant: "destructive",
      });
    } finally {
      setTaxesLoading(false);
    }
  }, [toast]);

  const refreshInvoices = useCallback(async () => {
    try {
      setInvoicesLoading(true);
      const response = await apiClient.getInvoices();
      if (response.success) {
        // Transform invoice data to match frontend expectations
        const transformedInvoices = response.data.invoices.map((invoice: any) => ({
          id: String(invoice.id),
          invoiceNumber: invoice.invoice_number || invoice.invoiceNumber,
          customerId: String(invoice.customer_id),
          customerName: invoice.customer_name || invoice.customerName,
          customerEmail: invoice.customer_email || invoice.customerEmail,
          customerMobile: invoice.customer_mobile || invoice.customerMobile,
          invoiceDate: invoice.invoice_date || invoice.invoiceDate,
          dueDate: invoice.due_date || invoice.dueDate,
          status: invoice.status,
          subTotal: parseFloat(invoice.sub_total?.toString() || invoice.subTotal?.toString() || '0'),
          totalTax: parseFloat(invoice.total_tax?.toString() || invoice.totalTax?.toString() || '0'),
          grandTotal: parseFloat(invoice.grand_total?.toString() || invoice.grandTotal?.toString() || '0'),
          amountPaid: parseFloat(invoice.amount_paid?.toString() || invoice.amountPaid?.toString() || '0'),
          balanceDue: parseFloat(invoice.balance_due?.toString() || invoice.balanceDue?.toString() || '0'),
          lineItems: invoice.line_items || invoice.lineItems || [],
          createdAt: invoice.created_at || invoice.createdAt,
          updatedAt: invoice.updated_at || invoice.updatedAt
        }));
        setInvoices(transformedInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setInvoicesLoading(false);
    }
  }, [toast]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshContacts(),
      refreshProducts(),
      refreshTaxes(),
      refreshInvoices()
    ]);
  }, [refreshContacts, refreshProducts, refreshTaxes, refreshInvoices]);

  // Wait for authentication to complete before making API calls
  useEffect(() => {
    if (!authLoading && user) {
      console.log('Authentication complete, refreshing data...');
      refreshAll();
    }
  }, [authLoading, user, refreshAll]);

  const createContact = useCallback(async (contactData: any): Promise<boolean> => {
    try {
      console.log('Creating contact with data:', contactData);
      const response = await apiClient.createContact(contactData);
      console.log('Create contact response:', response);
      if (response.success) {
        toast({
          title: "Success",
          description: "Contact created successfully",
        });
        // Refresh all data to ensure consistency
        await refreshAll();
        return true;
      } else {
        console.error('Failed to create contact:', response);
        toast({
          title: "Error",
          description: response.message || "Failed to create contact",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create contact",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshAll]);

  const createProduct = useCallback(async (productData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createProduct(productData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        await refreshProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create product",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshProducts]);

  const createTax = useCallback(async (taxData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createTax(taxData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Tax created successfully",
        });
        await refreshTaxes();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating tax:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create tax",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshTaxes]);

  const createInvoice = useCallback(async (invoiceData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createInvoice(invoiceData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
        await refreshInvoices();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create invoice",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshInvoices]);

  const value: DataContextType = {
    contacts,
    products,
    taxes,
    invoices,
    contactsLoading,
    productsLoading,
    taxesLoading,
    invoicesLoading,
    refreshContacts,
    refreshProducts,
    refreshTaxes,
    refreshInvoices,
    refreshAll,
    createContact,
    createProduct,
    createTax,
    createInvoice,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

